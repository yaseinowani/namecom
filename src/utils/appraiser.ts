export type RarityTier = 'LR' | 'UR' | 'SSR' | 'SR' | 'R' | 'N';

export interface CharacterAura {
  char: string;
  index: number;
  attribute: string;
  auraColor: 'amber' | 'rose' | 'indigo' | 'emerald' | 'purple' | 'cyan';
  score: number;
  rank: 'SS' | 'S' | 'A' | 'B';
  meaning: string;
  role: string;
}

export interface StatusMetric {
  key: string;
  label: string;
  score: number; // 30 - 100
  rank: 'SS' | 'S' | 'A' | 'B' | 'C';
}

export interface PriceBreakdownItem {
  title: string;
  detail: string;
  amountText: string;
  isMultiplier?: boolean;
}

export interface AppraisalResult {
  id: string;
  name: string;
  price: number;
  formattedYen: string;
  formattedJapaneseUnit: string;
  rarity: RarityTier;
  rarityLabel: string;
  raritySub: string;
  titleBadge: string;
  equivalentItem: string;
  deviationValue: number;
  topPercentile: string;
  stats: StatusMetric[];
  characterAuras: CharacterAura[];
  breakdown: PriceBreakdownItem[];
  reasons: string[];
  luckyItem: string;
  certificateNumber: string;
  timestamp: string;
}

function hashString(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function createRng(seedStr: string, salt = 0) {
  let state = hashString(seedStr, salt) || 123456789;
  return {
    next(): number {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    },
    nextInt(min: number, max: number): number {
      return Math.floor(this.next() * (max - min + 1)) + min;
    },
    pick<T>(arr: T[]): T {
      return arr[Math.floor(this.next() * arr.length)];
    },
  };
}

export function formatJapaneseCurrency(yen: number): string {
  if (yen < 10000) {
    return `${yen.toLocaleString('ja-JP')}円`;
  }
  const oku = Math.floor(yen / 100_000_000);
  const man = Math.floor((yen % 100_000_000) / 10_000);
  const rest = yen % 10_000;

  const parts: string[] = [];
  if (oku > 0) parts.push(`${oku.toLocaleString('ja-JP')}億`);
  if (man > 0) parts.push(`${man.toLocaleString('ja-JP')}万`);
  if (rest > 0 && oku === 0) {
    parts.push(`${rest.toLocaleString('ja-JP')}`);
  }
  return `${parts.join('')}円`;
}

// Special dictionary of Kanji rules
const SPECIAL_KANJI_BONUS: Record<
  string,
  { bonus: number; title: string; stat: 'charisma' | 'luck' | 'protagonist' | 'rhythm' | 'rarity' }
> = {
  龍: { bonus: 88_000_000, title: '古来の昇り龍プレミアム', stat: 'charisma' },
  竜: { bonus: 72_000_000, title: 'ドラゴニック覇気加算', stat: 'protagonist' },
  神: { bonus: 160_000_000, title: '規格外の神域ネーム特例', stat: 'rarity' },
  皇: { bonus: 120_000_000, title: 'インペリアル王統の気品', stat: 'charisma' },
  帝: { bonus: 95_000_000, title: '絶対君主リーダーシップ加算', stat: 'charisma' },
  王: { bonus: 65_000_000, title: 'キングズ・プライド評価額', stat: 'protagonist' },
  金: { bonus: 90_000_000, title: '純金ゴールドラッシュ配当', stat: 'luck' },
  宝: { bonus: 78_000_000, title: '強運トレジャーハンター特需', stat: 'luck' },
  福: { bonus: 60_000_000, title: '招福パワースポット加算', stat: 'luck' },
  翔: { bonus: 48_000_000, title: '大空への飛翔プレミアム', stat: 'protagonist' },
  蓮: { bonus: 45_000_000, title: '洗練のトレンドネーム賞', stat: 'rhythm' },
  凛: { bonus: 52_000_000, title: '芯の強さと透明感プレミアム', stat: 'rarity' },
  葵: { bonus: 40_000_000, title: '格式あるロイヤルフラワー加算', stat: 'charisma' },
  光: { bonus: 42_000_000, title: '周囲を照らすシャイニング加算', stat: 'protagonist' },
  星: { bonus: 58_000_000, title: '生まれながらのスターダム加算', stat: 'charisma' },
  愛: { bonus: 50_000_000, title: '全人類魅了・博愛プレミアム', stat: 'luck' },
  誠: { bonus: 38_000_000, title: '絶対信頼クレジット加算', stat: 'charisma' },
  優: { bonus: 36_000_000, title: '包容力・好感度ボーナス', stat: 'luck' },
  美: { bonus: 38_000_000, title: '造形美・黄金比ボーナス', stat: 'charisma' },
  大: { bonus: 28_000_000, title: 'ビッグスケール大器晩成枠', stat: 'protagonist' },
  一: { bonus: 34_000_000, title: '原点にして頂点・オンリーワン賞', stat: 'protagonist' },
  零: { bonus: 85_000_000, title: 'ミステリアス・ゼロの引力', stat: 'rarity' },
  姫: { bonus: 70_000_000, title: 'プリンセス特別待遇ボーナス', stat: 'rarity' },
  悟: { bonus: 98_000_000, title: '真理覚醒・規格外オーラ', stat: 'protagonist' },
  信: { bonus: 60_000_000, title: '天下布武・カリスマリーダー枠', stat: 'charisma' },
  鳳: { bonus: 130_000_000, title: '鳳凰飛翔・不死鳥伝説配当', stat: 'rarity' },
  虎: { bonus: 68_000_000, title: '猛虎襲来・闘争心ボーナス', stat: 'protagonist' },
  獅: { bonus: 75_000_000, title: '百獣の王・ライオンハート加算', stat: 'charisma' },
  雷: { bonus: 64_000_000, title: '電光石火・インパクト雷光賞', stat: 'rhythm' },
  響: { bonus: 46_000_000, title: '心揺さぶる音響レゾナンス賞', stat: 'rhythm' },
  真: { bonus: 35_000_000, title: '真実一路・オーセンティック加算', stat: 'charisma' },
  聖: { bonus: 80_000_000, title: 'ホーリー・清廉潔白プレミアム', stat: 'rarity' },
  天: { bonus: 72_000_000, title: '天賦の才・ヘブンリーオーラ', stat: 'luck' },
  月: { bonus: 44_000_000, title: '静謐なるルナ・カリスマ加算', stat: 'rhythm' },
  風: { bonus: 38_000_000, title: '時代を先駆ける疾風ボーナス', stat: 'rhythm' },
};

const SYMMETRIC_CHARS = new Set([
  '山', '田', '本', '中', '大', '王', '林', '森', '木', '日', '目', '口', '回', '品', '晶',
  '吉', '平', '幸', '春', '美', '貴', '豊', '里', '黒', '高', '京', '文', '天', '夫', '央',
  '未', '末', '申', '由', '甲', '米', '糸', '羊', '羽', '西', '谷', '車', '金', '門', '雨',
  '青', '音', 'A', 'H', 'I', 'M', 'O', 'T', 'U', 'V', 'W', 'X', 'Y',
]);

function getScoreRank(score: number): 'SS' | 'S' | 'A' | 'B' | 'C' {
  if (score >= 90) return 'SS';
  if (score >= 78) return 'S';
  if (score >= 65) return 'A';
  if (score >= 48) return 'B';
  return 'C';
}

function getEquivalentItem(price: number, rng: ReturnType<typeof createRng>): string {
  if (price >= 20_000_000_000) {
    return rng.pick([
      '民間宇宙ロケットの打ち上げミッション 3回分',
      'プロスポーツ球団の筆頭オーナー権＋専用スタジアム命名権',
      '小規模な無人島リゾート開発プロジェクト丸ごと1件分',
    ]);
  }
  if (price >= 3_000_000_000) {
    return rng.pick([
      '最新鋭プライベートジェット機体（専属クルー5年契約付）',
      '東京都心の一等地デザイナーズオフィスビル 1棟分',
      '世界各国の超高級ホテル最上階スイート 365日貸切滞在権',
    ]);
  }
  if (price >= 300_000_000) {
    return rng.pick([
      '都心タワーマンション最上階ペントハウス（家具付き）1戸分',
      '銀座の高級寿司屋の完全貸切ディナー 約2,200回分',
      '超高級スーパーカー 5台＋特注地下ガレージ建設費',
    ]);
  }
  if (price >= 30_000_000) {
    return rng.pick([
      'ファーストクラスで行く贅沢な世界一周旅行 15回分',
      '全国の老舗温泉旅館・離れ露天風呂付き特別室 400泊分',
      'うまい棒 約250万本分（小学校の体育館が埋まる量）',
    ]);
  }
  if (price >= 2_000_000) {
    return rng.pick([
      '最高峰ハイエンドゲーミングPCフルセット 4台分',
      '黒毛和牛A5ランク・特選焼肉食べ放題 250回分',
      '全国の星付きレストラン巡りコース 80回分',
    ]);
  }
  return rng.pick([
    '特製ラーメン全部乗せ（チャーシュー増し・味玉）120杯分',
    'ホテルのプレミアムアフタヌーンティー 8回分',
    'うまい棒 約2,000本（箱買いして友達全員に配れる量）',
  ]);
}

export function appraiseName(rawName: string, salt = 0): AppraisalResult {
  const cleaned = rawName.trim().replace(/\s+/g, ' ');
  const compact = cleaned.replace(/\s+/g, '');
  const chars = Array.from(compact);

  const rng = createRng(compact || '匿名希望', salt * 7919);

  // Script detection
  let kanjiCount = 0;
  let hiraganaCount = 0;
  let katakanaCount = 0;
  let alphaCount = 0;
  let symmetricCount = 0;

  for (const ch of chars) {
    if (/[\u4E00-\u9FFF\u3400-\u4DBF々]/.test(ch)) kanjiCount++;
    else if (/[\u3040-\u309F]/.test(ch)) hiraganaCount++;
    else if (/[\u30A0-\u30FF]/.test(ch)) katakanaCount++;
    else if (/[a-zA-Zａ-ｚＡ-Ｚ]/.test(ch)) alphaCount++;

    if (SYMMETRIC_CHARS.has(ch)) symmetricCount++;
  }

  // Initial base stats
  let charisma = rng.nextInt(52, 94);
  let luck = rng.nextInt(50, 95);
  let protagonist = rng.nextInt(50, 95);
  let rhythm = rng.nextInt(55, 96);
  let rarityStat = rng.nextInt(50, 96);

  const breakdown: PriceBreakdownItem[] = [];

  // Line item 1: Base valuation
  const basePrice = rng.nextInt(500_000, 24_000_000);
  let accumulatedPrice = basePrice;

  breakdown.push({
    title: `基礎ネームブランド上場価格（全${chars.length}文字）`,
    detail: `「${cleaned}」の文字配列・文字数構成から算出された初期評価`,
    amountText: `+¥${basePrice.toLocaleString('ja-JP')}`,
  });

  // Line item 2: Character inspection
  let matchedSpecial: { char: string; info: (typeof SPECIAL_KANJI_BONUS)[string] } | null = null;
  for (const ch of chars) {
    if (SPECIAL_KANJI_BONUS[ch]) {
      matchedSpecial = { char: ch, info: SPECIAL_KANJI_BONUS[ch] };
      break;
    }
  }

  if (matchedSpecial) {
    const kanjiBonus = Math.round(matchedSpecial.info.bonus * (0.9 + rng.next() * 0.25));
    accumulatedPrice += kanjiBonus;
    breakdown.push({
      title: `「${matchedSpecial.char}」${matchedSpecial.info.title}`,
      detail: `名前に宿る「${matchedSpecial.char}」が持つ固有オーラに対して特別加算`,
      amountText: `+¥${kanjiBonus.toLocaleString('ja-JP')}`,
    });

    if (matchedSpecial.info.stat === 'charisma') charisma = Math.min(100, charisma + 10);
    if (matchedSpecial.info.stat === 'luck') luck = Math.min(100, luck + 10);
    if (matchedSpecial.info.stat === 'protagonist') protagonist = Math.min(100, protagonist + 10);
    if (matchedSpecial.info.stat === 'rhythm') rhythm = Math.min(100, rhythm + 10);
    if (matchedSpecial.info.stat === 'rarity') rarityStat = Math.min(100, rarityStat + 12);
  } else {
    // Generate tailored bonus based on actual characters in their name
    const leadChar = chars[0] || '名';
    const charBonus = rng.nextInt(6_500_000, 48_000_000);
    accumulatedPrice += charBonus;
    breakdown.push({
      title: `頭文字「${leadChar}」ファーストインプレッション加算`,
      detail: `名乗った瞬間に「${leadChar}」の音と字形が相手の記憶に残る求心力を評価`,
      amountText: `+¥${charBonus.toLocaleString('ja-JP')}`,
    });
  }

  // Line item 3: Structure / Phonetic Rhythm bonus
  let rhythmBonus = rng.nextInt(4_500_000, 32_000_000);
  let rhythmTitle = '語感・母音抜けリズムインセンティブ';
  let rhythmDetail = `「${cleaned}」と声に出したときの音抜けの心地よさとリズム感を加算`;

  if (symmetricCount >= 2) {
    rhythmTitle = `左右対称・美文字シンメトリー加算（${symmetricCount}文字該当）`;
    rhythmDetail = '縦書きでも横書きでも揺るぎない端正な字面が、建築的美観として評価されました';
    rhythmBonus += 15_000_000;
    charisma = Math.min(100, charisma + 8);
  } else if (hiraganaCount > 0 && kanjiCount > 0) {
    rhythmTitle = '漢字×ひらがな 黄金ハイブリッド補正';
    rhythmDetail = '凛とした漢字とやわらかなひらがなの調和が生み出す親しみやすさの評価額';
    rhythmBonus += 10_000_000;
    luck = Math.min(100, luck + 8);
  } else if (katakanaCount > 0 || alphaCount > 0) {
    rhythmTitle = 'グローバル音響・スタイリッシュ加算';
    rhythmDetail = '国境を越えて通用するモダンな響きに、海外の架空ファンドから注目が入りました';
    rhythmBonus += 12_000_000;
    rarityStat = Math.min(100, rarityStat + 10);
  }

  accumulatedPrice += rhythmBonus;
  breakdown.push({
    title: rhythmTitle,
    detail: rhythmDetail,
    amountText: `+¥${rhythmBonus.toLocaleString('ja-JP')}`,
  });

  // Line item 4: Market Multiplier
  const roll = rng.next();
  let multiplier = 1.0;
  let multiplierLabel = '通常安定相場（標準乗数）';

  if (roll > 0.88 || (matchedSpecial && roll > 0.70)) {
    multiplier = rng.pick([6.5, 9.8, 18.0, 48.0]);
    multiplierLabel = '伝説級主人公ドラフト指名倍率';
  } else if (roll > 0.60) {
    multiplier = rng.pick([2.2, 3.5, 4.5]);
    multiplierLabel = '時代の追い風・カリスマ覚醒倍率';
  } else if (roll > 0.22) {
    multiplier = rng.pick([1.2, 1.5, 1.8]);
    multiplierLabel = '好感度プレミアム倍率';
  } else if (roll < 0.07) {
    multiplier = rng.pick([0.04, 0.15, 12.0]);
    multiplierLabel = multiplier < 1 ? '親近感重視・アットホーム相場調整' : '超突発フィーバー倍率';
  }

  const finalPrice = Math.max(300, Math.round((accumulatedPrice * multiplier) / 100) * 100);

  if (multiplier !== 1.0) {
    breakdown.push({
      title: multiplierLabel,
      detail:
        multiplier >= 10
          ? '「この名前は物語の中心になる」と架空査定官が満場一致で特別倍率を適用'
          : multiplier >= 2
          ? '字面と音の相乗効果が掛け算となり、市場価値を大きく引き上げました'
          : '呼びやすさと字形のバランスによる適正倍率が反映されました',
      amountText: `×${multiplier}倍`,
      isMultiplier: true,
    });
  }

  // Rarity calculation
  let rarity: RarityTier = 'R';
  let rarityLabel = 'RARE';
  let raritySub = '優良注目株';

  if (finalPrice >= 5_000_000_000) {
    rarity = 'LR';
    rarityLabel = 'LEGEND RARE';
    raritySub = '神話級';
    charisma = Math.max(92, charisma);
    protagonist = Math.max(94, protagonist);
    rarityStat = Math.max(93, rarityStat);
  } else if (finalPrice >= 800_000_000) {
    rarity = 'UR';
    rarityLabel = 'ULTRA RARE';
    raritySub = '国宝級';
    charisma = Math.max(88, charisma);
    protagonist = Math.max(88, protagonist);
  } else if (finalPrice >= 100_000_000) {
    rarity = 'SSR';
    rarityLabel = 'SUPER SPECIAL RARE';
    raritySub = '覇王級';
    protagonist = Math.max(82, protagonist);
  } else if (finalPrice >= 20_000_000) {
    rarity = 'SR';
    rarityLabel = 'SUPER RARE';
    raritySub = '殿堂級';
  } else if (finalPrice >= 1_500_000) {
    rarity = 'R';
    rarityLabel = 'RARE';
    raritySub = '注目株';
  } else {
    rarity = 'N';
    rarityLabel = 'NORMAL';
    raritySub = '愛され庶民派';
  }

  const stats: StatusMetric[] = [
    { key: 'charisma', label: 'カリスマ性', score: charisma, rank: getScoreRank(charisma) },
    { key: 'luck', label: '強運・金運', score: luck, rank: getScoreRank(luck) },
    { key: 'protagonist', label: '主人公度', score: protagonist, rank: getScoreRank(protagonist) },
    { key: 'rhythm', label: '語感センス', score: rhythm, rank: getScoreRank(rhythm) },
    { key: 'rarity', label: '希少価値', score: rarityStat, rank: getScoreRank(rarityStat) },
  ];

  const firstChar = chars[0] || '名';
  const lastChar = chars[chars.length - 1] || '前';

  const characterAuras: CharacterAura[] = chars.map((char, index) => {
    const charHash = hashString(char + compact, salt + index);
    const charRng = createRng(char + compact, salt + index);

    if (SPECIAL_KANJI_BONUS[char]) {
      const info = SPECIAL_KANJI_BONUS[char];
      const specialColorMap: Record<string, CharacterAura['auraColor']> = {
        charisma: 'purple',
        luck: 'amber',
        protagonist: 'rose',
        rhythm: 'cyan',
        rarity: 'indigo',
      };
      const score = charRng.nextInt(92, 99);
      return {
        char,
        index,
        attribute: info.title.replace('加算', '').replace('プレミアム', '').replace('配当', ''),
        auraColor: specialColorMap[info.stat] || 'amber',
        score,
        rank: 'SS',
        meaning: `特別な格式を放つ「${char}」。名前に宿る固有の引力と強い存在感が全体の市場価値を大きく牽引しています。`,
        role: index === 0 ? '第一印象・先頭オーラ' : index === chars.length - 1 ? '結びの守護印' : '中核シナジー',
      };
    }

    const attributePool: Array<{
      attr: string;
      color: CharacterAura['auraColor'];
      desc: string;
    }> = [
      {
        attr: '覇気・リーダーシップ',
        color: 'rose',
        desc: '周囲を巻き込み、物語の主人公として道を切り拓く推進力をもたらします。',
      },
      {
        attr: '招福・金運オーラ',
        color: 'amber',
        desc: '人脈と商機を自然に手繰り寄せる、明るく温かな財運の波動を宿しています。',
      },
      {
        attr: '明鏡止水・洞察力',
        color: 'indigo',
        desc: '物事の本質を瞬時に見抜き、冷静沈着に最適解を導き出す知性の源泉です。',
      },
      {
        attr: '天賦の才・覚醒',
        color: 'purple',
        desc: 'ここぞという土壇場で規格外の爆発力を発揮する、隠された潜在能力です。',
      },
      {
        attr: '親愛・人望調和',
        color: 'emerald',
        desc: '初対面でも警戒心を解き、自然と味方を増やしていく天性の好感度です。',
      },
      {
        attr: '疾風・音響センス',
        color: 'cyan',
        desc: '呼ぶだけで心地よく耳に残る、リズミカルで軽快なモダンオーラです。',
      },
    ];

    const picked = attributePool[charHash % attributePool.length];
    const score = charRng.nextInt(74, 96);
    const rank: 'SS' | 'S' | 'A' | 'B' =
      score >= 90 ? 'SS' : score >= 82 ? 'S' : score >= 75 ? 'A' : 'B';

    let role = '中核シナジー';
    if (index === 0) role = '第一印象・先頭オーラ';
    else if (index === chars.length - 1) role = '余韻・結びの守護印';

    return {
      char,
      index,
      attribute: picked.attr,
      auraColor: picked.color,
      score,
      rank,
      meaning: `「${char}」の文字が持つ${picked.attr}が、${picked.desc}`,
      role,
    };
  });

  const titlePool = [
    `【時代を動かす「${firstChar}」の求心力】`,
    `【全人類が一度は憧れる黄金ネーム】`,
    `【歩くパワースポット・幸福の呼び名】`,
    `【エンドロール単独クレジット級の貫禄】`,
    `【親しみやすさと品格のハイブリッド】`,
    `【裏ボスすら一目置く隠れカリスマ】`,
    `【呼ぶだけで場を和ませる天性のオーラ】`,
  ];

  const reasons = [
    matchedSpecial
      ? `「${matchedSpecial.char}」の文字が含まれることで、名前に宿る${matchedSpecial.info.title}が全体の相場を大きく押し上げています。`
      : `頭文字「${firstChar}」の第一印象と、結びの「${lastChar}」の安定感が絶妙なコントラストを生み出しています。`,
    `「${cleaned}」と声に出した際の母音の抜けが心地よく、記憶に定着しやすい黄金のメロディを持っています。`,
    `今後の市場予測によると、「落ち着きと個性を両立した名前」として長期保有に最適な優良銘柄と判定されました。`,
  ];

  const luckyItems = [
    '少し高めのカフェラテ',
    '晴れた日の散歩道',
    '青いペン・新しい手帳',
    '焼き立てのクロワッサン',
    '窓際の特等席',
    '好きな曲を聴きながらの深呼吸',
    'ピカピカに磨いた靴',
  ];

  let deviationValue = 50.0;
  let topPercentile = '上位 50%';

  if (rarity === 'LR') {
    deviationValue = Math.round((82 + rng.next() * 7.5) * 10) / 10;
    topPercentile = '上位 0.01%（神話級）';
  } else if (rarity === 'UR') {
    deviationValue = Math.round((76 + rng.next() * 5.8) * 10) / 10;
    topPercentile = '上位 0.15%（国宝級）';
  } else if (rarity === 'SSR') {
    deviationValue = Math.round((69 + rng.next() * 6.5) * 10) / 10;
    topPercentile = '上位 1.8%（全国屈指）';
  } else if (rarity === 'SR') {
    deviationValue = Math.round((62 + rng.next() * 6.5) * 10) / 10;
    topPercentile = '上位 8.5%（秀逸銘柄）';
  } else if (rarity === 'R') {
    deviationValue = Math.round((54 + rng.next() * 7.5) * 10) / 10;
    topPercentile = '上位 24%（優良相場）';
  } else {
    deviationValue = Math.round((46 + rng.next() * 7.5) * 10) / 10;
    topPercentile = '上位 48%（標準安定型）';
  }

  const certNum = `EST-${(hashString(compact, salt) % 900000 + 100000).toString()}`;

  return {
    id: `${compact}-${salt}-${Date.now()}`,
    name: cleaned,
    price: finalPrice,
    formattedYen: `¥${finalPrice.toLocaleString('ja-JP')}`,
    formattedJapaneseUnit: formatJapaneseCurrency(finalPrice),
    rarity,
    rarityLabel,
    raritySub,
    titleBadge: rng.pick(titlePool),
    equivalentItem: getEquivalentItem(finalPrice, rng),
    deviationValue,
    topPercentile,
    stats,
    characterAuras,
    breakdown,
    reasons,
    luckyItem: rng.pick(luckyItems),
    certificateNumber: certNum,
    timestamp: new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
  };
}
