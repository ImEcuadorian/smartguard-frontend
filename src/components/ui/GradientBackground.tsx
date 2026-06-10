export function GradientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute left-10 top-16 h-72 w-72 rounded-full bg-[rgb(var(--sg-primary-rgb)/0.18)] blur-3xl" />
      <div className="absolute right-12 top-8 h-80 w-80 rounded-full bg-[rgb(var(--sg-accent-rgb)/0.16)] blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
    </div>
  );
}
