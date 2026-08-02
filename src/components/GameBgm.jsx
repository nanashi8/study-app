import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useStore, todayIndex } from '../store/useStore.js'
import { GameBgmPlayer } from '../lib/gameBgmPlayer.js'
import { gameBgmTrackForState } from '../lib/gameBgmRouter.js'

/**
 * ゲーム画面だけでBGMを鳴らす全画面共通コントローラー。
 * AudioContextは最初のユーザー操作で解除し、読み上げ中はPlayer側で自動ダッキングする。
 */
export function GameBgmController() {
  const screen = useStore((state) => state.screen)
  const params = useStore((state) => state.params)
  const enabled = useStore((state) => state.settings.bgmEnabled !== false)
  const volume = useStore((state) => state.settings.bgmVolume ?? 0.35)
  const storyStep = useStore((state) => state.battleStoryStep)
  const playerRef = useRef(null)

  if (!playerRef.current && typeof window !== 'undefined') {
    // 初回Effectより先にユーザー操作が入っても、保存済みのOFFを破らない。
    playerRef.current = new GameBgmPlayer({ enabled, volume })
  }

  const track = useMemo(
    () => gameBgmTrackForState({ screen, params, day: todayIndex(), storyStep }),
    [screen, params, storyStep],
  )

  useLayoutEffect(() => {
    const player = playerRef.current ?? new GameBgmPlayer({ enabled, volume })
    playerRef.current = player
    player.setEnabled(enabled)
    player.setVolume(volume)
    player.setTrack(track)
    return undefined
  }, [enabled, volume, track])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const player = playerRef.current ?? new GameBgmPlayer({ enabled, volume })
    playerRef.current = player
    const unlock = (event) => {
      // OFFスイッチを押したpointerdown自体でAudioContextを解除し、
      // ReactのonClickより一瞬先に再生を始める競合を防ぐ。
      if (event?.target?.closest?.('[data-game-bgm-control]')) return
      void player.unlock()
    }
    const visibility = () => {
      if (document.hidden) player.suspend()
      else player.resume()
    }
    window.addEventListener('pointerdown', unlock, { passive: true })
    window.addEventListener('keydown', unlock)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      document.removeEventListener('visibilitychange', visibility)
      player.destroy()
      playerRef.current = null
    }
  }, [])

  return null
}
