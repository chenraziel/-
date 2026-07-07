import React, { useState, useEffect } from "react";
import { 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  RefreshCw, 
  Download, 
  FileJson, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  FileDown, 
  Sparkles,
  Info
} from "lucide-react";
import { 
  googleSignIn, 
  initAuth, 
  logout, 
  saveFileToDrive, 
  listFilesFromDrive, 
  downloadJsonFile, 
  deleteFileFromDrive,
  DriveFile 
} from "../lib/googleDrive";
import { Language, ProjectType, SavedApplianceUsage } from "../types";
import { APOLLO_PANELS, PREDEFINED_SURFACES } from "../data";
import { motion, AnimatePresence } from "motion/react";

interface GoogleDriveSyncProps {
  lang: Language;
  t: any;
  currentProjectState: {
    surfaceType: ProjectType;
    surfaceWidth: number;
    surfaceLength: number;
    selectedPanelId: string;
    panelCount: number;
    panels: any[];
    appliancesUsage: SavedApplianceUsage[];
    location: string;
    dailyGeneration: number;
    dailyConsumption: number;
  };
  onLoadProject: (project: any) => void;
}

export default function GoogleDriveSync({
  lang,
  t,
  currentProjectState,
  onLoadProject
}: GoogleDriveSyncProps) {
  // Auth states
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Drive file states
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [loadingFileId, setLoadingFileId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<{
    type: "success" | "error" | "info" | null;
    messageHe: string;
    messageEn: string;
  }>({ type: null, messageHe: "", messageEn: "" });

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        setNeedsAuth(false);
        fetchFiles(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch listed projects from Google Drive
  const fetchFiles = async (tokenToUse?: string | null) => {
    const token = tokenToUse || accessToken;
    if (!token) return;

    setIsLoadingFiles(true);
    try {
      const files = await listFilesFromDrive(token, "json");
      setDriveFiles(files);
    } catch (err: any) {
      console.error("Error listing files:", err);
      showTemporaryStatus(
        "error",
        "שגיאה בטעינת קבצים מ-Google Drive",
        "Error loading files from Google Drive"
      );
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const showTemporaryStatus = (type: "success" | "error" | "info", messageHe: string, messageEn: string) => {
    setSyncStatus({ type, messageHe, messageEn });
    setTimeout(() => {
      setSyncStatus({ type: null, messageHe: "", messageEn: "" });
    }, 5000);
  };

  // Sign In Handler
  const handleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        setNeedsAuth(false);
        showTemporaryStatus(
          "success",
          "חיבור ל-Google Drive בוצע בהצלחה!",
          "Connected to Google Drive successfully!"
        );
        fetchFiles(result.accessToken);
      }
    } catch (err: any) {
      console.error("Sign-in failed:", err);
      showTemporaryStatus(
        "error",
        "התחברות נכשלה. אנא ודא שאישרת את ההרשאות המתאימות בחלון הקופץ.",
        "Sign-in failed. Please ensure you allowed popup permissions."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      setNeedsAuth(true);
      setDriveFiles([]);
      showTemporaryStatus(
        "info",
        "התנתקת מחשבון Google Drive בהצלחה",
        "Disconnected from Google Drive account"
      );
    } catch (err) {
      console.error("Sign-out failed:", err);
    }
  };

  // Save current project state to Google Drive as JSON
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    if (!projectName.trim()) {
      showTemporaryStatus(
        "error",
        "אנא הזן שם לפרויקט תחילה",
        "Please enter a project name first"
      );
      return;
    }

    setIsSaving(true);
    try {
      const cleanName = projectName.trim();
      const filename = `apollo_solar_project_${cleanName.replace(/\s+/g, "_")}.json`;
      
      const projectPayload = {
        _isApolloProject: true,
        projectName: cleanName,
        savedAt: new Date().toISOString(),
        ...currentProjectState
      };

      const fileId = await saveFileToDrive(
        accessToken,
        filename,
        "application/json",
        JSON.stringify(projectPayload, null, 2)
      );

      showTemporaryStatus(
        "success",
        `הפרויקט "${cleanName}" נשמר בהצלחה ב-Google Drive!`,
        `Project "${cleanName}" saved successfully to Google Drive!`
      );
      setProjectName("");
      fetchFiles(accessToken);
    } catch (err: any) {
      console.error("Failed to save project:", err);
      showTemporaryStatus(
        "error",
        "שגיאה בשמירת הפרויקט בענן",
        "Error saving project to Google Drive"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Load selected project JSON from Google Drive
  const handleLoadProject = async (fileId: string, name: string) => {
    if (!accessToken) return;
    setLoadingFileId(fileId);
    try {
      const data = await downloadJsonFile(accessToken, fileId);
      if (data && data._isApolloProject) {
        onLoadProject(data);
        showTemporaryStatus(
          "success",
          `הפרויקט "${data.projectName || name}" נטען בהצלחה!`,
          `Project "${data.projectName || name}" loaded successfully!`
        );
      } else {
        showTemporaryStatus(
          "error",
          "קובץ זה אינו מכיל נתוני פרויקט תואמים של Apollo Solar Studio.",
          "This file does not contain valid Apollo Solar Studio data."
        );
      }
    } catch (err: any) {
      console.error("Failed to load project:", err);
      showTemporaryStatus(
        "error",
        "שגיאה בהורדת הקובץ מ-Google Drive",
        "Error loading project file from Google Drive"
      );
    } finally {
      setLoadingFileId(null);
    }
  };

  // Delete project with mandatory user confirmation dialogue
  const handleDeleteProject = async (fileId: string, name: string) => {
    if (!accessToken) return;

    const confirmMessage = lang === "he"
      ? `האם אתה בטוח שברצונך למחוק לצמיתות את הפרויקט "${name}" מ-Google Drive?`
      : `Are you sure you want to permanently delete the project "${name}" from Google Drive?`;

    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    try {
      await deleteFileFromDrive(accessToken, fileId);
      showTemporaryStatus(
        "success",
        `הקובץ "${name}" נמחק מ-Google Drive`,
        `File "${name}" deleted from Google Drive`
      );
      fetchFiles(accessToken);
    } catch (err) {
      console.error("Failed to delete file:", err);
      showTemporaryStatus(
        "error",
        "שגיאה במחיקת הקובץ מ-Google Drive",
        "Error deleting file from Google Drive"
      );
    }
  };

  // Export full PDF-Style Planner report to Google Drive as Markdown/Text file
  const handleExportReport = async () => {
    if (!accessToken) return;
    setIsExporting(true);

    try {
      const activePanel = APOLLO_PANELS.find((p) => p.id === currentProjectState.selectedPanelId) || APOLLO_PANELS[0];
      const activeSurface = PREDEFINED_SURFACES.find((s) => s.id === currentProjectState.surfaceType) || PREDEFINED_SURFACES[0];
      const systemPower = currentProjectState.panelCount * activePanel.power;
      const totalCost = currentProjectState.panelCount * activePanel.priceEstimate;
      const totalWeight = currentProjectState.panelCount * activePanel.weight;

      // Construct a beautiful comprehensive markdown report
      const reportMarkdown = `# APOLLO SOLAR STUDIO - PROJECT SUMMARY & SYSTEM DESIGN REPORT
===================================================================
Generated on: ${new Date().toLocaleString()}
Owner: ${user?.displayName || "Apollo User"} (${user?.email || "No Email"})

1. SURFACE CONFIGURATION
-------------------------------------------------------------------
- Predefined Surface Type: ${activeSurface.nameEn} (${activeSurface.nameHe})
- Custom Geometric Length: ${currentProjectState.surfaceLength} meters
- Custom Geometric Width: ${currentProjectState.surfaceWidth} meters
- Total Fitting Surface Area: ${(currentProjectState.surfaceLength * currentProjectState.surfaceWidth).toFixed(2)} sq. meters

2. APOLLO FLEXIBLE SOLAR MODULES SPECIFICATION
-------------------------------------------------------------------
- Selected Flexible Panel: ${activePanel.nameEn} (Apollo Series)
- Single Panel Power Rating: ${activePanel.power} Watts
- Efficiency Rate: ${activePanel.efficiency}% 
- Installed Panel Modules Count: ${currentProjectState.panelCount} units
- Combined Total Peak Power: ${systemPower} Watts (Pmax)
- Total Flexible System Weight: ${totalWeight.toFixed(1)} Kg (Only ${(totalWeight / (currentProjectState.surfaceLength * currentProjectState.surfaceWidth)).toFixed(2)} Kg/m²!)
- Total Cost Estimate: ₪${totalCost.toLocaleString()} ILS

3. HOURLY ENERGY CALCULATIONS & SOLAR YIELD
-------------------------------------------------------------------
- Targeted Location Climate: ${currentProjectState.location === "center" ? "Central Israel (High Yield)" : currentProjectState.location === "south" ? "Southern Israel / Negev (Max Desert Yield)" : "Northern Israel (Standard Yield)"}
- Combined Expected Daily Generation: ${currentProjectState.dailyGeneration.toFixed(0)} Wh/day
- Simulated Home/Vehicle Appliance Consumption: ${currentProjectState.dailyConsumption.toFixed(0)} Wh/day
- Net Energy Balance Status: ${currentProjectState.dailyGeneration >= currentProjectState.dailyConsumption ? `SURPLUS (+ ${(currentProjectState.dailyGeneration - currentProjectState.dailyConsumption).toFixed(0)} Wh/day)` : `DEFICIT (- ${(currentProjectState.dailyConsumption - currentProjectState.dailyGeneration).toFixed(0)} Wh/day)`}

4. SIMULATED ELECTRICAL LOAD BREAKDOWN
-------------------------------------------------------------------
${currentProjectState.appliancesUsage.map(app => {
  return `- Appliance Load: ${app.applianceId} | Qty: ${app.quantity} | Duration: ${app.hoursPerDay} hrs/day`;
}).join("\n")}

5. STEP-BY-STEP ADVISORY
-------------------------------------------------------------------
- No drilling, no heavy rails or structures required. Apollo film is peel-and-stick.
- Clean the mounting surface thoroughly with isopropyl alcohol before applying.
- Use the standard MC4 connectors to wire panels to your MPPT Charge Controller.
- Keep the system weights low to save vehicle range or marine hydrodynamics!

===================================================================
Apollo Solar Studio - Revolutionizing Flexible Solar Technology
Produced by Google Workspace Cloud Sync Integrator.
`;

      const safeFilename = `apollo_solar_report_${Date.now()}.txt`;
      await saveFileToDrive(accessToken, safeFilename, "text/plain", reportMarkdown);

      showTemporaryStatus(
        "success",
        `דוח הפרויקט המלא יוצא בהצלחה כקובץ טקסט בשם "${safeFilename}" ל-Google Drive שלך!`,
        `The complete project report has been successfully exported as "${safeFilename}" to your Google Drive!`
      );
    } catch (err: any) {
      console.error("Report export failed:", err);
      showTemporaryStatus(
        "error",
        "ייצוא הדוח ל-Google Drive נכשל",
        "Failed to export report to Google Drive"
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col gap-6" id="google-drive-sync-card">
      {/* Header of the Sync section */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
            <Cloud className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-none">
              {lang === "he" ? "סנכרון וגיבוי Google Drive" : "Google Drive Cloud Storage"}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">
              SECURE WORKSPACE API INTEGRATION
            </span>
          </div>
        </div>

        {/* Quick Sync status icon or logout button */}
        {!needsAuth && user && (
          <button
            onClick={handleSignOut}
            className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-100 transition-colors cursor-pointer flex items-center gap-1"
            title={lang === "he" ? "התנתק" : "Sign Out"}
            id="btn-drive-signout"
          >
            <LogOut className="h-3 w-3" />
            <span>{lang === "he" ? "התנתק" : "Sign Out"}</span>
          </button>
        )}
      </div>

      {/* Connection and Operation UI status alerts */}
      <AnimatePresence mode="popLayout">
        {syncStatus.type && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
              syncStatus.type === "success" 
                ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                : syncStatus.type === "error"
                ? "bg-red-50 border-red-100 text-red-800"
                : "bg-blue-50 border-blue-100 text-blue-800"
            }`}
          >
            {syncStatus.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : syncStatus.type === "error" ? (
              <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            ) : (
              <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            )}
            <p className="font-medium text-[11px] leading-relaxed">
              {lang === "he" ? syncStatus.messageHe : syncStatus.messageEn}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signed-Out State Indicator with branded Sign-in Button */}
      {needsAuth ? (
        <div className="space-y-4 text-center py-4 bg-slate-50/50 border border-slate-100/70 rounded-2xl p-6">
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {lang === "he"
              ? "חבר את ה-Google Drive שלך כדי לשמור את תכנון הפאנלים הסולאריים שלך בענן, לטעון הגדרות קודמות, ולייצא דוחות מפרט מפורטים."
              : "Connect your Google Drive to securely save and load your customized flexible solar panel designs, load past sessions, and export full PDF-style planning reports."
            }
          </p>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleSignIn}
              disabled={isLoggingIn}
              className="gsi-material-button relative overflow-hidden transition-all shadow-md hover:shadow-lg hover:scale-101 border border-slate-200"
              id="google-signin-btn-custom"
            >
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents">
                  {isLoggingIn 
                    ? (lang === "he" ? "מתחבר..." : "Connecting...") 
                    : (lang === "he" ? "התחבר באמצעות Google" : "Sign in with Google")
                  }
                </span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* Connected State Actions Dashboard */
        <div className="space-y-6">
          
          {/* Active Cloud Profile indicator */}
          <div className="flex items-center gap-3 bg-slate-50/50 rounded-xl p-3 border border-slate-100">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Google Avatar"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center">
                {user?.displayName?.[0] || "U"}
              </div>
            )}
            <div className="text-right flex-1">
              <span className="text-xs font-black text-slate-800 block">
                {user?.displayName || "Google Cloud User"}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {user?.email}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-full border border-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              {lang === "he" ? "מחובר ומאובטח" : "Cloud Active"}
            </span>
          </div>

          {/* Action Part 1: Save Configuration */}
          <form onSubmit={handleSaveProject} className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {lang === "he" ? "שמור פרויקט נוכחי ב-Drive" : "Save Current System to Drive"}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder={lang === "he" ? "שם לפרויקט (למשל: יאכטה סולארית 1)" : "Project name (e.g. My Solar Caravan)"}
                disabled={isSaving}
                className="flex-1 text-xs p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50 hover:bg-white transition-colors"
                maxLength={40}
              />
              <button
                type="submit"
                disabled={isSaving || !projectName.trim()}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-100 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/10 hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer border-0"
              >
                {isSaving ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileJson className="h-3.5 w-3.5" />
                )}
                <span>{lang === "he" ? "שמור" : "Save"}</span>
              </button>
            </div>
          </form>

          {/* Action Part 2: Quick Export Full Text report */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider block">
                {lang === "he" ? "דוח מפרט טכני מלא" : "System Specification Report"}
              </span>
              <p className="text-[10px] text-slate-400">
                {lang === "he"
                  ? "ייצא קובץ דוח טקסט מקיף הכולל חישובים, הספקים, משקלים והנחיות התקנה של אפולו."
                  : "Export a detailed layout text report including exact specs, energy calculations, weights, and step-by-step advisory."
                }
              </p>
            </div>
            <button
              onClick={handleExportReport}
              disabled={isExporting}
              className="py-2.5 px-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] rounded-lg flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer border-0"
            >
              {isExporting ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              )}
              <span>{lang === "he" ? "ייצא דוח" : "Export Report"}</span>
            </button>
          </div>

          {/* Action Part 3: Load existing configurations */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {lang === "he" ? "טען פרויקטים שמורים ב-Drive" : "Load Saved Systems from Cloud"}
              </label>
              
              <button
                type="button"
                onClick={() => fetchFiles()}
                disabled={isLoadingFiles}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title={lang === "he" ? "רענן רשימה" : "Refresh List"}
              >
                <RefreshCw className={`h-3 w-3 ${isLoadingFiles ? "animate-spin" : ""}`} />
              </button>
            </div>

            {isLoadingFiles ? (
              <div className="flex justify-center items-center py-6 text-xs text-slate-400 gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                <span>{lang === "he" ? "סורק את ה-Google Drive שלך..." : "Scanning Google Drive files..."}</span>
              </div>
            ) : driveFiles.length === 0 ? (
              <div className="bg-slate-50 border border-slate-100/60 rounded-xl p-4 text-center text-[11px] text-slate-400">
                {lang === "he"
                  ? "לא נמצאו פרויקטים שמורים ב-Drive. הקלד שם פרויקט למעלה כדי ליצור את הראשון!"
                  : "No saved Apollo solar projects found. Save your current design above to create one!"
                }
              </div>
            ) : (
              <div className="max-h-[220px] overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl bg-white shadow-xs">
                {driveFiles.map((file) => {
                  const isCurrentLoading = loadingFileId === file.id;
                  const readableName = file.name
                    .replace("apollo_solar_project_", "")
                    .replace(".json", "")
                    .replace(/_/g, " ");

                  return (
                    <div key={file.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                      <div className="text-right flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-800 block truncate">
                          {readableName}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {file.createdTime ? new Date(file.createdTime).toLocaleDateString() : ""} | {(parseFloat(file.size || "0") / 1024).toFixed(1)} KB
                        </span>
                      </div>

                      <div className="flex gap-1.5 flex-shrink-0">
                        {/* Load Button */}
                        <button
                          onClick={() => handleLoadProject(file.id, readableName)}
                          disabled={isCurrentLoading}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 font-bold text-[10px] rounded-md transition-colors flex items-center gap-1 cursor-pointer border-0"
                        >
                          {isCurrentLoading ? (
                            <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                          ) : (
                            <Download className="h-3 w-3" />
                          )}
                          <span>{lang === "he" ? "טען" : "Load"}</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteProject(file.id, readableName)}
                          className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-md text-slate-300 transition-colors cursor-pointer border-0"
                          title={lang === "he" ? "מחק קובץ" : "Delete File"}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Embedded sign-in styles */}
      <style>{`
        .gsi-material-button {
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          -webkit-appearance: none;
          background-color: WHITE;
          background-image: none;
          border-radius: 8px;
          box-sizing: border-box;
          color: #1f1f1f;
          cursor: pointer;
          font-family: 'Roboto', arial, sans-serif;
          font-size: 13px;
          font-weight: 500;
          height: 44px;
          letter-spacing: 0.25px;
          outline: none;
          overflow: hidden;
          padding: 0 16px;
          position: relative;
          text-align: center;
          text-transform: none;
          user-select: none;
          width: auto;
          min-width: 210px;
        }

        .gsi-material-button .gsi-material-button-state {
          -webkit-transition: opacity .218s;
          transition: opacity .218s;
          bottom: 0;
          left: 0;
          opacity: 0;
          position: absolute;
          right: 0;
          top: 0;
        }

        .gsi-material-button:disabled {
          cursor: default;
          background-color: #ffffff61;
          color: #1f1f1f1f;
        }

        .gsi-material-button:disabled .gsi-material-button-state {
          opacity: 0;
        }

        .gsi-material-button:hover .gsi-material-button-state {
          background-color: #303030;
          opacity: 0.04;
        }

        .gsi-material-button:focus .gsi-material-button-state {
          background-color: #303030;
          opacity: 0.12;
        }

        .gsi-material-button:active .gsi-material-button-state {
          background-color: #303030;
          opacity: 0.16;
        }

        .gsi-material-button-content-wrapper {
          align-items: center;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          height: 100%;
          justify-content: center;
          position: relative;
          width: 100%;
        }

        .gsi-material-button-icon {
          height: 20px;
          margin-right: 12px;
          min-width: 20px;
          width: 20px;
        }

        [dir="rtl"] .gsi-material-button-icon {
          margin-right: 0;
          margin-left: 12px;
        }

        .gsi-material-button-contents {
          flex-grow: 1;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
