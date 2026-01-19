import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, Loader2, CheckCircle, ArrowLeft, FileText, User } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import ConfettiBackground from "@/components/ConfettiBackground";
import { toast } from "sonner";
import { useRegistroPaso2 } from "@/hooks/useRegistroPaso2";

const RegistroDocumentos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completar: completarRegistro, loading: cargandoSupabase } = useRegistroPaso2();
  const [hojaVida, setHojaVida] = useState<File | null>(null);
  const [fotoRostro, setFotoRostro] = useState<File | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({ hojaVida: "", fotoRostro: "" });

  // Get data from step 1
  const step1Data = location.state as Step1Data | null;

  useEffect(() => {
    // If no step 1 data, redirect back to home
    // Ahora usamos sessionStorage en lugar de location.state
    const registroId = sessionStorage.getItem('registroId');
    if (!registroId) {
      navigate("/");
    }
  }, [navigate]);

  const validateFiles = () => {
    const newErrors = { hojaVida: "", fotoRostro: "" };
    if (!hojaVida) newErrors.hojaVida = "La hoja de vida es obligatoria";
    if (!fotoRostro) newErrors.fotoRostro = "La foto del rostro es obligatoria";
    setErrors(newErrors);
    return !newErrors.hojaVida && !newErrors.fotoRostro;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFiles()) return;

    // Obtener registroId de sessionStorage
    const registroId = sessionStorage.getItem('registroId');
    if (!registroId) {
      toast.error('Error: No se encontró el registro del Paso 1');
      navigate("/");
      return;
    }

    // Enviar a Supabase
    const resultado = await completarRegistro(registroId, {
      hojaVida: hojaVida || undefined,
      fotoRostro: fotoRostro || undefined,
    });

    if (resultado.success) {
      setIsSuccess(true);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background relative confetti-bg flex items-center justify-center p-4">
        <ConfettiBackground />
        <div className="relative z-10 bg-card rounded-2xl p-8 carnaval-border text-center max-w-md w-full">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-carnaval-green/20 flex items-center justify-center animate-float">
            <CheckCircle className="w-14 h-14 text-carnaval-green" />
          </div>
          <h3 className="font-display text-3xl md:text-4xl text-primary mb-4">
            ¡INSCRIPCIÓN COMPLETA!
          </h3>
          <p className="text-foreground text-lg mb-3">
            Tus datos y documentos han sido recibidos exitosamente.
          </p>
          <p className="text-muted-foreground mb-6">
            Te llamamos en las próximas <strong className="text-primary">24 horas</strong> para agendar tu entrevista.
          </p>
          <div className="bg-muted/50 rounded-xl p-4 mb-6">
            <p className="text-foreground text-sm">
              📱 Revisa tu teléfono y WhatsApp
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Guarda nuestro número para identificarnos
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="btn-carnaval w-full"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative confetti-bg">
      <ConfettiBackground />
      
      <div className="relative z-10 max-w-lg mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-carnaval-green flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">Datos</span>
            </div>
            <div className="w-12 h-1 bg-primary rounded"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-pulse-glow">
                <span className="text-primary-foreground font-bold text-sm">2</span>
              </div>
              <span className="text-sm text-foreground font-medium">Documentos</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 md:p-8 carnaval-border space-y-6">
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl md:text-3xl carnaval-text-gradient">
              PASO 2: TUS DOCUMENTOS
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              ¡Ya casi terminas!
            </p>
          </div>

          {/* Hoja de vida upload */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <FileText className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Hoja de Vida</h3>
                <p className="text-xs text-muted-foreground">PDF o imagen de tu CV</p>
              </div>
            </div>
            <FileUpload
              label="Sube tu hoja de vida"
              onChange={setHojaVida}
              accept="image/*,.pdf"
              required
              error={errors.hojaVida}
            />
          </div>

          {/* Foto rostro upload */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Foto de tu Rostro</h3>
                <p className="text-xs text-muted-foreground">Selfie o foto frontal clara</p>
              </div>
            </div>
            <FileUpload
              label="Sube una foto de tu rostro"
              onChange={setFotoRostro}
              accept="image/*"
              required
              error={errors.fotoRostro}
            />
          </div>

          {/* Tips */}
          <div className="bg-muted/30 rounded-xl p-4 border border-border">
            <p className="text-sm font-medium text-foreground mb-2">💡 Tips para tu foto:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Rostro bien iluminado y centrado</li>
              <li>• Fondo sencillo (pared lisa)</li>
              <li>• Sin lentes oscuros ni gorras</li>
            </ul>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={cargandoSupabase}
            className="btn-carnaval w-full animate-pulse-glow flex items-center justify-center gap-3 text-xl"
          >
            {cargandoSupabase ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                ¡COMPLETAR INSCRIPCIÓN!
              </>
            )}
          </button>

          <p className="text-center text-muted-foreground text-xs">
            🔒 Tus documentos están seguros y solo se usan para el proceso de selección.
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistroDocumentos;
