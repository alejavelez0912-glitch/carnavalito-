import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import FileUpload from "./FileUpload";
import { toast } from "sonner";

const formSchema = z.object({
  nombreCompleto: z.string().min(3, "Nombre debe tener al menos 3 caracteres").max(100),
  edad: z.number().min(18, "Debes ser mayor de 18 años").max(60, "La edad máxima es 60 años"),
  cedula: z.string().regex(/^\d{6,12}$/, "Cédula debe tener entre 6 y 12 dígitos"),
  barrio: z.string().min(2, "Ingresa tu barrio").max(100),
  estadoCivil: z.enum(["soltero", "casado", "union_libre"]),
  ocupacion: z.enum(["estudio", "trabajo", "ambos", "ninguno"]),
});

type FormData = z.infer<typeof formSchema>;

const CarnavalForm = () => {
  const [fotoFrente, setFotoFrente] = useState<File | null>(null);
  const [fotoReverso, setFotoReverso] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [photoErrors, setPhotoErrors] = useState({ frente: "", reverso: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const validatePhotos = () => {
    const newErrors = { frente: "", reverso: "" };
    if (!fotoFrente) newErrors.frente = "La foto del frente es obligatoria";
    if (!fotoReverso) newErrors.reverso = "La foto del reverso es obligatoria";
    setPhotoErrors(newErrors);
    return !newErrors.frente && !newErrors.reverso;
  };

  const onSubmit = async (data: FormData) => {
    if (!validatePhotos()) return;

    setIsSubmitting(true);

    try {
      // Simular envío (aquí iría el webhook de n8n)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      console.log("Form data:", data);
      console.log("Foto frente:", fotoFrente);
      console.log("Foto reverso:", fotoReverso);

      setIsSuccess(true);
      toast.success("¡Datos enviados correctamente!");
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
        reset();
        setFotoFrente(null);
        setFotoReverso(null);
      }, 5000);
    } catch (error) {
      toast.error("Error al enviar. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-card rounded-2xl p-8 carnaval-border text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-carnaval-green/20 flex items-center justify-center animate-float">
          <CheckCircle className="w-12 h-12 text-carnaval-green" />
        </div>
        <h3 className="font-display text-3xl text-primary mb-4">
          ¡DATOS RECIBIDOS!
        </h3>
        <p className="text-foreground text-lg mb-2">
          Te llamamos en las próximas 24 horas para tu entrevista.
        </p>
        <p className="text-muted-foreground">
          Revisa tu teléfono y WhatsApp 📱
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-card rounded-2xl p-6 md:p-8 carnaval-border space-y-5">
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl md:text-3xl carnaval-text-gradient">
          INSCRÍBETE AHORA
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Todos los campos son obligatorios
        </p>
      </div>

      {/* Nombre completo */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Nombre completo <span className="text-accent">*</span>
        </label>
        <input
          {...register("nombreCompleto")}
          placeholder="Ej: Juan Carlos Pérez García"
          className="input-carnaval"
        />
        {errors.nombreCompleto && (
          <p className="text-accent text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.nombreCompleto.message}
          </p>
        )}
      </div>

      {/* Edad y Cédula en grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Edad <span className="text-accent">*</span>
          </label>
          <input
            type="number"
            {...register("edad", { valueAsNumber: true })}
            placeholder="18-60"
            min={18}
            max={60}
            className="input-carnaval"
          />
          {errors.edad && (
            <p className="text-accent text-sm mt-1">{errors.edad.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nº Cédula <span className="text-accent">*</span>
          </label>
          <input
            {...register("cedula")}
            placeholder="Solo números"
            inputMode="numeric"
            className="input-carnaval"
          />
          {errors.cedula && (
            <p className="text-accent text-sm mt-1">{errors.cedula.message}</p>
          )}
        </div>
      </div>

      {/* Barrio */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Barrio donde vives <span className="text-accent">*</span>
        </label>
        <input
          {...register("barrio")}
          placeholder="Ej: San José, Rebolo, El Prado..."
          className="input-carnaval"
        />
        {errors.barrio && (
          <p className="text-accent text-sm mt-1">{errors.barrio.message}</p>
        )}
      </div>

      {/* Estado civil y ocupación */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Estado civil <span className="text-accent">*</span>
          </label>
          <select {...register("estadoCivil")} className="input-carnaval">
            <option value="">Selecciona...</option>
            <option value="soltero">Soltero/a</option>
            <option value="casado">Casado/a</option>
            <option value="union_libre">Unión libre</option>
          </select>
          {errors.estadoCivil && (
            <p className="text-accent text-sm mt-1">Selecciona una opción</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            ¿Estudias o trabajas? <span className="text-accent">*</span>
          </label>
          <select {...register("ocupacion")} className="input-carnaval">
            <option value="">Selecciona...</option>
            <option value="estudio">Estudio</option>
            <option value="trabajo">Trabajo</option>
            <option value="ambos">Ambos</option>
            <option value="ninguno">Ninguno</option>
          </select>
          {errors.ocupacion && (
            <p className="text-accent text-sm mt-1">Selecciona una opción</p>
          )}
        </div>
      </div>

      {/* Fotos de cédula */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <FileUpload
          label="Foto cédula FRENTE"
          onChange={setFotoFrente}
          required
          error={photoErrors.frente}
        />
        <FileUpload
          label="Foto cédula REVERSO"
          onChange={setFotoReverso}
          required
          error={photoErrors.reverso}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-carnaval w-full animate-pulse-glow flex items-center justify-center gap-3 text-xl mt-6"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="w-6 h-6" />
            ¡QUIERO MI PUESTO EN EL CARNAVAL!
          </>
        )}
      </button>

      <p className="text-center text-muted-foreground text-xs mt-4">
        🔒 Tus datos están protegidos y solo se usan para el proceso de selección.
      </p>
    </form>
  );
};

export default CarnavalForm;
