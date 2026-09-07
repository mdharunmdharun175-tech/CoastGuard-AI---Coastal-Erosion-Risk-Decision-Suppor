import React, { useState } from "react";
import { DisasterAlert, CapBroadcastAlert } from "../types";
import {
  Radio,
  Volume2,
  VolumeX,
  Languages,
  Code,
  Download,
  CheckCircle2,
  X,
  BellRing,
  Send,
  AlertTriangle,
  Play,
  FileCode
} from "lucide-react";
import confetti from "canvas-confetti";

interface CapBroadcastStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: DisasterAlert;
}

export const CapBroadcastStudioModal: React.FC<CapBroadcastStudioModalProps> = ({
  isOpen,
  onClose,
  alert
}) => {
  const [selectedLang, setSelectedLang] = useState<"en-US" | "it-IT" | "es-ES" | "fr-FR" | "de-DE">("en-US");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDispatched, setIsDispatched] = useState<boolean>(false);
  const [activeFormat, setActiveFormat] = useState<"xml" | "json">("xml");

  if (!isOpen) return null;

  // Language-specific localized disaster messages
  const localizedContent: Record<string, { headline: string; description: string; instruction: string }> = {
    "en-US": {
      headline: `CIVIL EMERGENCY: ${alert.headline}`,
      description: `Meteorological and wave telemetry models predict a critical storm wave energy surge of ${alert.peak_wave_energy} kW/m and wave heights of ${alert.peak_wave_height}m affecting ${alert.affected_zone_names.join(", ")}.`,
      instruction: "Immediate exclusion zone in effect for all beaches, dune corridors, and low-lying coastal promenades. Commercial harbor operations suspended. Follow Civil Protection protocols."
    },
    "it-IT": {
      headline: `ALLERTA PROTEZIONE CIVILE: ${alert.headline}`,
      description: `I modelli idrodinamici e satellitari Copernicus prevedono un picco di mareggiata con energia d'onda pari a ${alert.peak_wave_energy} kW/m e onde di ${alert.peak_wave_height}m lungo la costa di ${alert.affected_zone_names.join(", ")}.`,
      instruction: "Divieto assoluto di accesso alle spiagge, ai trabocchi e ai sentieri dunali. Allontanarsi dalla linea di battigia. Seguire le istruzioni delle autorità comunali."
    },
    "es-ES": {
      headline: `ALERTA DE PROTECCIÓN CIVIL: ${alert.headline}`,
      description: `Los modelos de oleaje predicen un aumento crítico de energía de ${alert.peak_wave_energy} kW/m y olas de ${alert.peak_wave_height}m en ${alert.affected_zone_names.join(", ")}.`,
      instruction: "Evacuación preventiva de paseos marítimos y zonas de dunas. Queda prohibida la navegación y el acceso a la costa."
    },
    "fr-FR": {
      headline: `ALERTE PROTECTION CIVILE: ${alert.headline}`,
      description: `Les prévisions hydrodynamiques signalent une violente houle côtière de ${alert.peak_wave_energy} kW/m avec des vagues de ${alert.peak_wave_height}m à ${alert.affected_zone_names.join(", ")}.`,
      instruction: "Évacuez immédiatement les plages et les sentiers littoraux. Restez à l'écoute des consignes préfectorales."
    },
    "de-DE": {
      headline: `KATASTROPHENSCHUTZ WARNUNG: ${alert.headline}`,
      description: `Hydrodynamische Modelle sagen schwere Sturmwellen mit einer Energie von ${alert.peak_wave_energy} kW/m und Wellenhöhen von ${alert.peak_wave_height}m für ${alert.affected_zone_names.join(", ")} voraus.`,
      instruction: "Strand- und Dünenbereiche sofort meiden. Sperrung der Uferpromenaden beachten."
    }
  };

  const curr = localizedContent[selectedLang] || localizedContent["en-US"];

  // Generate OASIS CAP v1.2 XML
  const capXml = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>COASTGUARD-CAP-${alert.id}-${Date.now()}</identifier>
  <sender>civil-protection@coastguard.emergency.gov</sender>
  <sent>${new Date().toISOString()}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <language>${selectedLang}</language>
    <category>Geo</category>
    <category>Met</category>
    <event>${alert.disaster_type}</event>
    <urgency>Immediate</urgency>
    <severity>${alert.severity === "CRITICAL" ? "Extreme" : "Severe"}</severity>
    <certainty>Observed</certainty>
    <headline>${curr.headline}</headline>
    <description>${curr.description}</description>
    <instruction>${curr.instruction}</instruction>
    <area>
      <areaDesc>${alert.affected_zone_names.join(", ")}</areaDesc>
      <circle>42.1812,14.6865,25.0</circle>
    </area>
    <parameter>
      <valueName>PeakWaveEnergyKwM</valueName>
      <value>${alert.peak_wave_energy}</value>
    </parameter>
    <parameter>
      <valueName>PeakWaveHeightM</valueName>
      <value>${alert.peak_wave_height}</value>
    </parameter>
  </info>
</alert>`;

  const capJson = {
    cap_version: "1.2",
    identifier: `COASTGUARD-CAP-${alert.id}-${Date.now()}`,
    sender: "civil-protection@coastguard.emergency.gov",
    sent: new Date().toISOString(),
    status: "Actual",
    msgType: "Alert",
    scope: "Public",
    info: {
      language: selectedLang,
      categories: ["Geo", "Met", "Safety"],
      event: alert.disaster_type,
      urgency: "Immediate",
      severity: alert.severity === "CRITICAL" ? "Extreme" : "Severe",
      certainty: "Observed",
      headline: curr.headline,
      description: curr.description,
      instruction: curr.instruction,
      areaDesc: alert.affected_zone_names.join(", "),
      parameters: {
        peak_wave_energy_kw_m: alert.peak_wave_energy,
        peak_wave_height_m: alert.peak_wave_height,
        estimated_shoreline_loss_m: alert.estimated_shoreline_loss_meters
      }
    }
  };

  // Text-to-Speech Siren Voice Dispatcher
  const handlePlayVoiceAlert = () => {
    if ("speechSynthesis" in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${curr.headline}. ${curr.description}. ${curr.instruction}`);
      utterance.lang = selectedLang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyCode = () => {
    const text = activeFormat === "xml" ? capXml : JSON.stringify(capJson, null, 2);
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadCAP = () => {
    const text = activeFormat === "xml" ? capXml : JSON.stringify(capJson, null, 2);
    const blob = new Blob([text], { type: activeFormat === "xml" ? "application/xml" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CAP_alert_${alert.id}_${selectedLang}.${activeFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDispatchOfficialBroadcast = () => {
    setIsDispatched(true);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ef4444", "#f59e0b", "#06b6d4"]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col text-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  OASIS CAP v1.2 Standardized Emergency Alert Studio
                </span>
                <span className="text-[10px] font-mono bg-rose-950 border border-rose-800 text-rose-300 px-2 py-0.5 rounded-full">
                  Multi-Lingual Broadcast
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Common Alerting Protocol (CAP) Broadcast Dispatcher
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Language Selector Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-200">Broadcast Language Selection:</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { code: "en-US", label: "🇺🇸 English (Global)" },
                { code: "it-IT", label: "🇮🇹 Italian (Adriatic)" },
                { code: "es-ES", label: "🇪🇸 Spanish (Iberia)" },
                { code: "fr-FR", label: "🇫🇷 French (EU)" },
                { code: "de-DE", label: "🇩🇪 German (Central)" }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code as any)}
                  className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-all border ${
                    selectedLang === lang.code
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-sm"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Localized Message Preview Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-rose-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-white text-sm">
                  Live Public Alert Rendering ({selectedLang})
                </h3>
              </div>

              {/* TTS Voice Synthesizer Button */}
              <button
                onClick={handlePlayVoiceAlert}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  isPlayingAudio
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop Voice Alert</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Play Voice Alert (TTS)</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <p className="font-bold text-rose-300 text-sm">{curr.headline}</p>
              <p className="text-slate-300 text-xs leading-relaxed">{curr.description}</p>
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-200 text-xs font-medium">
                <strong>Action Instruction:</strong> {curr.instruction}
              </div>
            </div>
          </div>

          {/* CAP Code Output (XML / JSON) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-slate-200">
                  Standardized OASIS CAP Payload
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center gap-1 text-[11px] font-mono">
                  <button
                    onClick={() => setActiveFormat("xml")}
                    className={`px-2.5 py-1 rounded ${activeFormat === "xml" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400"}`}
                  >
                    CAP XML v1.2
                  </button>
                  <button
                    onClick={() => setActiveFormat("json")}
                    className={`px-2.5 py-1 rounded ${activeFormat === "json" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400"}`}
                  >
                    CAP JSON
                  </button>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold"
                >
                  {isCopied ? "Copied!" : "Copy"}
                </button>

                <button
                  onClick={handleDownloadCAP}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300/90 overflow-x-auto max-h-56 leading-relaxed shadow-inner">
              {activeFormat === "xml" ? capXml : JSON.stringify(capJson, null, 2)}
            </pre>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            CAP v1.2 &bull; Compatible with EU-Alert, Wireless Emergency Alerts (WEA), & VHF Channel 16
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Close
            </button>

            <button
              onClick={handleDispatchOfficialBroadcast}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isDispatched ? "Broadcast Transmitted to Network" : "Authorize & Transmit CAP Feed"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
