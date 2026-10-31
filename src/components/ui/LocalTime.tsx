"use client";

import { useEffect, useState } from "react";

/** Live clock for a given IANA timezone. Renders a placeholder until mounted to avoid hydration mismatch. */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return <time suppressHydrationWarning className="tabular-nums">{now ?? "--:--:--"}</time>;
}