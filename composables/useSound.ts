/**
 * サウンド再生を管理するComposable
 * タイマー完了時にアラーム音を再生
 */

export const useSound = () => {
  const { settings } = useTimerSettings()

  // オーディオインスタンス
  let audio: HTMLAudioElement | null = null
  let audioContext: AudioContext | null = null

  /**
   * Web Audio APIでビープ音を生成
   */
  const playBeep = async () => {
    if (!process.client) return

    try {
      // AudioContextを作成（初回のみ）
      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const ctx = audioContext
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      // 周波数設定（ラの音 = 440Hz）
      oscillator.frequency.value = 880
      oscillator.type = 'sine'

      // 音量設定（フェードイン・フェードアウト）
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)

      // 再生
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.5)

      // 2回目のビープ（少し間を置いて）
      const oscillator2 = ctx.createOscillator()
      const gainNode2 = ctx.createGain()

      oscillator2.connect(gainNode2)
      gainNode2.connect(ctx.destination)

      oscillator2.frequency.value = 880
      oscillator2.type = 'sine'

      gainNode2.gain.setValueAtTime(0, ctx.currentTime + 0.6)
      gainNode2.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.61)
      gainNode2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.1)

      oscillator2.start(ctx.currentTime + 0.6)
      oscillator2.stop(ctx.currentTime + 1.1)
    } catch (error) {
      console.error('Failed to play beep:', error)
    }
  }

  /**
   * サウンドファイルを読み込み
   */
  const loadSound = (soundName: string = 'default') => {
    if (!process.client) return

    try {
      const soundPath = `/timer/sounds/${soundName}.mp3`
      audio = new Audio(soundPath)
      audio.load()
    } catch (error) {
      console.error('Failed to load sound:', error)
    }
  }

  /**
   * サウンドを再生
   */
  const playSound = async () => {
    if (!process.client) return

    // サウンドが無効の場合は再生しない
    if (!settings.value.soundEnabled) return

    try {
      // オーディオが未ロードの場合は読み込み
      if (!audio) {
        loadSound(settings.value.selectedSound)
      }

      if (audio) {
        // 既に再生中の場合は停止してリセット
        audio.pause()
        audio.currentTime = 0

        // 再生を試みる
        await audio.play()
      }
    } catch (error) {
      // サウンドファイルの再生に失敗した場合はビープ音を再生
      console.warn('Sound file not available, playing beep instead')
      await playBeep()
    }
  }

  /**
   * サウンドを停止
   */
  const stopSound = () => {
    if (!process.client) return

    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  /**
   * バイブレーションを実行
   */
  const vibrate = () => {
    if (!process.client) return

    // バイブレーションが無効の場合は実行しない
    if (!settings.value.vibrationEnabled) return

    // Vibration APIが利用可能かチェック
    if ('vibrate' in navigator) {
      try {
        // パターン: [振動, 休止, 振動, 休止, 振動]
        navigator.vibrate([200, 100, 200, 100, 200])
      } catch (error) {
        console.error('Failed to vibrate:', error)
      }
    }
  }

  /**
   * タイマー完了時のサウンドとバイブレーション
   */
  const notifyComplete = async () => {
    await playSound()
    vibrate()
  }

  /**
   * サウンドを変更
   */
  const changeSound = (soundName: string) => {
    loadSound(soundName)
  }

  // コンポーネントアンマウント時にクリーンアップ
  if (process.client) {
    onBeforeUnmount(() => {
      stopSound()
      audio = null
    })
  }

  return {
    playSound,
    stopSound,
    vibrate,
    notifyComplete,
    changeSound,
    loadSound
  }
}
