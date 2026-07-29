// 朗読プレイヤーとテストで共有する、原文→訳の再生順。
// UI状態とは分離し、全作品が必ず同じ順番で再生されるようにする。

export function buildLiteratureNarration(work) {
  if (!work?.scenes?.length) return []
  return work.scenes.flatMap((scene, sceneIndex) => [
    {
      id: `${work.id}:${sceneIndex}:original`,
      sceneIndex,
      phase: 'original',
      label: work.kind === 'english' ? '英語原文' : '古文原文',
      text: scene.speech || scene.original,
      displayText: scene.original,
      lang: work.kind === 'english' ? 'en-US' : 'ja-JP',
    },
    {
      id: `${work.id}:${sceneIndex}:translation`,
      sceneIndex,
      phase: 'translation',
      label: work.kind === 'english' ? 'やさしい和訳' : '現代語訳',
      text: scene.translation,
      displayText: scene.translation,
      lang: 'ja-JP',
    },
  ])
}

export const narrationStepIndex = (sceneIndex, phase = 'original') =>
  Math.max(0, Number(sceneIndex) || 0) * 2 + (phase === 'translation' ? 1 : 0)
