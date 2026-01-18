import { PartyPopper, Calendar } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-8 pb-6 px-4 text-center">
      {/* Logo area */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <PartyPopper className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display text-xl text-foreground">BARRANQUILLA</span>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="flex items-center gap-2">
          <span className="font-display text-xl carnaval-text-gradient">CARNAVAL 2026</span>
        </div>
      </div>

      {/* Main headline */}
      <h1 className="font-display text-4xl md:text-6xl leading-tight mb-4">
        <span className="text-foreground">¡SÉ PROTAGONISTA DE</span>
        <br />
        <span className="carnaval-text-gradient">LA FIESTA MÁS GRANDE</span>
        <br />
        <span className="text-foreground">DE COLOMBIA!</span>
      </h1>

      {/* Subtitle */}
      <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-6 leading-relaxed">
        Capacítate y forma parte del equipo logístico para el 
        <strong className="text-foreground"> Carnaval de Barranquilla 2026</strong> 
        {" "}y otros eventos de ciudad.
      </p>

      {/* Date badge */}
      <div className="inline-flex items-center gap-2 bg-carnaval-yellow/20 border border-carnaval-yellow/50 rounded-full px-6 py-3">
        <Calendar className="w-5 h-5 text-primary" />
        <span className="text-foreground font-semibold">
          CONVOCATORIA ABIERTA
        </span>
      </div>
      <p className="text-primary font-bold text-lg mt-3">
        Del 16 hasta el 20 de enero de 2026
      </p>
    </section>
  );
};

export default HeroSection;
