import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SceneBundleRows, SceneBundleSheet } from '../components/SceneBundles.jsx'
import { Button, Card, cx } from '../components/ui.jsx'
import { Check } from '../components/Icons.jsx'
import {
  SCENE_BUNDLE_LEVELS,
  SCENE_BUNDLE_PASSAGES,
  SCENE_BUNDLE_SUMMARY,
  getSceneBundle,
  sceneBundleLaunch,
  sceneBundleWordCount,
  sceneBundlesForPassage,
} from '../lib/sceneBundles.js'
import { listItemPlace, restoreListItemPlace } from '../lib/screenScroll.js'

const levelIdFrom = (value) => (
  SCENE_BUNDLE_LEVELS.some((level) => level.id === value) ? value : SCENE_BUNDLE_LEVELS[0].id
)

// 級ごとに、長文1本ずつの「場面の束」を並べる。束を暗記・テストしてから、その長文を読む。
export function SceneBundlesScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const replaceParams = useStore((state) => state.replaceParams)
  const srs = useStore((state) => state.srs)
  const readingsDone = useStore((state) => state.readingsDone)
  const [levelId, setLevelId] = useState(() => levelIdFrom(params.levelId))
  // 暗記・テストから戻ったときは、その束を開いたままにして、次のテストや本文へ進めるようにする。
  const [openBundle, setOpenBundle] = useState(() => getSceneBundle(params.bundleId))
  const screenRef = useRef(null)

  // 本文や束の暗記から戻ったら、その長文の欄を離れたときと同じ高さに置く（一覧の先頭へ戻さない）。
  useLayoutEffect(() => {
    restoreListItemPlace(screenRef.current, 'data-scene-bundle-passage', params.listPlace)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 開き直す束と戻す位置は一度だけ使う。残すと、次に別の画面から戻ったときにも同じ束が開いてしまう。
  useEffect(() => {
    if (params.bundleId || params.listPlace) {
      replaceParams({ ...params, bundleId: undefined, listPlace: undefined })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const passages = SCENE_BUNDLE_PASSAGES.filter((passage) => passage.level === levelId)
  // 束や本文へ移る前に、その長文の欄が画面のどの高さにあったかを戻り先に入れる。
  // この画面の履歴にも残し、戻り先を引き継がない画面（準備画面からの暗記など）を経ても同じ欄へ戻す。
  const returnTarget = (passageId, bundleId) => {
    const listPlace = listItemPlace(screenRef.current, 'data-scene-bundle-passage', passageId)
    replaceParams({ ...params, levelId, listPlace })
    return { screen: 'sceneBundles', params: { levelId, listPlace, ...(bundleId ? { bundleId } : {}) } }
  }

  const selectLevel = (nextLevelId) => {
    setLevelId(nextLevelId)
    // 本文や単語の詳細から戻ったときも、選んだ級のまま表示する。
    replaceParams({ ...params, levelId: nextLevelId, bundleId: undefined })
  }

  const startBundle = (bundle, mode) => {
    const target = returnTarget(bundle.passageId, bundle.id)
    const { screen, params: launchParams } = sceneBundleLaunch(bundle, mode, {
      continueTo: { ...target, label: '場面の束に戻る' },
      returnTo: target,
    })
    setOpenBundle(null)
    navigate(screen, launchParams)
  }

  const readPassage = (passageId) => {
    setOpenBundle(null)
    navigate('reader', { passageId, returnTo: returnTarget(passageId) })
  }

  return (
    <div ref={screenRef} className="pb-6" data-scene-bundle-catalog>
      <ScreenHeader
        title="場面の束から読む"
        subtitle={`全${SCENE_BUNDLE_SUMMARY.bundles}束・${SCENE_BUNDLE_SUMMARY.words.toLocaleString('ja-JP')}語。束を暗記してから長文へ`}
      />

      <div className="space-y-3 px-4 pt-3">
        <div className="grid grid-cols-4 gap-1 rounded-2xl bg-brand-100 p-1" role="tablist" aria-label="級を選ぶ">
          {SCENE_BUNDLE_LEVELS.map((level) => (
            <button
              key={level.id}
              type="button"
              role="tab"
              aria-selected={level.id === levelId}
              onClick={() => selectLevel(level.id)}
              className={cx(
                'min-h-11 rounded-xl px-1 py-2 text-xs font-extrabold transition-colors',
                level.id === levelId ? 'bg-white text-brand-700 shadow-sm' : 'text-brand-700/65',
              )}
              data-scene-bundle-level={level.id}
            >
              {level.label}
            </button>
          ))}
        </div>

        {passages.map((passage) => {
          const level = getLevel(passage.level)
          const bundles = sceneBundlesForPassage(passage.id)
          const done = readingsDone.includes(passage.id)
          return (
            <Card key={passage.id} className="overflow-hidden" data-scene-bundle-passage={passage.id}>
              <div className="flex items-center gap-3 px-4 pb-3 pt-4">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
                  style={{ backgroundColor: `${level.color}22` }}
                  aria-hidden="true"
                >
                  {passage.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-base font-extrabold leading-snug text-ink">{passage.titleJa}</h2>
                  <p className="truncate text-[11px] font-extrabold text-brand-600">{passage.theme}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] font-bold text-ink/45">
                    <span>場面の束 {bundles.length}・{sceneBundleWordCount(bundles)}語</span>
                    {done && (
                      <span className="inline-flex items-center gap-0.5 text-emerald-600">
                        <Check size={12} /> 読了
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <SceneBundleRows
                bundles={bundles}
                srs={srs}
                onOpen={setOpenBundle}
                className="border-t border-slate-100"
              />
              <div className="grid grid-cols-2 gap-2 border-t border-brand-100 bg-brand-50/40 p-3">
                <Button
                  full
                  size="sm"
                  variant="secondary"
                  className="min-h-12"
                  onClick={() => navigate('readingPrep', { passageId: passage.id, returnTo: returnTarget(passage.id) })}
                  aria-label={`${passage.titleJa}の読解の準備をする`}
                >
                  準備して読む
                </Button>
                <Button
                  full
                  size="sm"
                  className="min-h-12"
                  onClick={() => readPassage(passage.id)}
                  aria-label={`${passage.titleJa}の本文を読む`}
                >
                  本文を読む
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      <SceneBundleSheet
        bundle={openBundle}
        onClose={() => setOpenBundle(null)}
        onStudy={() => startBundle(openBundle, 'study')}
        onQuiz={() => startBundle(openBundle, 'quiz')}
        onRead={() => readPassage(openBundle.passageId)}
      />
    </div>
  )
}
