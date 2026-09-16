# 語源カードの監査記録

## 2026年9月5日の再監査（語源カードの拡張）

語源を「暗記・テスト・一覧」で学べる教材にするため、公開カードの母数を作り直した。

- 形態素分解（`derive-roots.js` の接頭辞＋語根）で得た候補を1語ずつ確認し、
  残した967リンク（106語根）を [`etymology-morpheme-audit.js`](../src/data/etymology-morpheme-audit.js) に固定した。
  別系統だった語（`telemedicine`＝medicus、`dialect`＝ギリシャ語 legein、
  古フランス語 poser 系の `-pose` 動詞）は理由つきで `REJECTED_MORPHEME_LINKS` に残す。
- 紐づく語が1語だけの語根（`scope`）は、関連語を示せないためカードにしない。
- 英検・大学入試で効く古典語根40件を [`etymology-classical-roots.js`](../src/data/etymology-classical-roots.js) に追加し、
  259リンクを明示リストで結んだ。綴りの自動推測（`autoRootIds`）の対象にはしない。
- 台帳 [`etymology-card-reviews.js`](../src/data/etymology-card-reviews.js) を196枚へ広げ、
  各カードの語根説明・全紐づけ語・照合見出しを固定するSHA-256を取り直した。

| 母数 | 変更前 | 変更後 |
| --- | ---: | ---: |
| 公開カード | 109枚 | 196枚 |
| 紐づく単語（一意） | 781語 | 1,977語 |
| カード→単語リンク | 786件 | 2,019件 |
