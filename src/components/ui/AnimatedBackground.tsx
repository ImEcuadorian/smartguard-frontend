export function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="sg-aurora-layer absolute inset-[-20%]" />
      <div className="sg-wave-layer absolute inset-0" />
      <div className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-[rgb(var(--sg-primary-rgb)/0.16)] blur-3xl" />
      <div className="absolute right-[5%] top-[6%] h-80 w-80 rounded-full bg-[rgb(var(--sg-accent-rgb)/0.14)] blur-3xl" />
      <div className="absolute bottom-[-10%] left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgb(2_6_23/0.46)_76%)]" />
    </div>
  );
}
