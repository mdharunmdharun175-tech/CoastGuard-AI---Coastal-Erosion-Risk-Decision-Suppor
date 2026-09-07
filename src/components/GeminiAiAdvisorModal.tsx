import React, { useState, useEffect, useRef } from "react";
import { CoastalTransect } from "../types";
import { fetchGeminiAdvisor, sendGeminiChat } from "../api/client";
import {
  Sparkles,
  Bot,
  User,
  Send,
  Loader2,
  X,
  FileText,
  MessageSquare,
  ShieldAlert,
  Waves,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Compass,
  Download
} from "lucide-react";

interface GeminiAiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  transect: CoastalTransect | null;
  transects?: CoastalTransect[];
  onSelectTransect?: (t: CoastalTransect) => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export const GeminiAiAdvisorModal: React.FC<GeminiAiAdvisorModalProps> = ({
  isOpen,
  onClose,
  transect,
  transects = [],
  onSelectTransect
}) => {
  const [activeTab, setActiveTab] = useState<"assessment" | "chat">("assessment");
  const [currentTransect, setCurrentTransect] = useState<CoastalTransect | null>(transect);

  // Assessment state
  const [assessmentText, setAssessmentText] = useState<string>("");
  const [isLoadingAssessment, setIsLoadingAssessment] = useState<boolean>(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);
  const [climateScenario, setClimateScenario] = useState<string>("IPCC SSP2-4.5 (+0.4m SLR by 2050)");
  const [copied, setCopied] = useState<boolean>(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      role: "model",
      content: "Hello! I am your CoastGuard AI Oceanographic Copilot powered by Gemini 3.7. Ask me any question regarding coastal erosion hydrodynamics, Stockdon wave runup, living shoreline designs, submerged reef specifications, or emergency surge mitigation for this transect.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transect) {
      setCurrentTransect(transect);
    }
  }, [transect]);

  useEffect(() => {
    if (isOpen && currentTransect && !assessmentText && !isLoadingAssessment) {
      handleGenerateAssessment();
    }
  }, [isOpen, currentTransect]);

  useEffect(() => {
    if (activeTab === "chat" && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, activeTab]);

  const handleGenerateAssessment = async () => {
    setIsLoadingAssessment(true);
    setAssessmentError(null);
    try {
      const res = await fetchGeminiAdvisor(
        currentTransect,
        undefined,
        climateScenario
      );
      if (res.success && res.assessment) {
        setAssessmentText(res.assessment);
      } else {
        setAssessmentError("No assessment generated from Gemini API.");
      }
    } catch (err: any) {
      console.error("Gemini assessment error:", err);
      setAssessmentError(err.message || "Failed to generate AI assessment");
    } finally {
      setIsLoadingAssessment(false);
    }
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || chatInput.trim();
    if (!textToSend || isSendingChat) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setChatInput("");
    setIsSendingChat(true);

    try {
      const apiMessages = [...chatMessages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await sendGeminiChat(apiMessages, currentTransect);
      if (res.success && res.reply) {
        const modelMsg: ChatMessage = {
          id: `mod-${Date.now()}`,
          role: "model",
          content: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages((prev) => [...prev, modelMsg]);
      }
    } catch (err: any) {
      console.error("Gemini chat error:", err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        content: `Error: ${err.message || "Failed to reach Gemini AI service. Please verify your GEMINI_API_KEY."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleCopyAssessment = () => {
    if (!assessmentText) return;
    navigator.clipboard.writeText(assessmentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!assessmentText) return;
    const blob = new Blob([assessmentText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Gemini_Coastal_Assessment_${currentTransect?.id || 'TRX'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Gemini AI Coastal Intelligence Advisor
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                  gemini-3.7-flash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Oceanographic analysis &bull; Nature-based engineering &bull; Real-time AI consultation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-bar: Sector Selector & Tabs */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          
          {/* Active Transect Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Selected Sector:</span>
            {transects.length > 0 ? (
              <select
                value={currentTransect?.id || ""}
                onChange={(e) => {
                  const found = transects.find(t => t.id === e.target.value);
                  if (found) {
                    setCurrentTransect(found);
                    if (onSelectTransect) onSelectTransect(found);
                    setAssessmentText("");
                  }
                }}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500"
              >
                {transects.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.id} - {t.risk_class} Risk)
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs font-bold text-cyan-300">
                {currentTransect?.name || "Global Coastal Domain"}
              </span>
            )}
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab("assessment")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                activeTab === "assessment"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Deep-Dive Assessment</span>
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                activeTab === "chat"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Interactive Copilot</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {activeTab === "assessment" ? (
            <div className="space-y-4">
              
              {/* Climate Scenario & Controls Toolbar */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-400 font-medium">Climate Boundary:</span>
                  <select
                    value={climateScenario}
                    onChange={(e) => setClimateScenario(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Baseline Present Day (0.0m SLR)">Baseline Present Day (+0.0m SLR)</option>
                    <option value="IPCC SSP2-4.5 (+0.4m SLR by 2050)">IPCC SSP2-4.5 (+0.4m SLR by 2050)</option>
                    <option value="IPCC SSP5-8.5 Extreme (+1.0m SLR by 2100)">IPCC SSP5-8.5 Extreme (+1.0m SLR by 2100)</option>
                    <option value="Category 3-4 Cyclonic Surge (+2.5m Surge + 400 kW/m Wave Energy)">Category 3-4 Cyclonic Surge (+2.5m Surge)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateAssessment}
                    disabled={isLoadingAssessment}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAssessment ? "animate-spin" : ""}`} />
                    <span>{isLoadingAssessment ? "Analyzing..." : "Re-Run Analysis"}</span>
                  </button>

                  {assessmentText && (
                    <>
                      <button
                        onClick={handleCopyAssessment}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs"
                        title="Copy to Clipboard"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={handleDownloadMarkdown}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs"
                        title="Download Markdown Report"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Assessment Body */}
              {isLoadingAssessment ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                  <p className="text-xs font-mono text-slate-300">
                    Synthesizing coastal hydrodynamics, Stockdon wave runup, and nature-based solutions with Gemini 3.7...
                  </p>
                </div>
              ) : assessmentError ? (
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 space-y-2">
                  <div className="font-bold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Analysis Notice</span>
                  </div>
                  <p>{assessmentError}</p>
                  <button
                    onClick={handleGenerateAssessment}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold"
                  >
                    Retry Analysis
                  </button>
                </div>
              ) : assessmentText ? (
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800/90 text-xs leading-relaxed space-y-4 text-slate-200 font-sans whitespace-pre-wrap">
                  {assessmentText}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 text-xs">
                  Click &ldquo;Re-Run Analysis&rdquo; to generate a comprehensive Gemini AI report for this transect.
                </div>
              )}

            </div>
          ) : (
            /* Interactive Copilot Chat Tab */
            <div className="flex flex-col h-[480px] space-y-3">
              
              {/* Preset prompt buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <span className="text-slate-500 shrink-0">Suggestions:</span>
                {[
                  "What is the best nature-based defense for this slope?",
                  "Explain Stockdon (2006) wave runup calculation",
                  "Compare submerged reef vs living shoreline cost",
                  "How to manage divergent littoral sediment deficit?"
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isSendingChat}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 whitespace-nowrap shrink-0 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Scroll Container */}
              <div
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3"
              >
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        msg.role === "user"
                          ? "bg-cyan-500 text-slate-950 font-bold text-xs"
                          : "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                      }`}
                    >
                      {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-cyan-600 text-white rounded-tr-none"
                          : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-wrap"
                      }`}
                    >
                      {msg.content}
                      <span className="block text-[9px] text-slate-400 mt-1 text-right font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {isSendingChat && (
                  <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono pl-10">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini AI is formulating coastal response...</span>
                  </div>
                )}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={`Ask Gemini AI about ${currentTransect?.name || 'coastal resilience'}...`}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isSendingChat}
                  className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isSendingChat}
                  className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 transition-all shadow-md"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
