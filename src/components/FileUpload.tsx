import { useState, useRef } from "react";
import { Camera, Check, X, Upload } from "lucide-react";

interface FileUploadProps {
  label: string;
  onChange: (file: File | null) => void;
  accept?: string;
  required?: boolean;
  error?: string;
}

const FileUpload = ({ label, onChange, accept = "image/*", required = false, error }: FileUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setFileName("");
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      
      <div
        onClick={handleClick}
        className={`file-upload-zone ${preview ? 'has-file' : ''} ${error ? 'border-accent' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-32 mx-auto rounded-lg object-cover"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4 text-accent-foreground" />
            </button>
            <div className="mt-2 flex items-center justify-center gap-2 text-carnaval-green">
              <Check className="w-4 h-4" />
              <span className="text-sm truncate max-w-[200px]">{fileName}</span>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <p className="text-foreground font-medium">Toca para subir foto</p>
            <p className="text-muted-foreground text-sm mt-1">JPG, PNG (máx. 5MB)</p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-accent text-sm">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
