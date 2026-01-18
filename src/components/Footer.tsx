import { MapPin, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t border-border">
      <div className="max-w-md mx-auto text-center">
        <h3 className="font-display text-xl text-primary mb-4">INSCRIPCIÓN</h3>
        
        <div className="flex items-start gap-3 bg-card/60 rounded-lg p-4 mb-6 text-left">
          <MapPin className="w-5 h-5 text-carnaval-green flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-foreground font-medium">Presencial:</p>
            <p className="text-muted-foreground text-sm">
              Centro de Oportunidades<br />
              Cra 21B # 39 – 59, barrio San José
            </p>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          O a través de este formulario en línea
        </p>

        <div className="pt-6 border-t border-border">
          <p className="text-muted-foreground text-xs">
            © 2026 Alcaldía de Barranquilla · Carnaval de Barranquilla
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Hecho con 💛 para los barranquilleros
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
