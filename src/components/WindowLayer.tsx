import { AnimatePresence } from "framer-motion";
import { useDesktop } from "../store/useDesktop";
import { Window } from "./Window";
import { CategoryWindow } from "./windows/CategoryWindow";
import { AppInfoWindow } from "./windows/AppInfoWindow";

/** Renders every open window from the store. */
export function WindowLayer() {
  const windows = useDesktop((s) => s.windows);

  return (
    <AnimatePresence>
      {windows.map((win) => (
        <Window
          key={win.id}
          instance={win}
          width={win.kind === "appInfo" ? 380 : 460}
        >
          {win.kind === "category" && win.payload && (
            <CategoryWindow categoryId={win.payload} />
          )}
          {win.kind === "appInfo" && win.payload && (
            <AppInfoWindow appId={win.payload} />
          )}
        </Window>
      ))}
    </AnimatePresence>
  );
}
