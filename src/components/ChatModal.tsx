import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User,
  AlertTriangle,
  Flower
} from "lucide-react";
import { ChatMessage } from "../types";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedConditions: string[];
}

export default function ChatModal({
  isOpen,
  onClose,
  selectedConditions,
}: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "안녕하세요! 꽃보다 제주 AI 건강 비서입니다. 제주의 맛있는 향토음식을 안전하게 즐기실 수 있도록 무엇이든 물어보세요! 😊",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggestions based on wellness context
  const SUGGESTIONS = [
    "당뇨 환자가 고기국수를 먹을 때 안전 수칙은?",
    "고혈압 환자를 위한 싱거운 제주 향토음식 추천",
    "제주 여행 중 한라산 산책로 난이도 어때요?"
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Map message history to simple text payload
      const historyPayload = messages.map(msg => ({
        role: msg.role,
        text: msg.text,
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          conditions: selectedConditions,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat service failed");
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        role: "model",
        text: data.text || "죄송합니다. 답변을 생성하지 못했습니다.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error("Chat Error:", err);
      const errorMsg: ChatMessage = {
        role: "model",
        text: "현재 서버 연결이 고르지 못해 답변을 생성하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm">
        <motion.div 
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-lg h-[80vh] md:h-[650px] shadow-2xl flex flex-col overflow-hidden border border-[#eae8e3]"
        >
          {/* Header Panel */}
          <div className="bg-[#006067] text-white px-5 py-4.5 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/10">
                <Flower className="w-5.5 h-5.5 text-[#ff9f43] fill-[#ffeaa7] animate-spin-slow" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-white tracking-tight">꽃보다 제주 AI 비서</h3>
                <p className="text-[10px] text-[#ffeaa7] font-extrabold tracking-widest uppercase">24/7 Wellness Companion</p>
              </div>
            </div>
            <button 
              id="close-chat-btn"
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed Area */}
          <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-[#fcfbfa]">
            {messages.map((msg, idx) => {
              const isModel = msg.role === "model";
              return (
                <div 
                  key={idx} 
                  className={`flex gap-3 max-w-[88%] ${isModel ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  {/* Avatar Icon */}
                  <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center shadow-sm ${
                    isModel ? "bg-[#006067] text-[#ffeaa7]" : "bg-emerald-50 text-emerald-800"
                  }`}>
                    {isModel ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>

                  {/* Bubble Container */}
                  <div className="space-y-1">
                    <div className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed font-bold ${
                      isModel 
                        ? "bg-white text-[#1b1c19] rounded-tl-none border border-[#eae8e3] shadow-xs" 
                        : "bg-[#006067] text-white rounded-tr-none shadow-sm"
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                    <span className="block text-[10px] font-bold text-[#5c6869] text-right px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Waiting/Typing Loader */}
            {loading && (
              <div className="flex gap-3 mr-auto max-w-[85%]">
                <div className="w-9 h-9 rounded-full bg-[#006067] text-[#ffeaa7] shrink-0 flex items-center justify-center shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-[#eae8e3] shadow-xs text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#006067] rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-[#006067] rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-[#006067] rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Shelf */}
          {messages.length === 1 && (
            <div className="px-5 py-4 bg-[#fcfbfa] border-t border-[#eae8e3] space-y-2 shrink-0">
              <p className="text-[10px] font-extrabold text-[#5c6869] uppercase tracking-wider">안심 케어 주요 추천 질문</p>
              <div className="flex flex-col gap-2">
                {SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sug)}
                    className="w-full text-left px-4 py-2.5 bg-white border border-[#eae8e3] hover:border-[#006067] rounded-xl text-xs font-bold text-[#1b1c19] transition-all hover:text-[#006067] shadow-xs active:scale-[0.99]"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Panel Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-4 bg-white border-t border-[#bdc9ca] flex gap-3 items-center shrink-0"
          >
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="제주 웰니스에 대해 질문해 보세요..."
              className="flex-grow h-13 px-4 border-2 border-[#bdc9ca] focus:border-[#006067] outline-none rounded-xl text-base font-medium"
              disabled={loading}
            />
            <button
              id="send-message-btn"
              type="submit"
              disabled={!input.trim() || loading}
              className={`w-13 h-13 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                input.trim() && !loading
                  ? "bg-[#006067] text-white hover:bg-[#007b83] active:scale-95"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
