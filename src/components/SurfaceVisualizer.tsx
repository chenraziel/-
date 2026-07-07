import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  RotateCw, 
  Zap, 
  Sparkles, 
  Scale, 
  Info,
  Maximize2
} from "lucide-react";
import { Language, ProjectType, SolarPanelSpec } from "../types";

interface PanelInstance {
  id: string;
  x: number; // in meters relative to surface top-left
  y: number; // in meters relative to surface top-left
  width: number; // in meters
  length: number; // in meters
  rotated: boolean;
}

interface SurfaceVisualizerProps {
  lang: Language;
  t: any;
  surfaceType: ProjectType;
  surfaceWidth: number; // meters
  surfaceLength: number; // meters
  selectedPanel: SolarPanelSpec;
  panelCount: number;
  setPanelCount: (count: number) => void;
  panels: PanelInstance[];
  setPanels: React.Dispatch<React.SetStateAction<PanelInstance[]>>;
}

export default function SurfaceVisualizer({
  lang,
  t,
  surfaceType,
  surfaceWidth,
  surfaceLength,
  selectedPanel,
  panelCount,
  setPanelCount,
  panels,
  setPanels
}: SurfaceVisualizerProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(80); // pixels per meter

  // Responsive scale calculations based on container width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Leave 40px padding on each side
        const availableWidth = containerWidth - 80;
        // Scale should fit the surface length (always draw length horizontally for aesthetic consistency)
        const calculatedScale = Math.min(
          availableWidth / surfaceLength,
          320 / surfaceWidth // Keep height reasonable
        );
        setScale(Math.max(20, Math.min(calculatedScale, 150)));
      }
    };

    updateScale();
    // Add event listener for window resize
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [surfaceLength, surfaceWidth, containerRef]);

  // Sync panelCount to length of panels state
  useEffect(() => {
    setPanelCount(panels.length);
  }, [panels, setPanelCount]);

  // Handle auto-layout
  const handleAutoLayout = () => {
    const margin = 0.15; // 15cm boundary margin
    const gap = 0.08;   // 8cm gap between panels
    const availL = surfaceLength - (margin * 2);
    const availW = surfaceWidth - (margin * 2);

    if (availL <= 0 || availW <= 0) return;

    // We can try orientation: vertical (length horizontal) or horizontal (length vertical)
    const pW = selectedPanel.width;
    const pL = selectedPanel.length;

    // Option 1: Standard layout (length parallel to surface length)
    const cols1 = Math.floor((availL + gap) / (pL + gap));
    const rows1 = Math.floor((availW + gap) / (pW + gap));
    const total1 = Math.max(0, cols1 * rows1);

    // Option 2: Rotated layout (length parallel to surface width)
    const cols2 = Math.floor((availL + gap) / (pW + gap));
    const rows2 = Math.floor((availW + gap) / (pL + gap));
    const total2 = Math.max(0, cols2 * rows2);

    let finalPanels: PanelInstance[] = [];

    if (total1 >= total2 && total1 > 0) {
      // Place Option 1
      for (let r = 0; r < rows1; r++) {
        for (let c = 0; c < cols1; c++) {
          finalPanels.push({
            id: `auto-${r}-${c}`,
            x: margin + c * (pL + gap),
            y: margin + r * (pW + gap),
            width: pW,
            length: pL,
            rotated: false
          });
        }
      }
    } else if (total2 > 0) {
      // Place Option 2 (Rotated panels)
      for (let r = 0; r < rows2; r++) {
        for (let c = 0; c < cols2; c++) {
          finalPanels.push({
            id: `auto-${r}-${c}`,
            x: margin + c * (pW + gap),
            y: margin + r * (pL + gap),
            width: pL,
            length: pW,
            rotated: true
          });
        }
      }
    }

    setPanels(finalPanels);
  };

  // Add a panel manually at the center
  const addPanelManually = () => {
    const id = `manual-${Date.now()}`;
    const x = Math.max(0.1, (surfaceLength - selectedPanel.length) / 2);
    const y = Math.max(0.1, (surfaceWidth - selectedPanel.width) / 2);

    setPanels((prev) => [
      ...prev,
      {
        id,
        x,
        y,
        width: selectedPanel.width,
        length: selectedPanel.length,
        rotated: false
      }
    ]);
  };

  // Rotate a specific panel
  const rotatePanel = (id: string) => {
    setPanels((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isRotated = !p.rotated;
          // Swap width & length
          return {
            ...p,
            width: isRotated ? selectedPanel.length : selectedPanel.width,
            length: isRotated ? selectedPanel.width : selectedPanel.length,
            rotated: isRotated
          };
        }
        return p;
      })
    );
  };

  // Remove a specific panel
  const removePanel = (id: string) => {
    setPanels((prev) => prev.filter((p) => p.id !== id));
  };

  // Clear all panels
  const clearAllPanels = () => {
    setPanels([]);
  };

  // SVG representation of the chosen surface type
  const renderSurfaceGraphic = () => {
    switch (surfaceType) {
      case "rv":
        return (
          <>
            {/* RV windshield */}
            <rect x={10} y={15} width={15} height={10} rx={2} fill="#e2e8f0" opacity={0.6} />
            <path d="M 12 15 Q 25 10 38 15" stroke="#cbd5e1" strokeWidth={2} fill="none" />
            {/* RV AC Unit outline in the middle of the roof */}
            <rect x="55%" y="40%" width={40} height={20} rx={4} fill="#94a3b8" opacity={0.5} />
            <text x="55%" y="35%" fontSize="9" className="fill-slate-400 font-sans font-medium">AC UNIT</text>
          </>
        );
      case "marine":
        return (
          <>
            {/* Yacht bow/stern curves */}
            <path d={`M 0 0 L 15 0 C 45 30, 45 70, 15 ${surfaceWidth * scale} L 0 ${surfaceWidth * scale} Z`} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 4" />
            <circle cx="95%" cy="50%" r="12" fill="none" stroke="#94a3b8" strokeWidth={1.5} opacity={0.4} />
            <circle cx="95%" cy="50%" r="4" fill="#94a3b8" opacity={0.4} />
          </>
        );
      case "roof":
        return (
          <>
            {/* Curved roof corrugation lines */}
            <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#e2e8f0" strokeWidth={1} />
            <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#e2e8f0" strokeWidth={1} />
            <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#e2e8f0" strokeWidth={1} />
            <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#e2e8f0" strokeWidth={1} />
          </>
        );
      case "awning":
        return (
          <>
            {/* Window awning framing and window glass shadow */}
            <rect x="15%" y="15%" width="70%" height="70%" rx={2} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 3" opacity={0.6} />
            <text x="50%" y="50%" fontSize="9" textAnchor="middle" className="fill-slate-400 font-sans font-semibold">WINDOW / WALL UNDER CANOPY</text>
          </>
        );
      case "pergolakit":
        return (
          <>
            {/* Elegant grid slats structure */}
            <line x1="10%" y1="0" x2="10%" y2="100%" stroke="#cbd5e1" strokeWidth={2} opacity={0.7} />
            <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#cbd5e1" strokeWidth={2} opacity={0.7} />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#cbd5e1" strokeWidth={2} opacity={0.7} />
            <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#cbd5e1" strokeWidth={2} opacity={0.7} />
            <line x1="90%" y1="0" x2="90%" y2="100%" stroke="#cbd5e1" strokeWidth={2} opacity={0.7} />
            <text x="50%" y="90%" fontSize="8" textAnchor="middle" className="fill-slate-400 font-mono font-bold uppercase tracking-wider">MODULAR ALUMINUM RAFTERS</text>
          </>
        );
      default:
        return null;
    }
  };

  // Drag and drop logic using custom offset math
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setDraggedId(id);

    const panel = panels.find((p) => p.id === id);
    if (!panel) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialPanelX = panel.x;
    const initialPanelY = panel.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / scale;
      const deltaY = (moveEvent.clientY - startY) / scale;

      // Bound panel to surface borders
      let newX = Math.max(0, Math.min(initialPanelX + deltaX, surfaceLength - panel.length));
      let newY = Math.max(0, Math.min(initialPanelY + deltaY, surfaceWidth - panel.width));

      // Snapping to grid (optional, 2.5cm increments for clean placement)
      newX = Math.round(newX * 40) / 40;
      newY = Math.round(newY * 40) / 40;

      setPanels((prev) =>
        prev.map((p) => (p.id === id ? { ...p, x: newX, y: newY } : p))
      );
    };

    const handleMouseUp = () => {
      setDraggedId(null);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Direct touch support for mobile DIY-ers
  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    const panel = panels.find((p) => p.id === id);
    if (!panel) return;

    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const initialPanelX = panel.x;
    const initialPanelY = panel.y;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const moveTouch = moveEvent.touches[0];
      const deltaX = (moveTouch.clientX - startX) / scale;
      const deltaY = (moveTouch.clientY - startY) / scale;

      let newX = Math.max(0, Math.min(initialPanelX + deltaX, surfaceLength - panel.length));
      let newY = Math.max(0, Math.min(initialPanelY + deltaY, surfaceWidth - panel.width));

      newX = Math.round(newX * 40) / 40;
      newY = Math.round(newY * 40) / 40;

      setPanels((prev) =>
        prev.map((p) => (p.id === id ? { ...p, x: newX, y: newY } : p))
      );
    };

    const handleTouchEnd = () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  // Compute weight comparisons
  // Flexible panels: panelCount * panelWeight.
  // Traditional panels are approx 12 kg per square meter (approx 20 kg for 300W glass panel) + heavy aluminum brackets
  const apolloTotalWeight = parseFloat((panels.reduce((sum, p) => sum + (p.rotated ? selectedPanel.weight : selectedPanel.weight), 0)).toFixed(1));
  
  // Traditional panels estimation: ~12kg per panel of 130W, plus racking ~3kg
  const traditionalTotalWeight = parseFloat((panels.length * (selectedPanel.power > 150 ? 22 : 12)).toFixed(1));
  const weightSaved = parseFloat(Math.max(0, traditionalTotalWeight - apolloTotalWeight).toFixed(1));

  const totalInstalledPower = panels.length * selectedPanel.power;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col gap-6" id="designer-canvas-section">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-sans tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
            {t.interactiveLayout}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {lang === "he" 
              ? `מידות המשטח: ${surfaceLength} מ׳ אורך × ${surfaceWidth} מ׳ רוחב`
              : `Surface area: ${surfaceLength}m length × ${surfaceWidth}m width`
            }
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={handleAutoLayout}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-sm"
            id="btn-auto-layout"
          >
            <Zap className="h-4 w-4" />
            {t.autoLayout}
          </button>
          
          <button
            onClick={addPanelManually}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all duration-200"
            id="btn-add-panel"
          >
            <Plus className="h-4 w-4 text-emerald-500" />
            {t.addPanel}
          </button>

          <button
            onClick={clearAllPanels}
            disabled={panels.length === 0}
            className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-red-500 border border-slate-200 rounded-lg disabled:opacity-40 disabled:hover:text-slate-400 transition-colors"
            title={t.clearPanels}
            id="btn-clear-panels"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Visual Workspace Canvas */}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
          <Info className="h-3.5 w-3.5" />
          {t.dragHelp}
        </span>

        <div 
          ref={containerRef}
          className="w-full relative bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 overflow-x-auto flex items-center justify-center min-h-[360px] cursor-crosshair select-none"
          id="solar-layout-canvas"
        >
          {/* Surface boundary */}
          <div
            className="relative bg-slate-200 rounded-2xl border-4 border-slate-300 shadow-inner overflow-hidden transition-all duration-300 flex-shrink-0"
            style={{
              width: `${surfaceLength * scale}px`,
              height: `${surfaceWidth * scale}px`,
            }}
          >
            {/* Custom SVG decor inside surface */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {renderSurfaceGraphic()}
            </svg>

            {/* Render placed panels */}
            <AnimatePresence>
              {panels.map((panel, idx) => {
                const panelWidthPx = panel.width * scale;
                const panelLengthPx = panel.length * scale;
                const panelXPx = panel.x * scale;
                const panelYPx = panel.y * scale;

                return (
                  <motion.div
                    key={panel.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`absolute rounded-md cursor-grab active:cursor-grabbing flex flex-col justify-between p-1.5 transition-shadow select-none group border shadow-sm ${
                      draggedId === panel.id 
                        ? "bg-amber-600 border-amber-500 z-50 shadow-md ring-2 ring-amber-400/50" 
                        : "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:shadow-md hover:border-amber-400/50"
                    }`}
                    style={{
                      width: `${panelLengthPx}px`,
                      height: `${panelWidthPx}px`,
                      left: `${panelXPx}px`,
                      top: `${panelYPx}px`,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, panel.id)}
                    onTouchStart={(e) => handleTouchStart(e, panel.id)}
                    id={`solar-panel-node-${panel.id}`}
                  >
                    {/* Panel Header Info */}
                    <div className="flex justify-between items-center pointer-events-none">
                      <span className="text-[10px] font-mono font-bold text-amber-400 leading-none">
                        #{idx + 1}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium leading-none">
                        {selectedPanel.power}W
                      </span>
                    </div>

                    {/* Solar grid pattern lines inside the flexible panel */}
                    <div className="grid grid-cols-4 gap-[2px] w-full h-[60%] opacity-15 pointer-events-none">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="border border-white/40 rounded-xs"></div>
                      ))}
                    </div>

                    {/* Panel Action Controls (Hover visible) */}
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          rotatePanel(panel.id);
                        }}
                        className="p-1 bg-slate-700/90 rounded-sm hover:bg-amber-500 text-white transition-colors"
                        title={lang === "he" ? "סובב לוח" : "Rotate Panel"}
                        id={`btn-rotate-${panel.id}`}
                      >
                        <RotateCw className="h-2.5 w-2.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePanel(panel.id);
                        }}
                        className="p-1 bg-slate-700/90 rounded-sm hover:bg-red-500 text-white transition-colors"
                        title={lang === "he" ? "מחק לוח" : "Delete Panel"}
                        id={`btn-delete-${panel.id}`}
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {panels.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-slate-400/75 text-xs font-semibold px-4 py-2 bg-white/70 backdrop-blur-xs rounded-full shadow-xs">
                  {lang === "he" ? "המשטח ריק. לחץ על כפתור הפריסה האוטומטית!" : "Surface empty. Click 'Maximize Auto-Layout'!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-medium">{t.panelsPlaced}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-slate-900 font-mono">{panels.length}</span>
            <span className="text-sm text-slate-400">/{lang === "he" ? "יחידות" : "panels"}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>{selectedPanel.nameHe}</span>
          </div>
        </div>

        <div className="bg-amber-500/5 rounded-xl p-4 border border-amber-500/10 flex flex-col justify-between">
          <span className="text-xs text-amber-800 font-medium">{t.totalPower}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-black text-amber-600 font-mono">{totalInstalledPower}</span>
            <span className="text-sm text-amber-600 font-bold">Wp</span>
          </div>
          <div className="text-[11px] text-amber-500 mt-2 font-semibold">
            {lang === "he" ? "נצילות לוחות גבוהה במיוחד של" : "Outstanding conversion efficiency of"} {selectedPanel.efficiency}%
          </div>
        </div>

        <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10 flex flex-col justify-between">
          <span className="text-xs text-emerald-800 font-medium">
            {lang === "he" ? "שווי משוער ללוחות" : "Estimated Panels Cost"}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-black text-emerald-600 font-mono">
              ₪{(panels.length * selectedPanel.priceEstimate).toLocaleString()}
            </span>
            <span className="text-sm text-emerald-600 font-semibold">{lang === "he" ? "ש״ח" : "ILS"}</span>
          </div>
          <div className="text-[11px] text-emerald-500 mt-2 font-semibold">
            {lang === "he" ? "החזר השקעה מהיר מייצור עצמי" : "Fast ROI from off-grid independence"}
          </div>
        </div>
      </div>

      {/* Revolution Weight Savings Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 border border-slate-700 shadow-sm relative overflow-hidden">
        {/* Decorative background sun glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <h4 className="text-sm font-bold text-amber-400 tracking-wider uppercase flex items-center gap-2 mb-4">
          <Scale className="h-4 w-4 text-amber-400" />
          {t.weightComparison}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>{t.weightApollo}</span>
                <span className="font-mono font-bold text-emerald-400">{apolloTotalWeight} kg</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(4, Math.min(apolloTotalWeight / (traditionalTotalWeight || 1) * 100, 100))}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400 block">{t.apolloDirectGlue}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>{t.weightTraditional}</span>
                <span className="font-mono font-bold text-rose-400">{traditionalTotalWeight} kg</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-400 h-full rounded-full transition-all duration-500"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400 block">{t.traditionalRacking}</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center items-center text-center">
            <span className="text-xs text-slate-300 font-medium">{t.weightSaved}</span>
            <span className="text-4xl font-black text-emerald-400 font-mono mt-1 mb-2 animate-bounce">
              {weightSaved} ק״ג
            </span>
            <span className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
              {t.netSavings}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
