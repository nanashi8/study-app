import { useStore } from '../store/useStore.js'
import {
  ContentMenu,
  ContentMenuButton,
  ContentMenuSection,
} from '../components/ContentMenu.jsx'
import {
  Book,
  BookOpen,
  Cards,
  Headphones,
  Lightbulb,
  Refresh,
} from '../components/Icons.jsx'

// 漢文アプリのホーム。英語アプリのホームと同じく、学ぶ内容（コンテンツ）を選ぶだけの画面にする。
// 今日の復習・単語帳・分野のカードは、それぞれのコンテンツのトップ（漢語・漢文法・漢文常識・返り点）に置く。
export function KanbunHomeScreen() {
  const navigate = useStore((state) => state.navigate)

  return (
    <ContentMenu title="漢文アプリ" data-kanbun-home-menu>
      <ContentMenuSection title="コンテンツを選ぶ" data-kanbun-mode-group>
        <ContentMenuButton
          icon={Book}
          color="#0f766e"
          label="漢語"
          onClick={() => navigate('kanbunCatalog', { domain: 'vocab' })}
          data-kanbun-entry="vocab"
        />
        <ContentMenuButton
          icon={BookOpen}
          color="#be123c"
          label="漢文法"
          onClick={() => navigate('kanbunCatalog', { domain: 'grammar' })}
          data-kanbun-entry="grammar"
        />
        <ContentMenuButton
          icon={Lightbulb}
          color="#7c3aed"
          label="漢文常識"
          onClick={() => navigate('kanbunCatalog', { domain: 'culture' })}
          data-kanbun-entry="culture"
        />
        <ContentMenuButton
          icon={Refresh}
          color="#9f1239"
          label="返り点・訓読"
          onClick={() => navigate('kanbunKundoku')}
          data-kanbun-entry="kundoku"
        />
        <ContentMenuButton
          icon={Headphones}
          color="#0d9488"
          label="漢文の名作"
          onClick={() => navigate('literatureLibrary', { kind: 'kanbun' })}
          data-kanbun-entry="literature"
        />
      </ContentMenuSection>

      <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
        <div className="flex gap-3">
          <Book size={20} className="mt-0.5 shrink-0 text-rose-700" />
          <div>
            <p className="text-sm font-extrabold text-rose-950">学習の順序</p>
            <p className="mt-1 text-xs font-bold leading-relaxed text-rose-900/65">
              中学は訓読の仕組みと故事成語から。高校では再読文字・句法、難関大では複合返り・思想・史伝の含意まで進みます。
            </p>
            <div className="mt-3 flex gap-2 text-[10px] font-extrabold text-rose-800">
              <span className="inline-flex items-center gap-1"><Book size={13} /> 暗記</span>
              <span>→</span>
              <span className="inline-flex items-center gap-1"><Cards size={13} /> テスト</span>
              <span>→</span>
              <span>日を空けて復習</span>
            </div>
          </div>
        </div>
      </div>
    </ContentMenu>
  )
}
