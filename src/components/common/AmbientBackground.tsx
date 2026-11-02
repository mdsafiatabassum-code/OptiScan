export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-40 -top-40 h-[36rem] w-[36rem] animate-drift rounded-full bg-primary-500/10 blur-3xl" />
      <div className="absolute -right-48 top-1/3 h-[32rem] w-[32rem] animate-drift rounded-full bg-secondary-600/10 blur-3xl [animation-delay:-8s]" />
      <div className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] animate-drift rounded-full bg-success-500/5 blur-3xl [animation-delay:-14s]" />
    </div>
  );
}
