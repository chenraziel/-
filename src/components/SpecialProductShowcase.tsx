import React, { useState } from "react";
import { 
  Sun, 
  Thermometer, 
  Sparkles, 
  Lightbulb, 
  Zap, 
  Car, 
  Battery, 
  Droplets, 
  Home, 
  Layers,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  ShieldAlert
} from "lucide-react";
import { Language, ProjectType, SolarPanelSpec } from "../types";

interface SpecialProductShowcaseProps {
  surfaceType: ProjectType;
  lang: Language;
  selectedPanel: SolarPanelSpec;
  panelCount: number;
}

export default function SpecialProductShowcase({
  surfaceType,
  lang,
  selectedPanel,
  panelCount
}: SpecialProductShowcaseProps) {
  const [numWindows, setNumWindows] = useState<number>(4);

  if (surfaceType !== "awning" && surfaceType !== "pergolakit") {
    return null;
  }

  const isHe = lang === "he";

  // Calculations for Awning
  const capacityPerWindow = 200; // 200W
  const solarGenPerWindow = 340; // ~340 kWh
  const solarSavingsPerWindow = 212.5; // ~212.5 NIS
  const acSavingsKwhPerWindow = 100; // ~100 kWh
  const acSavingsNisPerWindow = 65; // ~65 NIS

  const totalCapacity = numWindows * capacityPerWindow;
  const totalSolarGen = numWindows * solarGenPerWindow;
  const totalSolarSavings = numWindows * solarSavingsPerWindow;
  const totalAcSavingsKwh = numWindows * acSavingsKwhPerWindow;
  const totalAcSavingsNis = numWindows * acSavingsNisPerWindow;
  
  const overallKwhSaved = totalSolarGen + totalAcSavingsKwh;
  const overallNisSaved = totalSolarSavings + totalAcSavingsNis;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col gap-6" id="special-showcase-section">
      
      {/* HEADER SECTION */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="bg-gradient-to-tr from-amber-500 to-orange-500 p-2 rounded-xl text-white shadow-sm flex items-center justify-center">
          <Sparkles className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block font-mono">
            {isHe ? "מוצר קונספט סולארי פרימיום" : "PREMIUM SOLAR CONCEPT SHOWCASE"}
          </span>
          <h3 className="text-xl font-black text-slate-900 leading-tight">
            {surfaceType === "awning" 
              ? (isHe ? "גגון סולארי חכם מעל חלון – חישוב והחזר השקעה" : "Smart Window Awning – Savings & ROI")
              : (isHe ? "פרגולה סולארית מודולרית מוכנה להרכבה (DIY Kit)" : "Modular DIY Solar Pergola Kit")
            }
          </h3>
        </div>
      </div>

      {/* CASE 1: SOLAR WINDOW AWNING */}
      {surfaceType === "awning" && (
        <div className="space-y-6">
          <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl">
            <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5 justify-start">
              <span>{isHe ? "למה גגון סולארי הוא מוצר מהפכני?" : "Why is a solar window awning so powerful?"}</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHe 
                ? "במקום לקנות גגון פשוט שמגן רק מגשם, הגגון הסולארי של אפולו פאוור עובד בשבילך כל השנה. הוא מעניק ארבעה ערכים יוצאי דופן במוצר יחיד המתאים באופן מושלם לתנאי האקלים בישראל."
                : "Instead of a generic awning that only blocks rain, Apollo's integrated solar canopy works for you 365 days a year. It delivers four premium benefits in a single sleek unit tuned for highly sunny climates."
              }
            </p>
          </div>

          {/* THE 4 VALUES PROPOSITION GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <Droplets className="h-5 w-5 text-blue-500" />,
                titleHe: "1. הגנה מגשם ורוח",
                titleEn: "1. Rain Protection",
                descHe: "הגנה אמינה על החלון והקירות מפני חדירת מים, רטיבות ונזקי גשם בעונת החורף.",
                descEn: "Robust physical shield preventing rain ingress, wall dampness, and moisture damage during stormy winter months."
              },
              {
                icon: <Thermometer className="h-5 w-5 text-rose-500" />,
                titleHe: "2. הצללה והפחתת חום",
                titleEn: "2. Thermal Shading",
                descHe: "הפחתה קריטית של קרינת השמש הישירה בקיץ. החדר מתחמם פחות ועומס העבודה של המזגן יורד משמעותית.",
                descEn: "Blocks harsh direct summer heat before it hits the glass, cooling the room and cutting cooling energy load."
              },
              {
                icon: <Zap className="h-5 w-5 text-amber-500" />,
                titleHe: "3. ייצור חשמל נקי",
                titleEn: "3. Clean Generation",
                descHe: "קליטת קרינת השמש והמרתה לחשמל המזין את מכשירי הבית או נטען ישירות למצברי גיבוי.",
                descEn: "Directly harvests Israel's rich solar radiation, generating electricity to power appliances or charge backup batteries."
              },
              {
                icon: <Sparkles className="h-5 w-5 text-emerald-500" />,
                titleHe: "4. שיפור אסתטי יוקרתי",
                titleEn: "4. Premium Aesthetics",
                descHe: "חזות מבנה מודרנית והייטקיסטית שמחליפה את גגוני הפלסטיק המיושנים במוצר יוקרתי ומעוצב.",
                descEn: "Replaces outdated plastic canopies with sleek, semi-transparent high-tech architectural elements."
              }
            ].map((v, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-2 text-right">
                <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-xs self-end">
                  {v.icon}
                </div>
                <h5 className="text-xs font-black text-slate-800 mt-1">
                  {isHe ? v.titleHe : v.titleEn}
                </h5>
                <p className="text-[11px] text-slate-500 leading-normal">
                  {isHe ? v.descHe : v.descEn}
                </p>
              </div>
            ))}
          </div>

          {/* INTERACTIVE CALCULATOR */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 border border-slate-850 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between relative z-10">
              
              {/* Left Column: Interactive Slider */}
              <div className="w-full lg:max-w-md space-y-4 text-right">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block font-mono">
                    {isHe ? "חשב את פוטנציאל החיסכון הביתי" : "SIMULATE YOUR HOUSEHOLD SAVINGS"}
                  </span>
                  <h4 className="text-base font-black text-white mt-0.5">
                    {isHe ? "כמה חלונות דרומיים / מערביים יש בביתך?" : "How many South/West windows in your home?"}
                  </h4>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="font-mono text-amber-400 text-sm">{numWindows} {isHe ? "חלונות" : "windows"}</span>
                    <span className="text-slate-300">{isHe ? "מספר גגונים סולאריים:" : "Number of solar awnings:"}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={numWindows}
                    onChange={(e) => setNumWindows(parseInt(e.target.value) || 1)}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    id="slider-num-windows"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 space-y-2 text-[11px] text-slate-300">
                  <p className="flex justify-between">
                    <span className="font-mono font-bold text-white">{totalCapacity}W</span>
                    <span>{isHe ? "הספק מותקן כולל:" : "Total Installed Capacity:"}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-mono font-bold text-amber-400">{totalSolarGen} kWh / yr</span>
                    <span>{isHe ? "ייצור חשמל שנתי ישיר:" : "Annual Direct Generation:"}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-mono font-bold text-cyan-400">+{totalAcSavingsKwh} kWh / yr</span>
                    <span>{isHe ? "חיסכון עקיף במזגן (בגלל הצללה):" : "Indirect AC Shading Savings:"}</span>
                  </p>
                </div>
              </div>

              {/* Right Column: Savings Dashboard Badge */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 w-full lg:max-w-xs text-center flex flex-col justify-between h-48">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">
                    {isHe ? "סך החיסכון השנתי המוערך" : "TOTAL ESTIMATED SAVINGS"}
                  </span>
                  <span className="text-3xl font-black font-mono text-emerald-400 block mt-2">
                    ₪{overallNisSaved.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-300 font-mono block mt-1">
                    {isHe ? `חיסכון של ${overallKwhSaved} קוט"ש בשנה!` : `Saves ${overallKwhSaved} kWh annually!`}
                  </span>
                </div>

                <div className="border-t border-white/5 pt-2.5 text-[10px] text-slate-400 leading-normal">
                  {isHe 
                    ? "*מחושב לפי תעריף חשמל ממוצע של 0.62 ₪ לקוט\"ש בישראל וקרינה של 1,700 קוט\"ש לכל kWp בשנה."
                    : "*Based on Israeli average residential tariff of 0.62 NIS/kWh and 1,700 kWh yield per kWp per year."
                  }
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CASE 2: MODULAR DIY SOLAR PERGOLA KIT */}
      {surfaceType === "pergolakit" && (
        <div className="space-y-6">
          <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl">
            <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5 justify-start">
              <span>{isHe ? "מוצר פרימיום מושלם לבתים פרטיים וקיבוצים" : "A premium plug-and-play solution for residential & kibbutz yards"}</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHe 
                ? "במקום לתכנן ולקנות פאנלים סולאריים לחוד וקונסטרוקציה לחוד, הקיט המודולרי של אפולו מציע ערכה שלמה ומושלמת המיוצרת באלומניום עמיד במיוחד וכוללת גג סולארי גמיש מובנה ואטום לחלוטין מים, תאורה מובנית והכנה פנימית חכמה לטעינת רכב חשמלי וסוללת גיבוי."
                : "Instead of buying individual solar panels and booking heavy custom framing projects, Apollo's modular pergola kit comes as a complete prefabricated system. Crafted in strong, rustproof aluminum, it combines a walk-on waterproof solar roof, ambient LED illumination, and internal smart wiring ready for EV chargers and battery storage."
              }
            </p>
          </div>

          {/* BENTO-STYLE PRODUCT BREAKDOWN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Box 1: Structure */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between text-right">
              <div>
                <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-xs self-end mb-3">
                  <Home className="h-5 w-5 text-amber-600" />
                </div>
                <h5 className="text-xs font-black text-slate-800">
                  {isHe ? "שלד אלומיניום מהונדס" : "Engineered Aluminum Frame"}
                </h5>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  {isHe 
                    ? "שלד אלומיניום קל-משקל וחזק במיוחד שאינו מצריך אישורי בנייה מורכבים. מותאם במדויק לעומס הרוחות וקרינת השמש הישראלית."
                    : "Ultra-strong structural aluminum framework requiring no complex structural reinforcement. Built specifically to withstand harsh UV and wind."
                  }
                </p>
              </div>
              <span className="text-[9px] font-mono text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded self-start mt-3">PREFAB</span>
            </div>

            {/* Box 2: Apollo Solar Film Roof */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between text-right">
              <div>
                <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-xs self-end mb-3">
                  <Layers className="h-5 w-5 text-orange-500" />
                </div>
                <h5 className="text-xs font-black text-slate-800">
                  {isHe ? "גג סולארי Apollo מובנה" : "Integrated Apollo Solar Roof"}
                </h5>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  {isHe 
                    ? "גג אטום לחלוטין למים וגשם העשוי מהלוחות הגמישים והמתקדמים של אפולו. דק במיוחד (1.2 מ״מ), עמיד בפני הליכה או פגיעות (Walk-on Safe)."
                    : "100% waterproof roof covering leveraging Apollo's flexible solar films. Only 1.2mm thin, walkable, shatterproof, and durable."
                  }
                </p>
              </div>
              <span className="text-[9px] font-mono text-orange-700 bg-orange-500/10 px-2 py-0.5 rounded self-start mt-3">WALK-ON SAFE</span>
            </div>

            {/* Box 3: Concealed Gutter */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between text-right">
              <div>
                <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-xs self-end mb-3">
                  <Droplets className="h-5 w-5 text-blue-500" />
                </div>
                <h5 className="text-xs font-black text-slate-800">
                  {isHe ? "מרזב ניקוז סמוי מובנה" : "Built-in Concealed Gutter"}
                </h5>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  {isHe 
                    ? "מערכת ניקוז מים מובנית בתוך עמודי הפרגולה לתיעול חכם ואסתטי של מי הגשמים ישירות לגינה ללא צינורות חיצוניים מכוערים."
                    : "Water diversion system concealed within the hollow structural legs, funneling rain cleanly to the ground without external pipes."
                  }
                </p>
              </div>
              <span className="text-[9px] font-mono text-blue-700 bg-blue-500/10 px-2 py-0.5 rounded self-start mt-3">CLEAN WATERWAYS</span>
            </div>

            {/* Box 4: LED Lights */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between text-right">
              <div>
                <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-xs self-end mb-3">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                </div>
                <h5 className="text-xs font-black text-slate-800">
                  {isHe ? "תאורת LED היקפית" : "Built-in LED Lighting"}
                </h5>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  {isHe 
                    ? "פסי תאורת LED מובנים בתוך קורות הצללה המקנים אווירה דקורטיבית, יוקרתית ונעימה לחצר בשעות הערב, ללא חוטים גלויים."
                    : "Sleek, integrated LED strips embedded within the rafters, delivering beautiful ambient twilight lighting with zero visible wires."
                  }
                </p>
              </div>
              <span className="text-[9px] font-mono text-yellow-700 bg-yellow-500/10 px-2 py-0.5 rounded self-start mt-3">AMBIENT LED</span>
            </div>

            {/* Box 5: Storage Ready */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between text-right">
              <div>
                <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-xs self-end mb-3">
                  <Battery className="h-5 w-5 text-emerald-500" />
                </div>
                <h5 className="text-xs font-black text-slate-800">
                  {isHe ? "הכנה למצבר גיבוי ביתי" : "Battery Backup Terminals"}
                </h5>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  {isHe 
                    ? "חיבור מובנה בבסיס העמוד המאפשר הוספה מהירה וקלה של מצבר ליתיום LiFePO4 לגיבוי והפעלה של המכשירים גם בעת הפסקת חשמל."
                    : "Pre-wired terminal blocks in the support legs for plugging in home batteries, enabling critical loads to run during grid outages."
                  }
                </p>
              </div>
              <span className="text-[9px] font-mono text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded self-start mt-3">UPS CAPABLE</span>
            </div>

            {/* Box 6: EV Charging */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between text-right">
              <div>
                <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-xs self-end mb-3">
                  <Car className="h-5 w-5 text-cyan-500" />
                </div>
                <h5 className="text-xs font-black text-slate-800">
                  {isHe ? "הכנה לעמדת טעינת רכב חשמלי" : "EV Charger Integration"}
                </h5>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  {isHe 
                    ? "הכנת צנרת וחיווט ייעודי עבור עמדת טעינת רכב חשמלי. מאפשרת לטעון את הרכב שלך ישירות מהאנרגיה המיוצרת מהפרגולה!"
                    : "Pre-run heavy gauge conduit for EV wallboxes. Charge your electric vehicle directly from the solar pergola above!"
                  }
                </p>
              </div>
              <span className="text-[9px] font-mono text-cyan-700 bg-cyan-500/10 px-2 py-0.5 rounded self-start mt-3">EV READY</span>
            </div>

          </div>

          {/* SUMMARY BANNER */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 text-right">
            <div className="space-y-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                {isHe ? "פתרון קל ומהיר ללא כאבי ראש" : "EASY, ZERO-OUTAGE SETUP"}
              </span>
              <p className="text-xs text-slate-300">
                {isHe 
                  ? "הקיט המודולרי מגיע עם כל הברגים, התושבות ומרכיבי החיבור הנדרשים להרכבה עצמית פשוטה או על ידי מתקין מקומי בתוך יום אחד בלבד."
                  : "The modular kit ships complete with all hardware, adhesive sealants, and plug-play connectors for super-fast same-day setup."
                }
              </p>
            </div>
            <div className="text-xs font-bold text-amber-400 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 shrink-0">
              {isHe ? "ערכת Plug & Play סגורה" : "All-in-One Kit Structure"}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
