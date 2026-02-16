export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Photo Placeholder */}
      <div className="absolute inset-0 photo-placeholder">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[0.2em] mb-6 animate-fade-in-up">
          SHIP
        </h1>
        <p className="text-lg md:text-xl font-light tracking-[0.15em] mb-4 animate-fade-in-up delay-200 opacity-0">
          南房総のローカル複合施設
        </p>
        <p className="text-sm md:text-base font-light tracking-wider animate-fade-in-up delay-300 opacity-0">
          2026年5月 OPEN
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in-up delay-500 opacity-0">
        <div className="flex flex-col items-center gap-2 text-white/80">
          <span className="text-xs tracking-[0.2em]">SCROLL</span>
          <div className="w-px h-12 bg-white/50 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
