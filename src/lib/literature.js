// 朗読プレイヤーとテストで共有する、短い原文→区切り訳の再生順。
// UI状態とは分離し、全作品が必ず同じ一対一の順番で再生されるようにする。

export function literatureNarrationSegments(scene) {
  if (scene?.narrationSegments?.length) return scene.narrationSegments
  if (!scene?.original || !scene?.translation) return []
  return [
    {
      original: scene.original,
      translation: scene.translation,
      speech: scene.speech || scene.original,
    },
  ]
}

export function buildLiteratureNarration(work) {
  if (!work?.scenes?.length) return []
  return work.scenes.flatMap((scene, sceneIndex) => {
    const segments = literatureNarrationSegments(scene)
    return segments.flatMap((segment, segmentIndex) => [
      {
        id: `${work.id}:${sceneIndex}:${segmentIndex}:original`,
        sceneIndex,
        segmentIndex,
        segmentCount: segments.length,
        phase: 'original',
        label: work.kind === 'english' ? '英語' : '古文',
        text: segment.speech || segment.original,
        displayText: segment.original,
        lang: work.kind === 'english' ? 'en-US' : 'ja-JP',
      },
      {
        id: `${work.id}:${sceneIndex}:${segmentIndex}:translation`,
        sceneIndex,
        segmentIndex,
        segmentCount: segments.length,
        phase: 'translation',
        label: work.kind === 'english' ? '区切りの直訳' : '区切りの現代語訳',
        text: segment.translation,
        displayText: segment.translation,
        lang: 'ja-JP',
      },
    ])
  })
}

export function narrationStepIndex(
  workOrSceneIndex,
  sceneIndexOrPhase = 0,
  segmentIndex = 0,
  phase = 'original',
) {
  // 旧呼び出しの計算規則も残し、外部から参照されている場合の互換性を保つ。
  if (!workOrSceneIndex || typeof workOrSceneIndex !== 'object') {
    const legacySceneIndex = Math.max(0, Number(workOrSceneIndex) || 0)
    const legacyPhase = sceneIndexOrPhase
    return legacySceneIndex * 2 + (legacyPhase === 'translation' ? 1 : 0)
  }

  const work = workOrSceneIndex
  const safeSceneIndex = Math.max(
    0,
    Math.min(Number(sceneIndexOrPhase) || 0, Math.max(0, work.scenes.length - 1)),
  )
  const priorSegmentCount = work.scenes
    .slice(0, safeSceneIndex)
    .reduce((count, scene) => count + literatureNarrationSegments(scene).length, 0)
  const currentSegmentCount = literatureNarrationSegments(
    work.scenes[safeSceneIndex],
  ).length
  const safeSegmentIndex = Math.max(
    0,
    Math.min(Number(segmentIndex) || 0, Math.max(0, currentSegmentCount - 1)),
  )
  return (
    (priorSegmentCount + safeSegmentIndex) * 2 +
    (phase === 'translation' ? 1 : 0)
  )
}
