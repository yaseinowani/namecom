import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  RotateCcw,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Dices,
  Volume2,
  VolumeX,
  Download,
  Camera,
  X,
  History,
} from 'lucide-react';
import {
  appraiseName,
  AppraisalResult,
  formatJapaneseCurrency,
} from './utils/appraiser';
import { AppraisalCard } from './components/AppraisalCard';
import { AnimatedBackground } from './components/AnimatedBackground';
import { exportCertificateAsPng } from './utils/imageExporter';
import { soundFX } from './utils/sound';

export default function App() {
  const [inputName, setInputName] = useState<string>('');
  const [currentResult, setCurrentResult] = useState<AppraisalResult | null>(null);
  const [recentAppraisals, setRecentAppraisals] = useState<AppraisalResult[]>([]);
  const [rerollSeed, setRerollSeed] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [isScreenshotMode, setIsScreenshotMode] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  // URL query parameter support: ?name=...
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlName = params.get('name');
      if (urlName && urlName.trim()) {
        const clean = urlName.trim().slice(0, 20);
        setInputName(clean);
        handleAppraise(clean, 0);
      }
    } catch {
      // Fallback
    }
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundFX.enabled = next;
  };

  const handleAppraise = (nameToAppraise: string, seed = 0) => {
    const trimmed = nameToAppraise.trim();
    if (!trimmed) {
      setErrorMsg('査定したい名前を入力してください');
      inputRef.current?.focus();
      return;
    }
    setErrorMsg('');
    const result = appraiseName(trimmed, seed);
    setCurrentResult(result);
    setRerollSeed(seed);
    setCopied(false);

    // Record in recent session history (up to 4 items)
    setRecentAppraisals((prev) => {
      const filtered = prev.filter((p) => p.name !== result.name);
      return [result, ...filtered].slice(0, 4);
    });

    // Sync URL for direct link sharing without page reload
    try {
      const newUrl = `${window.location.pathname}?name=${encodeURIComponent(result.name)}`;
      window.history.replaceState(null, '', newUrl);
    } catch {
      // ignore
    }

    soundFX.playReveal(
      result.rarity === 'LR' || result.rarity === 'UR' || result.rarity === 'SSR'
    );

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAppraise(inputName, 0);
  };

  const handleReroll = () => {
    if (!currentResult) return;
    const nextSeed = rerollSeed + 1;
    handleAppraise(currentResult.name, nextSeed);
  };

  const handleReset = () => {
    setCurrentResult(null);
    setInputName('');
    setRerollSeed(0);
    setIsScreenshotMode(false);
    try {
      window.history.replaceState(null, '', window.location.pathname);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const getShareText = (res: AppraisalResult) => {
    const topStats = [...res.stats]
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((s) => `${s.label}:${s.score}点`)
      .join(' / ');

    const shareUrl = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(res.name)}`;

    return `【名前査定ドットコム】
「${res.name}」の架空市場価値を査定しました！

・推定価格：${res.formattedJapaneseUnit}（${res.formattedYen}）
・レア度：${res.rarity}（${res.raritySub}）
・全国偏差値：${res.deviationValue}（${res.topPercentile}）
・称号：${res.titleBadge}
・ステータス：${topStats}
・換算目安：${res.equivalentItem}

👇 あなたの名前も今すぐ査定！
${shareUrl}

#名前査定ドットコム #あなたの名前何円`;
  };

  const handleCopy = async () => {
    if (!currentResult) return;
    const text = getShareText(currentResult);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPng = async () => {
    if (!currentResult || isExporting) return;
    setIsExporting(true);
    try {
      await exportCertificateAsPng(currentResult);
    } catch {
      // Fallback
    } finally {
      setIsExporting(false);
    }
  };

  const tweetHref = currentResult
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText(currentResult))}`
    : '#';

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-amber-300 selection:text-slate-950 overflow-x-hidden">
      {/* Animated Pop Background */}
      <AnimatedBackground
        rarity={currentResult?.rarity}
      />

      {/* Top Header (Hidden in screenshot mode) */}
      {!isScreenshotMode && (
        <header className="relative bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 transition-all">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleReset();
              }}
              className="text-base font-extrabold tracking-tight text-slate-950 flex items-center group hover:text-amber-600 transition-colors"
            >
              <span>名前査定ドットコム</span>
            </a>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleSound}
                aria-label={soundOn ? '効果音をミュート' : '効果音を有効化'}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                title={soundOn ? '効果音: ON' : '効果音: OFF'}
              >
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Floating Exit Button for Screenshot Mode */}
      {isScreenshotMode && (
        <div className="fixed top-4 right-4 z-50">
          <button
            type="button"
            onClick={() => setIsScreenshotMode(false)}
            className="px-4 py-2 bg-slate-950/80 hover:bg-slate-950 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer transition-transform hover:scale-105"
          >
            <X className="w-4 h-4" />
            <span>通常画面に戻る</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Intro (Hidden in screenshot mode) */}
        {!isScreenshotMode && (
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight">
              あなたの名前、何円？
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
              名前を入力するだけで、文字のオーラや語感から架空の評価額とステータスを即座に査定します。
            </p>
          </div>
        )}

        {/* Input Form (Hidden in screenshot mode) */}
        {!isScreenshotMode && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <label
                  htmlFor="name-input"
                  className="block text-sm font-extrabold text-slate-900"
                >
                  査定する名前
                </label>

                {/* Big Input with Clear Button */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    id="name-input"
                    type="text"
                    value={inputName}
                    onChange={(e) => {
                      setInputName(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="お名前を入力（例：山田 太郎）"
                    maxLength={20}
                    className="w-full min-h-[60px] sm:min-h-[68px] pl-5 sm:pl-6 pr-14 py-3.5 sm:py-4 text-xl sm:text-2xl font-bold text-slate-950 bg-white border-2 border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all placeholder:font-normal placeholder:text-slate-400 shadow-xs"
                  />

                  {inputName && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputName('');
                        if (errorMsg) setErrorMsg('');
                        inputRef.current?.focus();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="入力をクリア"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {errorMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-bold text-rose-600"
                  >
                    {errorMsg}
                  </motion.p>
                )}

                {/* Big Button Placed Below Input */}
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  className="w-full min-h-[58px] sm:min-h-[64px] px-8 py-3.5 bg-slate-950 hover:bg-slate-800 active:bg-slate-900 text-white font-black text-lg sm:text-xl rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>査定する</span>
                </motion.button>
              </div>
            </form>

            {/* Privacy Note */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                入力データはブラウザ上でのみ計算され、外部サーバーや履歴には一切保存されません。
              </span>
            </div>
          </motion.div>
        )}

        {/* Appraisal Result Section */}
        {currentResult && (
          <div ref={resultRef} className="space-y-4 scroll-mt-20">
            {/* The Masterpiece Certificate Card */}
            <AppraisalCard result={currentResult} />

            {/* Actions Bar (Hidden when in screenshot clean view) */}
            {!isScreenshotMode && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-3 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Copy Text */}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={handleCopy}
                      className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>コピー完了！</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>結果をコピー</span>
                        </>
                      )}
                    </motion.button>

                    {/* Share to X */}
                    <motion.a
                      whileTap={{ scale: 0.96 }}
                      href={tweetHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>X でシェア</span>
                    </motion.a>

                    {/* Download Image (PNG) */}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      disabled={isExporting}
                      onClick={handleDownloadPng}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span>{isExporting ? '生成中...' : '画像を保存'}</span>
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Clean Screenshot Mode Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsScreenshotMode(true)}
                      className="px-3 py-2 text-slate-600 hover:text-slate-950 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="カードのみをすっきり表示します"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>スクショ専用枠</span>
                    </button>

                    {/* Reroll */}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={handleReroll}
                      title="同じ名前で別の相場（ガチャ）を再査定します"
                      className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300/80 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Dices className="w-3.5 h-3.5" />
                      <span>別相場（ガチャ）</span>
                    </motion.button>

                    {/* Reset for new name */}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={handleReset}
                      className="px-3 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>別の名前</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recent Appraisals Comparison Tray */}
            {recentAppraisals.length > 1 && !isScreenshotMode && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200/90 p-4 space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    <span>今回の査定比較リスト（最新4件）</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-normal">タップで切り替え</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {recentAppraisals.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setCurrentResult(item);
                        soundFX.playPop();
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        currentResult?.id === item.id
                          ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                          : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-black text-slate-950 truncate">{item.name}</div>
                      <div className="text-[11px] font-mono-num font-bold text-amber-700 truncate">
                        {item.formattedJapaneseUnit}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500">
                        {item.rarity} · 偏差値{item.deviationValue}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Disclaimer & Privacy Information (Hidden in screenshot mode) */}
        {!isScreenshotMode && (
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 text-xs text-slate-500 space-y-2 border border-slate-200/60 leading-relaxed">
            <p className="font-extrabold text-slate-800">
              免責事項・プライバシー保護
            </p>
            <p>
              「名前査定ドットコム」は完全なジョーク・エンターテインメント目的の架空査定サイトです。表示される推定金額・レア度・ステータスは独自のルールと乱数によるフィクションであり、実在する人物や名前の社会的価値を評価するものではありません。
            </p>
            <p>
              プライバシー保護のため、入力されたお名前や査定結果は<strong>データベースや外部サーバー、履歴等に一切保存されません</strong>。安心してお楽しみください。
            </p>
          </div>
        )}
      </main>

      {/* Clean Footer (Hidden in screenshot mode) */}
      {!isScreenshotMode && (
        <footer className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-400 bg-white">
          名前査定ドットコム · 完全無料・エンタメ専用（データ保存なし）
        </footer>
      )}
    </div>
  );
}
