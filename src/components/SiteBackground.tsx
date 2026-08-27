import { ClientOnly } from "@tanstack/react-router";
import FloatingLines from "./FloatingLines";

export function SiteBackground() {
  return (
    <div
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: -10, pointerEvents: "none" }}
      className="opacity-90"
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #FFD1DC 45%, #D0F0C0 100%)",
        }}
      />
      <ClientOnly fallback={null}>
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={[10, 15, 20]}
          lineDistance={[8, 6, 4]}
          linesGradient={["#FFD1DC", "#D0F0C0", "#FFFFFF", "#5C4033"]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
          mixBlendMode="soft-light"
        />
      </ClientOnly>
    </div>
  );
}