# 田口 将伍 — Portfolio

個人開発・チーム開発の制作物を簡潔に紹介する、Next.js製ポートフォリオです。

## 掲載中の制作物

- **Strive** — 筋トレ記録・成長可視化アプリ。Flutter / Firebaseで開発し、iOS / Androidで公開。
- **GuruMeet** — スワイプと投票で店選びを支援するチーム開発サービス。Flutter / FastAPI。
- **Construction Drawing Intelligence** — 建設図面を自然言語で検索し、根拠を原本まで追跡できるGrounded RAGシステム。FastAPI / PostgreSQL / pgvector。

## 主な実装

- 全ページで回遊し続ける、20点のFollow-the-Leader Spineによる鯉の身体変形
- Reynolds Steeringによる回遊、境界回避、個体間回避、ポインター反応
- Boidsによる小魚の群泳
- 身体座標から輪郭・胸びれ・尾びれ・錦鯉模様を毎フレーム生成するASCIIレンダラー
- 60Hz固定タイムステップとCanvas 2D描画
- `prefers-reduced-motion`、画面外停止、DPR上限による負荷制御
- 制作物を名称・一文・技術タグ・外部リンクで見せるミニマルな作品一覧
- マスクワイプ、段差リビール、マグネット追従、スクロール進捗などの軽量モーション
- モバイル / Web / Backendの実制作技術をSimple Iconsでカテゴリ表示
- セマンティックHTML、キーボードフォーカス、SEO / OGP

鯉は固定ASCII文字列や画像変換ではありません。頭部の操舵、20点の骨格追従、尾へ伝わる進行波、セルごとの形状判定をリアルタイムで計算します。

## セットアップ

Node.js 20.9以降を使用します。

```bash
npm install
npm run dev
```

`http://localhost:3000` を開きます。

## 検証

```bash
npm run typecheck
npm run lint
npm run build
```

## Vercelへのデプロイ

1. リポジトリをGitHubへpushします。
2. Vercelでリポジトリを選び、Framework PresetをNext.jsにします。
3. `NEXT_PUBLIC_SITE_URL`へ公開URLを設定します。
4. Build Commandは`npm run build`のままデプロイします。

メールアドレスなど未確認情報は掲載していません。

## 出典

- 鯉エンジンは[stackedlol/ascii-sharks](https://github.com/stackedlol/ascii-sharks)の固定タイムステップ、骨格追従、操舵、セルベース描画を調査し、鯉専用の形状・運動・模様として再実装しています。利用許可はポートフォリオ所有者が原作者から取得済みです。
- UIモーションは[Motion Reference](https://motion-reference.takayustudio.jp/)のモーション分類とタイミング設計を参考にし、サイト用に独自実装しています。
- GuruMeetの紹介文は[公式サイト](https://lp.gurumeet.net/)の公開情報を使用しています。
- Striveの紹介文とリンクは[公式サイト](https://strive-lp-xi.vercel.app/)の公開情報を使用しています。
- Construction Drawing Intelligenceの説明とリンクは[公開リポジトリ](https://github.com/jcm2bd9rn5-cyber/construction-drawing-intelligence)を参照しています。

詳細は`THIRD_PARTY_NOTICES.md`を参照してください。
