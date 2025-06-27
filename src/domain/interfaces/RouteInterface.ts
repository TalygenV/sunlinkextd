export interface RouteControllerProps {
  isAuthenticated: boolean;
  isInstaller?: boolean;
  isAdmin?: boolean;
  hasCompletedPurchase: boolean;
  isDataLoaded: boolean;
  portalComponent?: React.ReactNode;
  designComponent?: React.ReactNode;
  homeComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}