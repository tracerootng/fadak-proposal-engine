import React, { useState, useRef, useEffect } from "react";
import { 
  defaultProposals, 
  companyDetails 
} from "./data";
import { 
  ProposalStructure, 
  PillarItem, 
  BudgetItem, 
  JustificationItem, 
  CostBenefitItem,
  StrategyItem,
  DistributionItem,
  TimelineItem
} from "./types";
import { 
  FileText, 
  Download, 
  Printer, 
  Plus, 
  Trash2, 
  Sliders, 
  Building, 
  Users, 
  ShieldCheck, 
  FileSpreadsheet, 
  Eye, 
  Settings, 
  Sparkles, 
  RefreshCw, 
  Upload, 
  CheckCircle, 
  Menu, 
  ChevronRight, 
  Info,
  DollarSign
} from "lucide-react";

export default function App() {
  // Current loaded proposal
  const [proposals, setProposals] = useState<ProposalStructure[]>(defaultProposals);
  const [selectedProposalId, setSelectedProposalId] = useState<string>("zamfara_renaissance");
  const [zoomLevel, setZoomLevel] = useState<number>(0.75); // 0.5 to 1.2
  const [activeTab, setActiveTab] = useState<"presets" | "cover" | "letter" | "pillars" | "budget" | "conclusion">("presets");
  const [printWatermark, setPrintWatermark] = useState<boolean>(true);
  const [customLogoText, setCustomLogoText] = useState<string>("FADAK");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  
  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get active proposal
  const activeProposal = proposals.find(p => p.id === selectedProposalId) || proposals[0];

  // Helper to update active proposal fields deeply
  const updateActiveProposal = (updater: (prev: ProposalStructure) => ProposalStructure) => {
    setProposals(prev => prev.map(p => p.id === selectedProposalId ? updater(p) : p));
  };

  // Auto calculate budget grand total
  const calculatedGrandTotal = activeProposal.budget.reduce((acc, curr) => acc + curr.cost, 0);

  // Format Nigerian Naira currency
  const formatNaira = (value: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Triggers browser print dialog
  const handlePrint = () => {
    window.print();
  };

  // Load html2pdf bundle on demand from CDN
  const loadHtml2Pdf = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).html2pdf) {
        resolve((window as any).html2pdf);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.crossOrigin = "anonymous";
      script.onload = () => resolve((window as any).html2pdf);
      script.onerror = (err) => reject(new Error("Unable to load the A4 PDF compiler script. Please check your internet connection."));
      document.body.appendChild(script);
    });
  };

  // Performs a direct high-fidelity PDF compile and download
  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;
    try {
      setIsGeneratingPDF(true);
      const html2pdf = await loadHtml2Pdf();
      
      const element = document.getElementById("pdf-canvas-container");
      if (!element) {
        throw new Error("Could not find the document canvas to compile. Please refresh page.");
      }
      
      // Configuration for high fidelity vector-like PDF output
      const opt = {
        margin:       0,
        filename:     `Fadak_Proposal_${activeProposal.id}_${new Date().toISOString().split("T")[0]}.pdf`,
        image:        { type: "jpeg", quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          scrollY: 0,
          scrollX: 0,
          width: 794,
          windowWidth: 794, // Standard 210mm in pixels at 96dpi
          windowHeight: 1123, // Standard 297mm in pixels at 96dpi
          backgroundColor: "#ffffff",
          onclone: (clonedDoc: Document) => {
            // Helper function to convert OKLCH values to standard RGB/RGBA values
            const convertOklchToRgb = (lVal: string, cVal: string, hVal: string, aVal?: string): string => {
              let L = lVal.endsWith("%") ? parseFloat(lVal) / 100 : parseFloat(lVal);
              const C = parseFloat(cVal);
              const H = parseFloat(hVal);
              const alpha = aVal !== undefined ? (aVal.endsWith("%") ? parseFloat(aVal) / 100 : parseFloat(aVal)) : 1;

              if (isNaN(L)) L = 0;
              const cleanC = isNaN(C) ? 0 : C;
              const cleanH = isNaN(H) ? 0 : H;
              const cleanAlpha = isNaN(alpha) ? 1 : alpha;

              // OKLCH to OKLAB
              const hRad = (cleanH * Math.PI) / 180;
              const a = cleanC * Math.cos(hRad);
              const b = cleanC * Math.sin(hRad);

              // OKLAB to LMS
              const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
              const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
              const s_ = L - 0.0894841775 * a - 1.2914855414 * b;

              const l = Math.pow(Math.max(0, l_), 3);
              const m = Math.pow(Math.max(0, m_), 3);
              const s = Math.pow(Math.max(0, s_), 3);

              // LMS to linear sRGB
              const r_linear = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
              const g_linear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
              const b_linear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

              // Linear to sRGB gamma correction
              const toSRGB = (c: number): number => {
                return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
              };

              const rVal = Math.max(0, Math.min(255, Math.round(toSRGB(r_linear) * 255)));
              const gVal = Math.max(0, Math.min(255, Math.round(toSRGB(g_linear) * 255)));
              const bVal = Math.max(0, Math.min(255, Math.round(toSRGB(b_linear) * 255)));

              if (cleanAlpha === 1) {
                return `rgb(${rVal}, ${gVal}, ${bVal})`;
              } else {
                return `rgba(${rVal}, ${gVal}, ${bVal}, ${cleanAlpha})`;
              }
            };

            // Helper function to convert OKLAB values to standard RGB/RGBA values
            const convertOklabToRgb = (lVal: string, aVal: string, bInputVal: string, alphaVal?: string): string => {
              let L = lVal.endsWith("%") ? parseFloat(lVal) / 100 : parseFloat(lVal);
              const a = parseFloat(aVal);
              const b = parseFloat(bInputVal);
              const alpha = alphaVal !== undefined ? (alphaVal.endsWith("%") ? parseFloat(alphaVal) / 100 : parseFloat(alphaVal)) : 1;

              if (isNaN(L)) L = 0;
              const cleanA = isNaN(a) ? 0 : a;
              const cleanB = isNaN(b) ? 0 : b;
              const cleanAlpha = isNaN(alpha) ? 1 : alpha;

              const l_ = L + 0.3963377774 * cleanA + 0.2158037573 * cleanB;
              const m_ = L - 0.1055613458 * cleanA - 0.0638541728 * cleanB;
              const s_ = L - 0.0894841775 * cleanA - 1.2914855414 * cleanB;

              const l = Math.pow(Math.max(0, l_), 3);
              const m = Math.pow(Math.max(0, m_), 3);
              const s = Math.pow(Math.max(0, s_), 3);

              const r_linear = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
              const g_linear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
              const b_linear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

              const toSRGB = (c: number): number => {
                return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
              };

              const rVal = Math.max(0, Math.min(255, Math.round(toSRGB(r_linear) * 255)));
              const gVal = Math.max(0, Math.min(255, Math.round(toSRGB(g_linear) * 255)));
              const bVal = Math.max(0, Math.min(255, Math.round(toSRGB(b_linear) * 255)));

              if (cleanAlpha === 1) {
                return `rgb(${rVal}, ${gVal}, ${bVal})`;
              } else {
                return `rgba(${rVal}, ${gVal}, ${bVal}, ${cleanAlpha})`;
              }
            };

            const replaceOklchAndOklab = (css: string): string => {
              // Parse and translate oklch() calls
              css = css.replace(/\boklch\(([^)]+)\)/gi, (match, content) => {
                try {
                  const clean = content.replace(/,/g, " ").replace(/\//g, " ").trim();
                  const parts = clean.split(/\s+/);
                  if (parts.length >= 3) {
                    return convertOklchToRgb(parts[0], parts[1], parts[2], parts[3]);
                  }
                } catch (e) {
                  console.warn("Error translating oklch:", match, e);
                }
                return match;
              });

              // Parse and translate oklab() calls
              css = css.replace(/\boklab\(([^)]+)\)/gi, (match, content) => {
                try {
                  const clean = content.replace(/,/g, " ").replace(/\//g, " ").trim();
                  const parts = clean.split(/\s+/);
                  if (parts.length >= 3) {
                    return convertOklabToRgb(parts[0], parts[1], parts[2], parts[3]);
                  }
                } catch (e) {
                  console.warn("Error translating oklab:", match, e);
                }
                return match;
              });

              return css;
            };

            // Helper function to replace color-mix with standard fallback values cleanly
            const replaceColorMix = (css: string): string => {
              let index;
              while ((index = css.indexOf("color-mix(")) !== -1) {
                // Find matching closing parenthesis
                let depth = 1;
                let end = -1;
                for (let i = index + 10; i < css.length; i++) {
                  if (css[i] === "(") depth++;
                  else if (css[i] === ")") depth--;
                  if (depth === 0) {
                    end = i;
                    break;
                  }
                }
                if (end === -1) break; // unmatched
                
                const inner = css.substring(index + 10, end);
                const parts: string[] = [];
                let currentPart = "";
                let pDepth = 0;
                for (let i = 0; i < inner.length; i++) {
                  const char = inner[i];
                  if (char === "(") pDepth++;
                  else if (char === ")") pDepth--;
                  
                  if (char === "," && pDepth === 0) {
                    parts.push(currentPart.trim());
                    currentPart = "";
                  } else {
                    currentPart += char;
                  }
                }
                parts.push(currentPart.trim());
                
                let fallbackColor = "transparent";
                if (parts.length >= 2) {
                  let col = parts[1];
                  // Remove trailing percentages like " 10%" or " 50%"
                  col = col.replace(/\s+\d+%\s*$/, "");
                  fallbackColor = col;
                }
                
                css = css.substring(0, index) + fallbackColor + css.substring(end + 1);
              }
              return css;
            };

            // Build a single consolidated style text from all stylesheets in the document
            let consolidatedCSS = "";
            const successfullyParsedNodes = new Set();
            for (let i = 0; i < clonedDoc.styleSheets.length; i++) {
              try {
                const sheet = clonedDoc.styleSheets[i];
                const rules = sheet.cssRules || sheet.rules;
                if (!rules) continue;
                
                for (let j = 0; j < rules.length; j++) {
                  consolidatedCSS += rules[j].cssText + "\n";
                }
                if (sheet.ownerNode) {
                  successfullyParsedNodes.add(sheet.ownerNode);
                }
              } catch (sheetErr) {
                console.warn("Could not access stylesheet rules (likely cross-origin):", sheetErr);
              }
            }

            // If we managed to read css rules, we clean up modern CSS properties to prevent html2canvas failures
            const colorMap: Record<string, string> = {
              "ng-dark": "#063d1f",
              "ng-emerald": "#0f5c2e",
              "ng-gold": "#d4af37",
              "ng-gold-muted": "#bda062",
              "ng-light": "#f4faf6",
              "emerald-50": "#ecfdf5",
              "emerald-100": "#d1fae5",
              "emerald-200": "#a7f3d0",
              "emerald-300": "#6ee7b7",
              "emerald-400": "#34d399",
              "emerald-500": "#10b981",
              "emerald-600": "#059669",
              "emerald-700": "#047857",
              "emerald-800": "#065f46",
              "emerald-900": "#064e1b",
              "emerald-950": "#022c22",
              "slate-50": "#f8fafc",
              "slate-100": "#f1f5f9",
              "slate-200": "#e2e8f0",
              "slate-300": "#cbd5e1",
              "slate-400": "#94a3b8",
              "slate-500": "#64748b",
              "slate-600": "#475569",
              "slate-700": "#334155",
              "slate-800": "#1e293b",
              "slate-900": "#0f172a",
              "slate-950": "#020617",
              "gray-50": "#f9fafb",
              "gray-100": "#f3f4f6",
              "gray-200": "#e5e7eb",
              "gray-300": "#d1d5db",
              "gray-400": "#9ca3af",
              "gray-500": "#6b7280",
              "gray-600": "#4b5563",
              "gray-700": "#374151",
              "gray-800": "#1f2937",
              "gray-900": "#111827",
              "amber-500": "#f59e0b",
              "amber-400": "#fbbf24",
              "amber-600": "#d97706",
              "white": "#ffffff",
              "black": "#000000",
              "transparent": "transparent"
            };

            const resolveColor = (className: string): string | null => {
              if (!className) return null;
              
              // 1. Check arbitrary hex colors like from-[#063d1f], via-[#bd9636]/50, to-[#0c2315]
              const hexMatch = className.match(/^(?:from|via|to)-\[#?([0-9a-fA-F]{3,8})\](?:\/(\d+))?$/);
              if (hexMatch) {
                const hexColor = `#${hexMatch[1]}`;
                const opacityPercent = hexMatch[2];
                if (opacityPercent) {
                  let cleanHex = hexMatch[1];
                  if (cleanHex.length === 3) {
                    cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2];
                  }
                  const num = parseInt(cleanHex, 16);
                  const r = (num >> 16) & 255;
                  const g = (num >> 8) & 255;
                  const b = num & 255;
                  const alpha = parseFloat(opacityPercent) / 100;
                  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                }
                return hexColor;
              }
              
              // 2. Check utility brand/theme colors like from-ng-dark, to-ng-emerald, to-ng-emerald/40, via-ng-gold/50, to-slate-200/50
              const namedMatch = className.match(/^(?:from|via|to)-([a-zA-Z0-9_-]+)(?:\/(\d+))?$/);
              if (namedMatch) {
                const colorKey = namedMatch[1];
                const opacityPercent = namedMatch[2];
                const hexColor = colorMap[colorKey];
                if (hexColor) {
                  if (opacityPercent && hexColor !== "transparent") {
                    let cleanHex = hexColor.replace("#", "");
                    if (cleanHex.length === 3) {
                      cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2];
                    }
                    const num = parseInt(cleanHex, 16);
                    const r = (num >> 16) & 255;
                    const g = (num >> 8) & 255;
                    const b = num & 255;
                    const alpha = parseFloat(opacityPercent) / 100;
                    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                  }
                  return hexColor;
                }
              }
              
              // 3. Fallback ends-with matching for safety
              for (const [key, val] of Object.entries(colorMap)) {
                if (className.endsWith(`-${key}`)) {
                  return val;
                }
              }
              
              return null;
            };

            if (consolidatedCSS) {
              // 1. Remove the gradient color space interpolation which html2canvas doesn't support
              consolidatedCSS = consolidatedCSS.replace(/\bin\s+oklab(?:,\s*|\s+)/gi, "");
              consolidatedCSS = consolidatedCSS.replace(/\bin\s+oklch(?:,\s*|\s+)/gi, "");
              
              // 2. Resolve oklch and oklab blocks to standard legacy sRGB equivalents
              consolidatedCSS = replaceOklchAndOklab(consolidatedCSS);
              
              // 3. Resolve color-mix() blocks to their primary color constituent
              consolidatedCSS = replaceColorMix(consolidatedCSS);

              // 4. Resolve var(--color-*) definitions mapping to our solid colors
              for (const [key, val] of Object.entries(colorMap)) {
                const regex = new RegExp(`var\\(--color-${key}\\)`, "g");
                consolidatedCSS = consolidatedCSS.replace(regex, val);
              }

              // 5. Replace any linear-gradients containing CSS variables (which crash/fail html2canvas) with none/fallbacks
              consolidatedCSS = consolidatedCSS.replace(/linear-gradient\([^)]*var\(--tw-gradient-stops\)[^)]*\)/gi, "none");
              consolidatedCSS = consolidatedCSS.replace(/linear-gradient\([^)]*var\([^)]*\)[^)]*\)/gi, "none");
              
              // 6. Inject this cleaned consolidated stylesheet as a high priority style tag
              const cleanStyle = clonedDoc.createElement("style");
              cleanStyle.id = "cloned-cleaned-styles";
              cleanStyle.textContent = consolidatedCSS;
              clonedDoc.head.appendChild(cleanStyle);
              
              // 7. Keep all consolidated stylesheets fully active to guarantee styling behaves perfectly.
            }

            // Also clean any element-level inline styles and isolate the container layout
            const clonedContainer = clonedDoc.getElementById("pdf-canvas-container");
            if (clonedContainer) {
              // Hide all other direct children of clonedDoc.body to avoid visual overlap or bleed
              Array.from(clonedDoc.body.children).forEach(child => {
                if (child instanceof HTMLElement) {
                  child.style.setProperty("display", "none", "important");
                }
              });

              // Put the container directly inside the body at exact (0,0) coordinates
              clonedDoc.body.appendChild(clonedContainer);

              // Set the cloned document body and html bounds to match exact width (A4 @ 96dpi)
              clonedDoc.body.style.margin = "0";
              clonedDoc.body.style.padding = "0";
              clonedDoc.body.style.width = "794px";
              clonedDoc.body.style.maxWidth = "794px";
              clonedDoc.body.style.backgroundColor = "#ffffff";
              clonedDoc.body.style.position = "relative";
              clonedDoc.body.style.overflow = "visible";

              const htmlEl = clonedDoc.documentElement;
              if (htmlEl) {
                htmlEl.style.margin = "0";
                htmlEl.style.padding = "0";
                htmlEl.style.width = "794px";
                htmlEl.style.overflow = "visible";
              }

              // Ensure the container itself has standard width and clean margins/padding for perfectly straight alignment
              clonedContainer.style.setProperty("display", "block", "important");
              clonedContainer.style.setProperty("width", "794px", "important");
              clonedContainer.style.setProperty("max-width", "794px", "important");
              clonedContainer.style.setProperty("margin", "0", "important");
              clonedContainer.style.setProperty("padding", "0", "important");
              clonedContainer.style.setProperty("transform", "none", "important");
              clonedContainer.style.setProperty("box-shadow", "none", "important");
              clonedContainer.style.setProperty("overflow", "visible", "important");
              clonedContainer.style.setProperty("position", "relative", "important");

              const allElements = clonedContainer.querySelectorAll("*");
              allElements.forEach(el => {
                if (el instanceof HTMLElement) {
                  // Explicitly flatten any outer page gaps/margins/shadows in the PDF print output
                  if (el.classList.contains("print-page") || el.classList.contains("print-page-cover")) {
                    el.style.setProperty("margin-bottom", "0", "important");
                    el.style.setProperty("margin-top", "0", "important");
                    el.style.setProperty("box-shadow", "none", "important");
                    el.style.setProperty("border-radius", "0", "important");
                    el.style.setProperty("transform", "none", "important");
                    el.style.setProperty("width", "794px", "important");
                    el.style.setProperty("height", "1123px", "important");
                    el.style.setProperty("position", "relative", "important");
                    el.style.setProperty("box-sizing", "border-box", "important");
                  }

                  // 1. Resolve we can map any classes with bg-gradient-to-... into inline real gradients for html2canvas
                  let direction = "";
                  let fromColor = "";
                  let viaColor = "";
                  let toColor = "";

                  el.classList.forEach(className => {
                    if (className === "bg-gradient-to-r") direction = "to right";
                    else if (className === "bg-gradient-to-br") direction = "to bottom right";
                    else if (className === "bg-gradient-to-tr") direction = "to top right";
                    else if (className === "bg-gradient-to-b") direction = "to bottom";
                    
                    if (className.startsWith("from-")) {
                      fromColor = resolveColor(className) || "";
                    } else if (className.startsWith("via-")) {
                      viaColor = resolveColor(className) || "";
                    } else if (className.startsWith("to-")) {
                      toColor = resolveColor(className) || "";
                    }
                  });

                  if (fromColor) {
                    el.style.setProperty("background-color", fromColor, "important");
                  }

                  if (direction && fromColor) {
                    let gradientStr = "";
                    if (viaColor && toColor) {
                      gradientStr = `linear-gradient(${direction}, ${fromColor}, ${viaColor}, ${toColor})`;
                    } else if (toColor) {
                      gradientStr = `linear-gradient(${direction}, ${fromColor}, ${toColor})`;
                    } else {
                      gradientStr = `linear-gradient(${direction}, ${fromColor}, transparent)`;
                    }
                    el.style.setProperty("background-image", gradientStr, "important");
                  }

                  // 2. Scan classList and convert utility color helper classes into inline styles directly 
                  // to avoid empty CSS variable lookup failures inside html2canvas.
                  el.classList.forEach(className => {
                    const utilMatch = className.match(/^(bg|text|border)-([a-zA-Z0-9_-]+)(?:\/(\d+))?$/);
                    if (utilMatch) {
                      const mode = utilMatch[1];
                      const colorKey = utilMatch[2];
                      const opacityPercent = utilMatch[3];
                      const hexColor = colorMap[colorKey];
                      
                      if (hexColor) {
                        let finalColor = hexColor;
                        if (opacityPercent && hexColor !== "transparent") {
                          let cleanHex = hexColor.replace("#", "");
                          if (cleanHex.length === 3) {
                            cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2];
                          }
                          const num = parseInt(cleanHex, 16);
                          const r = (num >> 16) & 255;
                          const g = (num >> 8) & 255;
                          const b = num & 255;
                          const alpha = parseFloat(opacityPercent) / 100;
                          finalColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                        }
                        
                        if (mode === "bg") {
                          el.style.setProperty("background-color", finalColor, "important");
                        } else if (mode === "text") {
                          el.style.setProperty("color", finalColor, "important");
                        } else if (mode === "border") {
                          el.style.setProperty("border-color", finalColor, "important");
                        }
                      }
                    }
                  });

                  // 3. Clean background-image/gradients set inline
                  if (el.style.backgroundImage && (el.style.backgroundImage.includes("oklab") || el.style.backgroundImage.includes("oklch"))) {
                    let bgImg = el.style.backgroundImage;
                    bgImg = bgImg.replace(/\bin\s+oklab(?:,\s*|\s+)/gi, "");
                    bgImg = bgImg.replace(/\bin\s+oklch(?:,\s*|\s+)/gi, "");
                    bgImg = replaceOklchAndOklab(bgImg);
                    el.style.backgroundImage = bgImg;
                  }
                  
                  // 4. Clean color-mix and oklch background/color values set inline
                  if (el.style.backgroundColor && (el.style.backgroundColor.includes("color-mix") || el.style.backgroundColor.includes("oklch") || el.style.backgroundColor.includes("oklab"))) {
                    el.style.backgroundColor = replaceOklchAndOklab(replaceColorMix(el.style.backgroundColor));
                  }
                  if (el.style.color && (el.style.color.includes("color-mix") || el.style.color.includes("oklch") || el.style.color.includes("oklab"))) {
                    el.style.color = replaceOklchAndOklab(replaceColorMix(el.style.color));
                  }
                  if (el.style.borderColor && (el.style.borderColor.includes("color-mix") || el.style.borderColor.includes("oklch") || el.style.borderColor.includes("oklab"))) {
                    el.style.borderColor = replaceOklchAndOklab(replaceColorMix(el.style.borderColor));
                  }

                  // 5. Resolve CSS custom variables on standard inline style attributes directly inside the cssText
                  for (const [key, val] of Object.entries(colorMap)) {
                    const regex = new RegExp(`var\\(--color-${key}\\)`, "g");
                    if (el.style.cssText && el.style.cssText.includes(`var(--color-${key})`)) {
                      el.style.cssText = el.style.cssText.replace(regex, val);
                    }
                  }
                }
              });
            }
          }
        },
        jsPDF:        { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak:    { mode: ["avoid-all", "css"] }
      };

      // Set temporary state so that zoom renders at exactly 1.0 (to avoid scaling/wrapping logic bugs), 
      // margin-bottom gets removed, and shadows are flattened for printing.
      const originalZoom = zoomLevel;
      setZoomLevel(1.0);
      
      // Minor delay for browser to repaint layout at scale 1.0 before canvas capture
      setTimeout(async () => {
        try {
          // Add temporary generation class to zoom box to squish margins
          element.classList.add("is-generating-pdf");
          
          await html2pdf().from(element).set(opt).save();
          
          element.classList.remove("is-generating-pdf");
          setZoomLevel(originalZoom);
          setIsGeneratingPDF(false);
        } catch (innerError) {
          element.classList.remove("is-generating-pdf");
          setZoomLevel(originalZoom);
          throw innerError;
        }
      }, 600);

    } catch (err: any) {
      console.error(err);
      alert(`❌ PDF Compiler Error: ${err?.message || err}`);
      setIsGeneratingPDF(false);
    }
  };

  // Export current proposal configuration as JSON
  const handleExportJSON = () => {
    const dataStr2 = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeProposal, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr2);
    downloadAnchor.setAttribute("download", `Fadak_Proposal_${activeProposal.id}_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import proposal schema from JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string) as ProposalStructure;
          // Validate structure minimally
          if (parsed.id && parsed.coverTitle && parsed.recipient && parsed.budget) {
            // Append or overwrite
            setProposals(prev => {
              const exists = prev.some(p => p.id === parsed.id);
              if (exists) {
                return prev.map(p => p.id === parsed.id ? parsed : p);
              } else {
                return [...prev, parsed];
              }
            });
            setSelectedProposalId(parsed.id);
            alert("✅ Proposal imported successfully!");
          } else {
            alert("❌ Non-compliant Proposal JSON format.");
          }
        } catch (error) {
          alert("❌ Error parsing JSON file.");
        }
      };
    }
  };

  // Add new proposal template
  const handleCreateNewTemplate = () => {
    const newId = `custom_proposal_${Date.now()}`;
    const newTemplate: ProposalStructure = {
      id: newId,
      templateName: "Untitled Custom Proposal",
      coverTitle: "PROPOSAL DOCUMENTATION TITLE",
      coverSubtitle: "A Media Strategy and Documentary Film Initiative",
      coverBadge: "PROPOSAL Badging Section Label",
      coverDescription: "Enter description of this document and what it presents. Perfect premium formatting automatically applied in A4 sizes.",
      recipient: {
        name: "Honorable Recipient Title",
        headingName: "His Excellency Name Here",
        address: "Recipient Headquarters, City State",
        attention: "Attention: Designated Officer Role",
        date: "31st May 2026"
      },
      company: { ...companyDetails },
      letterTitle: "LETTER OF PROPOSAL: DRAFT MEDIA CONSULTING ENGAGEMENT TITLE",
      letterBody: [
        "First standard paragraph of proposal transmittal letter goes here. Explain the overview of your request.",
        "Second standard paragraph details, representing the premium services provided.",
        "Third standard paragraph outlines and references files attached below for full commercial details.",
        "We are excited to cooperate on this strategic initiative and look forward to hearing from you."
      ],
      letterSignoff: "Fatima Dauda Kurfi\nLead Consultant/Executive Producer\nFADAK MEDIA HUB",
      docTitle: "PROPOSAL FRAMEWORK",
      docSubtitle: "Corporate Pitch & Media Production Agenda",
      execSummary: "Write a high impact summary summarizing the key deliverables and strategic outcomes.",
      objectives: [
        "Narrative Integrity: Tell the authentic story.",
        "Social Investment: Attract key public and private resources.",
        "Aesthetic Delivery: World class video coverage."
      ],
      pillars: [
        { id: "cp1", pillar: "Pillar Item", highlight: "Detail of highlights and feature developments." }
      ],
      strategy: [
        { id: "cs1", title: "Technical Production", description: "Details of professional camera kit deployments and drone strategy." }
      ],
      distribution: [
        { id: "cd1", title: "Target Broadcasts", description: "Listing strategic local and regional TV/radio nodes." }
      ],
      timeline: [
        { id: "ct1", phase: "Phase 1: Pre-shoot", duration: "1 Week", description: "Reviewing schedules and scripting." }
      ],
      budget: [
        { id: "cb1", category: "Production Shoot", description: "Premium audio-visual production.", cost: 1500000 }
      ],
      justification: [
        { id: "cj1", num: "I", title: "Strategic Resource Protection", details: "Explanation of why this supports organizational legacy.", value: "Sovereign validation" }
      ],
      costBenefit: [
        { id: "ccb1", area: "Key Delivery Hub", benefit: "Full stakeholder satisfaction and long-term brand equity." }
      ],
      conclusionTitle: "CONCLUSION AND CALL TO ACTION",
      conclusionParagraphs: [
        "Conclusion statement or closing arguments. Make sure it has direct engagement callouts.",
        "The proposed timeline is actionable immediately upon draft signature confirmation."
      ],
      pathForwardTitle: "Immediate Milestones:",
      pathForwardItems: [
        "Review client brief parameters.",
        "Finalize standard budgets."
      ],
      pathForwardClosing: "We look forward to an opportunity to translate your legacy visually."
    };
    setProposals(prev => [...prev, newTemplate]);
    setSelectedProposalId(newId);
    setActiveTab("cover");
  };

  // Reset standard designs
  const handleResetDefaults = () => {
    if (confirm("Are you sure you want to reset all modifications to standard default settings?")) {
      setProposals(defaultProposals);
      setSelectedProposalId("zamfara_renaissance");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-900">
      
      {/* HEADER SECTION - Brand Identity */}
      <header className="bg-[#04200f] border-b border-[#bd9b3b]/30 py-4 px-6 sticky top-0 z-50 print:hidden shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Card */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white p-1 flex items-center justify-center shadow-md border border-ng-gold">
              <div className="w-10 h-10 rounded-md bg-[#063d1f] flex flex-col items-center justify-center text-xs font-bold text-white tracking-widest leading-none">
                <span className="text-[10px] text-ng-gold font-display font-black">FMH</span>
                <span className="text-[7px]">FADAK</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-display font-extrabold tracking-wide text-white">
                  FADAK MEDIA HUB <span className="text-xs font-normal text-ng-gold font-mono">RC: 8426199</span>
                </h1>
                <span className="hidden md:inline bg-ng-emerald/20 text-ng-gold text-[10px] uppercase font-bold py-0.5 px-2 rounded-full border border-ng-gold/10">
                  Nigeria Approved
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5 font-medium italic">
                Media · Technology · Strategy
              </p>
            </div>
          </div>

          {/* Quick Stats or Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="text-right hidden xl:block mr-2 border-r border-[#bd9b3b]/20 pr-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Proposal Editor Engine</p>
              <p className="text-xs text-ng-gold font-semibold font-display">Verbatim A4 PDF Studio</p>
            </div>
            
            {/* Download PDF Trigger (using html2pdf.js) */}
            <button
              onClick={handleDownloadPDF}
              id="download-pdf-btn"
              disabled={isGeneratingPDF}
              className="bg-gradient-to-r from-ng-gold to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-display font-bold text-xs px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPDF ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isGeneratingPDF ? "Compiling PDF..." : "Download A4 PDF"}</span>
            </button>

            {/* Standard Browser Print Trigger */}
            <button
              onClick={handlePrint}
              id="print-btn"
              title="Open browser print utility"
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Dialog</span>
            </button>

            <button
              onClick={handleExportJSON}
              title="Export configuration as JSON file"
              className="bg-emerald-800/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-700/50 hover:border-emerald-600 text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload previous proposal JSON state"
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import JSON</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportJSON}
                accept=".json"
                className="hidden"
              />
            </button>

            <button
              onClick={handleResetDefaults}
              title="Restore standard values"
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* WORKSPACE & ACTIONS */}
      <div className="flex-1 flex flex-col lg:flex-row print:block">
        
        {/* LEFT COMPONENT - PANEL CONTROLLER & FORMS */}
        <aside className="w-full lg:w-[480px] bg-slate-950 border-r border-[#bd9b3b]/20 flex flex-col shrink-0 print:hidden max-h-[calc(100vh-80px)] overflow-y-auto">
          
          {/* Preset Picker & Preset Customizations */}
          <div className="p-4 bg-slate-900/60 border-b border-[#bd9b3b]/10">
            <label className="block text-xs uppercase tracking-wider font-mono text-ng-gold font-bold mb-2">
              Select Proposal Preset
            </label>
            <div className="flex items-center gap-2">
              <select
                value={selectedProposalId}
                onChange={(e) => setSelectedProposalId(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-ng-gold font-semibold"
              >
                {proposals.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.templateName}
                  </option>
                ))}
              </select>
              <button
                onClick={handleCreateNewTemplate}
                className="p-2 bg-ng-emerald hover:bg-ng-emerald/80 text-white rounded-lg transition-colors cursor-pointer"
                title="Create a new custom template from blank"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2 items-center text-xs text-slate-300">
              <span className="text-slate-400">Preview Scale:</span>
              <input
                type="range"
                min="0.5"
                max="1.2"
                step="0.05"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="w-24 accent-ng-gold"
              />
              <span className="font-mono text-ng-gold font-bold">{(zoomLevel*100).toFixed(0)}%</span>
              
              <label className="ml-auto flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-slate-400">
                <input
                  type="checkbox"
                  checked={printWatermark}
                  onChange={(e) => setPrintWatermark(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-ng-gold focus:ring-0"
                />
                Show Watermarks
              </label>
            </div>
          </div>

          {/* EDITOR NAVIGATION TABS */}
          <div className="bg-slate-900 border-b border-[#bd9b3b]/10 flex flex-nowrap overflow-x-auto no-scrollbar">
            {[
              { id: "presets", label: "General & Org", icon: Building },
              { id: "cover", label: "Cover Details", icon: Sparkles },
              { id: "letter", label: "Transmittal", icon: FileText },
              { id: "pillars", label: "Pillars & Delivery", icon: Sliders },
              { id: "budget", label: "Budget Planner", icon: FileSpreadsheet },
              { id: "conclusion", label: "Sign-Off", icon: CheckCircle }
            ].map(tab => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 text-xs uppercase tracking-wider font-bold shrink-0 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id 
                      ? "border-ng-gold text-ng-gold bg-slate-950 font-extrabold" 
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB CONTENTS - EDITORS PANEL */}
          <div className="p-5 flex-1 space-y-5">
            
            {/* TAB 1: GENERAL & ORG */}
            {activeTab === "presets" && (
              <div className="space-y-4">
                <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
                  <h3 className="text-xs uppercase tracking-wider text-ng-gold font-bold mb-3 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-amber-500" />
                    FADAK Corp Identity (A4 letterhead)
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Company Registered Name</label>
                      <input
                        type="text"
                        value={activeProposal.company.name}
                        onChange={(e) => updateActiveProposal(p => ({
                          ...p,
                          company: { ...p.company, name: e.target.value }
                        }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">RC Registration Number (Nigeria Government)</label>
                      <input
                        type="text"
                        value={activeProposal.company.rc}
                        onChange={(e) => updateActiveProposal(p => ({
                          ...p,
                          company: { ...p.company, rc: e.target.value }
                        }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Company Sub-motto Tagline</label>
                      <input
                        type="text"
                        value={activeProposal.company.tagline}
                        onChange={(e) => updateActiveProposal(p => ({
                          ...p,
                          company: { ...p.company, tagline: e.target.value }
                        }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Head Office Address</label>
                      <textarea
                        rows={2}
                        value={activeProposal.company.address}
                        onChange={(e) => updateActiveProposal(p => ({
                          ...p,
                          company: { ...p.company, address: e.target.value }
                        }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">Official Tel</label>
                        <input
                          type="text"
                          value={activeProposal.company.tel}
                          onChange={(e) => updateActiveProposal(p => ({
                            ...p,
                            company: { ...p.company, tel: e.target.value }
                          }))}
                          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">Official HTML Web</label>
                        <input
                          type="text"
                          value={activeProposal.company.web}
                          onChange={(e) => updateActiveProposal(p => ({
                            ...p,
                            company: { ...p.company, web: e.target.value }
                          }))}
                          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Official Corporate Email</label>
                      <input
                        type="text"
                        value={activeProposal.company.email}
                        onChange={(e) => updateActiveProposal(p => ({
                          ...p,
                          company: { ...p.company, email: e.target.value }
                        }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
                  <h3 className="text-xs uppercase tracking-wider text-ng-gold font-bold mb-3 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    CEO Signatory Details
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">CEO Full Name</label>
                      <input
                        type="text"
                        value={activeProposal.company.ceoName}
                        onChange={(e) => updateActiveProposal(p => ({
                          ...p,
                          company: { ...p.company, ceoName: e.target.value }
                        }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">CEO Title</label>
                      <input
                        type="text"
                        value={activeProposal.company.ceoTitle}
                        onChange={(e) => updateActiveProposal(p => ({
                          ...p,
                          company: { ...p.company, ceoTitle: e.target.value }
                        }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-xs">
                  <h3 className="text-xs uppercase tracking-wider text-ng-gold font-bold mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    How to Print or Export
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>Customize any word, pricing, or list row on the sidebar.</li>
                    <li>Verify the live preview on the A4 pages.</li>
                    <li>Click or press <strong className="text-white">Print / Download A4 PDF</strong>.</li>
                    <li>In the dialog, set destination as <strong className="text-ng-gold">"Save as PDF"</strong>.</li>
                    <li>Enable <strong className="text-white">Background graphics</strong> in settings for premium green/gold gradients!</li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB 2: COVER DETAILS */}
            {activeTab === "cover" && (
              <div className="space-y-4">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
                  <h3 className="text-xs uppercase tracking-wider text-ng-gold font-bold flex items-center gap-1.5">
                    Cover Page Elements
                  </h3>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Cover Big Title</label>
                    <input
                      type="text"
                      value={activeProposal.coverTitle}
                      onChange={(e) => updateActiveProposal(p => ({ ...p, coverTitle: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded p-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Cover Subtitle Narrative</label>
                    <textarea
                      rows={2}
                      value={activeProposal.coverSubtitle}
                      onChange={(e) => updateActiveProposal(p => ({ ...p, coverSubtitle: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Center Badge Subtitle</label>
                    <input
                      type="text"
                      value={activeProposal.coverBadge}
                      onChange={(e) => updateActiveProposal(p => ({ ...p, coverBadge: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded p-2 text-white text-[11px] font-mono text-ng-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Sinopsis/Abstract Overview Description</label>
                    <textarea
                      rows={3}
                      value={activeProposal.coverDescription}
                      onChange={(e) => updateActiveProposal(p => ({ ...p, coverDescription: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded p-2 text-white"
                    />
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
                  <h3 className="text-xs uppercase tracking-wider text-ng-gold font-bold">
                    Design Controls
                  </h3>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Company Short Mark Logo Text</label>
                    <input
                      type="text"
                      value={customLogoText}
                      onChange={(e) => setCustomLogoText(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded p-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TRANSMITTAL LETTER */}
            {activeTab === "letter" && (
              <div className="space-y-4">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
                  <h3 className="text-xs uppercase tracking-wider text-ng-gold font-bold">
                    Recipient Information
                  </h3>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Recipient Name/Title</label>
                    <input
                      type="text"
                      value={activeProposal.recipient.name}
                      onChange={(e) => updateActiveProposal(p => ({
                        ...p,
                        recipient: { ...p.recipient, name: e.target.value }
                      }))}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded p-2 text-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Salutation Address Name</label>
                    <input
                      type="text"
                      value={activeProposal.recipient.headingName}
                      onChange={(e) => updateActiveProposal(p => ({
                        ...p,
                        recipient: { ...p.recipient, headingName: e.target.value }
                      }))}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Recipient Address Location</label>
                    <input
                      type="text"
                      value={activeProposal.recipient.address}
                      onChange={(e) => updateActiveProposal(p => ({
                        ...p,
                        recipient: { ...p.recipient, address: e.target.value }
                      }))}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded p-2 text-white text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Attention Directive Area</label>
                    <input
                      type="text"
                      value={activeProposal.recipient.attention}
                      onChange={(e) => updateActiveProposal(p => ({
                        ...p,
                        recipient: { ...p.recipient, attention: e.target.value }
                      }))}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Proposal Proposal Date</label>
                    <input
                      type="text"
                      value={activeProposal.recipient.date}
                      onChange={(e) => updateActiveProposal(p => ({
                        ...p,
                        recipient: { ...p.recipient, date: e.target.value }
                      }))}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded p-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
                  <h3 className="text-xs uppercase tracking-wider text-ng-gold font-bold">
                    Letter Transmittal Content (Verbatim Text)
                  </h3>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">General Proposal Subject Letter Header</label>
                    <textarea
                      rows={2}
                      value={activeProposal.letterTitle}
                      onChange={(e) => updateActiveProposal(p => ({ ...p, letterTitle: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded p-1.5 text-white font-bold font-serif"
                    />
                  </div>
                  
                  {activeProposal.letterBody.map((par, pId) => (
                    <div key={pId} className="space-y-1">
                      <label className="block text-slate-400 font-medium">Paragraph {pId+1}</label>
                      <textarea
                        rows={4}
                        value={par}
                        onChange={(e) => {
                          const updatedArr = [...activeProposal.letterBody];
                          updatedArr[pId] = e.target.value;
                          updateActiveProposal(p => ({ ...p, letterBody: updatedArr }));
                        }}
                        className="w-full bg-slate-800 border border-slate-700/60 rounded p-1.5 text-white"
                      />
                    </div>
                  ))}
                  
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Sign-off Signature Box Signature Text</label>
                    <textarea
                      rows={3}
                      value={activeProposal.letterSignoff}
                      onChange={(e) => updateActiveProposal(p => ({ ...p, letterSignoff: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded p-1.5 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PILLARS & DELIVERY */}
            {activeTab === "pillars" && (
              <div className="space-y-4">
                {/* PILLARS SECTION */}
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-wider text-ng-gold font-bold">
                      Key Pillars Table (The "Story" Hubs)
                    </h3>
                    <button
                      onClick={() => {
                        const newPillars = [...activeProposal.pillars, {
                          id: `p_new_${Date.now()}`,
                          pillar: "New Strategic Pillar",
                          highlight: "New strategic highlight details to pitch."
                        }];
                        updateActiveProposal(p => ({ ...p, pillars: newPillars }));
                      }}
                      className="bg-emerald-800 text-emerald-200 py-1 px-2 rounded hover:bg-emerald-700 text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Pillar
                    </button>
                  </div>

                  <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                    {activeProposal.pillars.map((pil, idx) => (
                      <div key={pil.id} className="p-3 bg-slate-950/80 rounded border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-slate-400">Pillar #{idx + 1}</span>
                          <button
                            onClick={() => {
                              const newPillars = activeProposal.pillars.filter(p => p.id !== pil.id);
                              updateActiveProposal(p => ({ ...p, pillars: newPillars }));
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/10 p-1 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={pil.pillar}
                          onChange={(e) => {
                            const updatedPillars = activeProposal.pillars.map(p => p.id === pil.id ? { ...p, pillar: e.target.value } : p);
                            updateActiveProposal(p => ({ ...p, pillars: updatedPillars }));
                          }}
                          placeholder="Pillar Title"
                          className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-white font-bold"
                        />
                        <textarea
                          rows={2}
                          value={pil.highlight}
                          onChange={(e) => {
                            const updatedPillars = activeProposal.pillars.map(p => p.id === pil.id ? { ...p, highlight: e.target.value } : p);
                            updateActiveProposal(p => ({ ...p, pillars: updatedPillars }));
                          }}
                          placeholder="Pillar highlights/Verbatim texts"
                          className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* STRATEGY SECTION */}
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-wider text-ng-gold font-bold">
                      Production Strategy Elements
                    </h3>
                    <button
                      onClick={() => {
                        const newStrategy = [...activeProposal.strategy, {
                          id: `s_new_${Date.now()}`,
                          title: "New Strategy Component",
                          description: "Specific visual or digital distribution strategy highlight details."
                        }];
                        updateActiveProposal(p => ({ ...p, strategy: newStrategy }));
                      }}
                      className="bg-emerald-800 text-emerald-200 py-1 px-2 rounded hover:bg-emerald-700 text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Component
                    </button>
                  </div>

                  <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                    {activeProposal.strategy.map((str) => (
                      <div key={str.id} className="p-3 bg-slate-950/80 rounded border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={str.title}
                            onChange={(e) => {
                              const updated = activeProposal.strategy.map(p => p.id === str.id ? { ...p, title: e.target.value } : p);
                              updateActiveProposal(p => ({ ...p, strategy: updated }));
                            }}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded p-1 text-white font-semibold text-xs"
                          />
                          <button
                            onClick={() => {
                              const updated = activeProposal.strategy.filter(p => p.id !== str.id);
                              updateActiveProposal(p => ({ ...p, strategy: updated }));
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/10 p-1 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={str.description}
                          onChange={(e) => {
                            const updated = activeProposal.strategy.map(p => p.id === str.id ? { ...p, description: e.target.value } : p);
                            updateActiveProposal(p => ({ ...p, strategy: updated }));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* DISTRIBUTION CHANNELS */}
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-wider text-ng-gold font-bold">
                      Media Distribution Outposts
                    </h3>
                  </div>
                  {activeProposal.distribution.map((dist) => (
                    <div key={dist.id} className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={dist.title}
                        onChange={(e) => {
                          const updated = activeProposal.distribution.map(p => p.id === dist.id ? { ...p, title: e.target.value } : p);
                          updateActiveProposal(p => ({ ...p, distribution: updated }));
                        }}
                        className="bg-slate-800 border border-slate-700 rounded p-1 text-white font-bold col-span-1"
                      />
                      <input
                        type="text"
                        value={dist.description}
                        onChange={(e) => {
                          const updated = activeProposal.distribution.map(p => p.id === dist.id ? { ...p, description: e.target.value } : p);
                          updateActiveProposal(p => ({ ...p, distribution: updated }));
                        }}
                        className="bg-slate-800 border border-slate-700 rounded p-1 text-white col-span-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: BUDGET PLANNER */}
            {activeTab === "budget" && (
              <div className="space-y-4">
                
                {/* Grand Total Indicator */}
                <div className="bg-gradient-to-r from-emerald-950 to-slate-950 p-4 rounded-lg border border-emerald-500/30 text-center space-y-1">
                  <span className="text-[10px] tracking-wider uppercase text-emerald-400 font-mono font-bold">Calculated Budget Total</span>
                  <div className="text-xl md:text-2xl font-display font-black text-white px-2">
                    {formatNaira(calculatedGrandTotal)}
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono italic">
                    Grand total compiles and updates dynamically in Nigerian Naira (₦).
                  </p>
                </div>

                {/* Grid budget entries */}
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-wider text-ng-gold font-bold">
                      Projected Documentary Budget Lines
                    </h3>
                    <button
                      onClick={() => {
                        const newBudget = [...activeProposal.budget, {
                          id: `b_new_${Date.now()}`,
                          category: `${activeProposal.budget.length + 1}. New Category`,
                          description: "Description of activities, personnel, or devices.",
                          cost: 1000000
                        }];
                        updateActiveProposal(p => ({ ...p, budget: newBudget }));
                      }}
                      className="bg-emerald-800 text-emerald-200 py-1 px-2 rounded hover:bg-emerald-700 text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Line Item
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {activeProposal.budget.map((bItem) => (
                      <div key={bItem.id} className="p-3 bg-slate-950 border border-slate-800 rounded space-y-2">
                        <div className="flex items-center justify-between gap-1">
                          <input
                            type="text"
                            value={bItem.category}
                            onChange={(e) => {
                              const updated = activeProposal.budget.map(p => p.id === bItem.id ? { ...p, category: e.target.value } : p);
                              updateActiveProposal(p => ({ ...p, budget: updated }));
                            }}
                            className="bg-slate-800 border border-slate-700 rounded p-1 text-white font-bold flex-1 text-xs"
                          />
                          <button
                            onClick={() => {
                              const updated = activeProposal.budget.filter(p => p.id !== bItem.id);
                              updateActiveProposal(p => ({ ...p, budget: updated }));
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={bItem.description}
                          onChange={(e) => {
                            const updated = activeProposal.budget.map(p => p.id === bItem.id ? { ...p, description: e.target.value } : p);
                            updateActiveProposal(p => ({ ...p, budget: updated }));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-white text-[11px]"
                          placeholder="Description"
                        />
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-slate-400 font-mono text-xs">₦</span>
                          <input
                            type="number"
                            value={bItem.cost}
                            onChange={(e) => {
                              const updated = activeProposal.budget.map(p => p.id === bItem.id ? { ...p, cost: parseFloat(e.target.value) || 0 } : p);
                              updateActiveProposal(p => ({ ...p, budget: updated }));
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-white font-mono text-xs font-bold"
                            placeholder="Price"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* TAB 6: CONCLUSION & SIGN-OFF */}
            {activeTab === "conclusion" && (
              <div className="space-y-4">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
                  <h3 className="text-xs uppercase tracking-wider text-ng-gold font-bold">
                    Conclusion Paragraphs
                  </h3>
                  {activeProposal.conclusionParagraphs.map((par, pIdx) => (
                    <div key={pIdx} className="space-y-1">
                      <label className="block text-slate-400">Statement Block {pIdx + 1}</label>
                      <textarea
                        rows={4}
                        value={par}
                        onChange={(e) => {
                          const updatedArr = [...activeProposal.conclusionParagraphs];
                          updatedArr[pIdx] = e.target.value;
                          updateActiveProposal(p => ({ ...p, conclusionParagraphs: updatedArr }));
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
                  <h3 className="text-xs uppercase tracking-wider text-ng-gold font-bold">
                    Conclusion Milestones ("Path Forward")
                  </h3>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Section Title</label>
                    <input
                      type="text"
                      value={activeProposal.pathForwardTitle}
                      onChange={(e) => updateActiveProposal(p => ({ ...p, pathForwardTitle: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-bold"
                    />
                  </div>
                  {activeProposal.pathForwardItems.map((item, keyIdx) => (
                    <div key={keyIdx}>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...activeProposal.pathForwardItems];
                          updated[keyIdx] = e.target.value;
                          updateActiveProposal(p => ({ ...p, pathForwardItems: updated }));
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Final Salutation Closing Sentence</label>
                    <textarea
                      rows={2}
                      value={activeProposal.pathForwardClosing}
                      onChange={(e) => updateActiveProposal(p => ({ ...p, pathForwardClosing: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer branding details */}
          <div className="p-4 border-t border-[#bd9b3b]/10 bg-slate-950 text-center text-[10px] text-slate-500 font-mono">
            FADAK MEDIA HUB ENGINE v2.0 · NIGERIA 🇳🇬
          </div>

        </aside>

        {/* RIGHT COMPONENT - HIGH FIDELITY MULTI-PAGE LIVE A4 CANVAS */}
        <main className="flex-1 bg-slate-800 p-6 flex flex-col items-center overflow-y-auto print:p-0 print:bg-white">
          
          {/* Action advice banner for standard users */}
          <div className="w-full max-w-4xl bg-ng-dark/95 border border-[#bd9b3b]/30 p-4 rounded-xl shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-ng-gold/10 flex items-center justify-center text-ng-gold border border-ng-gold/20 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-100">
                <p className="font-bold text-white flex items-center gap-1.5 text-sm">
                  Interactive Nigerian A4 Print Mode Active 
                </p>
                <p className="text-slate-300">
                  Pages display in high fidelity layout. Click "Print / Download" for standard vector-level PDF save.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="bg-white hover:bg-slate-100 disabled:opacity-75 text-[#063d1f] transition-colors py-1.5 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
              >
                {isGeneratingPDF ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-[#063d1f]" />
                )}
                <span>{isGeneratingPDF ? "Compiling PDF..." : "Direct PDF Download"}</span>
              </button>

              <button
                onClick={handlePrint}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1 shadow cursor-pointer"
                title="Open browser print dialog"
              >
                <Printer className="w-3.5 h-3.5 text-ng-gold" />
                <span>Browser Print</span>
              </button>
            </div>
          </div>

          {/* Live Zoom Scale Box */}
          <div 
            id="pdf-canvas-container"
            className="zoom-container flex flex-col gap-10 print:gap-0 print:block"
            style={{ 
              transform: `scale(${zoomLevel})`, 
              transformOrigin: "top center", 
              width: "210mm",
              // Maintain appropriate margin in screen mode to prevent UI jumps
              marginBottom: `calc(210mm * ${zoomLevel - 1} + 40px)`
            }}
          >

            {/* ======================================= */}
            {/* PAGE 1: EXQUISITE COVER PAGE            */}
            {/* ======================================= */}
            <div className="print-page-cover relative w-[210mm] h-[297mm] overflow-hidden bg-gradient-to-br from-[#063d1f] via-[#094c28] to-[#0c2315] text-white flex flex-col justify-between p-[20mm] shadow-2xl shrink-0 print:shadow-none mb-10 print:mb-0 select-none">
              
              {/* Corner Gold Leaf Border Decoratives */}
              <div className="absolute top-0 right-0 w-64 h-64 border-t-4 border-r-4 border-ng-gold/30 rounded-tr-[50px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 border-b-4 border-l-4 border-ng-gold/30 rounded-bl-[50px] pointer-events-none" />
              
              {/* Circular Gold Arcs Background (matches design exactly) */}
              <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full border border-ng-gold/5 pointer-events-none" />
              <div className="absolute top-[20%] left-[-15%] w-[600px] h-[600px] rounded-full border border-[#bd9636]/10 pointer-events-none" />
              <div className="absolute top-[20%] left-[-20%] w-[700px] h-[700px] rounded-full border border-[#bd9636]/5 pointer-events-none" />

              <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#bd9636]/5 blur-3xl pointer-events-none" />

              {/* COVER HEADER WITH FADAK BRANDING CARD */}
              <div className="flex justify-between items-start z-10">
                <div className="bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 border-b-4 border-ng-gold max-w-[85%]">
                  <div className="w-10 h-10 rounded-lg bg-[#063d1f] p-1 flex items-center justify-center">
                    <div className="w-8 h-8 rounded bg-ng-dark flex flex-col items-center justify-center text-[8px] font-bold text-white leading-none">
                      <span className="text-[7.5px] text-ng-gold font-display font-black">{customLogoText}</span>
                      <span className="text-[5.5px]">MEDIA</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-slate-900 font-display font-black text-xs uppercase tracking-wide leading-none">
                      {activeProposal.company.name}
                    </h2>
                    <p className="text-[8px] text-ng-emerald font-semibold uppercase tracking-wider mt-1">
                      {activeProposal.company.tagline}
                    </p>
                    <p className="text-[7px] text-slate-500 font-mono mt-0.5 leading-none">
                      RC: {activeProposal.company.rc}
                    </p>
                  </div>
                </div>

                <div className="text-right uppercase font-mono text-[9px] tracking-widest text-[#bd9636] border-b border-[#bd9636]/40 pb-1 mt-2">
                  Proposal Document
                </div>
              </div>

              {/* LARGE MAJESTIC COVER HERO SECTION */}
              <div className="my-auto z-10 space-y-7 pr-3">
                <div className="space-y-2">
                  <span className="text-ng-gold font-mono font-bold text-xs uppercase tracking-[0.25em] block">
                    Documentary Production Proposal
                  </span>
                  <div className="w-20 h-1 bg-gradient-to-r from-ng-gold to-amber-500" />
                </div>

                <h1 className="text-4xl md:text-5xl font-display font-black leading-[1.1] tracking-tight text-white drop-shadow-md">
                  {activeProposal.coverTitle}
                </h1>

                <p className="text-base text-slate-200 font-serif italic max-w-xl font-light border-l-2 border-ng-gold pl-4 py-1 leading-relaxed">
                  {activeProposal.coverSubtitle}
                </p>

                {/* Badged recipient sector pill box */}
                <span className="inline-block bg-[#052614] border border-ng-gold/30 rounded-xl px-5 py-3 text-xs tracking-wider uppercase font-display font-bold text-ng-gold/90 shadow-md">
                  {activeProposal.coverBadge}
                </span>

                <p className="text-xs text-slate-300 font-sans max-w-xl leading-relaxed font-light">
                  {activeProposal.coverDescription}
                </p>
              </div>

              {/* COVER FOOTER METADATA SECTION */}
              <div className="border-t border-[#bd9636]/30 pt-6 flex justify-between items-end z-10 text-[9px] uppercase tracking-wider font-mono text-slate-300">
                <div className="space-y-1 max-w-[50%]">
                  <p className="text-[#bd9636] font-bold text-[8px]">Respectfully Submitted To</p>
                  <p className="font-bold text-white text-xs">{activeProposal.recipient.headingName}</p>
                  <p className="text-slate-300 font-light text-[8px] normal-case leading-tight">{activeProposal.recipient.name}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[#bd9636] font-bold text-[8px]">Submitted By</p>
                  <p className="font-bold text-white text-xs">{activeProposal.company.ceoName}</p>
                  <p className="text-slate-300 font-light text-[8px]">{activeProposal.company.ceoTitle} · {activeProposal.recipient.date.split(" ").pop()}</p>
                </div>
              </div>

              {/* Base Line Indicator */}
              <div className="absolute bottom-1 left-[20mm] right-[20mm] h-[2px] bg-gradient-to-r from-transparent via-[#bd9636]/50 to-transparent" />
            </div>


            {/* ======================================= */}
            {/* PAGE 2: formal TRANSMITTAL LETTER      */}
            {/* ======================================= */}
            <div className="print-page relative w-[210mm] h-[297mm] overflow-hidden bg-white text-slate-800 flex flex-col justify-between p-[20mm] shadow-2xl shrink-0 print:shadow-none mb-10 print:mb-0">
              
              {/* Letterhead Section */}
              <div className="border-b-2 border-ng-dark pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-display font-black tracking-wide text-ng-dark leading-none">
                      {activeProposal.company.name}
                    </h2>
                    <p className="text-xs font-mono font-bold text-[#bfa054] tracking-widest uppercase mt-1">
                      {activeProposal.company.tagline}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      RC: {activeProposal.company.rc}
                    </p>
                  </div>
                  
                  {/* Decorative Nigerian Seal Stamp Placeholder */}
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#bfa054] p-0.5 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-ng-dark/10 flex flex-col items-center justify-center text-[7px] font-sans font-extrabold text-[#bfa054] text-center leading-none">
                      <span>FADAK</span>
                      <span className="text-[5px] text-ng-dark">LAGOS/KATSINA</span>
                      <span>★ 1999 ★</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 text-[9px] text-slate-600 font-medium">
                  <div>
                    <p className="leading-relaxed">Address: {activeProposal.company.address}</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p>Tel: {activeProposal.company.tel}</p>
                    <p>Email: {activeProposal.company.email}</p>
                    <p>Web: {activeProposal.company.web}</p>
                  </div>
                </div>
              </div>

              {/* Letter Body */}
              <div className="my-auto space-y-4 text-xs tracking-normal leading-relaxed text-justify w-full pr-1">
                
                {/* Date line */}
                <div className="flex justify-between items-center text-[10px] font-mono font-semibold text-slate-600">
                  <span>Proposal Reference No: FMH/PRP/2026/0A</span>
                  <span>Date: {activeProposal.recipient.date}</span>
                </div>

                {/* Recipient Coordinates */}
                <div className="space-y-0.5 font-bold text-slate-900 border-l-2 border-[#bfa054] pl-3 py-0.5">
                  <p>{activeProposal.recipient.name}</p>
                  <p className="text-[11px] text-slate-700">{activeProposal.recipient.headingName}</p>
                  <p className="text-slate-600 font-normal font-sans text-[10px]">{activeProposal.recipient.address}</p>
                  {activeProposal.recipient.attention && (
                    <p className="text-xs text-ng-emerald italic font-medium font-serif mt-1">{activeProposal.recipient.attention}</p>
                  )}
                </div>

                <p className="font-serif">Sir,</p>

                {/* Subject Title */}
                <h3 className="text-xs font-display font-black tracking-tight text-center text-[#063d1f] border-y border-slate-200 py-2.5 uppercase leading-snug">
                  {activeProposal.letterTitle}
                </h3>

                {/* Body Paragraphs */}
                {activeProposal.letterBody.slice(0, 2).map((para, idx) => (
                  <p key={idx} className="font-sans text-slate-700 first-line:pl-6">{para}</p>
                ))}

                {/* Segment for Objectives embedded in letter */}
                {activeProposal.letterBody[2] && activeProposal.letterBody[2].includes("The Objective:") && (
                  <div className="bg-slate-50 p-3 rounded border border-slate-100 space-y-1 my-2">
                    <p className="font-display font-bold text-[#063d1f] text-[11px] uppercase tracking-wider">The Objective:</p>
                    <p className="text-slate-600 text-xs italic font-serif leading-relaxed">
                      As we enter the consolidation phase of 2026, it is vital to institutionalize your legacy. This documentary will serve as:
                    </p>
                    <ul className="list-none space-y-1.5 pt-2 text-[11px]">
                      <li className="flex gap-2">
                        <span className="text-ng-gold font-bold">1.</span>
                        <p className="text-slate-700"><strong className="text-slate-900">A Global Marketing Tool:</strong> Attracting further Foreign Direct Investment (FDI) to the Industrial and agricultural sector.</p>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-ng-gold font-bold">2.</span>
                        <p className="text-slate-700"><strong className="text-slate-900">A Historical Record:</strong> Documenting the tangible impact of your policies on the lives of people.</p>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-ng-gold font-bold">3.</span>
                        <p className="text-slate-700"><strong className="text-slate-900">A National Benchmark:</strong> Positioning the state as the premier example of sub-national governance in Africa.</p>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Letter Body Continued */}
                {activeProposal.letterBody.slice(3).map((para, idx) => {
                  if (para.includes("The Deliverables:")) {
                    return (
                      <div key={idx} className="space-y-1">
                        <p className="font-display font-bold text-ng-emerald text-[11px] uppercase">The Deliverables:</p>
                        <p className="font-sans text-slate-700">{para.replace("The Deliverables:", "").trim()}</p>
                      </div>
                    );
                  }
                  return <p key={idx} className="font-sans text-slate-700">{para}</p>;
                })}

              </div>

              {/* Sign-off Block */}
              <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                <div className="space-y-3">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Yours Faithfully,</p>
                    {/* Simulated hand-written signature styling */}
                    <div className="py-2">
                      <span className="font-serif italic text-xl text-ng-emerald tracking-wide block font-bold" style={{ fontFamily: "'Playfair Display', cursive" }}>
                        F. Dauda Kurfi
                      </span>
                      <div className="w-24 h-[1px] bg-slate-300 mt-1" />
                    </div>
                    <p className="font-bold text-slate-900 text-xs">{activeProposal.company.ceoName}</p>
                    <p className="text-[9px] text-slate-500 font-mono font-medium">{activeProposal.company.ceoTitle}</p>
                    <p className="text-[10px] text-slate-800 font-bold uppercase tracking-wider">FADAK MEDIA HUB</p>
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-400 font-mono">
                  Page 2 of 6
                </div>
              </div>

              {/* Watermark Logo */}
              {printWatermark && (
                <div className="absolute top-[40%] left-[25%] opacity-[0.03] select-none pointer-events-none transform -rotate-12">
                  <div className="w-[300px] h-[300px] rounded-full border-12 border-ng-dark flex flex-col items-center justify-center font-serif text-[40px] font-black text-ng-dark">
                    <span>FADAK</span>
                    <span className="text-[15px] tracking-wider">MEDIA HOST</span>
                  </div>
                </div>
              )}
            </div>


            {/* ======================================= */}
            {/* PAGE 3: SUMMARY & KEY PILLARS TABLE     */}
            {/* ======================================= */}
            <div className="print-page relative w-[210mm] h-[297mm] overflow-hidden bg-white text-slate-800 flex flex-col justify-between p-[20mm] shadow-2xl shrink-0 print:shadow-none mb-10 print:mb-0">
              
              {/* Header decor */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-[9px] font-mono tracking-widest text-[#063d1f] font-bold uppercase">{activeProposal.company.name}</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Proposal Summary & Pillars</span>
              </div>

              {/* Main Content */}
              <div className="my-auto space-y-6">
                
                {/* Title */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[#bd9b3b] text-base font-bold">1.0</span>
                    <h2 className="text-lg font-display font-black text-[#063d1f] uppercase tracking-wide">
                      {activeProposal.docTitle}
                    </h2>
                  </div>
                  <p className="text-[11px] font-mono font-bold text-[#bfa054] tracking-wide italic">{activeProposal.docSubtitle}</p>
                  <div className="w-16 h-0.5 bg-[#bd9b3b] mt-1" />
                </div>

                {/* Section 1: Executive Summary */}
                <div className="space-y-2 text-justify">
                  <h3 className="text-xs uppercase tracking-wider font-display font-black text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-ng-emerald inline-block" />
                    1. Executive Summary
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans font-light first-letter:text-lg first-letter:font-bold first-letter:text-ng-dark">
                    {activeProposal.execSummary}
                  </p>
                </div>

                {/* Section 2: Objectives */}
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wider font-display font-black text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-ng-emerald inline-block" />
                    2. Objectives
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {activeProposal.objectives.map((obj, i) => {
                      const splitObj = obj.split(":");
                      const title = splitObj[0];
                      const desc = splitObj.slice(1).join(":");
                      return (
                        <div key={i} className="p-3 bg-[#f3f9f4]/60 border border-[#063d1f]/10 rounded-lg flex gap-2.5 items-start">
                          <span className="w-5 h-5 rounded bg-ng-emerald/10 text-[#063d1f] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {i+1}
                          </span>
                          <div className="text-xs space-y-0.5">
                            <h4 className="font-bold text-slate-900 leading-snug">{title}</h4>
                            {desc && <p className="text-[11px] text-slate-600 leading-normal">{desc.trim()}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: Key Documentary Pillars */}
                <div className="space-y-3 pt-1">
                  <h3 className="text-xs uppercase tracking-wider font-display font-black text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-ng-emerald inline-block" />
                    3. Key Documentary Pillars (The "Story" Hubs)
                  </h3>
                  
                  {/* Clean responsive table */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-ng-dark to-ng-emerald text-white font-display font-bold">
                          <th className="py-2.5 px-4 font-bold border-b border-ng-dark text-[#bd9636] uppercase tracking-wider w-[30%]">Pillar</th>
                          <th className="py-2.5 px-4 font-bold border-b border-ng-dark uppercase tracking-wider">Key Highlights to Feature</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeProposal.pillars.map((pil, idx) => (
                          <tr 
                            key={pil.id} 
                            className={`border-b border-slate-100 last:border-none ${
                              idx % 2 === 0 ? "bg-white" : "bg-[#f4faf6]/30"
                            }`}
                          >
                            <td className="py-2.5 px-4 font-bold text-slate-900 leading-snug border-r border-slate-100">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-ng-gold shrink-0" />
                                {pil.pillar}
                              </div>
                            </td>
                            <td className="py-2.5 px-4 text-slate-600 text-[11px] leading-relaxed">
                              {pil.highlight}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="flex justify-between items-center border-t border-slate-100 pt-3 text-[10px] text-slate-400 font-mono">
                <span>CONFIDENTIAL PROPOSAL · FADAK MEDIA HUB</span>
                <span>Page 3 of 6</span>
              </div>
            </div>


            {/* ======================================= */}
            {/* PAGE 4: PRODUCTION STRATEGY & TIMELINE */}
            {/* ======================================= */}
            <div className="print-page relative w-[210mm] h-[297mm] overflow-hidden bg-white text-slate-800 flex flex-col justify-between p-[20mm] shadow-2xl shrink-0 print:shadow-none mb-10 print:mb-0">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-[9px] font-mono tracking-widest text-[#063d1f] font-bold uppercase">{activeProposal.company.name}</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Production & Timeline</span>
              </div>

              {/* Body Content */}
              <div className="my-auto space-y-6">
                
                {/* Methodologies */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-display font-black text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-ng-emerald inline-block" />
                    4. Production Strategy & Methodology
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    To ensure high engagement and national appeal, the documentary will employ an advanced human-first epic cinematic narrative, keeping core visual standards at 4K resolution.
                  </p>
                  
                  <div className="space-y-2.5 pt-1">
                    {activeProposal.strategy.map((str, sIdx) => (
                      <div key={str.id} className="border-l-2 border-[#bd9636] pl-3.5 py-1 space-y-0.5">
                        <h4 className="font-bold text-slate-900 font-display text-xs">{str.title}</h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{str.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Media Distribution Plan */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-display font-black text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-ng-emerald inline-block" />
                    5. Media Distribution Plan
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed leading-none">
                    A media asset's effectiveness rests entirely on strategic eyes. We plan an immediate "Surround Sound" campaign:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3.5 pt-1.5">
                    {activeProposal.distribution.map((dist, idx) => (
                      <div key={dist.id} className="p-3 bg-[#fbfbfb] border border-slate-100 rounded-lg space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded bg-ng-gold" />
                          <h4 className="font-display font-extrabold text-slate-900 text-xs">{dist.title}</h4>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-light pl-4">{dist.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3 pt-1">
                  <h3 className="text-xs uppercase tracking-wider font-display font-black text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-ng-emerald inline-block" />
                    6. Estimated Timeline
                  </h3>
                  
                  <div className="relative border-l-2 border-[#063d1f]/10 ml-3 pl-6 space-y-4">
                    {activeProposal.timeline.map((time, tIdx) => (
                      <div key={time.id} className="relative">
                        {/* Dot indicator */}
                        <span className="absolute left-[-29px] top-0.5 w-3 h-3 rounded-full bg-gradient-to-r from-ng-gold to-amber-400 border border-white" />
                        
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-display font-black text-slate-900">{time.phase}</span>
                            <span className="bg-[#063d1f]/10 text-[#063d1f] font-mono text-[9px] font-bold px-2 py-0.5 rounded-full">
                              {time.duration}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed pr-2">{time.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="flex justify-between items-center border-t border-slate-100 pt-3 text-[10px] text-slate-400 font-mono">
                <span>CONFIDENTIAL PROPOSAL · FADAK MEDIA HUB</span>
                <span>Page 4 of 6</span>
              </div>
            </div>


            {/* ======================================= */}
            {/* PAGE 5: PROJECTED DOCUMENTARY BUDGET     */}
            {/* ======================================= */}
            <div className="print-page relative w-[210mm] h-[297mm] overflow-hidden bg-white text-slate-800 flex flex-col justify-between p-[20mm] shadow-2xl shrink-0 print:shadow-none mb-10 print:mb-0">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-[9px] font-mono tracking-widest text-[#063d1f] font-bold uppercase">{activeProposal.company.name}</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Project Pricing Breakdown</span>
              </div>

              {/* Content */}
              <div className="my-auto space-y-6">
                
                {/* Budget Title */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[#bd9b3b] text-base font-bold">2.0</span>
                    <h2 className="text-lg font-display font-black text-[#063d1f] uppercase tracking-wide">
                      Projected Documentary Budget
                    </h2>
                  </div>
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Financial allocation breakdown & Grand totals</p>
                  <div className="w-16 h-0.5 bg-[#bd9b3b] mt-1" />
                </div>

                {/* Table Container */}
                <div className="border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-ng-dark to-ng-emerald text-white font-display">
                        <th className="py-2.5 px-4 font-bold border-b border-ng-dark text-[#bd9636] uppercase tracking-wider w-[35%]">Category</th>
                        <th className="py-2.5 px-4 font-bold border-b border-ng-dark uppercase tracking-wider">Description of Logistics</th>
                        <th className="py-2.5 px-4 font-bold border-b border-ng-dark text-right uppercase tracking-wider w-[22%]">Estimated (₦)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeProposal.budget.map((b, bIdx) => (
                        <tr 
                          key={b.id} 
                          className={`border-b border-slate-100 last:border-none ${
                            bIdx % 2 === 0 ? "bg-white" : "bg-[#f4faf6]/30"
                          }`}
                        >
                          <td className="py-2.5 px-4 font-bold text-slate-900 border-r border-slate-100">
                            {b.category}
                          </td>
                          <td className="py-2.5 px-4 text-slate-600 text-[11px] leading-relaxed border-r border-slate-100">
                            {b.description}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900 text-[11px]">
                            {b.cost.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                      
                      {/* Subtotal block */}
                      <tr className="bg-slate-50 border-t border-slate-200">
                        <td colSpan={2} className="py-3 px-4 text-right font-display font-black text-slate-900 uppercase">
                          Grand Total Budget Amount:
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#063d1f] text-xs">
                          {formatNaira(calculatedGrandTotal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section 4: Justification of project costs */}
                <div className="space-y-3.5">
                  <div className="space-y-0.5">
                    <h3 className="text-xs uppercase tracking-wider font-display font-black text-slate-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-3.5 bg-ng-emerald inline-block" />
                      7. Justification of Project Costs
                    </h3>
                    <p className="text-[11px] text-slate-500 italic">
                      The proposed budget is structured to ensure that the production serves as a strategic asset of extreme value.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeProposal.justification.map((just) => (
                      <div key={just.id} className="p-3 bg-[#fbfbfb] border border-slate-100 rounded-lg space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[#bd9b3b] font-mono text-xs font-bold uppercase select-none bg-[#bd9b3b]/10 px-1.5 py-0.5 rounded">
                            {just.num}
                          </span>
                          <h4 className="font-display font-bold text-slate-900 text-xs leading-snug">{just.title}</h4>
                        </div>
                        <p className="text-[10px] text-slate-600 leading-normal pl-1.5 font-light">{just.details.slice(0, 150)}...</p>
                        {just.value && (
                          <div className="pt-1 pl-1.5 border-t border-dashed border-slate-100 text-[9.5px]">
                            <strong className="text-ng-emerald font-medium">Strategic Benefit: </strong>
                            <span className="text-slate-700 italic">{just.value}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="flex justify-between items-center border-t border-slate-100 pt-3 text-[10px] text-slate-400 font-mono">
                <span>CONFIDENTIAL PROPOSAL · FADAK MEDIA HUB</span>
                <span>Page 5 of 6</span>
              </div>
            </div>


            {/* ======================================= */}
            {/* PAGE 6: COST BENEFIT & CONCLUSION       */}
            {/* ======================================= */}
            <div className="print-page relative w-[210mm] h-[297mm] overflow-hidden bg-white text-slate-800 flex flex-col justify-between p-[20mm] shadow-2xl shrink-0 print:shadow-none mb-10 print:mb-0">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-[9px] font-mono tracking-widest text-[#063d1f] font-bold uppercase">{activeProposal.company.name}</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Signing & Action Path</span>
              </div>

              {/* Content body */}
              <div className="my-auto space-y-5">
                
                {/* Cost benefit summary table */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-display font-black text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-ng-emerald inline-block" />
                    v. Cost-Benefit Summary Highlights
                  </h3>
                  
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-ng-dark to-ng-emerald text-white font-display">
                          <th className="py-2.5 px-4 font-bold border-b border-ng-dark text-[#bd9636] uppercase tracking-wider w-[35%]">Investment Area</th>
                          <th className="py-2.5 px-4 font-bold border-b border-ng-dark uppercase tracking-wider">Benefit Highlights to State / Federation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeProposal.costBenefit.map((cb, idx) => (
                          <tr 
                            key={cb.id} 
                            className={`border-b border-slate-100 last:border-none ${
                              idx % 2 === 0 ? "bg-white" : "bg-[#f4faf6]/30"
                            }`}
                          >
                            <td className="py-2.5 px-4 font-bold text-slate-900 leading-snug border-r border-slate-100">
                              {cb.area}
                            </td>
                            <td className="py-2.5 px-4 text-slate-600 text-[11px] leading-relaxed">
                              {cb.benefit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 8: Conclusion & Call to Action */}
                <div className="space-y-2.5 pt-1 text-justify">
                  <h3 className="text-xs uppercase tracking-wider font-display font-black text-[#04200f] flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-[#bd9636] inline-block font-bold" />
                    {activeProposal.conclusionTitle}
                  </h3>
                  
                  {activeProposal.conclusionParagraphs.map((para, idx) => (
                    <p key={idx} className="text-xs text-slate-700 leading-relaxed font-sans font-light">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Path forward milestones */}
                <div className="p-3.5 bg-[#f4faf6] border border-[#063d1f]/10 rounded-xl space-y-2">
                  <span className="text-[10px] tracking-wider font-mono font-bold uppercase text-[#063d1f]">
                    {activeProposal.pathForwardTitle}
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeProposal.pathForwardItems.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <span className="w-4 h-4 rounded-full bg-ng-gold text-slate-900 font-extrabold text-[9px] flex items-center justify-center shrink-0 mt-0.5 select-none">
                          ✓
                        </span>
                        <p className="text-[10.5px] text-slate-700 leading-snug font-sans">{item}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-500 font-serif italic pt-1 border-t border-slate-200 mt-2">
                    {activeProposal.pathForwardClosing}
                  </p>
                </div>

              </div>

              {/* High-fidelity responsive signatures panel at the very bottom */}
              <div className="border-t border-slate-200 pt-4 flex justify-between items-start">
                
                <div className="space-y-2.5 max-w-[50%]">
                  <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 font-bold block mb-1">
                    Submitted Respectfully By
                  </span>
                  <div className="space-y-1">
                    {/* Digitized Signatory */}
                    <p className="font-serif italic text-lg leading-none font-bold text-ng-emerald" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Fatima Dauda Kurfi
                    </p>
                    <p className="text-xs font-bold text-slate-900 leading-none">{activeProposal.company.ceoName}</p>
                    <p className="text-[8.5px] text-slate-500 tracking-wider font-mono leading-tight">
                      {activeProposal.company.ceoTitle} · {activeProposal.company.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 shrink-0 text-right">
                  <span className="text-[8.5px] uppercase tracking-wider font-mono text-[#063d1f] font-bold block mb-1">
                    Authorization & Commencement Sign-off
                  </span>
                  
                  <div className="flex gap-4 pt-1 items-end">
                    <div className="text-center space-y-1">
                      <div className="w-32 h-[1px] bg-slate-300" />
                      <span className="text-[7.5px] font-mono text-slate-400">Signature stamp area</span>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="w-20 h-[1px] bg-slate-300" />
                      <span className="text-[7.5px] font-mono text-slate-400">Date</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-between items-center border-t border-slate-100 pt-3 text-[10px] text-slate-400 font-mono">
                <span>CONFIDENTIAL PROPOSAL · FADAK MEDIA HUB</span>
                <span>Page 6 of 6</span>
              </div>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
