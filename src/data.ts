import { PredefinedSurface, SolarPanelSpec, Appliance } from "./types";

export const PREDEFINED_SURFACES: PredefinedSurface[] = [
  {
    id: "rv",
    nameHe: "קרוואן / רכב מסחרי",
    nameEn: "Campervan / RV Roof",
    defaultWidth: 2.2,
    defaultLength: 5.5,
    maxWidth: 3.0,
    maxLength: 12.0,
    icon: "Truck",
    bgGradient: "from-amber-500/10 to-orange-500/10",
    descriptionHe: "שטח גג ישר או מקומר קלות. הלוחות הגמישים נדבקים ישירות לגג, מונעים רעשי רוח ואינם מוסיפים משקל או גובה הפוגעים באווירודינמיקה.",
    descriptionEn: "Flat or slightly curved roof. Flexible panels bond directly to the roof, eliminating wind noise, drag, and heavy mounting hardware."
  },
  {
    id: "marine",
    nameHe: "סירה / יאכטה / מפרשית",
    nameEn: "Sailboat / Yacht / Marine",
    defaultWidth: 2.5,
    defaultLength: 4.5,
    maxWidth: 4.5,
    maxLength: 15.0,
    icon: "Anchor",
    bgGradient: "from-blue-500/10 to-teal-500/10",
    descriptionHe: "סיפון סירה או בימיני (צילון). לוחות אפולו עמידים למים מלוחים וניתן לדרוך עליהם בבטחה, מה שהופך אותם לאידיאליים לחללים ימיים צפופים.",
    descriptionEn: "Deck, cabin top, or bimini. Apollo panels are highly salt-water resistant and 100% walk-on safe, making them perfect for marine decks."
  },
  {
    id: "roof",
    nameHe: "גג מעוגל / פרגולה / מחסן",
    nameEn: "Curved Roof / Pergola / Shed",
    defaultWidth: 3.0,
    defaultLength: 6.0,
    maxWidth: 15.0,
    maxLength: 30.0,
    icon: "Home",
    bgGradient: "from-emerald-500/10 to-teal-500/10",
    descriptionHe: "אידיאלי להתקנה עצמית קלה על פרגולות, מחסני גינה ופתרונות Balkonkraftwerk (סגנון גרמני). הפאנל הגמיש של אפולו מודבק ישירות ללא קונסטרוקציה כבדה שעלולה לעקם או לסכן את עמודי העץ.",
    descriptionEn: "Perfect for fast, lightweight DIY pergola & garden carport setups inspired by the German 'Balkonkraftwerk' trend. Requires no heavy structural racking or complex building permits."
  },
  {
    id: "camping",
    nameHe: "שטח / אוהל קמפינג / משטח נייד",
    nameEn: "Outdoor / Expedition Tent / Mat",
    defaultWidth: 1.8,
    defaultLength: 2.4,
    maxWidth: 5.0,
    maxLength: 10.0,
    icon: "Tent",
    bgGradient: "from-lime-500/10 to-emerald-500/10",
    descriptionHe: "פריסה על גבי אוהל משלחת או כמשטח מתקפל נייד. פתרון סולארי קל-משקל שניתן לגלגל ולארוז במהירות ללא חשש משבר זכוכית.",
    descriptionEn: "Draped over expedition tents or rolled out on the ground. A lightweight, ultra-portable solar setup that packs away easily with zero glass break risk."
  },
  {
    id: "balcony",
    nameHe: "מרפסת / מעקה ביתי",
    nameEn: "Balcony Railing / Apartment DIY",
    defaultWidth: 1.0,
    defaultLength: 3.0,
    maxWidth: 2.0,
    maxLength: 10.0,
    icon: "Layers",
    bgGradient: "from-indigo-500/10 to-purple-500/10",
    descriptionHe: "תלייה או הדבקה על מעקה המרפסת בבית משותף. פתרון אסתטי, דק וקל שאינו בולט החוצה וקל מאוד להתקנה עצמית מהירה.",
    descriptionEn: "Hanging or adhered to apartment railings. A sleek, flush-fit solar solution that doesn't protrude, enabling fast DIY urban power generation."
  },
  {
    id: "awning",
    nameHe: "גגון סולארי מעל חלון",
    nameEn: "Solar Window Awning",
    defaultWidth: 0.8,
    defaultLength: 1.5,
    maxWidth: 1.2,
    maxLength: 3.0,
    icon: "AppWindow",
    bgGradient: "from-sky-500/10 to-blue-500/10",
    descriptionHe: "גגון חכם המקנה הגנה מגשם, הצללה שמפחיתה את חום החדר ומורידה את עומס המזגן (חיסכון של 50-150 קוט\"ש נוספים בשנה!), ייצור חשמל ישיר של כ-320-360 קוט\"ש ושיפור אסתטי יוקרתי של המבנה.",
    descriptionEn: "Smart solar window canopy: rain protection, solar shading that reduces room temperature and AC workload (saving 50-150 kWh/yr in cooling!), direct electricity yield (~320-360 kWh/yr), and a premium exterior design."
  },
  {
    id: "pergolakit",
    nameHe: "פרגולת קיט מודולרית",
    nameEn: "Modular Pergola Kit",
    defaultWidth: 3.0,
    defaultLength: 4.0,
    maxWidth: 6.0,
    maxLength: 10.0,
    icon: "Grid",
    bgGradient: "from-rose-500/10 to-amber-500/10",
    descriptionHe: "ערכת פרגולה שלמה מוכנה להרכבה עצמית מהירה. כוללת שלד אלומיניום חזק, גג סולארי גמיש מובנה מבית אפולו פאוור, מרזב ניקוז מובנה, תאורת LED דקורטיבית והכנה מובנית למצבר גיבוי או עמדת טעינה לרכב חשמלי.",
    descriptionEn: "Complete modular DIY solar pergola kit. Features a high-strength aluminum frame, integrated Apollo flexible solar roof, built-in water drainage gutters, ambient LED lights, and pre-wired battery/EV charging ready ports."
  }
];

export const APOLLO_PANELS: SolarPanelSpec[] = [
  {
    id: "apollo-panda-al1206",
    nameHe: "Apollo Panda AL1206 (300W)",
    nameEn: "Apollo Panda AL1206 (300W)",
    power: 300,
    width: 1.005, // 1005 mm from datasheet
    length: 2.02, // 2020 mm from datasheet
    weight: 5.8, // 5.8 kg from datasheet
    efficiency: 17.5, // 17.5% cell efficiency from datasheet
    priceEstimate: 2350 // NIS estimate
  },
  {
    id: "apollo-flex-135",
    nameHe: "Apollo Flex 135W",
    nameEn: "Apollo Flex 135W",
    power: 135,
    width: 0.61, // 61 cm
    length: 1.32, // 132 cm
    weight: 1.5, // 1.5 kg - incredibly light!
    efficiency: 16.7,
    priceEstimate: 1100 // NIS
  },
  {
    id: "apollo-flex-270",
    nameHe: "Apollo Flex 270W",
    nameEn: "Apollo Flex 270W",
    power: 270,
    width: 0.72, // 72 cm
    length: 1.98, // 198 cm
    weight: 2.8, // 2.8 kg
    efficiency: 17.1,
    priceEstimate: 1950 // NIS
  },
  {
    id: "apollo-film-custom",
    nameHe: "Apollo Film Roll (Custom 150W/m²)",
    nameEn: "Apollo Film Roll (Custom 150W/sqm)",
    power: 150, // Per square meter
    width: 0.8, // 80 cm
    length: 1.0, // Scalable base (per meter)
    weight: 1.3, // 1.3 kg per meter
    efficiency: 16.5,
    priceEstimate: 1250 // NIS
  }
];

export const COMMON_APPLIANCES: Appliance[] = [
  {
    id: "fridge",
    nameHe: "מקרר קרוואנים/שטח (12V)",
    nameEn: "12V Compressor Fridge",
    power: 45,
    defaultHours: 12, // runs cycled approx 50% of the day
    icon: "Refrigerator",
    category: "kitchen"
  },
  {
    id: "led-lights",
    nameHe: "תאורת LED (פנים וחוץ)",
    nameEn: "LED Cabin Lighting",
    power: 15,
    defaultHours: 5,
    icon: "Lightbulb",
    category: "comfort"
  },
  {
    id: "laptop",
    nameHe: "מחשב נייד (עבודה בשטח)",
    nameEn: "Laptop Charger",
    power: 65,
    defaultHours: 4,
    icon: "Laptop",
    category: "electronics"
  },
  {
    id: "phone",
    nameHe: "טלפונים ניידים וטאבלטים",
    nameEn: "Smartphones & Tablets",
    power: 18,
    defaultHours: 3,
    icon: "Smartphone",
    category: "electronics"
  },
  {
    id: "vent-fan",
    nameHe: "מאוורר תקרה / ונטילציה",
    nameEn: "MaxxAir Ventilation Fan",
    power: 25,
    defaultHours: 8,
    icon: "Fan",
    category: "comfort"
  },
  {
    id: "water-pump",
    nameHe: "משאבת מים בלחץ (12V)",
    nameEn: "12V Water Pump",
    power: 60,
    defaultHours: 0.5, // used intermittently
    icon: "Droplets",
    category: "kitchen"
  },
  {
    id: "espresso",
    nameHe: "מכונת אספרסו קטנה",
    nameEn: "Espresso Maker (Inverter)",
    power: 1200,
    defaultHours: 0.1, // 6 minutes total usage
    icon: "Coffee",
    category: "kitchen"
  },
  {
    id: "tv",
    nameHe: "טלוויזיה LED קטנה",
    nameEn: "Smart TV (12V/24V)",
    power: 35,
    defaultHours: 3,
    icon: "Tv",
    category: "comfort"
  },
  {
    id: "wifi-router",
    nameHe: "ראוטר אינטרנט סלולרי",
    nameEn: "4G/5G Wi-Fi Router",
    power: 12,
    defaultHours: 10,
    icon: "Wifi",
    category: "electronics"
  }
];

export const SUN_HOURS_BY_CITYHe: Record<string, { name: string, hours: number }> = {
  "eilat": { name: "אילת (שמש חזקה מאוד, כ-6.8 שעות ביום)", hours: 6.8 },
  "negev": { name: "נגב / באר שבע (כ-6.3 שעות ביום)", hours: 6.3 },
  "center": { name: "תל אביב ומרכז הארץ (כ-5.8 שעות ביום)", hours: 5.8 },
  "jerusalem": { name: "ירושלים (כ-6.0 שעות ביום)", hours: 6.0 },
  "north": { name: "חיפה והצפון (כ-5.4 שעות ביום)", hours: 5.4 }
};

export const SUN_HOURS_BY_CITYEn: Record<string, { name: string, hours: number }> = {
  "eilat": { name: "Eilat (Ultra Solar, ~6.8 peak hours/day)", hours: 6.8 },
  "negev": { name: "Negev Desert (~6.3 peak hours/day)", hours: 6.3 },
  "center": { name: "Tel Aviv & Center (~5.8 peak hours/day)", hours: 5.8 },
  "jerusalem": { name: "Jerusalem (~6.0 peak hours/day)", hours: 6.0 },
  "north": { name: "Haifa & North (~5.4 peak hours/day)", hours: 5.4 }
};

export const DICTIONARY = {
  he: {
    title: "הכוח לזרום חופשי. בכל מקום.",
    subtitle: "מעבדה אינטראקטיבית לתכנון, פריסה והתקנה של פאנלי השמש הגמישים מבית Apollo Power. אפס קדיחות, אפס משקל, אינסוף אנרגיה.",
    selectSurfaceTitle: "1. בחר את סוג המשטח שלך",
    customizeDimensions: "2. התאם מידות משטח (מטרים)",
    width: "רוחב",
    length: "אורך",
    solarPanelSelection: "3. בחר דגם פאנל גמיש של אפולו",
    panelSpecText: "הספק: {power}W | מידות: {width}x{length} מ' | משקל: {weight} ק״ג בלבד",
    efficiency: "נצילות פאנל",
    priceEstimate: "מחיר משוער לפאנל",
    dimensionsError: "מידות קטנות מדי לפריסת פאנלים. נסה להגדיל את המשטח.",
    interactiveLayout: "פריסת פאנלים אינטראקטיבית",
    autoLayout: "פריסה אוטומטית מקסימלית",
    clearPanels: "נקה פאנלים",
    addPanel: "הוסף פאנל ידנית",
    dragHelp: "לחץ על הפריסה להוספת פאנלים או גרור אותם כדי לשנות מיקום. הלוחות גמישים לחלוטין ומתאימים לעקמומיות!",
    panelsPlaced: "פאנלים שהונחו",
    totalPower: "הספק מותקן כולל",
    weightComparison: "יתרון משקל מהפכני (השוואה לקשיח)",
    weightApollo: "משקל לוחות אפולו גמישים",
    weightTraditional: "משקל לוחות זכוכית מסורתיים + תושבות",
    weightSaved: "משקל שנחסך מהגג שלך!",
    appliancesCalcTitle: "מחשבון צריכת אנרגיה יומית (Wh)",
    addAppliance: "הוסף מכשיר חשמלי למערכת",
    dailyUsageSummary: "סיכום צריכה והפקת אנרגיה",
    dailyConsumption: "צריכה יומית מוערכת",
    dailyGeneration: "הפקת אנרגיה יומית ממוצעת",
    balance: "מאזן אנרגטי יומי",
    surplus: "עודף ייצור (המצברים ייטענו במלואם!)",
    deficit: "חוסר בייצור (מומלץ להוסיף פאנלים או להפחית שעות צריכה)",
    locationSelect: "בחר אזור בארץ לרמת קרינה",
    diyGuideTitle: "הוראות התקנה עצמית ורשימת ציוד (BOM)",
    stepByStep: "שלבי התקנה שלב-אחר-שלב",
    requiredEquipment: "רשימת חומרים וציוד נדרש",
    aiChatTitle: "היועץ הסולארי החכם של אפולו",
    aiChatPlaceholder: "שאל את ה-AI על בקר טעינה, כבלים, מצברים או שיטת הדבקה...",
    send: "שלח",
    loading: "חושב...",
    resetChat: "איפוס שיחה",
    switchLanguage: "English",
    hebrew: "עברית",
    appliances: "מכשירים",
    quantity: "כמות",
    hours: "שעות ביום",
    power: "הספק (W)",
    bomItem: "פריט",
    bomQuantity: "כמות נדרשת",
    bomSpecs: "מפרט מומלץ",
    backToTop: "חזרה למעלה",
    traditionalRacking: "כולל מסילות, ברגים וקדיחות איטום",
    apolloDirectGlue: "הדבקה ישירה ללא חירור הגג, עובי 1.2 מ״מ",
    netSavings: "חיסכון במשקל מונע שחיקה ומשפר את צריכת הדלק של הרכב/יאכטה באופן משמעותי!"
  },
  en: {
    title: "Freedom to Roam. Power to Stay.",
    subtitle: "Your interactive studio for planning and bonding Apollo Power's world-class flexible solar films. Zero drills, zero load, infinite energy.",
    selectSurfaceTitle: "1. Select Your Surface Type",
    customizeDimensions: "2. Customize Surface Dimensions (meters)",
    width: "Width",
    length: "Length",
    solarPanelSelection: "3. Choose Apollo Flexible Panel Model",
    panelSpecText: "Power: {power}W | Size: {width}x{length}m | Weight: only {weight} kg",
    efficiency: "Panel Efficiency",
    priceEstimate: "Estimated Price per Panel",
    dimensionsError: "Dimensions are too small for panel layout. Try expanding the surface.",
    interactiveLayout: "Interactive Panel Layout",
    autoLayout: "Maximize Auto-Layout",
    clearPanels: "Clear Layout",
    addPanel: "Add Panel Manually",
    dragHelp: "Click on the layout to place panels or drag to reposition. Apollo films are fully flexible and adapt to curves!",
    panelsPlaced: "Panels Placed",
    totalPower: "Total Installed Power",
    weightComparison: "Revolutionary Weight Comparison (vs Rigid)",
    weightApollo: "Apollo Flexible Panels Weight",
    weightTraditional: "Traditional Glass Panels + Mounting Racks Weight",
    weightSaved: "Weight Saved on Your Roof!",
    appliancesCalcTitle: "Daily Energy Consumption Calculator (Wh)",
    addAppliance: "Add Electrical Appliance",
    dailyUsageSummary: "Consumption vs Generation Summary",
    dailyConsumption: "Estimated Daily Usage",
    dailyGeneration: "Average Daily Generation",
    balance: "Daily Energy Balance",
    surplus: "Energy Surplus (Batteries will be fully charged!)",
    deficit: "Energy Deficit (Add more panels or reduce runtime)",
    locationSelect: "Select Irradiation Location",
    diyGuideTitle: "DIY Installation Guide & Bill of Materials (BOM)",
    stepByStep: "Step-by-Step Installation",
    requiredEquipment: "Required Materials & Equipment (BOM)",
    aiChatTitle: "Apollo Smart AI Solar Advisor",
    aiChatPlaceholder: "Ask AI about charge controllers, cables, batteries, or gluing technique...",
    send: "Send",
    loading: "Thinking...",
    resetChat: "Reset Chat",
    switchLanguage: "עברית",
    hebrew: "Hebrew",
    appliances: "Appliances",
    quantity: "Qty",
    hours: "Hours/Day",
    power: "Power (W)",
    bomItem: "Item",
    bomQuantity: "Required Qty",
    bomSpecs: "Recommended Spec",
    backToTop: "Back to Top",
    traditionalRacking: "Includes heavy structural aluminum rails & roof drills",
    apolloDirectGlue: "Direct adhesive bond, zero roof penetrations, 1.2mm thin",
    netSavings: "Weight savings prevent suspension wear and substantially improve vehicle/vessel fuel efficiency!"
  }
};
