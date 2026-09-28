export type Language = 'ja' | 'en';

export interface Translations {
  appTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  inputPlaceholder: string;
  buttonAppraise: string;
  buttonCalculating: string;
  sampleButton: string;
  privacyNote: string;
  calcAnalyzing: (name: string) => string;
  calcMatching: string;
  certHeader: string;
  certValueLabel: string;
  certValuePrefix: string;
  certCalculatedAmount: string;
  certEquivalentLabel: string;
  stampText: {
    top: string;
    mid: string;
    btm: string;
  };
  tabStats: string;
  tabBreakdown: string;
  breakdownCols: {
    item: string;
    factor: string;
    impact: string;
  };
  certFooterNote: string;
  shareHashtags: string;
  btnSavePng: string;
  btnCopy: string;
  btnCopied: string;
  btnShare: string;
  btnTryAgain: string;
  sampleNames: string[];
}

export const I18N: Record<Language, Translations> = {
  ja: {
    appTitle: '名前査定ドットコム',
    heroTitle: 'あなたの名前、何円？',
    heroSubtitle: '名前を入力するだけで、文字のオーラや語感から架空の評価額とステータスを即座に査定します。',
    inputPlaceholder: 'お名前を入力（例：山田 太郎）',
    buttonAppraise: '査定する',
    buttonCalculating: '査定計算中...',
    sampleButton: '例を試す',
    privacyNote: '入力データはブラウザ上でのみ計算され、外部サーバーや履歴には一切保存されません。',
    calcAnalyzing: (name: string) => `「${name}」の字画オーラを解析中`,
    calcMatching: '画数・語感・主人公オーラ照合中...',
    certHeader: '名前査定ドットコム 公式鑑定証',
    certValueLabel: '推定架空市場価値',
    certValuePrefix: '算出額：',
    certCalculatedAmount: '算出額：',
    certEquivalentLabel: '価値換算目安：',
    stampText: {
      top: '架空',
      mid: '鑑定済',
      btm: '極印',
    },
    tabStats: 'ステータス分析',
    tabBreakdown: '査定内訳明細',
    breakdownCols: {
      item: '査定項目',
      factor: '判定要因',
      impact: '補正影響',
    },
    certFooterNote: '※本鑑定はエンタメ目的の架空査定です（個人情報・データ保存なし）',
    shareHashtags: '#名前査定ドットコム #あなたの名前何円',
    btnSavePng: '画像を保存',
    btnCopy: '結果をコピー',
    btnCopied: 'コピー完了！',
    btnShare: '共有する',
    btnTryAgain: '別のお名前を査定する',
    sampleNames: [
      '山田 太郎',
      '織田 信長',
      '夏目 漱石',
      '坂本 龍馬',
      '孫悟空',
      '竈門 炭治郎',
      '大谷 翔平',
      '星野 アイ',
    ],
  },
  en: {
    appTitle: 'Name Valuation Online',
    heroTitle: 'What is Your Name Worth?',
    heroSubtitle: 'Enter any name to calculate its fictional market value, status stats, and unique protagonist aura.',
    inputPlaceholder: 'Enter a name (e.g. Tony Stark)',
    buttonAppraise: 'Appraise Name',
    buttonCalculating: 'Appraising Aura...',
    sampleButton: 'Try Random',
    privacyNote: 'All calculations run entirely in your local browser. No data is stored or transmitted.',
    calcAnalyzing: (name: string) => `Analyzing aura & letters for "${name}"...`,
    calcMatching: 'Matching syllables, charisma index & plot armor...',
    certHeader: 'NAME VALUATION OFFICIAL CERTIFICATE',
    certValueLabel: 'Estimated Fictional Market Value',
    certValuePrefix: 'Exact Value: ',
    certCalculatedAmount: 'Exact Value: ',
    certEquivalentLabel: 'Value Equivalent: ',
    stampText: {
      top: 'FICTIONAL',
      mid: 'VERIFIED',
      btm: 'OFFICIAL',
    },
    tabStats: 'Status Stats',
    tabBreakdown: 'Valuation Breakdown',
    breakdownCols: {
      item: 'Factor',
      factor: 'Analysis Detail',
      impact: 'Impact',
    },
    certFooterNote: '* This appraisal is for fictional entertainment only (Zero data stored).',
    shareHashtags: '#NameAppraisal #WhatIsYourNameWorth',
    btnSavePng: 'Save Image',
    btnCopy: 'Copy Result',
    btnCopied: 'Copied!',
    btnShare: 'Share',
    btnTryAgain: 'Appraise Another Name',
    sampleNames: [
      'Tony Stark',
      'Sherlock Holmes',
      'Taylor Swift',
      'Albert Einstein',
      'Neo',
      'Hermione Granger',
      'Leonardo da Vinci',
      'Bruce Wayne',
    ],
  },
};
