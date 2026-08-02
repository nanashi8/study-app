# ゲームBGMの完成音源レンダリング

ゲーム内ではMIDIやブラウザ発振音を鳴らさず、`public/assets/bgm/school-ensemble/`の完成済みAACを再生する。
第3版は各楽器を独立MIDIチャンネルへ分け、FluidSynthでSoundFontのサンプルとモジュレーターを処理する。

## 再生成

必要なもの:

- FluidSynth 2.5以降
- FFmpeg
- GM互換のSF2/SF3 SoundFont

```sh
GAME_SOUND_FONT=/absolute/path/to/sound-bank.sf2 npm run render:bgm -- --force
```

単曲を別ディレクトリへA/B出力する場合:

```sh
npm run render:bgm -- --track daily-morning --force \
  --sound-font /absolute/path/to/sound-bank.sf2 \
  --output-dir /private/tmp/study-app-bgm-a-b
```

SoundFontを省略するとmacOS内蔵GM音源のfallbackになるが、完成版のBGM監査は通らない。
完成版は44.1kHz stereo AAC-LC 160kbps、目標ラウドネス-18 LUFS、true peak -1.5dBTP以下で統一する。

## 今回の試作音源

GeneralUser GS 2.0.3をFluidSynth 2.5.6でレンダリングした。GeneralUser GS License v2.0は、
私的・商用の音楽制作と収益化した録音への利用を許可している。一方、ライセンス本文には一部サンプルの
出所を作者が完全には確認できない旨も記載されている。商用リリースの最終マスターでは、必要に応じて
サンプル由来が完全に監査された契約音源へ同じMIDIを差し替える。
