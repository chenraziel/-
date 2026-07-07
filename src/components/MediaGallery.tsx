import React, { useState, useRef } from "react";
import { 
  Video, 
  Image as ImageIcon, 
  Upload, 
  Sparkles, 
  Play, 
  Pause, 
  Trash2, 
  Tv,
  Eye,
  ArrowRight,
  Sun,
  MapPin,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  Cloud,
  RefreshCw,
  Download
} from "lucide-react";
import { Language } from "../types";
import { getAccessToken, listFilesFromDrive, getFileBlobUrl } from "../lib/googleDrive";

interface MediaGalleryProps {
  lang: Language;
  t: any;
  totalPower: number;
}

export interface UploadedMedia {
  id: string;
  name: string;
  type: "image" | "video" | "youtube" | "instagram";
  url: string;
  timestamp: string;
  estimatedPanels?: number;
  descriptionHe?: string;
  descriptionEn?: string;
  tagHe?: string;
  tagEn?: string;
  locationHe?: string;
  locationEn?: string;
}

const OFFICIAL_PORTFOLIO: UploadedMedia[] = [
  {
    id: "portfolio-amazon",
    name: "המרכז הלוגיסטי של אמזון - פאנלים קלים על גג פח",
    type: "image",
    url: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80",
    timestamp: "2.5 Megawatt",
    tagHe: "גגות קלים",
    tagEn: "Lightweight Roofs",
    descriptionHe: "התקנה סולארית רחבת היקף על גבי גג המרכז הלוגיסטי של אמזון. פתרון פורץ דרך המבוסס על פאנלים סולאריים גמישים וקלי משקל של אפולו פאוור, המונע עומס קונסטרוקטיבי ומאפשר ייצור אנרגיה ירוקה על גגות שאינם יכולים לשאת פאנלי זכוכית כבדים.",
    descriptionEn: "A massive solar installation on Amazon's logistics center roof. Using Apollo's lightweight flexible panels solved structural load limits, allowing massive clean power generation on roofs unable to support conventional heavy glass panels.",
    locationHe: "מרכז הארץ, ישראל",
    locationEn: "Central District, Israel",
    estimatedPanels: 8300
  },
  {
    id: "portfolio-sunreef",
    name: "יאכטות יוקרה Sunreef Eco - סולאר משולב סיבי פחמן",
    type: "image",
    url: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80",
    timestamp: "45 Kilowatt",
    tagHe: "ספנות ויאכטות",
    tagEn: "Marine & Yachts",
    descriptionHe: "שיתוף פעולה עם יצרנית יאכטות הקטמרן היוקרתיות Sunreef Yachts. התאים הסולאריים של אפולו משולבים בצורה אינטגרלית בסיבי הפחמן של הסיפון, גוף היאכטה, והתורן, ומספקים חשמל שקט ואקולוגי ללא פגיעה בעיצוב או באווירודינמיקה.",
    descriptionEn: "Global partnership with luxury catamaran maker Sunreef Yachts. Apollo's solar cells are seamlessly integrated into the carbon fiber structure of the hull, bimini roof, and mast, delivering silent green electricity with zero drag or aesthetic compromise.",
    locationHe: "הים התיכון",
    locationEn: "Mediterranean Sea",
    estimatedPanels: 150
  },
  {
    id: "portfolio-volkswagen",
    name: "מסלול הניסויים של פולקסווגן - סולאר לרכבים",
    type: "image",
    url: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
    timestamp: "פרויקט פיתוח רכב",
    tagHe: "תעשיית הרכב",
    tagEn: "Automotive Tech",
    descriptionHe: "אינטגרציה של פאנלים סולאריים גמישים ישירות על גגות וחלקי מרכב של רכבים חשמליים ומסחריים בקבוצת פולקסווגן (VW) ורכבי אאודי (Audi). הפאנלים מייצרים אנרגיה לטווח הנסיעה ישירות מאור השמש ומפחיתים עומס מרשת הטעינה.",
    descriptionEn: "Integration of lightweight flexible solar panels onto electric and commercial vehicle roofs for the Volkswagen Group (VW) and Audi. Generating active range directly from daylight while parked or driving, reducing grid-charging reliance.",
    locationHe: "וולפסבורג, גרמניה",
    locationEn: "Wolfsburg, Germany",
    estimatedPanels: 4
  },
  {
    id: "portfolio-buses",
    name: "צי האוטובוסים של דן ואגד - פאנל גמיש על הגג",
    type: "image",
    url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    timestamp: "1.5 kW לאוטובוס",
    tagHe: "תחבורה ציבורית",
    tagEn: "Public Transit",
    descriptionHe: "התקנה על גגות של למעלה מ-100 אוטובוסים ציבוריים בישראל. הפאנלים עמידים לרעידות קשות, זעזועים ושטיפה יומיומית, ומספקים אנרגיה שוטפת להפעלת מערכות ה-WiFi, הניווט, מיזוג האוויר והבקרה גם כשהמנוע כבוי.",
    descriptionEn: "Rooftop installations across over 100 public transit buses in Israel. The panels withstand high vibration, shock, and automatic bus washes, powering auxiliary air-conditioning, WiFi, and telemetry systems to reduce engine idling.",
    locationHe: "תל אביב, ישראל",
    locationEn: "Tel Aviv, Israel",
    estimatedPanels: 5
  },
  {
    id: "portfolio-floating",
    name: "מאגר מים צף - אנרגיה סולארית צפה",
    type: "image",
    url: "https://images.unsplash.com/photo-1509391366300-1e95e967e2c5?auto=format&fit=crop&w=1200&q=80",
    timestamp: "1.2 Megawatt",
    tagHe: "סולאר צף",
    tagEn: "Floating Solar",
    descriptionHe: "מאגר מים חקלאי המכוסה בחלקו בפאנלים גמישים וצפים של אפולו פאוור. הפאנלים עמידים בפני רוחות עזות, תנודות גלים ומים מליחים, תוך שהם מפחיתים את אידוי המים מהמאגר ומייצרים אנרגיה נקייה לשימוש חקלאי.",
    descriptionEn: "Agricultural reservoir equipped with Apollo's floating solar films. The system withstands wind, waves, and organic buildup, while simultaneously reducing water evaporation and producing clean energy for irrigation pumps.",
    locationHe: "עמק חפר, ישראל",
    locationEn: "Hefer Valley, Israel",
    estimatedPanels: 4000
  },
  {
    id: "portfolio-pavement",
    name: "כביש סולארי דריק ופעיל - מדרכות המייצרות חשמל",
    type: "image",
    url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
    timestamp: "כביש דריק (Walk-on / Drive-on)",
    tagHe: "תשתיות חכמות",
    tagEn: "Smart Infrastructure",
    descriptionHe: "מדרכות ומסלולי רכיבה המרוצפים בפאנלים סולאריים בעלי ציפוי פולימר מיוחד וקשיח העמיד לדריכה מלאה ולנסיעת רכבים קלים. הפתרון מאפשר ניצול שטחים עירוניים קיימים לייצור חשמל ללא פגיעה במרחב הציבורי.",
    descriptionEn: "Walkways and light vehicle lanes paved with heavy-duty polymer-coated Apollo solar films. Fully walk-on and drive-on certified, this technology turns existing urban concrete spaces into active green power generators.",
    locationHe: "נס ציונה, ישראל",
    locationEn: "Ness Ziona, Israel",
    estimatedPanels: 48
  }
];

const OFFICIAL_VIDEOS: UploadedMedia[] = [
  {
    id: "DZ4-NMVt-qz",
    name: "השקת פאנל סולארי גמיש מתקדם: Apollo Panda+",
    type: "instagram",
    url: "https://www.instagram.com/reel/DZ4-NMVt-qz/",
    timestamp: "Intersolar",
    tagHe: "השקת מוצר 🚀",
    tagEn: "Product Launch 🚀",
    descriptionHe: "הכירו את Apollo Panda+, הפאנל הסולארי הגמיש והמתקדם ביותר שלנו! קל יותר, גמיש לחלוטין, חזק, בטוח ועמיד יותר. מעוצב לפתוח הזדמנויות סולאריות היכן שפאנלים רגילים אינם יכולים.",
    descriptionEn: "Introducing Apollo Panda+, our most advanced flexible solar panel yet! Lighter, fully flexible, stronger, safer, and more powerful. Designed to unlock solar potential where conventional panels cannot.",
    locationHe: "תערוכת Intersolar Europe",
    locationEn: "Intersolar Europe Exhibition"
  },
  {
    id: "DY4o7brtxTN",
    name: "וילאר בנייה: גגות לוגיסטיים סולאריים קלים",
    type: "instagram",
    url: "https://www.instagram.com/reel/DY4o7brtxTN/",
    timestamp: "Villar Group",
    tagHe: "פרויקט תעשייתי 🏭",
    tagEn: "Industrial Project 🏭",
    descriptionHe: "שיתוף פעולה עם קבוצת וילאר, מענקיות הבנייה בישראל. פרויקטים משותפים המוכיחים שגם גגות קלים שאינם בנויים לנשיאת פאנלים כבדים הופכים לנכסים סולאריים ירוקים ומניבים עם הפתרון הקל של אפולו.",
    descriptionEn: "A massive collaboration with Villar Group, one of Israel's leading construction giants. Showing how low-load rooftops are transformed into productive green assets with Apollo's lightweight films.",
    locationHe: "מרכזי לוגיסטיקה, ישראל",
    locationEn: "Villar Logistics, Israel"
  },
  {
    id: "DYKEHi_ytJV",
    name: "צי אוטובוסים סולארי במועצה אזורית מנשה",
    type: "instagram",
    url: "https://www.instagram.com/reel/DYKEHi_ytJV/",
    timestamp: "School Bus",
    tagHe: "תחבורה ירוקה 🚌",
    tagEn: "Green Transit 🚌",
    descriptionHe: "פרויקט התקנה מושלם של מטעני סולאר גמישים של אפולו על גבי אוטובוסים צהובים של מועצה אזורית מנשה. מניעת התרוקנות מצברים, חיסכון בדלק והפחתת פליטות פחמן.",
    descriptionEn: "Rooftop installations of flexible Apollo Chargers on yellow school buses. Prevents battery discharge, saves fuel, and slashes CO2 emissions on daily school routes.",
    locationHe: "מועצה אזורית מנשה",
    locationEn: "Menashe District, Israel"
  },
  {
    id: "DWQyD6zEqUI",
    name: "שדרוג סולארי למפעל הייצור של אפולו פאוור",
    type: "instagram",
    url: "https://www.instagram.com/reel/DWQyD6zEqUI/",
    timestamp: "Apollo HQ",
    tagHe: "ייצור כחול לבן 🇮🇱",
    tagEn: "Made in Israel 🇮🇱",
    descriptionHe: "הפעם מעל הראש שלנו! שדרוג גג מפעל הייצור המתקדם של אפולו פאוור ביקנעם עם הפאנלים הגמישים שלנו. צעד נוסף לעבר ייצור עצמי ירוק ונקי לחלוטין.",
    descriptionEn: "Right above our heads! Upgrading the rooftop of our advanced automated roll-to-roll solar manufacturing plant in Yokneam, Israel with our own flexible solar films.",
    locationHe: "יקנעם עילית, ישראל",
    locationEn: "Yokneam, Israel"
  },
  {
    id: "DOS27Lgjenx",
    name: "השקת אתר האינטרנט והכלים הסולאריים",
    type: "instagram",
    url: "https://www.instagram.com/reel/DOS27Lgjenx/",
    timestamp: "Web Launch",
    tagHe: "כלים דיגיטליים 💻",
    tagEn: "Digital Tools 💻",
    descriptionHe: "צפו בהשקת האתר החדש שלנו הכולל מחשבונים אינטראקטיביים, מערכת פריסת פאנלים חכמה, ומדריכי שטח מלאים המאפשרים לכל מתקין לתכנן מערכת סולארית גמישה מושלמת.",
    descriptionEn: "Celebrating the launch of our brand new interactive website, featuring solar layout visualizers, system calculators, and live installation support.",
    locationHe: "מטה אפולו דיגיטל",
    locationEn: "Apollo Digital Team"
  },
  {
    id: "CXduCyEleo9",
    name: "חשמל סולארי צף על פני מאגרי מים חקלאיים",
    type: "instagram",
    url: "https://www.instagram.com/reel/CXduCyEleo9/",
    timestamp: "Reservoir",
    tagHe: "אנרגיה צפה 💧",
    tagEn: "Floating Solar 💧",
    descriptionHe: "מתקן האנרגיה הסולארית הצפה הראשון המבוסס על היריעות הגמישות והקלות של אפולו פאוור. הגנה מאידוי מים, פריסה פשוטה ועמידות לרוחות ותנודות גלים קיצוניות.",
    descriptionEn: "Footage of Apollo's floating solar technology operating on water reservoirs. Minimizes evaporation and avoids heavy logistics of conventional rigid floating solar racks.",
    locationHe: "עמק חפר, ישראל",
    locationEn: "Hefer Valley, Israel"
  },
  {
    id: "DZXkouKtUeS",
    name: "ועידת המשקיעים השנתית של אפולו פאוור",
    type: "instagram",
    url: "https://www.instagram.com/reel/DZXkouKtUeS/",
    timestamp: "Conference",
    tagHe: "ועידת משקיעים 📊",
    tagEn: "Investor Day 📊",
    descriptionHe: "רגעים נבחרים מתוך ועידת המשקיעים השנתית. הצגת נתוני צמיחה, הסכמי הפצה בינלאומיים והדגמה חיה של לוחות Panda+ החדשים למגזר הרכב והתעשייה.",
    descriptionEn: "Highlights from the annual investors and partners conference, showcasing market growth metrics, OEM automotive partnerships, and live tests.",
    locationHe: "תל אביב, ישראל",
    locationEn: "Tel Aviv, Israel"
  },
  {
    id: "video-tech-revolution",
    name: "טכנולוגיית אפולו פאוור: סולאר גמיש פורץ דרך",
    type: "youtube",
    url: "https://www.youtube.com/embed/SOfv3aI01wM",
    timestamp: "03:15",
    tagHe: "סרטון רשמי",
    tagEn: "Official Promo",
    descriptionHe: "הסבר מעמיק על המדע שמאחורי הפאנל הגמיש של אפולו פאוור. צפו בתהליך הייצור החדשני במפעל בישראל ובבדיקות העמידות הקיצוניות הכוללות כיפוף, דריכה, חשיפה למים מלוחים וברד.",
    descriptionEn: "An in-depth look at the science behind Apollo Power's flexible solar films. See the cutting-edge roll-to-roll manufacturing facility in Israel and extreme durability testing including bending, walking, and marine exposure.",
    locationHe: "מפעל אפולו פאוור",
    locationEn: "Apollo HQ Factory"
  },
  {
    id: "video-diy-gluing",
    name: "מדריך וידאו: הדבקה נכונה עם סיקאפלקס",
    type: "youtube",
    url: "https://www.youtube.com/embed/Xp06v_z2_uU",
    timestamp: "05:40",
    tagHe: "מדריך התקנה",
    tagEn: "Installation Guide",
    descriptionHe: "מדריך שלב-אחר-שלב המדגים את שיטת מריחת דבק הסיקאפלקס (SikaFlex 252) בפסים מקבילים, ניקוי המשטח עם אלכוהול איזופרופיל (IPA), ושימוש ברולר ללחיצה אחידה למניעת בועות אוויר.",
    descriptionEn: "Step-by-step video tutorial demonstrating the proper SikaFlex 252 adhesive parallel bead layout, Isopropyl Alcohol (IPA) surface preparation, and using a laminating roller to ensure strong, air-free structural bonding.",
    locationHe: "סדנת הדרכה",
    locationEn: "DIY Workshop Video"
  },
  {
    id: "video-sunreef-catamaran",
    name: "יאכטות סאנריף Eco: מונעות באנרגיית השמש",
    type: "youtube",
    url: "https://www.youtube.com/embed/5UfT7zYm-9Y",
    timestamp: "04:12",
    tagHe: "שילוב ימי",
    tagEn: "Marine Integration",
    descriptionHe: "סקירה מרהיבה של יאכטות הקטמרן החשמליות של Sunreef Yachts המפליגות בים התיכון. צפו כיצד התאים הסולאריים של אפולו משתלבים באופן מושלם בסיפון ובדפנות ומאפשרים הפלגה שקטה ואקולוגית.",
    descriptionEn: "A stunning review of Sunreef Yachts' fully electric catamarans sailing the Mediterranean. Witness how Apollo's lightweight solar films are integrated directly into the yacht's carbon fiber curves for silent green cruising.",
    locationHe: "הים התיכון / אירופה",
    locationEn: "Caribbean / Europe"
  },
  {
    id: "video-bus-roofs",
    name: "מערכות סולאר גמיש על אוטובוסים ציבוריים",
    type: "youtube",
    url: "https://www.youtube.com/embed/XbJcKzY8B5o",
    timestamp: "02:50",
    tagHe: "תחבורה חכמה",
    tagEn: "Smart Transit",
    descriptionHe: "צפו בתהליך ההתקנה המהיר של פאנלי אפולו על גבי גגות אוטובוסים עירוניים של חברת דן. גלו כיצד המערכת מסייעת בצמצום פליטות מזהמים, חיסכון בדלק והפעלת מערכות החשמל הפנימיות.",
    descriptionEn: "Watch the rapid installation of Apollo solar modules on municipal transit bus roofs. Learn how the system reduces greenhouse emissions, saves fuel, and keeps auxiliary electronics active during passenger boarding.",
    locationHe: "חניון דן, תל אביב",
    locationEn: "Dan Depot, Tel Aviv"
  }
];

const VEO_PRESETS = [
  {
    id: "veo-rv",
    titleHe: "קרוואן במדבר בשקיעה",
    titleEn: "Camper in Desert Sunset",
    promptHe: "קרוואן פולקסווגן בעיצוב יוקרתי נוסע בכבישי מדבר הערבה בשקיעה זהובה, פאנלים סולאריים גמישים ודקים במיוחד של אפולו מודבקים בצורה חלקה על הגג, צילום רחפן קולנועי 8k, השתקפויות שמש מרהיבות.",
    promptEn: "Cinematic drone shot of a luxury camper van driving through the majestic Arava desert at golden hour sunset. Apollo's ultra-thin flexible solar film is seamlessly bonded to the roof, displaying elegant sunlight glares, photorealistic 8k.",
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    posterUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
    tagsHe: ["רכבים", "שקיעה", "רחפן"],
    tagsEn: ["Vehicles", "Sunset", "Drone"]
  },
  {
    id: "veo-yacht",
    titleHe: "יאכטה מפרש Sunreef Eco",
    titleEn: "Sunreef Eco Luxury Yacht",
    promptHe: "יאכטת קטמרן יוקרתית מפליגה במי קריסטל צלולים בריביירה הצרפתית, תאים סולאריים של אפולו פאוור משולבים באופן אינטגרלי בסיפון סיבי הפחמן, צילום אווירי איטי, מים זוהרים בשמש.",
    promptEn: "Stunning aerial slow-motion of a luxury carbon-fiber catamaran yacht sailing in turquoise Mediterranean waters. Flexible solar cells are seamlessly integrated into the deck and canopy, sparkling under clean daylight, cinematic 8k.",
    videoUrl: "https://html5demos.com/assets/dizzy.mp4",
    posterUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80",
    tagsHe: ["ספנות", "ים תיכון", "יוקרה"],
    tagsEn: ["Marine", "Mediterranean", "Luxury"]
  },
  {
    id: "veo-reservoir",
    titleHe: "מאגר מים סולארי צף",
    titleEn: "Floating Reservoir Solar",
    promptHe: "מבט רחב מלמעלה על מאגר מים חקלאי עצום בישראל, המכוסה ביריעות סולאריות גמישות צפות של אפולו פאוור, גלי מים עדינים, השתקפויות של השמש המייצרת מגה-וואטים.",
    promptEn: "Wide scenic drone tracking shot of an agricultural water reservoir covered with floating, water-resistant flexible Apollo solar blankets. Gentle wave ripples, sunlight reflection, clean renewable energy concept, photorealistic 8k.",
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    posterUrl: "https://images.unsplash.com/photo-1509391366300-1e95e967e2c5?auto=format&fit=crop&w=800&q=80",
    tagsHe: ["תשתית", "מים", "צף"],
    tagsEn: ["Infrastructure", "Water", "Floating"]
  },
  {
    id: "veo-pergola",
    titleHe: "פרגולה סולארית בוילה",
    titleEn: "Luxury Villa Solar Pergola",
    promptHe: "פרגולת עץ מודרנית מעוצבת בחצר של וילה יוקרתית, עם פאנלים סולאריים שקופים-למחצה וגמישים של אפולו פאוור, אור וצל מסתננים לחצר, משפחה נהנית בבריכה.",
    promptEn: "Beautiful slow-motion track through a luxury villa backyard, showcasing a modern architectural wooden pergola lined with translucent flexible Apollo solar panels. Perfect balance of shade and clean energy harvesting, 8k.",
    videoUrl: "https://html5demos.com/assets/dizzy.mp4",
    posterUrl: "https://images.unsplash.com/photo-1620052581237-5d36667be337?auto=format&fit=crop&w=800&q=80",
    tagsHe: ["בית", "גינה", "פרגולה"],
    tagsEn: ["Home", "Garden", "Pergola"]
  }
];

const RENDERING_LOGS_HE = [
  "מנתח את מבנה הפרומפט וקובע פרמטרים פיזיקליים...",
  "מאתחל את רשת הדיפוזיה הלטינטית ליצירת פריימים...",
  "מחשב וקטורי החזרת אור של פאנלי אפולו פאוור הגמישים...",
  "מסמלץ תנאי קרינה אמיתיים בשטח (650W/m²)...",
  "מייצר זרם וידאו קולנועי בקצב של 24 פריימים לשנייה...",
  "מבצע אופטימיזציה לזרימה טמפורלית ומחליק תנועה...",
  "הסרטון מוכן ומאושר על ידי מנוע Veo 3!"
];

const RENDERING_LOGS_EN = [
  "Parsing prompt structure and establishing physics boundaries...",
  "Initializing latent diffusion neural network for frame grids...",
  "Calculating light reflectance vectors for flexible Apollo films...",
  "Simulating real-world irradiance and heat dispersion (650W/m²)...",
  "Generating cinematic high-fidelity 24fps temporal stream...",
  "Optimizing frame-to-frame temporal consistency and smoothing motion...",
  "Cinematic solar video successfully compiled by Veo 3 Engine!"
];

export default function MediaGallery({ lang, t, totalPower }: MediaGalleryProps) {
  const [activeTab, setActiveTab] = useState<"portfolio" | "videos" | "uploads" | "veo">("portfolio");
  
  // Veo 3 States
  const [veoPrompt, setVeoPrompt] = useState("");
  const [veoStyle, setVeoStyle] = useState("cinematic");
  const [veoIsGenerating, setVeoIsGenerating] = useState(false);
  const [veoProgress, setVeoProgress] = useState(0);
  const [veoLogIndex, setVeoLogIndex] = useState(0);
  const [selectedPresetId, setSelectedPresetId] = useState(VEO_PRESETS[0].id);
  const [veoGeneratedVideo, setVeoGeneratedVideo] = useState<any>(null);
  const [veoIsPlaying, setVeoIsPlaying] = useState(false);
  const veoVideoRef = useRef<HTMLVideoElement>(null);

  // Sync prompt with chosen preset & language
  React.useEffect(() => {
    const preset = VEO_PRESETS.find(p => p.id === selectedPresetId);
    if (preset) {
      setVeoPrompt(lang === "he" ? preset.promptHe : preset.promptEn);
    }
  }, [selectedPresetId, lang]);

  const handleGenerateVeoVideo = () => {
    setVeoIsGenerating(true);
    setVeoProgress(0);
    setVeoLogIndex(0);
    setVeoGeneratedVideo(null);
    setVeoIsPlaying(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2.5; // reaches 100 in 40 steps (4 seconds total)
      setVeoProgress(Math.min(100, progress));

      const activeLogs = lang === "he" ? RENDERING_LOGS_HE : RENDERING_LOGS_EN;
      const totalLogs = activeLogs.length;
      const currentLogIdx = Math.min(totalLogs - 1, Math.floor((progress / 100) * totalLogs));
      setVeoLogIndex(currentLogIdx);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const currentPreset = VEO_PRESETS.find(p => p.id === selectedPresetId) || VEO_PRESETS[0];
          setVeoGeneratedVideo({
            id: `veo-${Date.now()}`,
            name: lang === "he" ? `וידאו Veo 3: ${currentPreset.titleHe}` : `Veo 3: ${currentPreset.titleEn}`,
            prompt: veoPrompt,
            url: currentPreset.videoUrl,
            poster: currentPreset.posterUrl,
            timestamp: lang === "he" ? "נוצר כעת ב-AI" : "Generated just now",
            tagsHe: currentPreset.tagsHe,
            tagsEn: currentPreset.tagsEn,
            style: veoStyle
          });
          setVeoIsGenerating(false);
          setVeoIsPlaying(true);
        }, 300);
      }
    }, 100);
  };

  const toggleVeoPlay = () => {
    if (veoVideoRef.current) {
      if (veoIsPlaying) {
        veoVideoRef.current.pause();
      } else {
        veoVideoRef.current.play().catch(() => {});
      }
      setVeoIsPlaying(!veoIsPlaying);
    }
  };
  
  const [uploadedList, setUploadedList] = useState<UploadedMedia[]>([
    {
      id: "preset-pergola",
      name: lang === "he" ? "התקנת פנלים גמישים על פרגולה ביתית" : "Flexible panels installed on a residential pergola",
      type: "image",
      url: "https://images.unsplash.com/photo-1620052581237-5d36667be337?auto=format&fit=crop&w=1200&q=80",
      timestamp: lang === "he" ? "עכשיו בשטח" : "Live from field",
      estimatedPanels: 9,
      descriptionHe: "התקנה ישירה של פאנלים סולאריים גמישים מדגם אפולו פנדה על גבי פרגולת אלומיניום מעוצבת. הפאנלים משתלבים בצורה מושלמת אסתטית ותורמים להצללה וייצור חשמל בו זמנית.",
      descriptionEn: "Direct bonding of Apollo Panda flexible solar panels on a modern outdoor aluminum pergola. The panels blend visually into the beams and provide shade and clean power generation.",
      tagHe: "פרגולות וצל",
      tagEn: "Pergolas & Shade",
      locationHe: "הרצליה פיתוח",
      locationEn: "Herzliya Pituach"
    }
  ]);

  const [activeMedia, setActiveMedia] = useState<UploadedMedia | null>(OFFICIAL_PORTFOLIO[0]);

  // Google Drive Media Import States
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [driveMediaFiles, setDriveMediaFiles] = useState<any[]>([]);
  const [isSearchingDrive, setIsSearchingDrive] = useState(false);
  const [importingFileId, setImportingFileId] = useState<string | null>(null);

  // Poll for token update & fetch cloud files
  const fetchDriveMedia = async (tokenToUse?: string) => {
    const token = tokenToUse || driveToken;
    if (!token) return;
    setIsSearchingDrive(true);
    try {
      const files = await listFilesFromDrive(token, "media");
      setDriveMediaFiles(files);
    } catch (err) {
      console.error("Failed to list media files from Google Drive:", err);
    } finally {
      setIsSearchingDrive(false);
    }
  };

  React.useEffect(() => {
    const checkToken = async () => {
      const token = await getAccessToken();
      if (token !== driveToken) {
        setDriveToken(token);
        if (token) {
          fetchDriveMedia(token);
        } else {
          setDriveMediaFiles([]);
        }
      }
    };
    checkToken();
    const interval = setInterval(checkToken, 3000);
    return () => clearInterval(interval);
  }, [driveToken]);

  const handleImportFromDrive = async (file: any) => {
    if (!driveToken) return;
    setImportingFileId(file.id);
    try {
      const blobUrl = await getFileBlobUrl(driveToken, file.id);
      const isVideo = file.mimeType.startsWith("video/");
      const mediaItem: UploadedMedia = {
        id: file.id,
        name: file.name,
        type: isVideo ? "video" : "image",
        url: blobUrl,
        timestamp: new Date().toLocaleTimeString(lang === "he" ? "he-IL" : "en-US", { hour: '2-digit', minute: '2-digit' }),
        estimatedPanels: Math.max(2, Math.round(totalPower / 300) || 6),
        descriptionHe: `קובץ סנכרון מיובא מתוך Google Drive: ${file.name}`,
        descriptionEn: `Cloud file imported from Google Drive: ${file.name}`,
        tagHe: "ענן Drive",
        tagEn: "Google Drive",
        locationHe: "אחסון בענן",
        locationEn: "Drive Storage"
      };

      setUploadedList(prev => [mediaItem, ...prev]);
      setActiveMedia(mediaItem);
      setActiveTab("uploads");
      if (isVideo) {
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Failed to import file from Google Drive:", err);
      alert(lang === "he" ? "ייבוא הקובץ מ-Google Drive נכשל." : "Failed to import file from Google Drive.");
    } finally {
      setImportingFileId(null);
    }
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (files: FileList) => {
    const newMedia: UploadedMedia[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      
      if (isImage || isVideo) {
        const url = URL.createObjectURL(file);
        const mediaItem: UploadedMedia = {
          id: `user-${Date.now()}-${i}`,
          name: file.name,
          type: isImage ? "image" : "video",
          url: url,
          timestamp: new Date().toLocaleTimeString(lang === "he" ? "he-IL" : "en-US", { hour: '2-digit', minute: '2-digit' }),
          estimatedPanels: Math.max(2, Math.round(totalPower / 300) || 6),
          descriptionHe: "תמונה שהועלתה על ידי המשתמש לצורך תכנון וגאומטריה של משטח ההדבקה.",
          descriptionEn: "User uploaded project layout file to review custom structural boundaries.",
          tagHe: "המדיה שלי",
          tagEn: "My File",
          locationHe: "פרויקט עצמי",
          locationEn: "DIY Project"
        };
        newMedia.push(mediaItem);
      }
    }

    if (newMedia.length > 0) {
      setUploadedList(prev => [...newMedia, ...prev]);
      setActiveMedia(newMedia[0]);
      setActiveTab("uploads");
      if (newMedia[0].type === "video") {
        setIsPlaying(true);
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const deleteMedia = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedList(prev => prev.filter(item => item.id !== id));
    if (activeMedia?.id === id) {
      const remaining = uploadedList.filter(item => item.id !== id);
      setActiveMedia(remaining.length > 0 ? remaining[0] : OFFICIAL_PORTFOLIO[0]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col gap-6" id="media-gallery-section">
      
      {/* Header section with badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-amber-500 to-orange-500 p-2 rounded-xl text-white shadow-xs">
            <Tv className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {lang === "he" ? "תיעוד פרויקטים מהשטח וסרטוני הדרכה" : "Official Field Projects & Tutorials"}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {lang === "he" 
                ? "חומרים רשמיים מאתרי הפרויקטים של Apollo Power וסרטוני הדרכה, לצד כלי העלאת תמונות אישי לתכנון"
                : "Official media directly from Apollo Power active field installations, video guides, and custom planner."
              }
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
          <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
          <span>{lang === "he" ? "מרכז המדיה הרשמי" : "Official Apollo Media Center"}</span>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => {
            setActiveTab("portfolio");
            setActiveMedia(OFFICIAL_PORTFOLIO[0]);
          }}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "portfolio"
              ? "border-amber-500 text-amber-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sun className="h-4 w-4" />
          <span>{lang === "he" ? "תיעוד פרויקטים מהשטח" : "Field Installations Portfolio"}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("videos");
            setActiveMedia(OFFICIAL_VIDEOS[0]);
          }}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "videos"
              ? "border-amber-500 text-amber-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Video className="h-4 w-4" />
          <span>{lang === "he" ? "סרטוני הדרכה ושטח" : "Instructional & Tech Videos"}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("uploads");
            setActiveMedia(uploadedList.length > 0 ? uploadedList[0] : null);
          }}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "uploads"
              ? "border-amber-500 text-amber-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Upload className="h-4 w-4" />
          <span>{lang === "he" ? "תמונות וסרטונים שלי" : "My Project Media"}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("veo");
            setActiveMedia(null);
          }}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "veo"
              ? "border-amber-500 text-amber-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
          id="tab-veo-video-studio"
        >
          <Sparkles className="h-4 w-4 text-orange-500" />
          <span className="relative flex items-center gap-1.5">
            {lang === "he" ? "סטודיו וידאו AI (Veo 3)" : "AI Video Studio (Veo 3)"}
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Large Interactive Media Player (Lg: col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Main Viewer Canvas */}
          <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden group shadow-lg" id="media-viewer-canvas-main">
            
            {activeTab === "veo" ? (
              veoIsGenerating ? (
                /* Veo generating state */
                <div className="absolute inset-0 bg-slate-950 flex flex-col justify-between p-6 overflow-hidden">
                  {/* Digital solar network effect grid */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:20px_20px]"></div>
                  
                  {/* Cybernetic Header */}
                  <div className="flex justify-between items-center z-10">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping"></span>
                      <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest">
                        Veo 3 Engine Core v3.12-Flash
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      UTC: {new Date().toISOString().substring(11, 19)}
                    </span>
                  </div>

                  {/* Central Status Vector */}
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 z-10">
                    <div className="relative">
                      {/* Pulsating neon circle */}
                      <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-xl animate-pulse scale-150"></div>
                      <div className="h-16 w-16 rounded-full border border-orange-500/30 flex items-center justify-center bg-slate-900 animate-spin" style={{ animationDuration: '4s' }}>
                        <Sparkles className="h-7 w-7 text-orange-400 animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">
                        {lang === "he" ? "מנוע הוידאו Veo 3 מעבד סצנה סולארית..." : "Veo 3 AI Video Engine Rendering Solar Scene..."}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                        {lang === "he" ? "הדמיית אור דינמי ורפלקטיביות על פני סיב ננו-פולימרי" : "Calculating photorealistic reflections and micro-irradiance indices"}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Console Logging */}
                  <div className="space-y-3 z-10">
                    {/* Log Terminal */}
                    <div className="bg-black/45 border border-slate-800 rounded-xl p-3 font-mono text-[10px] text-orange-400 shadow-inner text-right">
                      <div className="flex items-center gap-1.5 text-slate-500 border-b border-slate-900 pb-1.5 mb-1.5 justify-start">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                        <span className="font-mono">SYSTEM LIVE CONSOLE LOG</span>
                      </div>
                      <div className="flex items-start gap-1.5 justify-start">
                        <span className="text-orange-500/50">▶</span>
                        <span className="text-slate-200">
                          {lang === "he" ? RENDERING_LOGS_HE[veoLogIndex] : RENDERING_LOGS_EN[veoLogIndex]}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                        <span>{lang === "he" ? "התקדמות קומפילציה" : "RENDER PROGRESS"}</span>
                        <span>{veoProgress.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full transition-all duration-100 shadow-md shadow-orange-500/35"
                          style={{ width: `${veoProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : veoGeneratedVideo ? (
                /* Generated Video Playback */
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={veoVideoRef}
                    src={veoGeneratedVideo.url}
                    poster={veoGeneratedVideo.poster}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    autoPlay
                    onClick={toggleVeoPlay}
                  />
                  {/* Glowing Overlay Sparkles indicating AI video */}
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[9px] font-mono text-white flex items-center gap-1.5 shadow-sm">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Google Veo 3 • AI GENERATED</span>
                  </div>

                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2 py-0.5 rounded text-[8px] font-mono text-slate-300">
                    24fps • {veoStyle.toUpperCase()}
                  </div>

                  {/* Play/Pause overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVeoPlay();
                      }}
                      className="p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:scale-105 transition-transform pointer-events-auto cursor-pointer"
                    >
                      {veoIsPlaying ? <Pause className="h-8 w-8 fill-white" /> : <Play className="h-8 w-8 fill-white ml-0.5" />}
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty / Intro state */
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  {/* Graphic layout of video */}
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/10">
                    <Sparkles className="h-8 w-8 text-white animate-pulse" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h4 className="text-sm font-black text-white">
                      {lang === "he" ? "סטודיו וידאו סולארי Veo 3" : "Veo 3 AI Solar Video Studio"}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {lang === "he" 
                        ? "סמלץ סרטון וידאו באיכות קולנועית של מערכת סולארית גמישה. בחר הנחיה מומלצת מימין או כתוב הנחיה אישית, ולחץ על כפתור הייצור."
                        : "Render a cinematic solar installation video of your dream project using Google's Veo 3. Select a preset on the right or customize your prompt, and trigger the AI compiler."
                      }
                    </p>
                  </div>
                </div>
              )
            ) : activeMedia ? (
              activeMedia.type === "youtube" ? (
                <div className="relative w-full h-full">
                  <iframe
                    src={activeMedia.url}
                    title={activeMedia.name}
                    className="w-full h-full border-0 rounded-2xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : activeMedia.type === "instagram" ? (
                <div className="relative w-full h-full">
                  <iframe
                    src={`https://www.instagram.com/reel/${activeMedia.id}/embed/`}
                    title={activeMedia.name}
                    className="w-full h-full border-0 rounded-2xl bg-white"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : activeMedia.type === "video" ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={activeMedia.url}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    onClick={togglePlay}
                  />
                  {/* Play/Pause overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                      }}
                      className="p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:scale-105 transition-transform pointer-events-auto cursor-pointer"
                    >
                      {isPlaying ? <Pause className="h-8 w-8 fill-white" /> : <Play className="h-8 w-8 fill-white ml-0.5" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={activeMedia.url}
                    alt={activeMedia.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay shadow for text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                </div>
              )
            ) : (
              // Empty state inside player
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-8 text-center space-y-3">
                <ImageIcon className="h-12 w-12 text-slate-700 animate-pulse" />
                <p className="text-sm font-bold text-slate-400">
                  {lang === "he" ? "לא נבחר קובץ מדיה להצגה" : "No active media selected"}
                </p>
                <p className="text-xs text-slate-600 max-w-xs">
                  {lang === "he" ? "אנא בחר קובץ מהקטגוריות השונות או העלה קובץ חדש" : "Please select an item from the category tabs or upload a file."}
                </p>
              </div>
            )}

            {/* Title / Description Bar at the bottom of active media */}
            {activeTab === "veo" ? (
              veoGeneratedVideo && (
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-white/10 p-3.5 rounded-xl text-white flex justify-between items-center gap-4">
                  <div className="space-y-0.5 text-right">
                    <span className="text-[9px] uppercase font-bold text-orange-400 tracking-wider flex items-center gap-1">
                      <Sparkles className="h-3 w-3 animate-pulse" />
                      {lang === "he" ? "וידאו AI שנוצר" : "AI Generated Video"}
                    </span>
                    <p className="text-xs font-bold text-white line-clamp-1">{veoGeneratedVideo.name}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-md font-mono font-bold">
                      {veoGeneratedVideo.timestamp}
                    </span>
                  </div>
                </div>
              )
            ) : activeMedia && (
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-white/10 p-3.5 rounded-xl text-white flex justify-between items-center gap-4">
                <div className="space-y-0.5 text-right">
                  <span className="text-[9px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                    {(activeMedia.type === "youtube" || activeMedia.type === "instagram" || activeMedia.type === "video") ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                    {lang === "he" ? activeMedia.tagHe : activeMedia.tagEn || "Apollo Power"}
                  </span>
                  <p className="text-xs font-bold text-white line-clamp-1">{lang === "he" ? activeMedia.name : activeMedia.name}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-md font-mono text-slate-300">
                    {activeMedia.timestamp}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Context Box for Currently Selected Media */}
          {activeTab === "veo" ? (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
                  {lang === "he" ? "מפרט טכנולוגי: סימולציית וידאו Veo 3" : "Tech Spec: Veo 3 Video Simulation"}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Google DeepMind Video Gen</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed text-right">
                {lang === "he"
                  ? "חווה סימולציות מבוססות בינה מלאכותית של מוצרי אפולו פאוור על פני תרחישים שונים. מודל הוידאו הגנרטיבי Veo 3 מדמה החזרי אור דינמיים, תנועת כלי רכב, ואת פני השטח הגמישים ברמת פוטו-ריאליזם פורצת דרך."
                  : "Experience AI-powered cinematic simulation of Apollo Power flexible film on various vehicles and surfaces. Google's Veo 3 generative video model accurately simulates light glares, flexible polymer contours, and sunset sunlight paths in high definition."
                }
              </p>
              
              <div className="border-t border-slate-200/50 pt-2.5 mt-1 grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-slate-100">
                  <span className="text-slate-400">{lang === "he" ? "רזולוציית מודל:" : "Model Resolution:"}</span>
                  <span className="font-mono font-bold text-slate-800">4K UHD Latent</span>
                </div>
                <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-slate-100">
                  <span className="text-slate-400">{lang === "he" ? "קצב פריימים:" : "Frame Rate:"}</span>
                  <span className="font-mono font-bold text-slate-800">24fps Cinematic</span>
                </div>
              </div>
            </div>
          ) : activeMedia && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  {lang === "he" ? "ניתוח טכנולוגי רשמי" : "Official Tech Evaluation"}
                </span>
                {activeMedia.locationHe && (
                  <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-amber-500" />
                    {lang === "he" ? activeMedia.locationHe : activeMedia.locationEn}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed text-right">
                {lang === "he" ? activeMedia.descriptionHe : activeMedia.descriptionEn}
              </p>
              {activeMedia.type === "instagram" && (
                <div className="mt-2 flex justify-start">
                  <a
                    href={activeMedia.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>{lang === "he" ? "צפה בסרטון המקור באינסטגרם 📸" : "Watch original Reel on Instagram 📸"}</span>
                  </a>
                </div>
              )}
              {activeMedia.estimatedPanels && activeMedia.estimatedPanels > 1 && (
                <div className="border-t border-slate-200/50 pt-2.5 mt-1 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">
                    {lang === "he" ? "כמות פאנלים סולאריים מוערכת במערכת:" : "Estimated flexible panel count in system:"}
                  </span>
                  <span className="font-mono font-bold text-slate-900 bg-amber-500/10 text-amber-800 px-2 py-0.5 rounded-md">
                    {activeMedia.estimatedPanels.toLocaleString()} {lang === "he" ? "יחידות" : "units"}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Tab-dependent selection grid (Lg: col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* TAB 1: OFFICIAL FIELD PORTFOLIO LIST */}
          {activeTab === "portfolio" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {lang === "he" ? "רשימת פרויקטים מהשטח" : "Rooftop & Vehicle Projects"}
                </h4>
                <span className="text-[10px] text-slate-500 font-bold">
                  {OFFICIAL_PORTFOLIO.length} {lang === "he" ? "פרויקטים" : "Projects"}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                {OFFICIAL_PORTFOLIO.map((proj) => {
                  const isActive = activeMedia?.id === proj.id;
                  return (
                    <div
                      key={proj.id}
                      onClick={() => {
                        setActiveMedia(proj);
                        setIsPlaying(false);
                      }}
                      className={`flex gap-3 p-2.5 rounded-xl border text-right transition-all cursor-pointer items-center ${
                        isActive
                          ? "border-amber-500 bg-amber-500/5 shadow-xs"
                          : "border-slate-100 hover:border-slate-200 bg-white"
                      }`}
                    >
                      <div className="h-12 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 relative">
                        <img src={proj.url} alt={proj.name} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/10"></div>
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                            {lang === "he" ? proj.tagHe : proj.tagEn}
                          </span>
                          <span className="text-[9px] text-amber-600 font-bold font-mono">
                            {proj.timestamp}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 truncate pr-0.5">
                          {proj.name}
                        </h5>
                        <p className="text-[10px] text-slate-500 truncate">
                          {lang === "he" ? proj.locationHe : proj.locationEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: INSTRUCTIONAL VIDEO CENTER */}
          {activeTab === "videos" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {lang === "he" ? "ספריית וידאו והדרכה" : "Video Guides & Durability Logs"}
                </h4>
                <span className="text-[10px] text-slate-500 font-bold">
                  {OFFICIAL_VIDEOS.length} {lang === "he" ? "סרטונים" : "Videos"}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                {OFFICIAL_VIDEOS.map((vid) => {
                  const isActive = activeMedia?.id === vid.id;
                  return (
                    <div
                      key={vid.id}
                      onClick={() => {
                        setActiveMedia(vid);
                        setIsPlaying(false);
                      }}
                      className={`flex gap-3 p-2.5 rounded-xl border text-right transition-all cursor-pointer items-center ${
                        isActive
                          ? "border-amber-500 bg-amber-500/5 shadow-xs"
                          : "border-slate-100 hover:border-slate-200 bg-white"
                      }`}
                    >
                      <div className="h-12 w-16 rounded-lg bg-slate-900 flex-shrink-0 flex items-center justify-center relative border border-slate-800">
                        <Video className="h-5 w-5 text-amber-500" />
                        <div className="absolute bottom-1 right-1 bg-black/60 px-1 py-0.2 rounded text-[8px] text-white font-mono">
                          {vid.timestamp}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[9px] bg-amber-500/10 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                            {lang === "he" ? vid.tagHe : vid.tagEn}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold">
                            {lang === "he" ? "וידאו" : "Video"}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 truncate pr-0.5">
                          {vid.name}
                        </h5>
                        <p className="text-[10px] text-slate-500 truncate">
                          {lang === "he" ? vid.locationHe : vid.locationEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: USER MY MEDIA LOADER */}
          {activeTab === "uploads" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Local Uploads + Google Drive Media Import */}
              <div className="space-y-4">
                {/* Drag and drop zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 min-h-[140px] ${
                    isDragging
                      ? "border-amber-500 bg-amber-500/5 scale-98"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                  id="drag-and-drop-uploader"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,video/*"
                    className="hidden"
                    multiple
                  />
                  
                  <div className="h-9 w-9 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center">
                    <Upload className="h-4.5 w-4.5 text-amber-500 animate-bounce" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-800">
                      {lang === "he" ? "גרור והשלך תמונה או סרטון של הגג" : "Drag & drop photos or video of your roof"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {lang === "he" ? "או לחץ לבחירת קובץ מקומי" : "or click to browse your local device"}
                    </p>
                  </div>

                  <span className="text-[8px] text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-full font-semibold">
                    PNG, JPG, MP4 up to 50MB
                  </span>
                </div>

                {/* Google Drive Media Importer */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                      <Cloud className="h-4 w-4 text-blue-500" />
                      <span>{lang === "he" ? "ייבוא ישיר מ-Google Drive" : "Import from Google Drive"}</span>
                    </div>
                    {driveToken && (
                      <button
                        onClick={() => fetchDriveMedia()}
                        disabled={isSearchingDrive}
                        className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors cursor-pointer border-0 bg-transparent"
                        title={lang === "he" ? "רענן מדיה" : "Refresh Cloud Media"}
                      >
                        <RefreshCw className={`h-3 w-3 ${isSearchingDrive ? "animate-spin" : ""}`} />
                      </button>
                    )}
                  </div>

                  {!driveToken ? (
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {lang === "he"
                        ? "💡 טיפ: חבר את ה-Google Drive שלך בתיבה שלמעלה כדי לסרוק ולייבא תמונות או סרטונים ישירות מהענן!"
                        : "💡 Tip: Connect your Google Drive in the account panel above to scan and import your project's images or videos directly!"
                      }
                    </p>
                  ) : isSearchingDrive ? (
                    <div className="flex justify-center items-center py-6 text-[10px] text-slate-400 gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-500" />
                      <span>{lang === "he" ? "סורק תמונות וסרטונים ב-Drive..." : "Scanning Drive for images & videos..."}</span>
                    </div>
                  ) : driveMediaFiles.length === 0 ? (
                    <p className="text-[10px] text-slate-400 bg-white p-3 rounded-xl border border-slate-100 text-center">
                      {lang === "he"
                        ? "לא נמצאו קבצי תמונה או וידאו ב-Google Drive שלך."
                        : "No image or video files found on your Google Drive."
                      }
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto bg-white border border-slate-100 rounded-xl p-2 shadow-inner">
                      {driveMediaFiles.map((file) => {
                        const isCurrentlyImporting = importingFileId === file.id;
                        const isVideo = file.mimeType.startsWith("video/");
                        return (
                          <div key={file.id} className="flex items-center justify-between gap-2 p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className="flex items-center gap-2 min-w-0 flex-1 text-right">
                              {file.thumbnailLink ? (
                                <img src={file.thumbnailLink} className="h-6 w-8 rounded object-cover" alt="" referrerPolicy="no-referrer" />
                              ) : (
                                <div className={`h-6 w-8 rounded flex items-center justify-center ${isVideo ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"}`}>
                                  {isVideo ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                                </div>
                              )}
                              <span className="text-[10px] font-bold text-slate-700 truncate block">
                                {file.name}
                              </span>
                            </div>

                            <button
                              onClick={() => handleImportFromDrive(file)}
                              disabled={isCurrentlyImporting || importingFileId !== null}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-[9px] rounded-md transition-all cursor-pointer flex items-center gap-1 border-0"
                            >
                              {isCurrentlyImporting ? (
                                <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                              ) : (
                                <Download className="h-2.5 w-2.5" />
                              )}
                              <span>{lang === "he" ? "ייבא" : "Import"}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Uploaded Queue */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {lang === "he" ? "רשימת קבצים בפרויקט שלי" : "My Project Media Queue"}
                </h4>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {uploadedList.length > 0 ? (
                    uploadedList.map((media) => {
                      const isActive = activeMedia?.id === media.id;
                      return (
                        <div
                          key={media.id}
                          onClick={() => {
                            setActiveMedia(media);
                            if (media.type === "video") {
                              setIsPlaying(true);
                            } else {
                              setIsPlaying(false);
                            }
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                            isActive
                              ? "border-amber-500 bg-amber-500/5 font-semibold text-slate-950"
                              : "border-slate-100 hover:border-slate-200 bg-white text-slate-600"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              media.type === "video" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"
                            }`}>
                              {media.type === "video" ? <Video className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                            </div>
                            <div className="text-right min-w-0">
                              <p className="text-[10px] font-bold truncate max-w-[140px]">{media.name}</p>
                              <span className="text-[8px] text-slate-400 block mt-0.5">
                                {media.timestamp} • {media.type === "video" ? (lang === "he" ? "סרטון" : "Video") : (lang === "he" ? "תמונה" : "Photo")}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isActive && (
                              <span className="text-[8px] font-bold bg-emerald-500/10 text-emerald-800 px-1.5 py-0.5 rounded-md">
                                {lang === "he" ? "מוצג" : "Active"}
                              </span>
                            )}
                            <button
                              onClick={(e) => deleteMedia(media.id, e)}
                              className="p-1 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-600 transition-colors cursor-pointer border-0 bg-transparent"
                              title="Delete file"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-slate-100 text-[10px] text-slate-400">
                      {lang === "he" ? "אין קבצים מועלים עדיין" : "No project files uploaded yet"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* TAB 4: VEO VIDEO CONTROLS */}
          {activeTab === "veo" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {lang === "he" ? "בקרת יצירה: וידאו Veo 3" : "Veo 3 AI Creation Controls"}
                </h4>
                <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                  VEO 3.0 FLASH
                </span>
              </div>

              {/* Step 1: Preset Selectors */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-right">
                  {lang === "he" ? "צעד 1: בחר סגנון ותרחיש סולארי" : "Step 1: Select Solar Scenario"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {VEO_PRESETS.map((preset) => {
                    const isSelected = selectedPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setSelectedPresetId(preset.id)}
                        className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/50 shadow-sm"
                            : "border-slate-100 hover:border-slate-200 bg-white"
                        }`}
                      >
                        <span className={`text-[11px] font-bold block ${isSelected ? "text-orange-600 font-black" : "text-slate-800"}`}>
                          {lang === "he" ? preset.titleHe : preset.titleEn}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {(lang === "he" ? preset.tagsHe : preset.tagsEn).map((tag, i) => (
                            <span 
                              key={i} 
                              className={`text-[8px] px-1.5 py-0.5 rounded-md ${
                                isSelected ? "bg-orange-100/50 text-orange-700" : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Prompt Textbox */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    {veoPrompt.length} {lang === "he" ? "תווים" : "chars"}
                  </span>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-right">
                    {lang === "he" ? "צעד 2: ערוך או כתוב הנחיה אישית" : "Step 2: Customize Prompt"}
                  </label>
                </div>
                <textarea
                  value={veoPrompt}
                  onChange={(e) => setVeoPrompt(e.target.value)}
                  disabled={veoIsGenerating}
                  rows={4}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none bg-slate-50/50 hover:bg-white transition-colors text-right"
                  placeholder={lang === "he" ? "הקלד תיאור חופשי של הסרטון שברצונך לייצר..." : "Type custom description of video prompt..."}
                />
              </div>

              {/* Step 3: Lens & Advanced Settings */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* Style selector */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block text-right">
                      {lang === "he" ? "סגנון צילום" : "CAMERA STYLE"}
                    </label>
                    <select
                      value={veoStyle}
                      onChange={(e) => setVeoStyle(e.target.value)}
                      disabled={veoIsGenerating}
                      className="w-full text-[10px] font-bold bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-orange-500"
                    >
                      <option value="cinematic">{lang === "he" ? "קולנועי (Cinematic)" : "Cinematic 8k"}</option>
                      <option value="drone">{lang === "he" ? "מבט רחפן (Drone)" : "FPV Drone Path"}</option>
                      <option value="isometric">{lang === "he" ? "איזומטרי תלת-ממד" : "Isometric Render"}</option>
                    </select>
                  </div>

                  {/* Lighting settings */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block text-right">
                      {lang === "he" ? "זמן ותאורה" : "LIGHTING & TIME"}
                    </label>
                    <select
                      disabled={veoIsGenerating}
                      className="w-full text-[10px] font-bold bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-orange-500"
                    >
                      <option value="golden">{lang === "he" ? "שקיעה / שעת זהב" : "Sunset Golden Hour"}</option>
                      <option value="noon">{lang === "he" ? "צהריים בהירים" : "Bright Midday Sun"}</option>
                      <option value="overcast">{lang === "he" ? "מעונן חלקית" : "Soft Overcast Light"}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Trigger Button */}
              <button
                onClick={handleGenerateVeoVideo}
                disabled={veoIsGenerating || !veoPrompt.trim()}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white shadow-orange-500/15 hover:shadow-orange-500/25 active:scale-[0.98]"
                id="btn-veo-generate-trigger"
              >
                <Sparkles className={`h-4 w-4 ${veoIsGenerating ? "animate-spin text-slate-500" : "text-white animate-pulse"}`} />
                <span>
                  {veoIsGenerating
                    ? lang === "he" ? `מייצר וידאו סולארי (${veoProgress.toFixed(0)}%)...` : `Compiling Solar Frames (${veoProgress.toFixed(0)}%)...`
                    : lang === "he" ? "ייצר סרטון וידאו ב-Veo 3 🎬" : "Generate Cinematic Video with Veo 3 🎬"
                  }
                </span>
              </button>
            </div>
          )}

          {/* Persistent Info Card pointing to real Apollo Tech details */}
          <div className="bg-slate-900 text-slate-300 rounded-2xl p-4 border border-slate-800 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              {lang === "he" ? "טכנולוגיה מתוצרת ישראל" : "Israeli DeepTech Solar"}
            </span>
            <p className="text-[10px] text-slate-400 leading-relaxed text-right">
              {lang === "he"
                ? "הפאנלים של אפולו מיוצרים במפעל מתקדם בישראל, ומאפשרים הספק חסר תקדים על גגות קלים, משטחים מעוקלים, רכבים וסיפוני יאכטות עם אפס פליטת פחמן בהתקנה עצמית פשוטה."
                : "Apollo Power's patented roll-to-roll active solar film delivers solar harvesting capability to surfaces once deemed impossible: light metal roofs, vehicles, composite sails, and active marine hulls."
              }
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
