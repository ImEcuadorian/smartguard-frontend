export function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="sg-mesh-layer absolute inset-[-12%]" />
      <div className="sg-aurora-layer absolute inset-[-18%]" />
      <div className="sg-wave-layer absolute inset-0" />
      <div className="sg-light-ribbon-layer absolute inset-0" />
      <div className="sg-grid-layer absolute inset-0" />
      <div className="sg-scan-layer absolute inset-0" />
      <div className="sg-backdrop-layer absolute inset-0" />
    </div>
  );
}
