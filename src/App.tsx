import { useState } from "react";
import { BootSequence } from "./components/BootSequence";
import { Desktop } from "./components/Desktop";

const BOOT_KEY = "lookout:booted";

export default function App() {
  // Show the boot animation once per browser session.
  const [booted, setBooted] = useState(
    () => sessionStorage.getItem(BOOT_KEY) === "1",
  );

  const finish = () => {
    sessionStorage.setItem(BOOT_KEY, "1");
    setBooted(true);
  };

  return (
    <>
      <Desktop />
      {!booted && <BootSequence onDone={finish} />}
    </>
  );
}
