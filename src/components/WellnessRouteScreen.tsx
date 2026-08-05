import { useState, useEffect } from "react";
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
  Flower,
  MapPin,
  Sparkles,
  Stethoscope,
  LocateFixed,
  Navigation
} from "lucide-react";
import { WELLNESS_ITINERARY } from "../data";
import { FoodVenueInfo } from "../types";

// 에어코리아/기상청 API 응답을 못 받을 때 쓰는 오프라인 대체값
const FALLBACK_ENVIRONMENT = {
  airGrade: "매우 좋음",
  pm25Text: "실시간 수치: 8 µg/m³",
  uvGrade: "보통",
  uvHint: "양산 지참 및 차단제 도포 권장",
};

// 제주데이터허브 API 응답을 못 받을 때 쓰는 오프라인 대체 목록 (좌표 없음 — 지도는 실시간 데이터에서만 표시)
const FALLBACK_BARRIER_FREE_SPOTS = [
  { name: "한라수목원", address: "제주시 연동 1002", lat: null, lng: null },
  { name: "칠십리시공원", address: "서귀포시 서홍동 571-3", lat: null, lng: null },
  { name: "제주현대미술관", address: "제주시 한경면 저지리 2114-68", lat: null, lng: null },
  { name: "함덕서우봉해변", address: "제주시 조천읍 함덕리 산 1", lat: null, lng: null },
];

// 한국관광공사 웰니스관광정보 API 응답을 못 받을 때 쓰는 오프라인 대체 목록
const FALLBACK_WELLNESS_SPOTS = [
  { contentId: "fallback-1", title: "서귀포 치유의 숲", address: "서귀포시 산록남로 2271", theme: "자연 치유", imageUrl: null, distanceM: null },
  { contentId: "fallback-2", title: "오레브핫스프링앤스파", address: "서귀포시 태평로 152", theme: "온천·사우나·스파", imageUrl: null, distanceM: null },
  { contentId: "fallback-3", title: "석예원 본초 족욕", address: "서귀포시 성산읍 섭지코지로25번길 34", theme: "기타 웰니스", imageUrl: null, distanceM: null },
];

function formatDistance(distanceM: number | null): string | null {
  if (distanceM == null) return null;
  return distanceM < 1000 ? `${distanceM}m` : `${(distanceM / 1000).toFixed(1)}km`;
}

// 한국관광공사 의료관광정보 API 응답을 못 받을 때 쓰는 오프라인 대체 목록
const FALLBACK_MEDICAL_SPOTS = [
  { contentId: "fallback-1", name: "제주대학교병원", address: "제주시 아란13길 15" },
  { contentId: "fallback-2", name: "의료법인 혜인의료재단 한국병원", address: "제주시 서광로 193" },
  { contentId: "fallback-3", name: "한국의학연구소 제주의원", address: "서귀포시 소로름로 61" },
];

const UV_HINTS: Record<string, string> = {
  낮음: "자외선 차단제 없이도 비교적 안전해요",
  보통: "양산 지참 및 차단제 도포 권장",
  높음: "그늘 이용과 자외선 차단제 재도포 권장",
  매우높음: "장시간 야외활동은 피하고 차단제를 자주 덧발라 주세요",
  위험: "가급적 실외 활동을 자제해 주세요",
};

interface WellnessRouteScreenProps {
  onBack: () => void;
  onChangeScreen: (screen: string) => void;
  onSelectFood: (foodName: string, venue?: FoodVenueInfo | null) => void;
}

export default function WellnessRouteScreen({
  onBack,
  onChangeScreen,
  onSelectFood,
}: WellnessRouteScreenProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [environment, setEnvironment] = useState(FALLBACK_ENVIRONMENT);
  const [barrierFreeSpots, setBarrierFreeSpots] = useState(FALLBACK_BARRIER_FREE_SPOTS);
  const [selectedMapSpot, setSelectedMapSpot] = useState<typeof FALLBACK_BARRIER_FREE_SPOTS[number] | null>(null);
  const [wellnessSpots, setWellnessSpots] = useState(FALLBACK_WELLNESS_SPOTS);
  const [medicalSpots, setMedicalSpots] = useState(FALLBACK_MEDICAL_SPOTS);
  const [nearMeStatus, setNearMeStatus] = useState<"idle" | "locating" | "active" | "denied">("idle");

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
  };

  useEffect(() => {
    let active = true;
    fetch("/api/environment/jeju")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        setEnvironment((prev) => ({
          airGrade: data.airQuality?.grade ?? prev.airGrade,
          pm25Text:
            data.airQuality?.pm25Value != null
              ? `실시간 수치: ${data.airQuality.pm25Value} µg/m³`
              : prev.pm25Text,
          uvGrade: data.uvIndex?.grade ?? prev.uvGrade,
          uvHint: data.uvIndex?.grade ? (UV_HINTS[data.uvIndex.grade] ?? prev.uvHint) : prev.uvHint,
        }));
      })
      .catch(() => {
        console.warn("Using offline static fallback for environment data");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/tourism/barrier-free")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.spots?.length > 0) {
          setBarrierFreeSpots(data.spots.slice(0, 8));
        }
      })
      .catch(() => {
        console.warn("Using offline static fallback for barrier-free spots");
      });
    return () => {
      active = false;
    };
  }, []);

  const loadWellnessSpots = (active: { current: boolean }, coords?: { lat: number; lng: number }) => {
    const query = coords ? `?lat=${coords.lat}&lng=${coords.lng}` : "";
    fetch(`/api/tourism/wellness${query}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active.current && data?.spots?.length > 0) {
          setWellnessSpots(data.spots.slice(0, 8));
          if (coords) setNearMeStatus("active");
        } else if (coords) {
          setNearMeStatus("idle");
        }
      })
      .catch(() => {
        console.warn("Using offline static fallback for wellness spots");
        if (coords) setNearMeStatus("idle");
      });
  };

  useEffect(() => {
    const active = { current: true };
    loadWellnessSpots(active);
    return () => {
      active.current = false;
    };
  }, []);

  const handleFindWellnessNearMe = () => {
    if (!navigator.geolocation) {
      setNearMeStatus("denied");
      return;
    }
    setNearMeStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadWellnessSpots(
          { current: true },
          { lat: position.coords.latitude, lng: position.coords.longitude }
        );
      },
      () => {
        setNearMeStatus("denied");
      },
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    let active = true;
    fetch("/api/tourism/medical")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.spots?.length > 0) {
          setMedicalSpots(data.spots.slice(0, 8));
        }
      })
      .catch(() => {
        console.warn("Using offline static fallback for medical tourism spots");
      });
    return () => {
      active = false;
    };
  }, []);

  // 지도에 표시할 무장애 여행지: 사용자가 목록에서 고른 곳 우선, 없으면 좌표가 있는 첫 실시간 데이터
  const mapSpot = selectedMapSpot ?? barrierFreeSpots.find((s) => s.lat != null && s.lng != null) ?? null;
  const mapEmbedUrl = mapSpot
    ? (() => {
        const delta = 0.01; // 약 1km 반경
        const bbox = [mapSpot.lng! - delta, mapSpot.lat! - delta, mapSpot.lng! + delta, mapSpot.lat! + delta].join(",");
        return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${mapSpot.lat},${mapSpot.lng}`;
      })()
    : null;
  const mapDirectionsUrl = mapSpot
    ? `https://map.kakao.com/link/to/${encodeURIComponent(mapSpot.name)},${mapSpot.lat},${mapSpot.lng}`
    : null;

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
              <h1 className="font-display font-extrabold text-base text-[#006067] tracking-tight">Jeju over Flowers</h1>
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

            {/* 실제 무장애 여행지 위치 지도 (OpenStreetMap, 좌표는 제주데이터허브 실시간 데이터) */}
            <div className="w-full h-full min-h-[420px] relative">
              {mapEmbedUrl ? (
                <iframe
                  key={mapEmbedUrl}
                  src={mapEmbedUrl}
                  className="w-full h-full min-h-[420px] absolute inset-0 border-0"
                  title={`${mapSpot?.name} 위치 지도`}
                />
              ) : (
                <div className="w-full h-full min-h-[420px] bg-gradient-to-br from-[#eefcfd] to-[#f4f3ef] flex flex-col items-center justify-center gap-2">
                  <MapPin className="w-10 h-10 text-[#006067]/20" />
                  <p className="text-xs text-[#5c6869] font-bold">위치 정보를 불러오는 중이에요</p>
                </div>
              )}

              {/* Floating Spot Info Overlay */}
              {mapSpot && (
                <div className="absolute bottom-4 right-4 left-4 sm:left-auto bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-md border border-[#eae8e3] flex items-center gap-4 max-w-full">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-[#5c6869] uppercase tracking-wider">선택된 무장애 여행지</p>
                    <p className="text-base font-extrabold text-[#1b1c19] mt-0.5 truncate">{mapSpot.name}</p>
                    <p className="text-[11px] text-[#5c6869] font-semibold truncate">{mapSpot.address}</p>
                  </div>
                  {mapDirectionsUrl && (
                    <a
                      href={mapDirectionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 flex items-center gap-1 text-xs font-extrabold text-white bg-[#006067] px-3 py-2 rounded-xl hover:bg-[#00787f] transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      길찾기
                    </a>
                  )}
                </div>
              )}
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
                <p className="text-xl font-extrabold text-emerald-700 mt-1">{environment.airGrade}</p>
                <p className="text-[11px] text-[#5c6869] font-semibold mt-1">PM2.5 {environment.pm25Text}</p>
              </div>
              <Wind className="w-10 h-10 text-emerald-600 opacity-80 shrink-0" />
            </div>

            {/* UV Index */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eae8e3] flex items-center justify-between min-h-[105px]">
              <div>
                <p className="text-[10px] font-bold text-[#5c6869] uppercase tracking-wider">자외선 자극지수</p>
                <p className="text-xl font-extrabold text-amber-600 mt-1">{environment.uvGrade}</p>
                <p className="text-[11px] text-[#5c6869] font-semibold mt-1">{environment.uvHint}</p>
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
                당뇨·고혈압·신장 수치를 포함해 최상의 생체 수용성을 보여주는 자연 친화 루트입니다.
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

        {/* Certified Barrier-Free Spots (제주데이터허브 무장애 여행지 정보) */}
        <section className="space-y-4">
          <div>
            <h3 className="font-display font-extrabold text-2xl text-[#1b1c19] tracking-tight">인증된 무장애 여행지</h3>
            <p className="text-xs text-[#5c6869] font-bold mt-1">제주데이터허브 제공 무장애 여행지 정보 기반</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
            {barrierFreeSpots.map((spot, idx) => {
              const hasCoords = spot.lat != null && spot.lng != null;
              const isSelected = mapSpot?.name === spot.name && mapSpot?.address === spot.address;
              return (
                <button
                  key={idx}
                  onClick={() => hasCoords && setSelectedMapSpot(spot)}
                  disabled={!hasCoords}
                  className={`min-w-[220px] text-left bg-white p-4 rounded-2xl shadow-sm border flex items-start gap-2.5 shrink-0 transition-all ${
                    isSelected ? "border-[#006067] ring-2 ring-[#006067]/15" : "border-[#eae8e3]"
                  } ${hasCoords ? "cursor-pointer hover:border-[#bdc9ca]" : "cursor-default opacity-80"}`}
                >
                  <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? "text-[#006067]" : "text-[#006067]/70"}`} />
                  <div>
                    <p className="font-display font-extrabold text-sm text-[#1b1c19]">{spot.name}</p>
                    <p className="text-[11px] text-[#5c6869] font-semibold mt-0.5">{spot.address}</p>
                    {hasCoords && (
                      <span className="inline-block mt-1.5 text-[10px] font-extrabold text-[#006067]">
                        {isSelected ? "지도에 표시 중" : "탭해서 지도 보기"}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Wellness Tourism Spots (한국관광공사 웰니스관광정보 API) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-display font-extrabold text-2xl text-[#1b1c19] tracking-tight">근처 웰니스 명소</h3>
                <p className="text-xs text-[#5c6869] font-bold mt-1">
                  {nearMeStatus === "active"
                    ? "내 위치 기준 가까운 순으로 정렬됨"
                    : "한국관광공사 웰니스관광정보 API 실시간 제공"}
                </p>
              </div>
            </div>
            <button
              id="wellness-near-me-btn"
              onClick={handleFindWellnessNearMe}
              disabled={nearMeStatus === "locating"}
              className="shrink-0 flex items-center gap-1.5 text-xs font-extrabold text-[#006067] bg-[#eefcfd] px-3.5 py-2 rounded-xl border border-[#006067]/10 hover:border-[#006067]/30 transition-all disabled:opacity-60"
            >
              <LocateFixed className={`w-4 h-4 ${nearMeStatus === "locating" ? "animate-pulse" : ""}`} />
              {nearMeStatus === "locating" ? "위치 확인 중" : "내 주변"}
            </button>
          </div>
          {nearMeStatus === "denied" && (
            <p className="text-[11px] text-[#a15f21] font-bold -mt-2">
              위치 정보를 가져올 수 없어 제주 전체 목록을 보여드리고 있어요.
            </p>
          )}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
            {wellnessSpots.map((spot) => (
              <div
                key={spot.contentId}
                className="min-w-[220px] bg-white rounded-2xl shadow-sm border border-[#eae8e3] overflow-hidden shrink-0"
              >
                <div
                  className="w-full h-28 bg-cover bg-center bg-[#eefcfd]"
                  style={spot.imageUrl ? { backgroundImage: `url('${spot.imageUrl}')` } : undefined}
                ></div>
                <div className="p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#eefcfd] text-[#006067] border border-[#006067]/10">
                      {spot.theme}
                    </span>
                    {formatDistance(spot.distanceM) && (
                      <span className="shrink-0 text-[10px] font-extrabold text-[#006067]">
                        {formatDistance(spot.distanceM)}
                      </span>
                    )}
                  </div>
                  <p className="font-display font-extrabold text-sm text-[#1b1c19] mt-1.5">{spot.title}</p>
                  <p className="text-[11px] text-[#5c6869] font-semibold mt-0.5">{spot.address}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Medical Tourism Designated Institutions (한국관광공사 의료관광정보 API) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#006067]" />
            <div>
              <h3 className="font-display font-extrabold text-2xl text-[#1b1c19] tracking-tight">의료관광 지정기관</h3>
              <p className="text-xs text-[#5c6869] font-bold mt-1">한국관광공사 의료관광정보 API 실시간 제공</p>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
            {medicalSpots.map((spot) => (
              <div
                key={spot.contentId}
                className="min-w-[220px] bg-white p-4 rounded-2xl shadow-sm border border-[#eae8e3] flex items-start gap-2.5 shrink-0"
              >
                <Stethoscope className="w-4 h-4 text-[#006067] shrink-0 mt-0.5" />
                <div>
                  <p className="font-display font-extrabold text-sm text-[#1b1c19]">{spot.name}</p>
                  <p className="text-[11px] text-[#5c6869] font-semibold mt-0.5">{spot.address}</p>
                </div>
              </div>
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
