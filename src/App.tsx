import React, { useState, useEffect } from "react";
import { 
  Truck, 
  Anchor, 
  Home, 
  Tent, 
  Layers, 
  Languages, 
  Sun, 
  Activity, 
  Sparkles, 
  Cpu, 
  BookOpen, 
  Wrench,
  Info,
  Sliders,
  Maximize2,
  AppWindow,
  Grid
} from "lucide-react";
import { Language, ProjectType, SolarPanelSpec, SavedApplianceUsage } from "./types";
import { PREDEFINED_SURFACES, APOLLO_PANELS, DICTIONARY } from "./data";
import SurfaceVisualizer from "./components/SurfaceVisualizer";
import EnergyCalculator from "./components/EnergyCalculator";
import AIConsultant from "./components/AIConsultant";
import MediaGallery from "./components/MediaGallery";
import SpecialProductShowcase from "./components/SpecialProductShowcase";
import GoogleDriveSync from "./components/GoogleDriveSync";

export default function App() {
  const [lang, setLang] = useState<Language>("he");
  const t = DICTIONARY[lang];

  // Surface and Layout state
  const [surfaceType, setSurfaceType] = useState<ProjectType>("rv");
  const [surfaceWidth, setSurfaceWidth] = useState(2.2); // meters
  const [surfaceLength, setSurfaceLength] = useState(5.5); // meters
  const [selectedPanelId, setSelectedPanelId] = useState("apollo-panda-al1206");
  const [panelCount, setPanelCount] = useState(0);
  const [panels, setPanels] = useState<any[]>([]);

  // Energy Calculation state
  const [appliancesUsage, setAppliancesUsage] = useState<SavedApplianceUsage[]>([]);
  const [location, setLocation] = useState("center");
  const [dailyGeneration, setDailyGeneration] = useState(0);
  const [dailyConsumption, setDailyConsumption] = useState(0);

  const selectedPanel = APOLLO_PANELS.find((p) => p.id === selectedPanelId) || APOLLO_PANELS[0];

  // Sync dimensions when predefined surface type changes
  useEffect(() => {
    const predefined = PREDEFINED_SURFACES.find((s) => s.id === surfaceType);
    if (predefined) {
      setSurfaceWidth(predefined.defaultWidth);
      setSurfaceLength(predefined.defaultLength);
      // Clear panels when changing geometry to prevent floating panels
      setPanels([]);
    }
  }, [surfaceType]);

  // Load a default appliance list for the chosen project type on startup
  useEffect(() => {
    if (surfaceType === "rv") {
      setAppliancesUsage([
        { applianceId: "fridge", quantity: 1, hoursPerDay: 12 },
        { applianceId: "led-lights", quantity: 1, hoursPerDay: 5 },
        { applianceId: "laptop", quantity: 1, hoursPerDay: 4 },
        { applianceId: "phone", quantity: 2, hoursPerDay: 3 }
      ]);
    } else if (surfaceType === "marine") {
      setAppliancesUsage([
        { applianceId: "fridge", quantity: 1, hoursPerDay: 15 },
        { applianceId: "led-lights", quantity: 1, hoursPerDay: 6 },
        { applianceId: "wifi-router", quantity: 1, hoursPerDay: 8 },
        { applianceId: "water-pump", quantity: 1, hoursPerDay: 0.5 }
      ]);
    } else if (surfaceType === "camping") {
      setAppliancesUsage([
        { applianceId: "led-lights", quantity: 1, hoursPerDay: 4 },
        { applianceId: "phone", quantity: 2, hoursPerDay: 2 },
        { applianceId: "vent-fan", quantity: 1, hoursPerDay: 6 }
      ]);
    } else if (surfaceType === "awning") {
      setAppliancesUsage([
        { applianceId: "led-lights", quantity: 2, hoursPerDay: 6 },
        { applianceId: "laptop", quantity: 1, hoursPerDay: 5 }
      ]);
    } else if (surfaceType === "pergolakit") {
      setAppliancesUsage([
        { applianceId: "led-lights", quantity: 4, hoursPerDay: 6 },
        { applianceId: "laptop", quantity: 2, hoursPerDay: 4 },
        { applianceId: "phone", quantity: 3, hoursPerDay: 3 },
        { applianceId: "wifi-router", quantity: 1, hoursPerDay: 10 }
      ]);
    } else {
      setAppliancesUsage([
        { applianceId: "laptop", quantity: 1, hoursPerDay: 5 },
        { applianceId: "phone", quantity: 1, hoursPerDay: 3 }
      ]);
    }
  }, [surfaceType]);

  const renderSurfaceIcon = (iconName: string) => {
    const props = { className: "h-5 w-5" };
    switch (iconName) {
      case "Truck": return <Truck {...props} />;
      case "Anchor": return <Anchor {...props} />;
      case "Home": return <Home {...props} />;
      case "Tent": return <Tent {...props} />;
      case "Layers": return <Layers {...props} />;
      case "AppWindow": return <AppWindow {...props} />;
      case "Grid": return <Grid {...props} />;
      default: return <Sliders {...props} />;
    }
  };

  // State bundle for Google Drive synchronization
  const currentProjectState = {
    surfaceType,
    surfaceWidth,
    surfaceLength,
    selectedPanelId,
    panelCount,
    panels,
    appliancesUsage,
    location,
    dailyGeneration,
    dailyConsumption
  };

  // Load project configuration from Google Drive
  const handleLoadProject = (loadedData: any) => {
    if (loadedData.surfaceType) setSurfaceType(loadedData.surfaceType);
    if (loadedData.surfaceWidth !== undefined) setSurfaceWidth(loadedData.surfaceWidth);
    if (loadedData.surfaceLength !== undefined) setSurfaceLength(loadedData.surfaceLength);
    if (loadedData.selectedPanelId) setSelectedPanelId(loadedData.selectedPanelId);
    if (loadedData.panelCount !== undefined) setPanelCount(loadedData.panelCount);
    if (loadedData.panels) setPanels(loadedData.panels);
    if (loadedData.appliancesUsage) setAppliancesUsage(loadedData.appliancesUsage);
    if (loadedData.location) setLocation(loadedData.location);
    if (loadedData.dailyGeneration !== undefined) setDailyGeneration(loadedData.dailyGeneration);
    if (loadedData.dailyConsumption !== undefined) setDailyConsumption(loadedData.dailyConsumption);
  };

  return (
    <div 
      className={`min-h-screen bg-slate-50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] flex flex-col antialiased selection:bg-amber-100 selection:text-amber-900 pb-12`}
      dir={lang === "he" ? "rtl" : "ltr"}
    >
      {/* Dynamic Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-amber-500 to-orange-500 p-2.5 rounded-xl text-white shadow-md shadow-orange-500/10 flex items-center justify-center">
              <Sun className="h-5 w-5 animate-spin-slow" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-orange-600 block uppercase font-display">
                APOLLO POWER TECHNOLOGY
              </span>
              <h1 className="text-lg font-black text-slate-900 leading-none mt-0.5">
                {lang === "he" ? "Apollo Solar Studio" : "Apollo Solar Studio"}
              </h1>
            </div>
          </div>

          <button
            onClick={() => setLang(lang === "he" ? "en" : "he")}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all duration-150"
            id="language-toggle-nav"
          >
            <Languages className="h-4 w-4 text-orange-500" />
            <span>{t.switchLanguage}</span>
          </button>
        </div>
      </nav>

      {/* Hero Welcome Banner */}
      <header className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white py-12 px-6 text-center relative overflow-hidden">
        {/* Dynamic solar flare overlay effect */}
        <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-transparent opacity-60"></div>

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/25 rounded-full text-xs font-semibold tracking-wide text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>{lang === "he" ? "טכנולוגיית סולאר גמיש מהפכנית" : "Revolutionary Solar Film Tech"}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
            {t.title}
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </header>

      {/* Flagship Datasheet Showcase for Apollo Panda AL1206 */}
      <section className="max-w-7xl mx-auto px-6 mt-8 w-full" id="apollo-panda-specs-section">
        <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 md:p-8 shadow-xl relative overflow-hidden">
          {/* Subtle grid pattern background to resemble the solar cells */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:30px_30px]"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center justify-between">
            {/* Left side: Key highlights */}
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-400">
                <Cpu className="h-3.5 w-3.5" />
                <span>{lang === "he" ? "סדרת הדגל - Panda Series" : "Flagship Series - Panda Series"}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black font-display text-white">
                Apollo Panda AL1206 (300W - 310W)
              </h3>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                {lang === "he"
                  ? "הפאנל הסולארי הגמיש החזק והעמיד ביותר בעולם, המיועד להתקנה קלה ומהירה על גבי משטחים מקומרים, רכבים וסיפוני יאכטות בעלי מגבלת משקל או ללא אפשרות לקדיחה."
                  : "The most durable, high-yield, ultra-lightweight flexible solar module in the world, specifically designed to fit lightweight structures, curved surfaces, and marine decks."
                }
              </p>

              {/* 3 Core Benefits Icons */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
                  <span className="text-lg md:text-2xl font-black text-amber-400 block">↓ 80%</span>
                  <span className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-wider block mt-1">
                    {lang === "he" ? "הפחתת משקל כולל" : "Weight Reduced"}
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
                  <span className="text-lg md:text-2xl font-black text-amber-400 block">↓ 50%</span>
                  <span className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-wider block mt-1">
                    {lang === "he" ? "חיסכון בעלויות עבודה" : "Labor Cost Savings"}
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
                  <span className="text-lg md:text-2xl font-black text-amber-400 block">17.5%</span>
                  <span className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-wider block mt-1">
                    {lang === "he" ? "נצילות תאים גבוהה" : "Cell Efficiency"}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle side: 2D Schematic Preview & Cell Structure (Interactive SVG) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 w-full lg:w-72 flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider mb-2">
                {lang === "he" ? "תרשים פריסת תאים (6x12)" : "72-Cell Schema Layout (6x12)"}
              </span>
              <div className="relative w-44 aspect-[1/2] border border-slate-700 bg-slate-900 rounded-md p-1.5 flex flex-col justify-between">
                {/* 6x12 cell matrix simulation */}
                <div className="grid grid-cols-6 grid-rows-12 gap-0.5 h-full w-full">
                  {Array.from({ length: 72 }).map((_, idx) => (
                    <div key={idx} className="bg-slate-950 border-[0.5px] border-slate-800 rounded-sm hover:bg-amber-500/20 transition-colors"></div>
                  ))}
                </div>
                {/* Junction Box indicator */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-3 bg-slate-800 border border-slate-600 rounded-sm flex items-center justify-center">
                  <span className="text-[5px] text-slate-300 font-mono">IP68</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">
                2020mm x 1005mm x 2.2mm
              </span>
            </div>

            {/* Right side: Detailed Specs Grid */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full lg:max-w-xs space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 border-b border-white/10 pb-1.5">
                {lang === "he" ? "מפרט טכני מלא - AL1206" : "Technical Specifications - AL1206"}
              </h4>
              <div className="space-y-1.5 text-xs">
                {[
                  { labelHe: "הספק מקסימלי", labelEn: "Max Power (Pmax)", val: "300W ±5%" },
                  { labelHe: "מתח בנקודת הספק", labelEn: "Max Voltage (Vmp)", val: "38.0V" },
                  { labelHe: "זרם בנקודת הספק", labelEn: "Max Current (Imp)", val: "7.88A" },
                  { labelHe: "מתח מעגל פתוח", labelEn: "Open Circuit (Voc)", val: "47.5V" },
                  { labelHe: "זרם קצר", labelEn: "Short Circuit (Isc)", val: "8.6A" },
                  { labelHe: "משקל כולל", labelEn: "Total Weight", val: "5.8 Kg (2.9 Kg/m²)" },
                  { labelHe: "עמידות עומס סטטי", labelEn: "Static Load Certification", val: "2400 Pa" },
                  { labelHe: "קופסת חיבורים", labelEn: "Junction Box", val: "Front Side, IP68" }
                ].map((spec, i) => (
                  <div key={i} className="flex justify-between border-b border-white/5 pb-1 last:border-0">
                    <span className="text-slate-400 text-[11px]">
                      {lang === "he" ? spec.labelHe : spec.labelEn}
                    </span>
                    <span className="font-mono text-white font-bold text-[11px]">
                      {spec.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media & Projects Inspiration Gallery */}
      <section className="max-w-7xl mx-auto px-6 mt-8 w-full">
        <MediaGallery lang={lang} t={t} totalPower={panelCount * selectedPanel.power} />
      </section>

      {/* Main Grid Workspace */}
      <main className="max-w-7xl mx-auto px-6 mt-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Hand: Planning Setup & Configuration (Lg: col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Cloud Sync dashboard section */}
          <section>
            <GoogleDriveSync
              lang={lang}
              t={t}
              currentProjectState={currentProjectState}
              onLoadProject={handleLoadProject}
            />
          </section>

          {/* Section 1: Surface Selector */}
          <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col gap-6" id="surface-selector-section">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-amber-500/10 text-amber-600 font-bold font-mono text-sm flex items-center justify-center">1</span>
                {t.selectSurfaceTitle}
              </h3>
            </div>

            {/* Custom Interactive Surface Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3" id="surface-grid-picker">
              {PREDEFINED_SURFACES.map((surf) => {
                const isSelected = surfaceType === surf.id;
                return (
                  <button
                    key={surf.id}
                    onClick={() => setSurfaceType(surf.id)}
                    className={`flex flex-col items-center justify-between p-4 rounded-xl border-2 text-center transition-all ${
                      isSelected
                        ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10 scale-102"
                        : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100/70 hover:border-slate-200"
                    }`}
                    id={`btn-surface-${surf.id}`}
                  >
                    <div className={`p-3 rounded-lg mb-3 ${isSelected ? "bg-white/15 text-amber-400" : "bg-white text-slate-600 shadow-xs"}`}>
                      {renderSurfaceIcon(surf.icon)}
                    </div>
                    <span className="text-xs font-black tracking-tight leading-snug">
                      {lang === "he" ? surf.nameHe : surf.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Surface details description box */}
            {(() => {
              const currentSurf = PREDEFINED_SURFACES.find((s) => s.id === surfaceType);
              if (!currentSurf) return null;
              return (
                <div className={`p-4 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed flex items-start gap-3 bg-gradient-to-br ${currentSurf.bgGradient}`}>
                  <Info className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p>{lang === "he" ? currentSurf.descriptionHe : currentSurf.descriptionEn}</p>
                </div>
              );
            })()}

            {/* Geometry Customizer Sliders */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
                {t.customizeDimensions}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Length slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{t.length}</span>
                    <span className="font-mono text-amber-600">{surfaceLength} {lang === "he" ? "מטר" : "meters"}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.1"
                    value={surfaceLength}
                    onChange={(e) => {
                      setSurfaceLength(parseFloat(e.target.value));
                      setPanels([]); // clear panels to avoid overlapping
                    }}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    id="slider-surface-length"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>1m</span>
                    <span>15m</span>
                  </div>
                </div>

                {/* Width slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{t.width}</span>
                    <span className="font-mono text-amber-600">{surfaceWidth} {lang === "he" ? "מטר" : "meters"}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.1"
                    value={surfaceWidth}
                    onChange={(e) => {
                      setSurfaceWidth(parseFloat(e.target.value));
                      setPanels([]);
                    }}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    id="slider-surface-width"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0.5m</span>
                    <span>5m</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Panel Specification Selector */}
          <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col gap-4" id="panel-selector-section">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-amber-500/10 text-amber-600 font-bold font-mono text-sm flex items-center justify-center">2</span>
                {t.solarPanelSelection}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {APOLLO_PANELS.map((p) => {
                const isSelected = selectedPanelId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPanelId(p.id);
                      setPanels([]); // clear to avoid geometry mismatches
                    }}
                    className={`p-4 rounded-xl border-2 text-right transition-all flex flex-col justify-between h-[120px] ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/5"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                    id={`btn-panel-spec-${p.id}`}
                  >
                    <div>
                      <span className="text-xs font-black text-slate-950 block">
                        {lang === "he" ? p.nameHe : p.nameEn}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {t.panelSpecText
                          .replace("{power}", p.power.toString())
                          .replace("{width}", p.width.toString())
                          .replace("{length}", p.length.toString())
                          .replace("{weight}", p.weight.toString())
                        }
                      </span>
                    </div>

                    <div className="flex justify-between items-center w-full border-t border-slate-100 pt-2 mt-2">
                      <span className="text-[10px] font-bold text-amber-600">
                        {p.efficiency}% {lang === "he" ? "נצילות" : "Eff."}
                      </span>
                      <span className="text-xs font-black text-emerald-600">
                        ₪{p.priceEstimate.toLocaleString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Special Custom Product Showcase for Window Awning and Pergola Kit */}
          <SpecialProductShowcase
            surfaceType={surfaceType}
            lang={lang}
            selectedPanel={selectedPanel}
            panelCount={panelCount}
          />

          {/* Section 3: Interactive Placement Visualizer Layout */}
          <section>
            <SurfaceVisualizer
              lang={lang}
              t={t}
              surfaceType={surfaceType}
              surfaceWidth={surfaceWidth}
              surfaceLength={surfaceLength}
              selectedPanel={selectedPanel}
              panelCount={panelCount}
              setPanelCount={setPanelCount}
              panels={panels}
              setPanels={setPanels}
            />
          </section>

          {/* Section 4: Daily Energy Calculator */}
          <section>
            <EnergyCalculator
              lang={lang}
              t={t}
              totalPower={panelCount * selectedPanel.power}
              appliancesUsage={appliancesUsage}
              setAppliancesUsage={setAppliancesUsage}
              location={location}
              setLocation={setLocation}
              dailyGeneration={dailyGeneration}
              setDailyGeneration={setDailyGeneration}
              dailyConsumption={dailyConsumption}
              setDailyConsumption={setDailyConsumption}
            />
          </section>

          {/* Section 5: Apollo Media Gallery & Veo 3 AI Generation */}
          <section>
            <MediaGallery
              lang={lang}
              t={t}
              totalPower={panelCount * selectedPanel.power}
            />
          </section>

        </div>

        {/* Right Hand: AI Expert Consultant Panel (Lg: col-span-4 sticky) */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-[90px] h-[fit-content]">
          <AIConsultant
            lang={lang}
            t={t}
            location={location}
            totalPower={panelCount * selectedPanel.power}
          />

          {/* Side Info Box: Quick Contact and Specs */}
          <div className="bg-slate-950 text-slate-300 rounded-2xl p-5 border border-slate-800 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 font-display">
              {lang === "he" ? "אודות אפולו פאוור" : "About Apollo Power"}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              {lang === "he"
                ? "אפולו פאוור (Apollo Power) היא מובילה עולמית בפיתוח טכנולוגיית סולאר גמיש חלוצית. הלוחות פותחו ומיוצרים בישראל, ומאפשרים להפוך כל משטח - כבישים, כלי רכב, סירות וגגות בעלי כושר נשיאה נמוך - למקור אנרגיה נקי ויציב."
                : "Apollo Power Ltd. is a global pioneer in flexible solar thin-film technology. Engineered and produced in Israel, their innovative films transform any surface—be it vehicles, marine decks, or low-load roofs—into an active clean energy producer."
              }
            </p>
            <a
              href="https://apollo-power.com/company/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
              id="anchor-apollo-official"
            >
              <span>{lang === "he" ? "עבור לאתר הרשמי" : "Visit Official Website"}</span>
              <span className={lang === "he" ? "mr-1 rotate-180" : "ml-1"}>→</span>
            </a>
          </div>
        </div>

      </main>

      {/* Footer credits and back to top */}
      <footer className="max-w-7xl mx-auto px-6 mt-16 text-center text-slate-400 text-xs border-t border-slate-200/50 pt-8 w-full flex flex-col md:flex-row justify-between items-center gap-4">
        <span>
          © {new Date().getFullYear()} Apollo DIY Solar Project Builder. {lang === "he" ? "השראה וטכנולוגיה סולארית גמישה." : "Inspired by Apollo Power's solar film."}
        </span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
          id="btn-scroll-top"
        >
          {t.backToTop}
        </button>
      </footer>
    </div>
  );
}
