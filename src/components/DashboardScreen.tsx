import { useState, useEffect, FormEvent } from "react";
import { motion } from "motion/react";
import { 
  HeartPulse, 
  User, 
  Search, 
  Edit, 
  Heart, 
  Star, 
  ArrowRight, 
  Flame, 
  ShieldAlert, 
  Sparkles,
  Droplet,
  Home,
  Map,
  BookOpen,
  MapPin,
  Phone,
  X,
  Flower,
  Citrus
} from "lucide-react";
import { FOOD_ITEMS } from "../data";

// 국립중앙의료원 응급의료기관 API 응답을 못 받을 때 쓰는 오프라인 대체 목록
const FALLBACK_JEJU_HOSPITALS = [
  { name: "제주대학교병원 (권역응급의료센터)", phone: "064-717-1114", address: "제주시 아란13길 15" },
  { name: "한라병원 (권역외상센터)", phone: "064-740-5000", address: "제주시 도령로 65" },
  { name: "서귀포의료원 (서귀포 지역 응급)", phone: "064-730-3000", address: "서귀포시 동홍동 1530-2" },
  { name: "제주중앙병원", phone: "064-786-7000", address: "제주시 이도이동" }
];

interface DashboardScreenProps {
  selectedConditions: string[];
  onChangeScreen: (screen: string) => void;
  onSelectFood: (foodName: string) => void;
  onOpenChat: () => void;
}

export default function DashboardScreen({
  selectedConditions,
  onChangeScreen,
  onSelectFood,
  onOpenChat,
}: DashboardScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [hospitals, setHospitals] = useState(FALLBACK_JEJU_HOSPITALS);

  useEffect(() => {
    let active = true;
    fetch("/api/emergency/hospitals")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.hospitals?.length > 0) {
          setHospitals(data.hospitals);
        }
      })
      .catch(() => {
        console.warn("Using offline static fallback for emergency hospitals");
      });
    return () => {
      active = false;
    };
  }, []);

  // Format the mode text based on selected conditions
  const getConditionsText = () => {
    if (selectedConditions.length === 0) return "일반 웰니스 모드";
    const mapped = selectedConditions.map(c => {
      if (c === "diabetes") return "당뇨 관리";
      if (c === "hypertension") return "고혈압 관리";
      if (c === "kidney") return "신장 질환 케어";
      if (c === "allergy") return "알레르기 체크";
      if (c === "vegan") return "비건 지향";
      return c;
    });
    return mapped.join(" + ");
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSelectFood(searchQuery.trim());
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfbfa] text-[#1b1c19]">
      {/* Top App Bar with Glassmorphism */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-6 h-18 glass-header">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-amber-50">
            <Flower className="w-5.5 h-5.5 text-[#ff9f43] fill-[#ffeaa7] animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-lg text-[#006067] tracking-tight">꽃보다 제주</h1>
            <p className="text-[9px] text-[#5c6869] font-extrabold tracking-widest uppercase">My Wellness Jeju</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full font-bold border border-emerald-200/50">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            AI 건강 상태: 안전함
          </div>
          <button 
            id="profile-btn"
            onClick={() => onChangeScreen("welcome")}
            className="p-2.5 hover:bg-[#eae8e3] rounded-full transition-all active:scale-95"
          >
            <User className="w-6 h-6 text-[#006067]" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-26 pb-32 px-5 max-w-[1200px] mx-auto w-full">
        
        {/* Welcome Section styled like a Boarding Pass Header */}
        <section className="mt-2 mb-8 bg-white p-6 rounded-3xl border border-[#eae8e3] shadow-sm relative overflow-hidden">
          {/* Subtle background orange accent representing hallabong */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />
          
          <span className="text-[10px] text-amber-600 font-extrabold tracking-widest uppercase block mb-1">HELLO, TRAVELER</span>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#1b1c19] leading-tight">
            민준님, 오늘의 안전한 제주 여행을 시작해 볼까요?
          </h2>
          
          {/* Active Mode Boarding Pass Tag */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2.5 px-4.5 py-2 bg-[#eefcfd] rounded-xl border border-[#b2ebf2] shadow-xs">
              <span className="w-2.5 h-2.5 bg-[#00838f] rounded-full animate-pulse"></span>
              <span className="font-sans text-sm font-extrabold text-[#006067]">
                활성화된 안전 필터: <span className="underline decoration-teal-400 decoration-2">{getConditionsText()}</span>
              </span>
            </div>
            
            <button 
              id="edit-mode-btn"
              onClick={() => onChangeScreen("welcome")}
              className="px-3.5 py-2 hover:bg-[#eae8e3] bg-[#f4f3ef] rounded-xl transition-colors font-display font-bold text-xs text-[#006067] flex items-center gap-1.5 border border-[#e5e3de]"
              title="설정 변경"
            >
              <Edit className="w-4 h-4 text-[#006067]" />
              <span>설정 변경</span>
            </button>
          </div>
        </section>

        {/* Elegant Search Bar with travel flair */}
        <section className="mb-8">
          <form onSubmit={handleSearchSubmit} className="relative w-full group">
            <div className="absolute inset-y-0 left-4.5 flex items-center pointer-events-none">
              <Search className="w-5.5 h-5.5 text-[#5c6869]" />
            </div>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제주 향토음식의 실시간 영양 및 위험도를 즉시 분석해 드려요 (예: 고기국수, 갈치조림)"
              className="w-full h-15 pl-13 pr-24 bg-white border border-[#eae8e3] focus:border-[#006067] focus:ring-4 focus:ring-[#006067]/5 rounded-2xl shadow-xs text-sm md:text-base outline-none transition-all duration-300 font-medium"
            />
            <button 
              type="submit" 
              className="absolute right-2.5 top-2.5 h-10 px-6 bg-gradient-to-r from-[#006067] to-[#007b83] text-white rounded-xl text-xs font-extrabold transition-all active:scale-95 cursor-pointer hover:shadow-md"
            >
              실시간 분석
            </button>
          </form>
        </section>

        {/* Premium Bento Grid Travel Services */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[11px] font-extrabold text-[#5c6869] uppercase tracking-wider">스마트 제주 웰니스 서비스</h3>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">LIVE UPDATE</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* AI Health Map Card (Bento Grid) */}
            <div 
              id="service-map"
              onClick={() => onChangeScreen("route")}
              className="bg-gradient-to-br from-[#006067] to-[#007b83] text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between h-48 group cursor-pointer hover:shadow-lg active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full pointer-events-none translate-x-4 translate-y-4" />
              <div className="flex justify-between items-start w-full">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Map className="w-6 h-6 text-[#96f1fa]" />
                </div>
                <span className="text-[10px] bg-white/20 text-white font-extrabold px-2.5 py-1 rounded-md">실시간 연동</span>
              </div>
              <div>
                <p className="text-[10px] text-[#96f1fa] font-extrabold tracking-wider uppercase">JEJU ROAD MAP</p>
                <p className="font-display font-extrabold text-xl leading-tight mt-1">안전 무장애 힐링 코스</p>
              </div>
            </div>

            {/* Food Guide Card (Bento Grid) */}
            <div 
              id="service-guide"
              onClick={() => {
                onSelectFood("전복죽");
              }}
              className="bg-white text-[#1b1c19] p-6 rounded-2xl shadow-sm flex flex-col justify-between h-48 group cursor-pointer border border-[#eae8e3] hover:border-[#bdc9ca] hover:shadow-lg active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-amber-500/5 rounded-full pointer-events-none translate-x-4 translate-y-4" />
              <div className="flex justify-between items-start w-full">
                <div className="p-3 bg-[#fcfbfa] rounded-xl border border-[#eae8e3]">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                </div>
                <span className="text-[10px] bg-[#f4f3ef] text-[#5c6869] font-extrabold px-2.5 py-1 rounded-md">성분 검증</span>
              </div>
              <div>
                <p className="text-[10px] text-amber-600 font-extrabold tracking-wider uppercase">LOCAL TASTE</p>
                <p className="font-display font-extrabold text-xl leading-tight mt-1 text-[#1b1c19] group-hover:text-[#006067] transition-colors">향토 음식 영양 분석기</p>
              </div>
            </div>

            {/* Emergency Info Card (Bento Grid) */}
            <div 
              id="service-emergency"
              onClick={() => setShowEmergencyModal(true)}
              className="bg-gradient-to-br from-[#ffdad6] to-[#ffd2cc] text-[#ba1a1a] p-6 rounded-2xl shadow-sm flex flex-col justify-between h-48 group cursor-pointer hover:shadow-lg active:scale-[0.98] transition-all border border-[#fbc9c3]"
            >
              <div className="flex justify-between items-start w-full">
                <div className="p-3 bg-white/50 rounded-xl">
                  <ShieldAlert className="w-6 h-6 text-[#ba1a1a]" />
                </div>
                <span className="text-[10px] bg-[#ba1a1a]/10 text-[#ba1a1a] font-extrabold px-2.5 py-1 rounded-md">119 연동</span>
              </div>
              <div>
                <p className="text-[10px] text-[#93000a] font-extrabold tracking-wider uppercase">EMERGENCY PROTOCOL</p>
                <p className="font-display font-extrabold text-xl leading-tight mt-1">응급 및 지정 의료망</p>
              </div>
            </div>

          </div>
        </section>

        {/* Local Safe Foods Scrolling Grid */}
        <section className="mb-10 overflow-hidden">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h3 className="font-display font-extrabold text-2xl text-[#1b1c19] tracking-tight">
                추천 안심 식사 리스트
              </h3>
              <p className="text-xs text-[#5c6869] font-bold mt-1.5">사용자 당뇨 및 만성 질환 필터를 적용한 청정 제주 메뉴</p>
            </div>
            <button 
              id="view-all-foods-btn"
              onClick={() => onSelectFood("고기국수")}
              className="text-[#006067] font-display text-xs font-extrabold flex items-center gap-1 hover:underline shrink-0 bg-[#eefcfd] px-3.5 py-2 rounded-xl border border-[#006067]/10"
            >
              <span>전체 보기</span> <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar scroll-smooth">
            {FOOD_ITEMS.map((food) => (
              <motion.div
                key={food.id}
                id={`food-card-${food.id}`}
                whileHover={{ y: -5 }}
                onClick={() => onSelectFood(food.name)}
                className="min-w-[280px] md:min-w-[340px] bg-white rounded-2xl shadow-sm hover:shadow-md border border-[#eae8e3] overflow-hidden group cursor-pointer transition-all duration-300"
              >
                {/* Image Wrapper with visual filters */}
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={food.imageUrl} 
                    alt={food.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl flex items-center gap-1 text-xs font-bold shadow-sm border border-[#eae8e3]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                    <span className="text-[#006067]">AI 안전 적합</span>
                  </div>
                </div>

                {/* Content Panel with refined typography */}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className="font-display font-extrabold text-lg text-[#1b1c19] group-hover:text-[#006067] transition-colors">
                      {food.name}
                    </h4>
                    <div className="flex items-center text-amber-600 shrink-0 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="text-xs font-extrabold ml-1">{food.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#5c6869] mb-4 leading-relaxed font-semibold h-9 overflow-hidden text-ellipsis line-clamp-2">{food.description}</p>
                  
                  {/* Food Tags */}
                  <div className="flex gap-1.5 flex-wrap">
                    {food.tags.map(tag => (
                      <span 
                        key={tag}
                        className="px-2.5 py-1 bg-[#f4f3ef] text-[#5c6869] text-[10px] font-extrabold rounded-md border border-[#e5e3de]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Dynamic Alert Banner styled like a Travel Advisory */}
        <section className="mb-6 bg-[#21150c] text-[#ffdcc3] p-6 rounded-3xl relative overflow-hidden flex items-center gap-5 shadow-xs border border-amber-950/40">
          <div className="z-10 flex-grow">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 rounded-full text-[10px] font-extrabold tracking-wider uppercase mb-3 border border-amber-500/20">
              <Droplet className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span>실시간 날씨 알림</span>
            </div>
            <h4 className="font-display font-extrabold text-lg text-white mb-1.5">
              오늘 서귀포 지역 습도 지수 높음 (80%)
            </h4>
            <p className="text-xs md:text-sm text-[#ffdcc3]/85 leading-relaxed font-bold">
              습도가 높아지면 인슐린 감수성이 하락할 수 있어, 당뇨 수치를 정기적으로 체크하시고 제공되는 무설탕 티를 보충하세요.
            </p>
          </div>
          {/* Background decorative elements representing Jeju design */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500/10 rounded-full opacity-40 pointer-events-none" />
        </section>

      </main>

      {/* Floating Action Button (FAB) for AI Chat */}
      <button
        id="fab-ai-chat"
        onClick={onOpenChat}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-[#006067] to-[#007b83] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 group cursor-pointer ring-4 ring-[#006067]/20"
        title="AI 비서에게 질문하기"
      >
        <Sparkles className="w-5.5 h-5.5 animate-pulse" />
      </button>

      {/* Emergency Institution Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl relative border border-[#ffdad6]"
          >
            <button 
              id="close-emergency-modal-btn"
              onClick={() => setShowEmergencyModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-[#f4f3ef] rounded-full text-gray-500 transition-colors"
            >
              <X className="w-5.5 h-5.5" />
            </button>
            
            <div className="flex items-center gap-2.5 mb-4 text-[#ba1a1a]">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="font-display font-extrabold text-lg">제주 권역 24시간 응급센터</h3>
            </div>

            <p className="text-xs text-[#5c6869] mb-5 leading-relaxed font-bold">
              만일의 상황 발생 시 신속히 안전 요원이나 하단의 전문 병원 응급실에 연락하세요. 꽃보다 제주는 항상 119 구급대 및 주요 응급실 정보를 지원합니다.
            </p>

            <div className="space-y-3">
              {hospitals.map((hosp, i) => (
                <div key={i} className="p-3.5 bg-[#fcfbfa] rounded-2xl border border-[#eae8e3] flex justify-between items-center gap-3">
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-[#1b1c19]">{hosp.name}</h4>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1 font-bold">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-[#006067]" />
                      {hosp.address}
                    </p>
                  </div>
                  <a 
                    href={`tel:${hosp.phone.replace(/-/g, "")}`}
                    className="p-2.5 bg-[#ffdad6] text-[#93000a] hover:bg-[#ffb4ab] rounded-xl transition-colors flex items-center justify-center shrink-0"
                    title="전화 걸기"
                  >
                    <Phone className="w-4.5 h-4.5" />
                  </a>
                </div>
              ))}
            </div>

            <button
              id="emergency-close-btn"
              onClick={() => setShowEmergencyModal(false)}
              className="mt-6 w-full py-4.5 bg-[#006067] text-white font-display font-extrabold text-base rounded-2xl hover:bg-[#007b83] transition-colors"
            >
              확인 완료
            </button>
          </motion.div>
        </div>
      )}

      {/* Premium Bottom Dock */}
      <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 h-20 bg-white/90 backdrop-blur-md border-t border-[#eae8e3] shadow-[0_-5px_20px_rgba(0,0,0,0.03)] rounded-t-3xl">
        {/* ACTIVE TAB: Home */}
        <button 
          id="tab-home"
          className="flex flex-col items-center justify-center text-[#006067] bg-[#eefcfd] rounded-2xl px-5 py-2.5 transition-all border border-[#006067]/10"
        >
          <Home className="w-5 h-5 mb-0.5 text-[#006067]" />
          <span className="text-xs font-extrabold">홈</span>
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
          onClick={() => onSelectFood("고기국수")}
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
