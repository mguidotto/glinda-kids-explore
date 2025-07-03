
import { ReactNode } from "react";
import { useCapacitor } from "@/hooks/useCapacitor";
import MobileBottomNav from "./MobileBottomNav";

interface MobileLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

const MobileLayout = ({ children, showBottomNav = true }: MobileLayoutProps) => {
  const { isNative } = useCapacitor();

  // MobileLayout should only be used for native apps
  if (!isNative) {
    return <>{children}</>;
  }

  return (
    <div className={`min-h-screen ${isNative ? 'pb-20' : ''}`}>
      {children}
      {isNative && showBottomNav && <MobileBottomNav />}
    </div>
  );
};

export default MobileLayout;
