import { CREDIT_SECTIONS } from '../data/credits.js'
import { CLIMATE_STATIONS } from '../data/subjects/climate.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SubjectText } from '../components/SubjectText.jsx'
import { Card } from '../components/ui.jsx'

// 出典のページ（メニューのいちばん下）。教材づくりで参考にしたものと、図や数値に使った資料を並べる。
// 地名などの常用漢字にない字は、学習の画面と同じ読みがな（SubjectText）で読めるようにする。
const stationLabels = (kind) => Object.values(CLIMATE_STATIONS)
  .filter((station) => (kind === 'japan' ? station.country === '日本' : station.country !== '日本'))
  .map((station) => station.label)

export function CreditsScreen() {
  return (
    <div className="pb-8" data-credits-page>
      <ScreenHeader title="出典" subtitle="参考にした教科書の単元と、図・数値に使った資料" />
      <div className="space-y-4 px-4 pt-3">
        {CREDIT_SECTIONS.map((section) => (
          <section key={section.id} className="space-y-2" aria-label={section.title} data-credits-section={section.id}>
            <h2 className="px-1 font-display text-base font-extrabold text-ink/80">{section.title}</h2>
            {section.items.map((item) => (
              <Card key={item.id} className="p-4" data-credit={item.id}>
                <p className="text-sm font-extrabold leading-relaxed text-ink"><SubjectText>{item.name}</SubjectText></p>
                <p className="mt-1 text-xs font-bold leading-relaxed text-ink/65"><SubjectText>{item.use}</SubjectText></p>
                {item.stations && (
                  <p className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
                    <SubjectText>{`地点：${stationLabels(item.stations).join('・')}`}</SubjectText>
                  </p>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-2 inline-block break-all text-xs font-bold text-brand-700 underline"
                  >
                    {item.url}
                  </a>
                )}
              </Card>
            ))}
            {section.note && <p className="px-1 text-xs font-bold leading-relaxed text-ink/55"><SubjectText>{section.note}</SubjectText></p>}
          </section>
        ))}
      </div>
    </div>
  )
}
