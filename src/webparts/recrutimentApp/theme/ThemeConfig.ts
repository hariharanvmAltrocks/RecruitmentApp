export interface AppTheme {
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  sideNavColor: string;
  headerColor: string;
  fontFamily: string;
}

export const defaultTheme: AppTheme = {
  primaryColor: "#2563eb",
  secondaryColor: "#f8fafc",
  buttonColor: "#2563eb",
  sideNavColor: "#ffffff",
  headerColor: "#ffffff",
  fontFamily: "'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif"
};
