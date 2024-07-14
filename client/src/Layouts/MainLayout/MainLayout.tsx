import { ReactNode } from "react";
import Sidebar from "../../components/Sidebar";
import { useRouterState } from "@tanstack/react-router";
import { useBreakpoint } from "../../hooks/useBreakpoint";

interface Props {
  children?: ReactNode;
}

function MainLayout({ children }: Props) {
  const routerState = useRouterState();
  const hideNavRoutes = ["/login"];
  const { isBelowSm } = useBreakpoint("sm");

  const sidebar = () => {
    if (hideNavRoutes.includes(routerState.location.pathname)) {
      return null;
    }

    if (!isBelowSm) return <Sidebar />;

    return (
      <div className="drawer">
        <input id="main-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side">
          <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <Sidebar />
        </div>
      </div>
    );
  };

  return (
    <div className="sm:flex">
      <div>{sidebar()}</div>
      <div className="w-full">{children}</div>
    </div>
  );
}

export default MainLayout;
