import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  User, 
  Bot, 
  Loader2,
  HelpCircle as HelpIcon
} from "lucide-react";
import { Language, Message } from "../types";

interface AIConsultantProps {
  lang: Language;
  t: any;
  location: string;
  totalPower: number;
}

export default function AIConsultant({
  lang,
  t,
  location,
  totalPower
}: AIConsultantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Prepopulate with a welcoming message from the Solar Expert AI
  useEffect(() => {
    const welcomeHe = `שלום! אני היועץ הסולארי החכם של אפולו. ☀️
אני כאן כדי לעזור לך לתכנן ולהתקין את פרויקט ה-DIY הסולארי הגמיש שלך. 

תוכל לשאול אותי שאלות כמו:
• כיצד להדביק את הפאנלים הגמישים על גג הקרוואן או הסיפון באופן בטוח?
• איך לחבר את הפאנלים בטור לעומת חיבור במקביל?
• כיצד לבחור את בקר הטעינה (MPPT) והמצבר המתאימים ביותר להספק שלך?

מה תרצה לתכנן היום?`;

    const welcomeEn = `Hello! I am your Apollo Smart AI Solar Advisor. ☀️
I'm here to guide you through planning, sizing, and installing your flexible DIY solar project.

Ask me anything about:
• How to securely bond flexible solar films to campervans, roofs, or yacht decks?
• Connecting panels in Series vs. Parallel?
• Selecting the optimal MPPT charge controller & battery capacity for your setup.

What are we planning today?`;

    setMessages([
      {
        id: "welcome-msg",
        role: "model",
        content: lang === "he" ? welcomeHe : welcomeEn,
        timestamp: new Date()
      }
    ]);
  }, [lang]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Suggested questions
  const SUGGESTED_QUESTIONS = lang === "he" ? [
    { text: "איזה דבק מומלץ להדבקה על פיברגלס או פח?", label: "שיטות הדבקה" },
    { text: "חיבור פאנלים סולאריים בטור לעומת במקביל", label: "טור או מקביל" },
    { text: "איך לבחור בקר טעינה MPPT מתאים?", label: "בחירת בקר" },
    { text: "האם פאנלים של אפולו עמידים למים מלוחים ודריכה?", label: "עמידות ודריכה" }
  ] : [
    { text: "Which adhesive is recommended for fiberglass/metal roofs?", label: "Adhesive Types" },
    { text: "What is the difference between Series vs. Parallel wiring?", label: "Wiring Guide" },
    { text: "How to select the right size MPPT controller?", label: "Sizing MPPT" },
    { text: "Are Apollo panels walk-on safe and saltwater durable?", label: "Durability" }
  ];

  // Send message
  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input.trim();
    if (!messageText || isLoading) return;

    if (!textToSend) {
      setInput("");
    }

    const newUserMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: messageText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Send the chat history to the proxy Express endpoint
      const currentHistory = [...messages, newUserMessage].map((m) => ({
        role: m.role,
        content: m.content
      }));

      // Add a tiny hint about the user's current project details into the prompt so AI gives contextual answers!
      const projectCtxMsg = {
        role: "user",
        content: `[מידע על הפרויקט הנוכחי של המשתמש: הספק סולארי מתוכנן: ${totalPower}W, אזור קרינה שנבחר: ${location}. המשתמש שואל: ${messageText}]`
      };

      const payloadHistory = [...messages.map(m => ({ role: m.role, content: m.content })), projectCtxMsg];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadHistory })
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI server");
      }

      const data = await response.json();

      const newAIMessage: Message = {
        id: `msg-${Date.now()}-model`,
        role: "model",
        content: data.text || "סליחה, לא הצלחתי לעבד את התשובה כעת.",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, newAIMessage]);
    } catch (error) {
      console.error("AI Assistant error:", error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-err`,
        role: "model",
        content: lang === "he" 
          ? "מצטער, חלה שגיאה בחיבור לשרת ה-AI של אפולו. אנא ודא שמפתח ה-API תקין ונסה שוב."
          : "Sorry, a connection error occurred with the Apollo AI service. Please ensure your API key is correctly configured.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome-msg",
        role: "model",
        content: lang === "he" 
          ? "השיחה אותחלה מחדש. כיצד אוכל לסייע לך בתכנון המערכת הסולארית הגמישה שלך כעת? ☀️" 
          : "Chat has been reset. How can I assist you with your DIY flexible solar project today? ☀️",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col gap-4 h-[550px]" id="ai-chat-section">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-amber-500 to-orange-500 p-2 rounded-xl text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{t.aiChatTitle}</h3>
            <span className="text-[10px] bg-amber-500/10 text-amber-700 font-bold px-2 py-0.5 rounded-full">
              Powered by Gemini 3.5 Flash
            </span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2 text-slate-400 hover:text-slate-600 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
          title={t.resetChat}
          id="btn-reset-chat"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4" id="chat-messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Avatar */}
            <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === "user" ? "bg-slate-200 text-slate-600" : "bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-xs"
            }`}>
              {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            {/* Message Bubble */}
            <div className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-xs ${
              msg.role === "user"
                ? "bg-slate-900 text-white rounded-tr-none font-medium"
                : "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-xs flex items-center justify-center flex-shrink-0 animate-spin">
              <Loader2 className="h-4 w-4" />
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs font-semibold shadow-xs">
              <span className="inline-block animate-bounce font-sans">{t.loading}</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Questions Quick Tags */}
      <div className="space-y-1.5 border-t border-slate-100 pt-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
          <HelpIcon className="h-3 w-3 text-amber-500" />
          {lang === "he" ? "שאלות נפוצות מומלצות:" : "Recommended Quick Qs:"}
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-[50px] overflow-y-auto">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.text)}
              disabled={isLoading}
              className="text-[11px] bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 text-slate-600 hover:text-amber-800 font-semibold px-2.5 py-1 rounded-full transition-all duration-150 disabled:opacity-50"
              id={`btn-suggest-q-${idx}`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
        id="chat-input-form"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder={t.aiChatPlaceholder}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-hidden transition-all disabled:opacity-50 text-slate-800"
          id="input-chat-message"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-xl p-3 disabled:opacity-40 transition-all flex items-center justify-center shadow-md shadow-slate-900/10 flex-shrink-0"
          id="btn-send-message"
        >
          <Send className={`h-4 w-4 ${lang === "he" ? "rotate-180" : ""}`} />
        </button>
      </form>
    </div>
  );
}
