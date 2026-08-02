import { useMemo, useState } from 'react'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Button, ProgressBar, cx } from '../components/ui.jsx'
import { ArrowRight, Check } from '../components/Icons.jsx'
import { LightNovelScene } from '../components/LightNovelScene.jsx'
import { useStore } from '../store/useStore.js'
import {
  BATTLE_STUDENTS,
  battleEmotionById,
  battleStudentById,
  battleStudentLifestylePortrait,
  battleStudentPortrait,
  battleSupportStyleById,
} from '../lib/battleCast.js'
import {
  AFTER_SCHOOL_CHRONICLE,
  afterSchoolBattleEpilogue,
  afterSchoolDailyChapter,
  afterSchoolEpisodeNumber,
} from '../lib/afterSchoolStory.js'
import {
  afterSchoolBondState,
  afterSchoolBranchOptions,
  afterSchoolBranchScene,
  isBattleStudentUnlocked,
  resolveAfterSchoolReward,
} from '../lib/afterSchoolBonds.js'
import { publicAssetUrl } from '../lib/publicAssetUrl.js'

function scenePortrait(scene, studentId, emotionId) {
  if (scene.outfitId === 'home' || scene.outfitId === 'weekend') {
    return battleStudentLifestylePortrait(studentId, scene.outfitId)
  }
  return battleStudentPortrait(studentId, emotionId)
}

function BondMeter({ bond, inverse = false }) {
  return (
    <div className={cx('min-w-0', inverse ? 'text-white' : 'text-ink')}>
      <div className="flex items-center justify-between gap-2 text-[9px] font-extrabold">
        <span className="truncate">絆LV{bond.level.level} · {bond.level.label}</span>
        <span className={cx('shrink-0', inverse ? 'text-amber-200' : 'text-violet-600')}>
          {bond.nextLevel ? `あと ${bond.pointsToNext}` : 'MAX'}
        </span>
      </div>
      <ProgressBar
        value={bond.progress}
        color="linear-gradient(90deg,#67e8f9,#c4b5fd,#f9a8d4)"
        className={cx('mt-1 h-1.5', inverse ? 'bg-white/15' : 'bg-violet-100')}
      />
    </div>
  )
}

function RouteHub({
  options,
  bonds,
  currentStudentId,
  unlockedStudentIds,
  onSelect,
  onBack,
  onHome,
}) {
  const unlockedCount = unlockedStudentIds.length
  return (
    <div className="min-h-full bg-gradient-to-b from-slate-950 via-indigo-950 to-violet-950 pb-8 text-white">
      <ScreenHeader
        title="友達と過ごす日常"
        subtitle="対決のあと、誰とどんな時間を過ごす？"
        onBack={onBack}
        color="#0f172a"
        inverse
      />

      <div className="space-y-4 px-4">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-slate-900 shadow-2xl">
          <img
            src={publicAssetUrl(AFTER_SCHOOL_CHRONICLE.keyVisual)}
            alt="放課後の昇降口で、クラスメイトたちが三つの寄り道ルートを相談している"
            className="aspect-[16/9] w-full object-cover"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <span className="rounded-full border border-cyan-100/25 bg-slate-950/60 px-2 py-1 text-[8px] font-extrabold tracking-[0.16em] text-cyan-100 backdrop-blur-sm">
              AFTER SCHOOL CROSSROADS
            </span>
            <h1 className="mt-2 font-display text-xl font-extrabold">戦いのあとは、いつもの時間</h1>
            <p className="mt-1 text-[10px] font-bold leading-relaxed text-white/65">
              行き先と過ごす相手で、会話も育つ関係も変わります。
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-2 px-1">
            <div>
              <p className="text-[9px] font-extrabold tracking-[0.16em] text-cyan-200">CHOOSE A ROUTE</p>
              <h2 className="mt-0.5 font-display text-lg font-extrabold">3つの日常</h2>
            </div>
            <span className="rounded-full bg-white/10 px-2 py-1 text-[8px] font-extrabold text-white/55">仲間 {unlockedCount}/{BATTLE_STUDENTS.length}</span>
          </div>

          <div className="mt-2.5 space-y-2.5" aria-label="日常の行き先">
            {options.map((profile) => {
              const scene = afterSchoolBranchScene(profile)
              const bond = afterSchoolBondState(bonds, profile.studentId)
              const isCurrent = profile.studentId === currentStudentId
              const unlocked = isBattleStudentUnlocked(unlockedStudentIds, profile.studentId)
              const nextReward = !bond.skillUnlocked
                ? `${profile.skill.emoji} 特技まであと${Math.max(0, 3 - bond.points)}`
                : !bond.itemUnlocked
                  ? `${profile.item.emoji} アイテムまであと${Math.max(0, 8 - bond.points)}`
                  : `${profile.item.emoji} XPボーナスあり`
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => onSelect(profile.id)}
                  className="grid min-h-28 w-full grid-cols-[6.5rem_minmax(0,1fr)] overflow-hidden rounded-[1.35rem] border border-white/12 bg-white/[0.07] text-left shadow-lg transition-transform active:scale-[0.99]"
                >
                  <span className="relative overflow-hidden bg-slate-900">
                    <img
                      src={publicAssetUrl(scene.image)}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/55" />
                    <img
                      src={publicAssetUrl(scenePortrait(scene, bond.student.id, 'curious'))}
                      alt=""
                      className={cx(
                        'absolute bottom-1 left-1 h-12 w-12 rounded-xl border-2 border-white/50 bg-slate-900 object-cover [image-rendering:pixelated]',
                        !unlocked && 'brightness-0 opacity-70',
                      )}
                    />
                    {!unlocked && (
                      <span className="absolute bottom-4 left-5 text-base" aria-hidden="true">🔒</span>
                    )}
                  </span>
                  <span className="min-w-0 p-3">
                    <span className="flex items-center justify-between gap-2">
                      <strong className="truncate text-xs font-extrabold">{profile.routeLabel}</strong>
                      {isCurrent && (
                        <span className="shrink-0 rounded-full bg-emerald-400/15 px-2 py-1 text-[7px] font-extrabold text-emerald-100">同行中</span>
                      )}
                      {!unlocked && (
                        <span className="shrink-0 rounded-full bg-pink-400/15 px-2 py-1 text-[7px] font-extrabold text-pink-100">出会い</span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-[9px] font-bold text-cyan-100">
                      {unlocked ? bond.student.name : 'まだ知らないクラスメイト'} · {profile.location}
                    </span>
                    <span className="mt-1.5 block"><BondMeter bond={bond} inverse /></span>
                    <span className="mt-1.5 block truncate text-[8px] font-extrabold text-amber-200">
                      {unlocked ? `NEXT · ${nextReward}` : 'FIRST EVENT · 話すと共闘できる仲間に'}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <p className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-[9px] font-bold leading-relaxed text-white/50">
          放課後は採点なしです。どの声掛けでも絆とXPを得られ、性格に合う言葉では絆が少し多く伸びます。
        </p>
        <Button full variant="ghost" className="text-white/65 active:bg-white/10" onClick={onHome}>
          今回は日常パートを終える
        </Button>
      </div>
    </div>
  )
}

export function AfterSchoolInterludeScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const goHome = useStore((state) => state.goHome)
  const storyStep = useStore((state) => state.battleStoryStep)
  const currentStudentId = useStore((state) => state.battleStudentId)
  const bonds = useStore((state) => state.afterSchoolBonds)
  const unlockedStudentIds = useStore((state) => state.unlockedBattleStudentIds)
  const completeAfterSchoolRoute = useStore((state) => state.completeAfterSchoolRoute)
  const returnToChronicle = useStore((state) => state.returnToAfterSchoolChronicle)
  const currentStudent = battleStudentById(currentStudentId)
  const options = useMemo(
    () => afterSchoolBranchOptions({ step: storyStep, currentStudentId }),
    [storyStep, currentStudentId],
  )
  // 対決後は毎回ここから始め、同行者を含む3つの行き先を自分で選ぶ。
  const [branchId, setBranchId] = useState(null)
  const [choiceId, setChoiceId] = useState(null)
  const [reward, setReward] = useState(null)
  const [epilogueRead, setEpilogueRead] = useState(() => !params.fromBattle)
  const [branchStoryRead, setBranchStoryRead] = useState(false)

  const profile = options.find((item) => item.id === branchId) ?? null
  const scene = profile ? afterSchoolBranchScene(profile) : null
  const bond = profile ? afterSchoolBondState(bonds, profile.studentId) : null
  const selectedChoice = profile?.choices.find((choice) => choice.id === choiceId) ?? null
  const rewardPreview = selectedChoice
    ? resolveAfterSchoolReward({ bonds, branchId: profile.id, choiceId: selectedChoice.id })
    : null
  const episodeNumber = afterSchoolEpisodeNumber(storyStep)
  const epilogue = afterSchoolBattleEpilogue({
    storyStep,
    studentName: currentStudent.name,
    rivalName: params.rivalName,
    verdictId: params.verdictId,
    isTeacher: params.isTeacher,
    teacherDefeated: params.teacherDefeated,
  })
  const isFirstMeeting = profile
    ? !isBattleStudentUnlocked(unlockedStudentIds, profile.studentId)
    : false
  const dailyChapter = profile
    ? afterSchoolDailyChapter({
        storyStep,
        studentName: bond.student.name,
        routeLabel: profile.routeLabel,
        location: profile.location,
        situation: profile.situation,
        opening: profile.opening,
        firstMeeting: isFirstMeeting,
      })
    : null

  if (!epilogueRead) {
    return (
      <LightNovelScene
        story={epilogue}
        image={AFTER_SCHOOL_CHRONICLE.keyVisual}
        imageAlt="ことばの対決を終え、クラスメイトたちが日常へ戻る昇降口"
        portraits={{
          'student-relieved': battleStudentPortrait(currentStudent.id, 'relieved'),
        }}
        onBack={returnToChronicle}
        onComplete={() => setEpilogueRead(true)}
        completeLabel="友達との日常へ"
        skipLabel="日常へ進む"
      />
    )
  }

  if (!profile || !scene || !bond) {
    return (
      <RouteHub
        options={options}
        bonds={bonds}
        currentStudentId={currentStudentId}
        unlockedStudentIds={unlockedStudentIds}
        onSelect={(nextBranchId) => {
          setBranchId(nextBranchId)
          setChoiceId(null)
          setReward(null)
          setBranchStoryRead(false)
        }}
        onBack={returnToChronicle}
        onHome={goHome}
      />
    )
  }

  if (!branchStoryRead && dailyChapter) {
    return (
      <LightNovelScene
        story={dailyChapter}
        image={scene.image}
        imageAlt={`${profile.location}。${profile.situation}`}
        portraits={{
          'student-opening': scenePortrait(scene, bond.student.id, profile.openingEmotionId),
        }}
        onBack={() => setBranchId(null)}
        onComplete={() => setBranchStoryRead(true)}
        completeLabel="返す言葉を選ぶ"
        skipLabel="会話へ進む"
      />
    )
  }

  const confirmReward = () => {
    if (!selectedChoice || reward) return
    const granted = completeAfterSchoolRoute({
      step: storyStep,
      branchId: profile.id,
      choiceId: selectedChoice.id,
    })
    if (granted) setReward(granted)
  }

  const finishEpisode = ({ openTalk = false } = {}) => {
    if (!reward) return
    returnToChronicle()
    if (openTalk) navigate('characterTalk', { fromBattle: true, storyStep })
  }

  const selectAnotherRoute = () => {
    if (reward) return
    setBranchId(null)
    setChoiceId(null)
    setBranchStoryRead(false)
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-950 via-indigo-950 to-violet-950 pb-8 text-white">
      <ScreenHeader
        title={profile.routeLabel}
        subtitle={`${bond.student.name}と過ごす日常`}
        onBack={reward ? returnToChronicle : selectAnotherRoute}
        color="#0f172a"
        inverse
      />

      <div className="space-y-4 px-4">
        <section className="after-school-interlude-hero relative overflow-hidden rounded-[2rem] border border-white/15 bg-slate-900 shadow-2xl">
          <img
            src={publicAssetUrl(scene.image)}
            alt={`${profile.location}。${profile.situation}`}
            className="aspect-[16/10] w-full object-cover"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          <img
            src={publicAssetUrl(scenePortrait(scene, bond.student.id, profile.openingEmotionId))}
            alt={`${bond.student.name}の${battleEmotionById(profile.openingEmotionId).label}の表情`}
            className="absolute bottom-3 right-3 h-20 w-20 rounded-2xl border-2 border-white/55 bg-slate-900 object-cover shadow-xl [image-rendering:pixelated]"
          />
          <div className="absolute inset-x-0 bottom-0 p-4 pr-24">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full border border-white/20 bg-slate-950/65 px-2 py-1 text-[8px] font-extrabold tracking-[0.12em] backdrop-blur-sm">
                ROUTE {String(episodeNumber).padStart(2, '0')}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[8px] font-extrabold text-amber-100 backdrop-blur-sm">
                {scene.emoji} {profile.time}
              </span>
            </div>
            <h1 className="mt-2 font-display text-xl font-extrabold leading-tight">{profile.location}</h1>
            <p className="mt-1 truncate text-[10px] font-bold text-white/65">{bond.student.name} · {bond.student.club}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-200/15 bg-white/[0.07] p-3.5 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[8px] font-extrabold tracking-[0.15em] text-cyan-200">RELATIONSHIP</p>
              <p className="mt-0.5 truncate text-xs font-extrabold">{bond.student.name}との関係</p>
            </div>
            <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-[8px] font-extrabold text-amber-100">{bond.visits}回一緒に過ごした</span>
          </div>
          <div className="mt-2"><BondMeter bond={bond} inverse /></div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[8px] font-bold">
            <span className={cx('rounded-xl px-2 py-1.5', bond.skillUnlocked ? 'bg-cyan-300/15 text-cyan-100' : 'bg-white/[0.05] text-white/40')}>
              {profile.skill.emoji} LV2特技 · {bond.skillUnlocked ? profile.skill.name : '未解放'}
            </span>
            <span className={cx('rounded-xl px-2 py-1.5', bond.itemUnlocked ? 'bg-amber-300/15 text-amber-100' : 'bg-white/[0.05] text-white/40')}>
              {profile.item.emoji} LV3アイテム · {bond.itemUnlocked ? profile.item.name : '未解放'}
            </span>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-4 shadow-xl backdrop-blur-sm">
          <p className="text-[9px] font-extrabold tracking-[0.16em] text-pink-200">YOUR RESPONSE</p>
          <h2 className="mt-1 font-display text-lg font-extrabold">返す言葉を選ぶ</h2>
          <p className="mt-2 text-[11px] font-bold leading-relaxed text-white/60">
            {bond.student.name}の話を聞いて、今の自分らしい言葉を返そう。
          </p>

          {!reward && (
            <>
              <div className="mt-4 flex items-end justify-between gap-2">
                <div>
                  <h3 className="text-sm font-extrabold">どんな声をかける？</h3>
                  <p className="mt-0.5 text-[9px] font-bold text-white/40">どれも失敗なし · 性格に合う言葉は絆+2</p>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-1 text-[8px] font-extrabold text-white/55">3 CHOICES</span>
              </div>

              <div className="mt-2.5 grid gap-2" role="group" aria-label={`${bond.student.name}への声かけ`}>
                {profile.choices.map((choice) => {
                  const style = battleSupportStyleById(choice.styleId)
                  const selected = selectedChoice?.id === choice.id
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => setChoiceId(choice.id)}
                      aria-pressed={selected}
                      className={cx(
                        'min-h-14 rounded-2xl border px-3 py-2.5 text-left transition-transform active:scale-[0.99]',
                        selected ? 'border-pink-200 bg-pink-300/20 ring-2 ring-pink-300/20' : 'border-white/10 bg-white/[0.06]',
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/10 text-base">{style.emoji}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[8px] font-extrabold text-amber-200">{style.label}</span>
                          <strong className="mt-0.5 block text-[11px] font-extrabold leading-relaxed">{choice.label}</strong>
                        </span>
                        {selected && <Check size={17} className="shrink-0 text-pink-200" />}
                      </span>
                    </button>
                  )
                })}
              </div>

              {selectedChoice && (
                <div className="battle-expression-change mt-3 flex items-start gap-3 rounded-2xl border border-cyan-200/20 bg-gradient-to-br from-cyan-400/15 to-violet-400/10 p-3" role="status" aria-live="polite">
                  <span className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-cyan-100/25 bg-slate-900">
                    <img
                      src={publicAssetUrl(scenePortrait(scene, bond.student.id, selectedChoice.emotionId))}
                      alt={`${bond.student.name}の${battleEmotionById(selectedChoice.emotionId).label}の表情`}
                      className="h-full w-full object-cover [image-rendering:pixelated]"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-extrabold text-cyan-100">{bond.student.name}の返事 · {battleEmotionById(selectedChoice.emotionId).emoji}</span>
                    <p className="mt-1 text-xs font-extrabold leading-relaxed">{selectedChoice.reply}</p>
                    <p className="mt-1.5 text-[9px] font-extrabold text-amber-200">
                      受取予定：+{rewardPreview?.xpGained ?? 0} XP · 絆+{rewardPreview?.bondPointsGained ?? 0}
                      {rewardPreview?.styleMatched ? ' · 性格ボーナス' : ''}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {reward && (
            <div className="mt-4 rounded-2xl border border-amber-200/35 bg-gradient-to-br from-amber-300/20 via-pink-300/10 to-cyan-300/15 p-3.5" role="status" aria-live="polite">
              <p className="text-[9px] font-extrabold tracking-[0.15em] text-amber-200">AFTER SCHOOL REWARD</p>
              <h3 className="mt-1 font-display text-base font-extrabold">放課後の思い出が力になった</h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <span className="rounded-xl bg-slate-950/40 px-3 py-2 text-center">
                  <strong className="block text-lg font-extrabold text-amber-100">+{reward.xpGained}</strong>
                  <span className="text-[8px] font-bold text-white/50">冒険者XP</span>
                </span>
                <span className="rounded-xl bg-slate-950/40 px-3 py-2 text-center">
                  <strong className="block text-lg font-extrabold text-cyan-100">+{reward.bondPointsGained}</strong>
                  <span className="text-[8px] font-bold text-white/50">{bond.student.name}との絆</span>
                </span>
              </div>
              {reward.styleMatched && <p className="mt-2 text-[9px] font-extrabold text-pink-100">🤝 性格に合う声掛けで絆ボーナス</p>}
              {reward.itemXpBonus > 0 && <p className="mt-1 text-[9px] font-extrabold text-amber-100">{profile.item.emoji} {profile.item.name}の効果：XP +{reward.itemXpBonus}</p>}
              {reward.unlockedSkill && (
                <div className="mt-2 rounded-xl border border-cyan-200/20 bg-cyan-300/10 px-3 py-2">
                  <p className="text-[8px] font-extrabold text-cyan-200">NEW BATTLE SKILL</p>
                  <p className="mt-0.5 text-xs font-extrabold">{reward.unlockedSkill.emoji} {reward.unlockedSkill.name}</p>
                  <p className="mt-0.5 text-[9px] font-bold text-white/55">{reward.unlockedSkill.description}</p>
                </div>
              )}
              {reward.unlockedItem && (
                <div className="mt-2 rounded-xl border border-amber-200/20 bg-amber-300/10 px-3 py-2">
                  <p className="text-[8px] font-extrabold text-amber-200">NEW MEMORY ITEM</p>
                  <p className="mt-0.5 text-xs font-extrabold">{reward.unlockedItem.emoji} {reward.unlockedItem.name}</p>
                  <p className="mt-0.5 text-[9px] font-bold text-white/55">{reward.unlockedItem.description}</p>
                </div>
              )}
              {reward.companionUnlocked && (
                <div className="mt-2 rounded-xl border border-pink-200/25 bg-pink-300/10 px-3 py-2">
                  <p className="text-[8px] font-extrabold text-pink-200">NEW COMPANION · KEY VISUAL SAVED</p>
                  <p className="mt-0.5 text-xs font-extrabold">🤝 {bond.student.name}が共闘できる仲間になった</p>
                  <p className="mt-0.5 text-[9px] font-bold text-white/55">この出会いはアルバムから振り返れ、次の戦果画面から同行者に選べます。</p>
                </div>
              )}
              <p className="mt-2 text-[8px] font-bold leading-relaxed text-white/40">放課後XPは冒険者LVへ加算されます。学習の正答率・SRS・診断結果は変わりません。</p>
            </div>
          )}
        </section>

        <div className="space-y-2">
          {!reward ? (
            <>
              <Button full size="lg" disabled={!selectedChoice} onClick={confirmReward}>
                この放課後を確定して報酬を受け取る <ArrowRight size={19} />
              </Button>
              <Button full variant="secondary" onClick={selectAnotherRoute}>行き先を選び直す</Button>
            </>
          ) : (
            <>
              <Button full size="lg" onClick={() => finishEpisode()}>
                物語へ戻る <ArrowRight size={19} />
              </Button>
              <Button full variant="secondary" onClick={() => finishEpisode({ openTalk: true })}>
                もっと友達と話す
              </Button>
            </>
          )}
          <Button full variant="ghost" className="text-white/65 active:bg-white/10" onClick={goHome}>今回はここで終える</Button>
        </div>
      </div>
    </div>
  )
}
