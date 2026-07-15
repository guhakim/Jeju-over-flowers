import { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  User, 
  ShieldCheck, 
  Wind, 
  Sun, 
  HeartPulse, 
  Activity, 
  Bookmark, 
  Share2, 
  Clock,
  Home,
  Map,
  BookOpen,
  Flower
} from "lucide-react";
import { WELLNESS_ITINERARY } from "../data";

interface WellnessRouteScreenProps {
  onBack: () => void;
  onChangeScreen: (screen: string) => void;
  onSelectFood: (foodName: string) => void;
}

export default function WellnessRouteScreen({
  onBack,
  onChangeScreen,
  onSelectFood,
}: WellnessRouteScreenProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
  };

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
              <h1 className="font-display font-extrabold text-base text-[#006067] tracking-tight">꽃보다 제주</h1>
              <p className="text-[8px] text-[#5c6869] font-extrabold tracking-widest uppercase">Wellness Guide</p>
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

      {/* Main Content */}
      <main className="pt-26 pb-32 px-5 max-w-[1200px] mx-auto w-full space-y-8">
        
        {/* Page Title */}
        <motion.section 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2"
        >
          <span className="text-[10px] text-amber-600 font-extrabold tracking-widest uppercase block mb-1">JEJU ROAD MAP</span>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl leading-tight text-[#1b1c19] tracking-tight">
            민준님을 위한 힐링 안전 코스
          </h2>
          <p className="text-xs md:text-sm font-semibold text-[#5c6869] mt-2">
            사용자의 실시간 컨디션과 관절 및 신장 질환 이력을 반영한 최적의 무장애 산책로입니다.
          </p>
        </motion.section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Map Section (Large Card) */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-8 bg-white rounded-3xl shadow-sm overflow-hidden relative min-h-[420px] border border-[#eae8e3]"
          >
            {/* Top Floating Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs text-emerald-800 border border-emerald-200/50 px-4 py-2 rounded-xl text-xs font-bold shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>안전 무장애 인증 경로</span>
              </span>
            </div>

            {/* Stylized Vector Map Background */}
            <div className="w-full h-full min-h-[420px] relative">
              <div 
                className="w-full h-full bg-cover bg-center absolute inset-0 filter saturate-105"
                style={{ 
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBPL6gJqulllb6R6c0Szi99uahd-Xxb4IGDo2F3Yl4eFkqqcrjHMxHBUgIPgmI_ywaw1RasnUzFNqgK_wAjLMrE6GeOF_DdMkdkWv6NyFfwJVbXYDDpfMVKtfORS2DA-vYXo3vUNi38myvOmN5T5o0HoY9egZvAkkdi2YnV8F0ZVks8Qgc8e4xK-kDibwKsNbvwIyZmZ5nn4IOKkp0XPWVUnYVvdoNnB9i-t1l_aX2J-iiib3O_2Q4xS90U4a_K_Ec7_CT4y81VwVcb')` 
                }}
              ></div>

              {/* Floating Map Stats Overlay */}
              <div className="absolute bottom-4 right-4 left-4 sm:left-auto bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-md border border-[#eae8e3] flex justify-around sm:justify-start items-center gap-5">
                <div>
                  <p className="text-[10px] font-bold text-[#5c6869] uppercase tracking-wider">총 하이킹 코스</p>
                  <p className="text-xl font-extrabold text-[#006067] font-sans mt-0.5">4.2 km</p>
                </div>
                <div className="w-px h-8 bg-[#eae8e3]"></div>
                <div>
                  <p className="text-[10px] font-bold text-[#5c6869] uppercase tracking-wider">소모 칼로리</p>
                  <p className="text-xl font-extrabold text-[#006067] font-sans mt-0.5">340 kcal</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Environmental Health Metric Side Cards */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-4 flex flex-col gap-4"
          >
            {/* Air Quality */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eae8e3] flex items-center justify-between min-h-[105px]">
              <div>
                <p className="text-[10px] font-bold text-[#5c6869] uppercase tracking-wider">제주 대기 상태</p>
                <p className="text-xl font-extrabold text-emerald-700 mt-1">매우 좋음</p>
                <p className="text-[11px] text-[#5c6869] font-semibold mt-1">PM2.5 실시간 수치: 8 µg/m³</p>
              </div>
              <Wind className="w-10 h-10 text-emerald-600 opacity-80 shrink-0" />
            </div>

            {/* UV Index */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eae8e3] flex items-center justify-between min-h-[105px]">
              <div>
                <p className="text-[10px] font-bold text-[#5c6869] uppercase tracking-wider">자외선 자극지수</p>
                <p className="text-xl font-extrabold text-amber-600 mt-1">보통</p>
                <p className="text-[11px] text-[#5c6869] font-semibold mt-1">양산 지참 및 차단제 도포 권장</p>
              </div>
              <Sun className="w-10 h-10 text-amber-500 opacity-80 shrink-0" />
            </div>

            {/* Wellness Score Card */}
            <div className="bg-gradient-to-br from-[#006067] to-[#007b83] text-white p-6 rounded-2xl shadow-sm flex-grow flex flex-col justify-between min-h-[160px]">
              <div>
                <p className="text-[10px] font-extrabold opacity-80 uppercase tracking-wider">실시간 안전 지수</p>
                <div className="flex items-end gap-1.5 mt-2">
                  <span className="text-4xl font-extrabold text-white leading-none">92</span>
                  <span className="text-sm font-bold opacity-80 pb-0.5">/ 100</span>
                </div>
              </div>
              <p className="text-xs text-white/90 font-bold leading-relaxed mt-5">
                만성 저혈압 및 알레르기 수치를 포함해 최상의 생체 수용성을 보여주는 자연 친화 루트입니다.
              </p>
            </div>
          </motion.section>
        </div>

        {/* Timed Itinerary Section */}
        <section className="space-y-5 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-extrabold text-2xl text-[#1b1c19] tracking-tight">안전 웰니스 타임라인</h3>
              <p className="text-xs text-[#5c6869] font-bold mt-1">시간대별 세심한 동선 큐레이션</p>
            </div>
            <span className="text-xs font-bold text-[#006067] flex items-center gap-1.5 bg-[#eefcfd] px-3.5 py-1.5 rounded-full border border-[#006067]/10">
              <Activity className="w-4 h-4 text-[#006067] animate-pulse" />
              <span>실시간 동기화됨</span>
            </span>
          </div>

          <div className="space-y-5 relative">
            {/* Timeline Vertical Bar */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-[#eae8e3] hidden md:block"></div>

            {WELLNESS_ITINERARY.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => {
                  if (item.title.includes("그린테이블")) {
                    onSelectFood("옥돔 구이");
                  } else if (item.title.includes("시트러스")) {
                    onSelectFood("한라봉 차");
                  }
                }}
                className="group relative md:pl-14 cursor-pointer"
              >
                {/* Bullet */}
                <div className="absolute left-5.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#006067] rounded-full hidden md:block border-4 border-white ring-4 ring-[#eefcfd]"></div>

                {/* Card */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eae8e3] hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-5 active:scale-[0.99]">
                  {/* Image */}
                  <div 
                    className="w-full sm:w-32 h-32 rounded-xl bg-cover bg-center shrink-0 shadow-xs"
                    style={{ backgroundImage: `url('${item.imageUrl}')` }}
                  ></div>
                  
                  {/* Info */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#006067] uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#006067]" />
                          {item.time}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                          item.intensity === "저강도" || item.intensity === "무장애 경로"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                            : "bg-amber-50 text-amber-800 border border-amber-100"
                        }`}>
                          {item.intensity}
                        </span>
                      </div>
                      <h4 className="font-display font-extrabold text-lg text-[#1b1c19] mt-1.5 group-hover:text-[#006067] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs md:text-sm text-[#5c6869] leading-relaxed mt-1 font-bold">
                        {item.description}
                      </p>
                    </div>

                    {item.title.includes("그린테이블") && (
                      <div className="mt-3 text-xs font-extrabold text-[#006067] bg-[#eefcfd] px-3.5 py-1.5 rounded-lg border border-[#006067]/10 inline-block w-fit">
                        ✨ 맞춤 향토 밥상: 당뇨 및 고혈압 관리 레시피 즉시 확인
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-10 flex flex-col items-center gap-4"
        >
          <button
            id="save-trip-btn"
            onClick={handleSaveToggle}
            className={`w-full max-w-md py-4 rounded-2xl font-display font-extrabold text-base shadow-sm hover:shadow-md transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
              isSaved
                ? "bg-emerald-800 text-white"
                : "bg-[#006067] text-white hover:bg-[#007b83]"
            }`}
          >
            {isSaved ? (
              <>
                <ShieldCheck className="w-5.5 h-5.5" />
                <span>스마트 보관함에 저장 완료</span>
              </>
            ) : (
              <>
                <Bookmark className="w-5.5 h-5.5" />
                <span>웰니스 일정에 추가하기</span>
              </>
            )}
          </button>
          
          <button 
            id="share-caregiver-btn"
            className="text-xs font-extrabold text-[#006067] hover:underline flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>가족 및 보호자에게 실시간 안심 경로 전송</span>
          </button>
        </motion.div>
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
        
        {/* ACTIVE TAB: Map */}
        <button 
          id="tab-route"
          className="flex flex-col items-center justify-center text-[#006067] bg-[#eefcfd] rounded-2xl px-5 py-2.5 transition-all border border-[#006067]/10"
        >
          <Map className="w-5 h-5 mb-0.5 text-[#006067]" />
          <span className="text-xs font-extrabold">지도</span>
        </button>

        <button 
          id="tab-guide"
          onClick={() => onChangeScreen("home")}
          className="flex flex-col items-center justify-center text-gray-400 px-4 py-1 hover:text-[#006067] transition-all"
        >
          <BookOpen className="w-6 h-6 mb-1" />
          <span className="text-xs font-bold">가이드</span>
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
