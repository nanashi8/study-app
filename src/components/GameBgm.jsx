import { useEffect, useMemo, useRef } from 'react'
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
  const playerRef = useRef(null)

  if (!playerRef.current && typeof window !== 'undefined') {
    playerRef.current = new GameBgmPlayer()
  }

  const track = useMemo(
    () => gameBgmTrackForState({ screen, params, day: todayIndex() }),
    [screen, params],
  )

  useEffect(() => {
    const player = playerRef.current ?? new GameBgmPlayer()
    playerRef.current = player
    player.setEnabled(enabled)
    player.setVolume(volume)
    player.setTrack(track)
    return undefined
  }, [enabled, volume, track])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const player = playerRef.current ?? new GameBgmPlayer()
    playerRef.current = player
    const unlock = () => player.unlock()
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
