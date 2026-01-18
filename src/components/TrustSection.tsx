import { Users, Calendar, CreditCard, MessageCircle, Check } from "lucide-react";

const TrustSection = () => {
  const benefits = [
    {
      icon: Users,
      title: "+500 vacantes",
      description: "Disponibles para ti",
    },
    {
      icon: Calendar,
      title: "4 semanas",
      description: "De trabajo garantizado",
    },
    {
      icon: CreditCard,
      title: "Pago puntual",
      description: "Uniforme incluido",
    },
    {
      icon: MessageCircle,
      title: "Respuesta rápida",
      description: "Vía WhatsApp",
    },
  ];

  const requisitos = [
    "Ser mayor de 18 años",
    "Residir en Barranquilla",
    "Disponibilidad Pre-Carnaval y Carnaval",
    "Asistir a capacitación presencial (5 horas)",
  ];

  return (
    <section className="py-12 px-4">
      {/* Benefits grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-card/80 backdrop-blur-sm rounded-xl p-4 text-center border border-border hover:border-primary/50 transition-all duration-300"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
              <benefit.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground text-lg">{benefit.title}</h3>
            <p className="text-muted-foreground text-sm">{benefit.description}</p>
          </div>
        ))}
      </div>

      {/* Requisitos */}
      <div className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border">
        <h3 className="font-display text-2xl text-primary mb-4 text-center">
          REQUISITOS
        </h3>
        <ul className="space-y-3">
          {requisitos.map((requisito, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-carnaval-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-carnaval-green" />
              </div>
              <span className="text-foreground">{requisito}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 p-4 bg-carnaval-yellow/10 rounded-lg border border-carnaval-yellow/30">
          <p className="text-sm text-foreground">
            <strong className="text-primary">*Cupos limitados.</strong> Sujeto a cumplimiento de requisitos.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Este proceso es <strong className="text-carnaval-green">gratuito</strong> y no requiere intermediarios.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
