import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import FileUpload from "./FileUpload";
import { toast } from "sonner";
import { useRegistroPaso1 } from "@/hooks/useRegistroPaso1";

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
  const navigate = useNavigate();
  const { crear: crearRegistro, loading: cargandoSupabase } = useRegistroPaso1();
  const [fotoFrente, setFotoFrente] = useState<File | null>(null);
  const [fotoReverso, setFotoReverso] = useState<File | null>(null);
  const [photoErrors, setPhotoErrors] = useState({ frente: "", reverso: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
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

    // Enviar datos a Supabase
    const resultado = await crearRegistro({
      nombre_completo: data.nombreCompleto,
      edad: data.edad,
      cedula: data.cedula,
      barrio: data.barrio,
      estado_civil: data.estadoCivil,
      ocupacion: data.ocupacion,
      foto_cedula_frente: fotoFrente || undefined,
      foto_cedula_reverso: fotoReverso || undefined,
    });

    if (resultado.success) {
      // Navegar al paso 2
      navigate("/registro-documentos");
    }
  };

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
        disabled={cargandoSupabase}
        className="btn-carnaval w-full animate-pulse-glow flex items-center justify-center gap-3 text-xl mt-6"
      >
        {cargandoSupabase ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            CONTINUAR AL PASO 2
            <ArrowRight className="w-6 h-6" />
          </>
        )}
      </button>
      
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="w-3 h-3 rounded-full bg-primary"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <span className="text-muted-foreground text-xs ml-2">Paso 1 de 2</span>
      </div>

      <p className="text-center text-muted-foreground text-xs mt-4">
        🔒 Tus datos están protegidos y solo se usan para el proceso de selección.
      </p>
    </form>
  );
};

export default CarnavalForm;
