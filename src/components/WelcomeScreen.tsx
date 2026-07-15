import { motion } from "motion/react";
import { 
  Activity, 
  Heart, 
  LayoutGrid, 
  UtensilsCrossed, 
  Leaf, 
  User, 
  ArrowRight, 
  CheckCircle2,
  Map,
  BookOpen,
  Flower,
  Citrus,
  Home
} from "lucide-react";
import { HEALTH_CONDITIONS } from "../data";

interface WelcomeScreenProps {
  selectedConditions: string[];
  onToggleCondition: (id: string) => void;
  onStart: () => void;
  onChangeScreen: (screen: string) => void;
  currentTab: string;
}

export default function WelcomeScreen({
  selectedConditions,
  onToggleCondition,
  onStart,
  onChangeScreen,
  currentTab,
}: WelcomeScreenProps) {
  
  // Icon selector helper
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Activity":
        return <Activity className="w-6 h-6" />;
      case "Heart":
        return <Heart className="w-6 h-6" />;
      case "LayoutGrid":
        return <LayoutGrid className="w-6 h-6" />;
      case "UtensilsCrossed":
        return <UtensilsCrossed className="w-6 h-6" />;
      case "Leaf":
        return <Leaf className="w-6 h-6" />;
      default:
        return <Activity className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfbfa] text-[#1b1c19]">
      {/* Premium Glassmorphic Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-18 glass-header">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 shadow-inner">
            <Flower className="w-6 h-6 text-[#ff9f43] fill-[#ffeaa7] animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
          </div>
          <div>
            <span className="font-display font-extrabold text-lg md:text-xl tracking-tight text-[#006067]">꽃보다 제주</span>
            <span className="block text-[10px] text-[#3e494a] font-bold tracking-widest uppercase">Jeju Wellness Trip</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-block text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">
            🍊 실시간 제주 날씨 맑음 (24°C)
          </span>
          <button 
            id="profile-btn"
            className="p-2.5 hover:bg-[#eae8e3] rounded-full transition-all duration-200 active:scale-95"
            onClick={() => onChangeScreen("home")}
          >
            <User className="w-6 h-6 text-[#006067]" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-26 pb-32 px-5 max-w-[1200px] mx-auto w-full flex-grow">
        
        {/* Modern Interactive Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center md:text-left relative py-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#eae8e3] text-[#3e494a] rounded-full text-xs font-bold tracking-wide mb-4">
            ✨ AI 기반 웰니스 여행 가이드
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-[44px] leading-tight text-[#1b1c19] tracking-tight">
            어떤 웰니스 여행을 원하시나요?
          </h1>
          <p className="font-sans text-[#3e494a] text-lg md:text-xl mt-3 max-w-2xl leading-relaxed">
            건강 상태와 라이프스타일을 선택해주시면, <span className="text-[#006067] font-extrabold">개인 맞춤형 식단</span>과 <span className="text-[#006067] font-extrabold">안전한 무장애 힐링 경로</span>를 자동 구성합니다.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Visual Landscape Card (Span 7) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:col-span-7 h-[280px] lg:h-auto rounded-3xl overflow-hidden relative shadow-md group min-h-[300px]"
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
              style={{ 
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwQGejdS2u9TSyrSQZzfKX8S1yif7zwy-7p9mpmlIMdK7vC-GotPAMgJRJJ9AAgbCXIYe-NCvE6zmAJo2TMXNYz2L6VB4TI0Iz38WmZBJ-Y3OWPk5HbhKjRMjnIFT16GeCes9-nCToza0d16rDoxRD1ykWgHoFKz1CnL2-TyFn8Jv1am1wCdHJxhflkPkPOEpEcn_sVUuOWfi3Hz87pJFWfOhtfr0Sht5V3241M0DB3NKi6vyKyG-rYWGuYhQe0uo7wu__yGhY1APb')` 
              }}
            ></div>
            
            {/* Top Floating Glass Badge */}
            <div className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <span className="w-2.5 h-2.5 bg-[#97f3b5] rounded-full animate-pulse"></span>
              <span className="text-white text-xs font-bold tracking-wider">Jeju Care System Activated</span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-20">
              <span className="bg-amber-400 text-amber-950 px-3.5 py-1.5 rounded-xl text-xs font-extrabold mb-3 inline-block shadow-sm">
                Jeju Local Wellness Tour
              </span>
              <h2 className="text-white font-display text-2xl md:text-3xl font-extrabold leading-snug tracking-tight">
                당신의 건강하고 활기찬<br/>
                제주 힐링 여정, 꽃보다 제주와 함께
              </h2>
            </div>
          </motion.div>

          {/* Disease Cards Column (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {HEALTH_CONDITIONS.slice(0, 2).map((cond, idx) => {
              const isSelected = selectedConditions.includes(cond.id);
              return (
                <motion.button
                  key={cond.id}
                  id={`cond-card-${cond.id}`}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.05 }}
                  onClick={() => onToggleCondition(cond.id)}
                  className={`w-full text-left p-5.5 rounded-2xl flex items-center justify-between transition-all duration-300 border-2 active:scale-[0.99] cursor-pointer relative overflow-hidden ${
                    isSelected 
                      ? "bg-white border-[#006067] shadow-md ring-4 ring-[#006067]/10" 
                      : "bg-white border-[#eef0ec] hover:border-[#bdc9ca] shadow-sm hover:shadow-md"
                  }`}
                >
                  {/* Selected subtle corner highlight */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#006067]/5 rounded-bl-full pointer-events-none" />
                  )}

                  <div className="flex items-center gap-4 z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                      isSelected ? "bg-[#006067] text-white" : "bg-[#f4f3ef] text-[#006067] border border-[#e5e3de]"
                     }`}>
                      {renderIcon(cond.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-display font-extrabold text-lg text-[#1b1c19]">{cond.name}</p>
                        {isSelected && (
                          <span className="text-[10px] bg-[#d0fbff] text-[#006067] font-bold px-2 py-0.5 rounded-md">활성화</span>
                        )}
                      </div>
                      <p className="text-xs text-[#5c6869] font-semibold mt-1">{cond.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center z-10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isSelected 
                        ? "border-[#006067] bg-[#006067] text-white" 
                        : "border-[#bdc9ca] bg-transparent text-transparent"
                    }`}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Other 3 Cards below (Interactive layout block) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          {HEALTH_CONDITIONS.slice(2).map((cond, idx) => {
            const isSelected = selectedConditions.includes(cond.id);
            return (
              <motion.div 
                key={cond.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + idx * 0.05 }}
              >
                <button
                  id={`cond-card-${cond.id}`}
                  onClick={() => onToggleCondition(cond.id)}
                  className={`w-full text-left p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 border-2 active:scale-[0.99] min-h-[150px] cursor-pointer relative overflow-hidden ${
                    isSelected 
                      ? "bg-white border-[#006067] shadow-md ring-4 ring-[#006067]/10" 
                      : "bg-white border-[#eef0ec] hover:border-[#bdc9ca] shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                      isSelected ? "bg-[#006067] text-white" : "bg-[#f4f3ef] text-[#006067] border border-[#e5e3de]"
                    }`}>
                      {renderIcon(cond.icon)}
                    </div>

                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isSelected 
                        ? "border-[#006067] bg-[#006067] text-white" 
                        : "border-[#bdc9ca] bg-transparent"
                    }`}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display font-extrabold text-base md:text-lg text-[#1b1c19]">{cond.name}</p>
                      {isSelected && (
                        <span className="text-[10px] bg-[#d0fbff] text-[#006067] font-bold px-1.5 py-0.5 rounded-md">선택됨</span>
                      )}
                    </div>
                    <p className="text-xs text-[#5c6869] font-semibold mt-1">{cond.description}</p>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Action Button Section with Premium Feedback */}
        <div className="mt-14 flex flex-col items-center">
          <motion.button
            id="start-travel-btn"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onStart}
            disabled={selectedConditions.length === 0}
            className={`w-full max-w-md py-4.5 px-8 rounded-2xl font-display font-extrabold text-lg flex items-center justify-center gap-3 group transition-all duration-300 shadow-md ${
              selectedConditions.length > 0
                ? "bg-gradient-to-r from-[#006067] to-[#007b83] text-white hover:shadow-lg cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none border border-gray-300/30"
            }`}
          >
            <span>제주 건강 웰니스 여행 시작</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.button>
          
          <p className="mt-4 text-xs text-[#5c6869] font-bold flex items-center gap-1">
            🍊 <span className="underline decoration-amber-400 decoration-2">언제든지 마이 홈에서 건강 설정을 수정할 수 있어요.</span>
          </p>
        </div>

      </main>

      {/* Floating Premium Bottom Dock */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-20 bg-white/90 backdrop-blur-md border-t border-[#eae8e3] shadow-[0_-5px_20px_rgba(0,0,0,0.03)] rounded-t-3xl">
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
          className="flex flex-col items-center justify-center text-[#006067] bg-[#eefcfd] rounded-2xl px-5 py-2.5 transition-all border border-[#006067]/10"
        >
          <User className="w-5 h-5 mb-0.5 text-[#006067]" />
          <span className="text-xs font-extrabold">프로필</span>
        </button>
      </nav>
    </div>
  );
}
