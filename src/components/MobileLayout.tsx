
import { ReactNode } from "react";
import { useCapacitor } from "@/hooks/useCapacitor";
import MobileBottomNav from "./MobileBottomNav";

interface MobileLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

const MobileLayout = ({ children, showBottomNav = true }: MobileLayoutProps) => {
  const { isNative } = useCapacitor();

  // Only apply mobile layout for native apps
  if (!isNative) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen pb-20">
      {children}
      {showBottomNav && <MobileBottomNav />}
    </div>
  );
};

export default MobileLayout;
