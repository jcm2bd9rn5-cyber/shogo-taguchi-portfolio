# 田口 将伍 — Portfolio

個人開発作品を簡潔に紹介する、Next.js製ポートフォリオです。

## 主な実装

- 全ページで回遊し続ける、20点のFollow-the-Leader Spineによる鯉の身体変形
- Reynolds Steeringによる回遊、境界回避、個体間回避、ポインター反応
- Boidsによる小魚の群泳
- 身体座標から輪郭・胸びれ・尾びれ・錦鯉模様を毎フレーム生成するASCIIレンダラー
- 60Hz固定タイムステップとCanvas 2D描画
- `prefers-reduced-motion`、画面外停止、DPR上限による負荷制御
- Strive / GuruMeetを画像・作品名・一文・公式リンクで見せる作品一覧
- 余計な入場アニメーションやカーソル演出を使わない簡潔なUI
- 短い自己紹介と制作物の一覧
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

- 鯉エンジンは[stackedlol/ascii-sharks](https://github.com/stackedlol/ascii-sharks)の構成や公開アルゴリズムを研究して実装しています。元プロジェクトの利用許可は未確認のため、直接流用の可否は別途確認が必要です。
- UIモーションは[Motion Reference](https://motion-reference.takayustudio.jp/)のモーション分類とタイミング設計を参考にし、サイト用に独自実装しています。
- GuruMeetの紹介文は[公式サイト](https://lp.gurumeet.net/)の公開情報を使用しています。
- Striveの紹介文とリンクは[公式サイト](https://strive-lp-xi.vercel.app/)の公開情報を使用しています。

詳細は`THIRD_PARTY_NOTICES.md`を参照してください。
