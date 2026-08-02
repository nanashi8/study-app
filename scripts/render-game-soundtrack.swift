import AVFoundation
import AudioToolbox
import Foundation

struct InstrumentConfig: Decodable {
  let name: String
  let program: Int
  let percussion: Bool
  let gainDb: Float
  let pan: Float
}

struct RenderConfig: Decodable {
  let trackId: String
  let midiPath: String
  let outputPath: String
  let durationSeconds: Double
  let reverbMix: Float
  let masterGainDb: Float
  let instruments: [InstrumentConfig]
}

enum RenderFailure: LocalizedError {
  case usage
  case trackCount(expected: Int, actual: Int)
  case renderStatus(String)

  var errorDescription: String? {
    switch self {
    case .usage:
      return "usage: render-game-soundtrack <render-config.json>"
    case let .trackCount(expected, actual):
      return "MIDIトラック数が一致しません: expected=\(expected), actual=\(actual)"
    case let .renderStatus(status):
      return "オフラインレンダリングに失敗しました: \(status)"
    }
  }
}

func decibelsToLinear(_ decibels: Float) -> Float {
  return powf(10, decibels / 20)
}

func render(_ config: RenderConfig) throws {
  let engine = AVAudioEngine()
  let ensembleMixer = AVAudioMixerNode()
  let reverb = AVAudioUnitReverb()
  var samplers: [AVAudioUnitSampler] = []

  engine.attach(ensembleMixer)
  engine.attach(reverb)

  let soundBank = URL(
    fileURLWithPath: "/System/Library/Components/CoreAudio.component/Contents/Resources/gs_instruments.dls"
  )
  for instrument in config.instruments {
    let sampler = AVAudioUnitSampler()
    engine.attach(sampler)
    try sampler.loadSoundBankInstrument(
      at: soundBank,
      program: UInt8(clamping: instrument.program),
      bankMSB: UInt8(
        instrument.percussion
          ? kAUSampler_DefaultPercussionBankMSB
          : kAUSampler_DefaultMelodicBankMSB
      ),
      bankLSB: UInt8(kAUSampler_DefaultBankLSB)
    )
    sampler.overallGain = instrument.gainDb
    sampler.stereoPan = max(-100, min(100, instrument.pan * 100))
    engine.connect(sampler, to: ensembleMixer, format: nil)
    samplers.append(sampler)
  }

  reverb.loadFactoryPreset(.mediumHall)
  reverb.wetDryMix = max(0, min(45, config.reverbMix))
  ensembleMixer.outputVolume = decibelsToLinear(config.masterGainDb)

  engine.connect(ensembleMixer, to: reverb, format: nil)
  engine.connect(reverb, to: engine.mainMixerNode, format: nil)

  let sequencer = AVAudioSequencer(audioEngine: engine)
  try sequencer.load(from: URL(fileURLWithPath: config.midiPath), options: [])
  let musicalTracks: [AVMusicTrack]
  if sequencer.tracks.count == samplers.count + 1 {
    // Standard MIDI Type 1の先頭はテンポ／拍子だけを持つconductor track。
    musicalTracks = Array(sequencer.tracks.dropFirst())
  } else {
    musicalTracks = sequencer.tracks
  }
  guard musicalTracks.count == samplers.count else {
    throw RenderFailure.trackCount(expected: samplers.count, actual: musicalTracks.count)
  }
  for (index, track) in musicalTracks.enumerated() {
    track.destinationAudioUnit = samplers[index]
  }

  guard let format = AVAudioFormat(standardFormatWithSampleRate: 44_100, channels: 2) else {
    throw RenderFailure.renderStatus("出力フォーマットを作成できません")
  }
  try engine.enableManualRenderingMode(.offline, format: format, maximumFrameCount: 4096)

  let outputURL = URL(fileURLWithPath: config.outputPath)
  do {
    let outputFile = try AVAudioFile(forWriting: outputURL, settings: format.settings)
    let buffer = AVAudioPCMBuffer(
      pcmFormat: engine.manualRenderingFormat,
      frameCapacity: engine.manualRenderingMaximumFrameCount
    )!
    let targetFrames = AVAudioFramePosition((config.durationSeconds * format.sampleRate).rounded())
    var transientRetries = 0

    try engine.start()
    sequencer.prepareToPlay()
    try sequencer.start()

    while engine.manualRenderingSampleTime < targetFrames {
      let remaining = targetFrames - engine.manualRenderingSampleTime
      let requestedFrames = AVAudioFrameCount(
        min(AVAudioFramePosition(buffer.frameCapacity), remaining)
      )
      let status: AVAudioEngineManualRenderingStatus
      do {
        status = try engine.renderOffline(requestedFrames, to: buffer)
      } catch {
        let nsError = error as NSError
        throw RenderFailure.renderStatus(
          "renderOffline sample=\(engine.manualRenderingSampleTime), domain=\(nsError.domain), code=\(nsError.code)"
        )
      }
      switch status {
      case .success:
        transientRetries = 0
        do {
          try outputFile.write(from: buffer)
        } catch {
          let nsError = error as NSError
          throw RenderFailure.renderStatus(
            "outputFile.write sample=\(engine.manualRenderingSampleTime), domain=\(nsError.domain), code=\(nsError.code)"
          )
        }
      case .insufficientDataFromInputNode, .cannotDoInCurrentContext:
        transientRetries += 1
        if transientRetries > 100 {
          throw RenderFailure.renderStatus("一時エラーが100回続きました")
        }
      case .error:
        throw RenderFailure.renderStatus("AVAudioEngine error")
      @unknown default:
        throw RenderFailure.renderStatus("unknown status")
      }
    }
  }

  sequencer.stop()
  engine.stop()
}

do {
  guard CommandLine.arguments.count == 2 else { throw RenderFailure.usage }
  let configURL = URL(fileURLWithPath: CommandLine.arguments[1])
  let configData = try Data(contentsOf: configURL)
  let config = try JSONDecoder().decode(RenderConfig.self, from: configData)
  try render(config)
  print("rendered \(config.trackId) -> \(config.outputPath)")
} catch {
  FileHandle.standardError.write(Data("\(error.localizedDescription)\n".utf8))
  exit(1)
}
