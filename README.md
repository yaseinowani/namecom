# 名前査定ドットコム (Name Value Appraiser)

名前を入力するだけで、文字の部首・音韻・画数・語感から架空の市場価値とステータスを即座に査定・格付けするエンタメWEBアプリケーションです。

## 特徴
- 🎯 **独自の鑑定アルゴリズム**: ハッシュ値・言霊波動・語感リズム・漢字属性から再現性のある評価額とレアリティ（N〜LR）を即時算出
- 🎴 **プレミアム鑑定書カード**: ゴージャスな鑑定証書デザイン、金箔・ホログラム調の高級カードUI
- 📸 **画像書き出し**: HTML5 Canvasを活用した高解像度PNG保存機能（SNS共有に最適）
- 🐦 **SNSワンクリックシェア**: X（旧Twitter）への結果投稿ボタン完備
- 🔒 **プライバシー安全**: 入力された名前データは完全にブラウザ内（クライアントサイド）のみで計算され、外部サーバーやDBには送信・保存されません

## 技術スタック
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Animations & Icons**: Motion (Framer Motion), Lucide React
- **Sound**: Web Audio API (シンセシス生成、外部音声アセット不要)

## 開発・起動方法

### インストール
```bash
npm install
```

### 開発サーバー起動
```bash
npm run dev
```
ブラウザで `http://localhost:3000` を開いて動作を確認できます。

### プロダクションビルド
```bash
npm run build
```

## ライセンス
MIT License
