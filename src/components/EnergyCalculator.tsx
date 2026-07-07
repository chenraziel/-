import React, { useState, useEffect } from "react";
import { 
  Trash2, 
  Plus, 
  MapPin, 
  Info, 
  Check, 
  AlertTriangle,
  Lightbulb,
  Refrigerator,
  Laptop,
  Smartphone,
  Tv,
  Wifi,
  Coffee,
  BatteryCharging,
  ZapOff
} from "lucide-react";
import { Language, Appliance, SavedApplianceUsage } from "../types";
import { COMMON_APPLIANCES, SUN_HOURS_BY_CITYHe, SUN_HOURS_BY_CITYEn } from "../data";

interface EnergyCalculatorProps {
  lang: Language;
  t: any;
  totalPower: number; // Watts
  appliancesUsage: SavedApplianceUsage[];
  setAppliancesUsage: React.Dispatch<React.SetStateAction<SavedApplianceUsage[]>>;
  location: string;
  setLocation: (loc: string) => void;
  dailyGeneration: number;
  setDailyGeneration: (val: number) => void;
  dailyConsumption: number;
  setDailyConsumption: (val: number) => void;
}

export default function EnergyCalculator({
  lang,
  t,
  totalPower,
  appliancesUsage,
  setAppliancesUsage,
  location,
  setLocation,
  dailyGeneration,
  setDailyGeneration,
  dailyConsumption,
  setDailyConsumption
}: EnergyCalculatorProps) {
  const [selectedCityHours, setSelectedCityHours] = useState(5.8); // Default center

  const citiesDict = lang === "he" ? SUN_HOURS_BY_CITYHe : SUN_HOURS_BY_CITYEn;

  // Track daily solar energy generation
  useEffect(() => {
    // Math: Installed Power * Sun Hours * 0.8 (losses like dust, angle, cable resistivity, MPPT conversion)
    const efficiencyFactor = 0.82;
    const generatedWh = totalPower * selectedCityHours * efficiencyFactor;
    setDailyGeneration(Math.round(generatedWh));
  }, [totalPower, selectedCityHours, setDailyGeneration]);

  // Track daily consumption
  useEffect(() => {
    const totalWh = appliancesUsage.reduce((sum, item) => {
      const appliance = COMMON_APPLIANCES.find((a) => a.id === item.applianceId);
      if (appliance) {
        return sum + (appliance.power * item.quantity * item.hoursPerDay);
      }
      return sum;
    }, 0);
    setDailyConsumption(Math.round(totalWh));
  }, [appliancesUsage, setDailyConsumption]);

  // Change city
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityKey = e.target.value;
    setLocation(cityKey);
    const hours = citiesDict[cityKey]?.hours || 5.8;
    setSelectedCityHours(hours);
  };

  // Add an appliance to the list
  const addAppliance = (applianceId: string) => {
    const alreadyExists = appliancesUsage.find((a) => a.applianceId === applianceId);
    if (alreadyExists) {
      // Just increase quantity
      setAppliancesUsage((prev) =>
        prev.map((a) => (a.applianceId === applianceId ? { ...a, quantity: a.quantity + 1 } : a))
      );
    } else {
      const original = COMMON_APPLIANCES.find((a) => a.id === applianceId);
      if (original) {
        setAppliancesUsage((prev) => [
          ...prev,
          {
            applianceId,
            quantity: 1,
            hoursPerDay: original.defaultHours
          }
        ]);
      }
    }
  };

  // Remove an appliance from the list
  const removeAppliance = (applianceId: string) => {
    setAppliancesUsage((prev) => prev.filter((a) => a.applianceId !== applianceId));
  };

  // Update hours per day for a specific item
  const updateHours = (applianceId: string, hours: number) => {
    setAppliancesUsage((prev) =>
      prev.map((a) => (a.applianceId === applianceId ? { ...a, hoursPerDay: Math.max(0.1, Math.min(hours, 24)) } : a))
    );
  };

  // Update quantity for a specific item
  const updateQuantity = (applianceId: string, q: number) => {
    setAppliancesUsage((prev) =>
      prev.map((a) => (a.applianceId === applianceId ? { ...a, quantity: Math.max(1, q) } : a))
    );
  };

  // Get matching icon for appliance
  const renderApplianceIcon = (iconName: string) => {
    const props = { className: "h-5 w-5 text-slate-500" };
    switch (iconName) {
      case "Refrigerator": return <Refrigerator {...props} />;
      case "Lightbulb": return <Lightbulb {...props} />;
      case "Laptop": return <Laptop {...props} />;
      case "Smartphone": return <Smartphone {...props} />;
      case "Tv": return <Tv {...props} />;
      case "Wifi": return <Wifi {...props} />;
      case "Coffee": return <Coffee {...props} />;
      default: return <Lightbulb {...props} />;
    }
  };

  const netBalance = dailyGeneration - dailyConsumption;
  const balancePercentage = dailyConsumption > 0 
    ? Math.round((dailyGeneration / dailyConsumption) * 100) 
    : 100;

  // Sizing standard off-grid accessories based on layout
  const recommendedBatteryAh = Math.round(Math.max(100, dailyConsumption / 12 / 0.8)); // 12V Battery estimation, 80% DoD Lithium
  const recommendedMpptA = Math.round(Math.max(15, (totalPower / 12) * 1.2)); // Sizing 12V MPPT with a 20% safety margin

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col gap-6" id="energy-calculator-section">
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {t.appliancesCalcTitle}
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          {lang === "he"
            ? "חשב את ההספקים של מכשירי החשמל שיופעלו על ידי מצברי המערכת והשווה לייצור הסולארי"
            : "Estimate the power consumption of devices running on your battery bank and compare it with solar yield."
          }
        </p>
      </div>

      {/* Grid: Left side Add items & list, Right side calculations map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Appliances Setup Area */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Quick Add Grid */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              {lang === "he" ? "לחץ להוספת מכשיר למערכת:" : "Click to add an appliance to your kit:"}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMMON_APPLIANCES.map((app) => (
                <button
                  key={app.id}
                  onClick={() => addAppliance(app.id)}
                  className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-300 rounded-xl text-left transition-all text-xs font-semibold text-slate-700"
                  id={`btn-add-appliance-${app.id}`}
                >
                  {renderApplianceIcon(app.icon)}
                  <span className="truncate">{lang === "he" ? app.nameHe : app.nameEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Appliances List */}
          <div className="border border-slate-100 rounded-xl overflow-hidden mt-2">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <span className="col-span-5">{t.appliances}</span>
              <span className="col-span-2 text-center">{t.power}</span>
              <span className="col-span-2 text-center">{t.quantity}</span>
              <span className="col-span-2 text-center">{t.hours}</span>
              <span className="col-span-1"></span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[280px] overflow-y-auto" id="appliances-list">
              {appliancesUsage.map((item) => {
                const app = COMMON_APPLIANCES.find((a) => a.id === item.applianceId);
                if (!app) return null;

                return (
                  <div key={item.applianceId} className="px-4 py-3 grid grid-cols-12 gap-2 items-center hover:bg-slate-50/50 transition-colors">
                    {/* Name */}
                    <div className="col-span-5 flex items-center gap-2">
                      {renderApplianceIcon(app.icon)}
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {lang === "he" ? app.nameHe : app.nameEn}
                      </span>
                    </div>

                    {/* Watts */}
                    <div className="col-span-2 text-center text-xs font-mono font-semibold text-slate-500">
                      {app.power}W
                    </div>

                    {/* Quantity Selector */}
                    <div className="col-span-2 flex justify-center">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.applianceId, parseInt(e.target.value) || 1)}
                        className="w-12 text-center border border-slate-200 rounded-md py-0.5 text-xs font-mono font-bold"
                        id={`input-qty-${item.applianceId}`}
                      />
                    </div>

                    {/* Hours Slider */}
                    <div className="col-span-2 flex flex-col items-center">
                      <input
                        type="number"
                        min="0.1"
                        max="24"
                        step="0.5"
                        value={item.hoursPerDay}
                        onChange={(e) => updateHours(item.applianceId, parseFloat(e.target.value) || 1)}
                        className="w-12 text-center border border-slate-200 rounded-md py-0.5 text-xs font-mono font-bold mb-1"
                        id={`input-hours-${item.applianceId}`}
                      />
                    </div>

                    {/* Delete Item */}
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => removeAppliance(item.applianceId)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        id={`btn-remove-appliance-${item.applianceId}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {appliancesUsage.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs font-medium">
                  {lang === "he" ? "לא נוספו מכשירי חשמל. הוסף מכשיר מהרשימה למעלה כדי להתחיל!" : "No appliances added. Click an appliance above to start calculating!"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Energy Yield & Summary Analysis */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col gap-4">
          {/* Location Picker */}
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5 mb-1.5">
              <MapPin className="h-4 w-4 text-amber-500" />
              {t.locationSelect}
            </label>
            <select
              value={location}
              onChange={handleCityChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 shadow-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-hidden transition-all"
              id="select-solar-location"
            >
              {Object.entries(citiesDict).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>

          {/* Daily Generation vs Daily Consumption */}
          <div className="space-y-4 border-t border-b border-slate-200/50 py-4 my-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">{t.dailyConsumption}</span>
              <span className="text-sm font-bold font-mono text-slate-900">{dailyConsumption} Wh</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">{t.dailyGeneration}</span>
              <span className="text-sm font-bold font-mono text-amber-600 flex items-center gap-1">
                <BatteryCharging className="h-4 w-4 animate-bounce" />
                {dailyGeneration} Wh
              </span>
            </div>

            {/* Visual Balance Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-500">{t.balance}</span>
                <span className={netBalance >= 0 ? "text-emerald-500" : "text-rose-500"}>
                  {netBalance >= 0 ? "+" : ""}{netBalance} Wh ({balancePercentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${netBalance >= 0 ? "bg-emerald-500" : "bg-rose-500"}`}
                  style={{ width: `${Math.min(100, balancePercentage)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Dynamic Suggestion Card */}
          <div className={`p-4 rounded-xl border flex gap-3 ${
            netBalance >= 0 
              ? "bg-emerald-50/50 border-emerald-100 text-emerald-800" 
              : "bg-rose-50/50 border-rose-100 text-rose-800"
          }`} id="solar-recommendation-box">
            {netBalance >= 0 ? (
              <>
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold block">{t.surplus}</span>
                  <p className="opacity-90 leading-relaxed">
                    {lang === "he"
                      ? `ייצור האנרגיה הסולארית שלך עולה על הצריכה. המערכת תהיה יציבה ועצמאית לחלוטין!`
                      : `Solar energy production is high enough to cover your consumption. Your batteries will stay happily topped up!`
                    }
                  </p>
                </div>
              </>
            ) : (
              <>
                <ZapOff className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold block">{t.deficit}</span>
                  <p className="opacity-90 leading-relaxed">
                    {lang === "he"
                      ? `ייצור האנרגיה הנוכחי אינו מספיק. נסה להוסיף עוד פאנל גמיש על המשטח או לצמצם שימוש במכשירים זוללי זרם.`
                      : `You are consuming more power than you generate. We highly recommend adding another flexible panel or using fewer appliances.`
                    }
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Sizing recommendations */}
          <div className="mt-2 bg-white rounded-xl p-3 border border-slate-100 space-y-2 text-[11px]">
            <span className="font-bold text-slate-400 block uppercase tracking-wider">
              {lang === "he" ? "המלצת ציוד היקפי למערכת:" : "Recommended Peripheral Specs:"}
            </span>
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1">
                <Info className="h-3 w-3 text-slate-400" />
                {lang === "he" ? "קיבולת מצבר מומלצת (LiFePO4)" : "Lithium Battery Bank (LiFePO4)"}
              </span>
              <span className="font-mono font-bold text-slate-800">
                {recommendedBatteryAh} Ah (12.8V)
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1">
                <Info className="h-3 w-3 text-slate-400" />
                {lang === "he" ? "בקר טעינה מתאים (MPPT)" : "MPPT Solar Charge Controller"}
              </span>
              <span className="font-mono font-bold text-slate-800">
                {recommendedMpptA} A / 12V-24V
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
