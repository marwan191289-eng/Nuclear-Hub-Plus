import { useEffect } from "react";

export function ClickGlowLayer() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const addGlow = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return;

      const glow = document.createElement("span");
      glow.className = "tap-glow";
      glow.setAttribute("aria-hidden", "true");
      glow.style.setProperty("--tap-x", `${event.clientX}px`);
      glow.style.setProperty("--tap-y", `${event.clientY}px`);
      document.body.appendChild(glow);
      window.setTimeout(() => glow.remove(), 900);
    };

    window.addEventListener("pointerdown", addGlow, { passive: true });
    return () => window.removeEventListener("pointerdown", addGlow);
  }, []);

  return null;
}
