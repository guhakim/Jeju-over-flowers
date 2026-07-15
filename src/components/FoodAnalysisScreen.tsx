import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  User, 
  Sparkles, 
  Star, 
  ShieldAlert, 
  CheckCircle, 
  Home, 
  Map, 
  BookOpen,
  Apple,
  Flower
} from "lucide-react";
import { NutritionAnalysis } from "../types";
import { getDefaultAnalysis } from "../data";

interface FoodAnalysisScreenProps {
  foodName: string;
  selectedConditions: string[];
  onBack: () => void;
  onChangeScreen: (screen: string) => void;
}

export default function FoodAnalysisScreen({
  foodName,
  selectedConditions,
  onBack,
  onChangeScreen,
}: FoodAnalysisScreenProps) {
  const [analysis, setAnalysis] = useState<NutritionAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    
    async function loadAnalysis() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/gemini/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            foodName,
            conditions: selectedConditions,
          }),
        });

        if (!response.ok) {
          throw new Error("API analysis failed");
        }

        const data = await response.json();
        if (active) {
          setAnalysis(data);
        }
      } catch (err: any) {
        console.warn("Using high-quality offline static fallback for:", foodName);
        // Fallback to beautiful default analysis
        if (active) {
          setAnalysis(getDefaultAnalysis(foodName));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAnalysis();

    return () => {
      active = false;
    };
  }, [foodName, selectedConditions]);

  // Color helper for risk label/score
  const getRiskColor = (score: number) => {
    if (score >= 4.0) return { text: "text-[#ba1a1a]", bg: "bg-[#ffdad6]", border: "border-[#ba1a1a]" };
    if (score >= 2.5) return { text: "text-[#834808]", bg: "bg-[#ffdcc3]", border: "border-[#a15f21]" };
    return { text: "text-[#006d3d]", bg: "bg-[#97f3b5]/40", border: "border-[#006d3d]" };
  };

  // Get image for current analyzed food
  const getFoodImage = (name: string) => {
    if (name.includes("국수") || name.includes("Noodles")) {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuC3OAO_CxaVJ3VR2qNEX7InneICEOPXMyTAlmDkMtoYXp68-wJjc_Zb4eCwHDyYdhy9PKvffYVASoQRpF_6VhF9EFCLjYMcnDFv6nT4gW7zA0mVO2zoZh5er4Ntm4KhCbomasayo9jo9XabzBbIalNYe1O1FfxpvyuhvbGmn6vske9upvmsRPfg281QDphjaJXTxbbVRK9dZijRxczgScERQAY1DrPKBJQtZ-FgcgvqDTKoGPTsolE9b_G1QrIDbr8n1c7eTY8B3a8c";
    }
    if (name.includes("흑돼지") || name.includes("Pork")) {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuB14sc4YnFjO6EMzRa545_QwoyRbUAMHsR7DalF7Ux5PXpBpD71MzItIHNv1l_2m07vv1v2SR4UlqiB-ZsgZFGxnKp7ujnFZNgP5KpKnAOvUX-xTa9TaE-PaFkqlrkNaCukXx5UFckKx8zLGw1GXI64BaK0zJps89mCneiU42oeR5pjDlM8I7KOWdbsb4iDr-SXKvOFQs_RaCkif9BxmAeVRWbbZmQm1LUbZHPljxjC0DfT1QO77NjP2b543o96-iJ2r-Zuau3cJT6C";
    }
    if (name.includes("전복죽") || name.includes("Porridge")) {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuAcHjS51V5YuPdDvFKq2DbP7ZmFr-Gjh2Be4WsxOBp6F-V_Fv1oC2UxAp0RAAlg_Qs4vuApo24EsbqMTYpWIPdZF_tgNDctySYzP5yaCQ60qsxKc53nIZXBS0zS9pIN6Pvfe5_TPKfx-mlzkZ3LfGoUJnAt-E6ayv2ww0SqyDrCaQaTphbj6m29aZ89NURo1Gy8FK6CQRuISQREGqUO0ZZoC3jb1HmgCiDwZIuWmsYN7qsuL_zSd6zlkQcjSKHNszmbgNxleXQ5282b";
    }
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuBUfZ3rY4ZGub0JE4NdcgMkirSOtHlXgHYYKSOZINrC4x3RpAvrPtBzI44aZ_q-EF7pTBa0uTCp170b4L1h5vHBd7NW0EQSdrU6FEvEUXJujAIMFuSFBLWTsnDHw0B2rARxKNX6PqpaCj8ow6Bu15K3G_CGc40Rf5s4F46FlVQriuoP6SrX0--qY3ppaq9tk6e8DdzPoQyzAB4b904VOmC4pttpL_zT6ISgcGxuchL6DLQoSTxaJZDRCFhawifKoYwPn3d5BNLH80gH";
  };

  const getAlternativeImage = (name: string) => {
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuDGEAba7pxmNos8SBJ2WLNGfJZAJ3groeMyPe0YQfoCOHWVuIq6j1spqdGb5trbO42clG2RUFfbT-HtAgPCegoBj9MDwiAD91oyb7bdFr7_6uNGTRFOhkDRXVgB4n9c0MeRtHR3MaQp7p90CjHHAQSFyxJP_59ap0EFs71WLm6MwwVzfi5usQoijVtXYRo_rSXKFVRI681tQmgpq-npWhdVLcvmn4rCjJAAINRZ8rIpZKuO1zcpx2_pfZCOlA0RXwuptIz5tJ1UiQ0R";
  };

  const isDiabetes = selectedConditions.includes("diabetes");
  const isHypertension = selectedConditions.includes("hypertension");

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfbfa] text-[#1b1c19]">
      {/* Top App Bar with Glassmorphism */}
      <header className="fixed top-0 left-0 w-full z-45 flex justify-between items-center px-6 h-18 glass-header">
        <div className="flex items-center gap-2">
          <button 
            id="back-btn"
            onClick={onBack}
            className="p-2 hover:bg-[#eae8e3] rounded-full transition-all active:scale-95 text-[#006067]"
          >
            <ArrowLeft className="w-5.5 h-5.5" />
          </button>
          <div className="flex items-center gap-2 ml-1">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-50">
              <Flower className="w-5 h-5 text-[#ff9f43] fill-[#ffeaa7] animate-spin-slow" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-base text-[#006067] tracking-tight">{foodName} 분석</h1>
              <p className="text-[8px] text-[#5c6869] font-extrabold tracking-widest uppercase">Jeju Wellness Table</p>
            </div>
          </div>
        </div>
        <button 
          id="profile-btn"
          onClick={() => onChangeScreen("welcome")}
          className="p-2.5 hover:bg-[#eae8e3] rounded-full transition-all active:scale-95"
        >
          <User className="w-6 h-6 text-[#006067]" />
        </button>
      </header>

      {/* Main Canvas */}
      <main className="pt-26 pb-32 px-5 max-w-[1200px] mx-auto w-full">
        {loading ? (
          /* Sleek Skeleton Loader */
          <div className="space-y-6 animate-pulse">
            <div className="w-full aspect-[4/3] bg-gray-200 rounded-2xl"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-28 bg-gray-200 rounded-2xl"></div>
              <div className="h-28 bg-gray-200 rounded-2xl"></div>
            </div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="h-44 bg-gray-200 rounded-2xl"></div>
          </div>
        ) : !analysis ? (
          <div className="p-8 text-center text-gray-500">분석 데이터를 불러오지 못했습니다.</div>
        ) : (
          <div className="space-y-6">
            
            {/* Food Hero Section */}
            <motion.section 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-sm border border-[#eae8e3]">
                <img 
                  src={getFoodImage(analysis.foodName)} 
                  alt={analysis.foodName} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end">
                  <span className="text-[10px] text-[#ffeaa7] font-extrabold tracking-widest uppercase block mb-1">JEJU WELLNESS DIET</span>
                  <h2 className="text-white font-display text-2xl md:text-3xl font-extrabold tracking-tight">{analysis.foodName}</h2>
                  <p className="text-white/80 text-xs font-bold mt-1.5">신선한 제주 로컬 식재료로 엄선된 향토 밥상</p>
                </div>
              </div>
            </motion.section>

            {/* Risk Score Bento Grid */}
            <section className="grid grid-cols-2 gap-4">
              {/* Diabetes Card (당뇨) */}
              <div className={`bg-white p-5 rounded-2xl shadow-sm border border-[#eae8e3] border-l-4 ${getRiskColor(analysis.riskScoreDiabetes).border} flex flex-col items-center text-center justify-between min-h-[135px]`}>
                <span className="text-xs font-extrabold text-[#5c6869] tracking-tight">당뇨 생체 자극도</span>
                <div className={`flex items-center gap-1.5 my-2 font-sans font-extrabold text-2xl ${getRiskColor(analysis.riskScoreDiabetes).text}`}>
                  <span>{analysis.riskScoreDiabetes.toFixed(1)}</span>
                  <Star className="w-5.5 h-5.5 fill-current" />
                </div>
                <span className={`px-4 py-1 rounded-xl text-xs font-extrabold ${getRiskColor(analysis.riskScoreDiabetes).bg} ${getRiskColor(analysis.riskScoreDiabetes).text}`}>
                  {analysis.riskLabelDiabetes}
                </span>
              </div>

              {/* Hypertension Card (고혈압) */}
              <div className={`bg-white p-5 rounded-2xl shadow-sm border border-[#eae8e3] border-l-4 ${getRiskColor(analysis.riskScoreHypertension).border} flex flex-col items-center text-center justify-between min-h-[135px]`}>
                <span className="text-xs font-extrabold text-[#5c6869] tracking-tight">혈압 자극 지수</span>
                <div className={`flex items-center gap-1.5 my-2 font-sans font-extrabold text-2xl ${getRiskColor(analysis.riskScoreHypertension).text}`}>
                  <span>{analysis.riskScoreHypertension.toFixed(1)}</span>
                  <Star className="w-5.5 h-5.5 fill-current" />
                </div>
                <span className={`px-4 py-1 rounded-xl text-xs font-extrabold ${getRiskColor(analysis.riskScoreHypertension).bg} ${getRiskColor(analysis.riskScoreHypertension).text}`}>
                  {analysis.riskLabelHypertension}
                </span>
              </div>
            </section>

            {/* AI Recommendation Box */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#006067] to-[#007b83] text-white p-6 rounded-2xl shadow-sm border border-[#006067]/10"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#ffeaa7]" />
                <h3 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">AI 안심 영양 가이드</h3>
              </div>
              <p className="text-xs font-extrabold text-[#d0fbff] mb-2 uppercase tracking-widest">PERSONAL RECOMENDATION</p>
              <p className="text-sm leading-relaxed text-white font-semibold whitespace-pre-line">
                {analysis.aiRecommendation}
              </p>
            </motion.section>

            {/* Detailed Nutrition Progress Bars */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#eae8e3]">
              <h3 className="font-display font-extrabold text-lg text-[#1b1c19] tracking-tight mb-4">정밀 영양 성분 비율</h3>
              
              <div className="space-y-5">
                {/* Carbohydrate Bar */}
                <div>
                  <div className="flex justify-between text-xs md:text-sm font-extrabold text-[#5c6869] mb-1.5">
                    <span>탄수화물 (Carbohydrates)</span>
                    <span className={analysis.nutrition.carbsProgress > 60 ? "text-[#ba1a1a]" : "text-emerald-700"}>
                      {analysis.nutrition.carbs}
                    </span>
                  </div>
                  <div className="w-full bg-[#f6f5f3] h-3 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.nutrition.carbsProgress}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${
                        analysis.nutrition.carbsProgress > 60 ? "bg-[#ba1a1a]" : "bg-emerald-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Sodium Bar */}
                <div>
                  <div className="flex justify-between text-xs md:text-sm font-extrabold text-[#5c6869] mb-1.5">
                    <span>나트륨 (Sodium)</span>
                    <span className={analysis.nutrition.sodiumProgress > 60 ? "text-[#ba1a1a]" : "text-emerald-700"}>
                      {analysis.nutrition.sodium}
                    </span>
                  </div>
                  <div className="w-full bg-[#f6f5f3] h-3 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.nutrition.sodiumProgress}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${
                        analysis.nutrition.sodiumProgress > 60 ? "bg-[#ba1a1a]" : "bg-emerald-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Sugars Bar */}
                <div>
                  <div className="flex justify-between text-xs md:text-sm font-extrabold text-[#5c6869] mb-1.5">
                    <span>당류 (Sugars)</span>
                    <span className={analysis.nutrition.sugarsProgress > 50 ? "text-[#ba1a1a]" : "text-emerald-700"}>
                      {analysis.nutrition.sugars}
                    </span>
                  </div>
                  <div className="w-full bg-[#f6f5f3] h-3 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.nutrition.sugarsProgress}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${
                        analysis.nutrition.sugarsProgress > 50 ? "bg-[#ba1a1a]" : "bg-emerald-600"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Safe Alternative Recommendation */}
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-[#eefcfd] p-6 rounded-2xl shadow-sm border border-[#006067]/10"
            >
              <div className="flex items-center gap-2 mb-4 text-[#006067]">
                <CheckCircle className="w-5 h-5 shrink-0 text-[#006067]" />
                <h3 className="font-display font-extrabold text-base">더 건강하고 조화로운 웰니스 대안</h3>
              </div>
              <div className="flex gap-5 items-start">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#eae8e3] shadow-xs">
                  <img 
                    src={getAlternativeImage(analysis.alternative.name)} 
                    alt={analysis.alternative.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-base text-[#1b1c19] mb-1">
                    {analysis.alternative.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5c6869] leading-relaxed font-bold">
                    {analysis.alternative.description}
                  </p>
                </div>
              </div>
            </motion.section>

          </div>
        )}
      </main>

      {/* Premium Bottom Dock */}
      <nav className="fixed bottom-0 left-0 w-full z-45 flex justify-around items-center px-4 h-20 bg-white/90 backdrop-blur-md border-t border-[#eae8e3] shadow-[0_-5px_20px_rgba(0,0,0,0.03)] rounded-t-3xl">
        <button 
          id="tab-home"
          onClick={() => onChangeScreen("home")}
          className="flex flex-col items-center justify-center text-gray-400 px-4 py-1 hover:text-[#006067] transition-all"
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs font-bold">홈</span>
        </button>
        <button 
          id="tab-route"
          onClick={() => onChangeScreen("route")}
          className="flex flex-col items-center justify-center text-gray-400 px-4 py-1 hover:text-[#006067] transition-all"
        >
          <Map className="w-6 h-6 mb-1" />
          <span className="text-xs font-bold">지도</span>
        </button>
        
        {/* ACTIVE TAB: Guide */}
        <button 
          id="tab-guide"
          className="flex flex-col items-center justify-center text-[#006067] bg-[#eefcfd] rounded-2xl px-5 py-2.5 transition-all border border-[#006067]/10"
        >
          <BookOpen className="w-5 h-5 mb-0.5 text-[#006067]" />
          <span className="text-xs font-extrabold">가이드</span>
        </button>

        <button 
          id="tab-profile"
          onClick={() => onChangeScreen("welcome")}
          className="flex flex-col items-center justify-center text-gray-400 px-4 py-1 hover:text-[#006067] transition-all"
        >
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs font-bold">프로필</span>
        </button>
      </nav>
    </div>
  );
}
