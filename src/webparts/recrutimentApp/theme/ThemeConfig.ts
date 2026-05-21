export interface AppTheme {
  primaryColor: string;     // Primary Accent / Borders / Active indicators
  secondaryColor: string;   // Page background / Layout main background
  buttonColor: string;      // Primary Button background
  sideNavColor: string;     // Sidebar background
  headerColor: string;      // Header/Navbar background
  textColor: string;        // Text color
  cardColor: string;        // Card background
  fontFamily: string;
  name?: string;            // Predefined theme name (optional)
  isCustom?: boolean;       // Custom theme flag (optional)
}

export const predefinedThemes: Record<string, AppTheme> = {
  classic: {
    name: "Classic",
    primaryColor: "#2563eb",
    secondaryColor: "#f8fafc",
    buttonColor: "#2563eb",
    sideNavColor: "#1e1b4b", // dark navy-purple sidebar background
    headerColor: "#ffffff",
    textColor: "#0f172a",
    cardColor: "#ffffff",
    fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif"
  },
   Kamoa_Theme: {
    name: "Kamoa Theme",
    primaryColor: "#000000",
    secondaryColor: "#f8fafc",
    buttonColor: "#f00b0b",
    sideNavColor: "#f20404", // dark navy-purple sidebar background
    headerColor: "#ffffff",
    textColor: "#0f172a",
    cardColor: "#ffffff",
    fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif"
  },
  dark: {
    name: "Dark",
    primaryColor: "#3b82f6",
    secondaryColor: "#0f172a",
    buttonColor: "#3b82f6",
    sideNavColor: "#111827",
    headerColor: "#1f2937",
    textColor: "#f9fafb",
    cardColor: "#1f2937",
    fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif"
  },
  koopaBeach: {
    name: "Koopa Beach",
    primaryColor: "#38bdf8", // ocean blue
    secondaryColor: "#fef3c7", // sandy yellow
    buttonColor: "#f59e0b", // sunny amber
    sideNavColor: "#0284c7", // deep ocean blue
    headerColor: "#e0f2fe", // soft sky/water
    textColor: "#1e293b",
    cardColor: "#ffffff",
    fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif"
  },
  chocoMountain: {
    name: "Choco Mountain",
    primaryColor: "#78350f", // chocolate accent
    secondaryColor: "#fafaf9", // stone gray / sand
    buttonColor: "#78350f", // milk chocolate
    sideNavColor: "#451a03", // deep cocoa
    headerColor: "#fff7ed", // warm cream
    textColor: "#451a03", // dark chocolate text
    cardColor: "#fff7ed", // warm cream card
    fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif"
  },
  sherbetLand: {
    name: "Sherbet Land",
    primaryColor: "#ec4899", // pink accent
    secondaryColor: "#f5f3ff", // soft pastel background
    buttonColor: "#ec4899", // strawberry pink
    sideNavColor: "#fbcfe8", // soft pastel pink
    headerColor: "#e0f2fe", // soft pastel blue
    textColor: "#4c1d95", // deep purple text
    cardColor: "#ffffff",
    fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif"
  },
  rainbowRoad: {
    name: "Rainbow Road",
    primaryColor: "#d946ef", // neon magenta
    secondaryColor: "#0f052d", // cosmic dark background
    buttonColor: "#d946ef", // neon button
    sideNavColor: "#2e1065", // cosmic deep violet sidebar
    headerColor: "#4c1d95", // neon purple header
    textColor: "#fdf4ff", // lilac text
    cardColor: "#1e1145", // translucent card bg
    fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif"
  }
};

export const defaultTheme: AppTheme = predefinedThemes.classic;
