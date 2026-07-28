import { useCallback, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, FileText, UploadCloud, X } from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 o';
  const k = 1024;
  const sizes = ['o', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function App() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const incoming = Array.from(newFiles);
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.file.name + f.file.size));
      const toAdd = incoming
        .filter((f) => !existing.has(f.name + f.size))
        .map((f) => ({ id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`, file: f }));
      return [...prev, ...toAdd];
    });
    setSubmitted(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
      }
      e.target.value = '';
    },
    [addFiles],
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (files.length === 0) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    files.forEach((item) => {
      formData.append('files', item.file, item.file.name);
    });

    try {
      const response = await fetch(
        'https://legal2digital.app.n8n.cloud/webhook-test/11c30306-9c8b-4ffe-9fb7-d953cbf61511',
        { method: 'POST', body: formData },
      );
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }
      setSubmitted(true);
      setFiles([]);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'envoi.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [files]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <img
            src="/SVG-Logo_favicon.svg"
            alt="Logo"
            className="w-16 h-16 mb-4 mx-auto"
          />
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
            Déposez vos documents
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm">
            Glissez-déposez un ou plusieurs fichiers, ou parcourez votre ordinateur.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 px-6 py-12 text-center
              ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 scale-[1.01]'
                  : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'
              }`}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <UploadCloud
              className={`mx-auto w-10 h-10 mb-3 transition-colors duration-200 ${
                isDragging ? 'text-blue-500' : 'text-slate-300'
              }`}
              strokeWidth={1.5}
            />
            <p className="text-sm font-medium text-slate-600">
              {isDragging ? 'Relâchez pour déposer' : 'Glissez vos fichiers ici'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              ou cliquez pour parcourir
            </p>
          </div>

          {files.length > 0 && (
            <ul className="mt-5 space-y-2">
              {files.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg bg-slate-50 border border-slate-100 px-3.5 py-2.5 group transition-colors hover:border-blue-200"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-slate-400">{formatBytes(item.file.size)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(item.id);
                    }}
                    className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Retirer le fichier"
                  >
                    <X className="w-4 h-4" strokeWidth={2} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {submitError && (
            <div className="mt-5 flex items-center gap-2.5 rounded-lg bg-red-50 border border-red-100 px-4 py-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" strokeWidth={2} />
              <p className="text-sm text-red-700 font-medium">
                {submitError}
              </p>
            </div>
          )}

          {submitted && (
            <div className="mt-5 flex items-center gap-2.5 rounded-lg bg-green-50 border border-green-100 px-4 py-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" strokeWidth={2} />
              <p className="text-sm text-green-700 font-medium">
                Document(s) soumis(s) avec succès.
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={files.length === 0 || isSubmitting}
            className={`w-full mt-6 py-3 rounded-xl font-medium text-sm transition-all duration-200
              ${
                files.length === 0 || isSubmitting
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.99]'
              }`}
          >
            {isSubmitting
              ? 'Envoi en cours…'
              : `Soumettre le${files.length > 1 ? 's' : ''} document${files.length > 1 ? 's' : ''}`}
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          {files.length > 0
            ? `${files.length} fichier${files.length > 1 ? 's' : ''} sélectionné${files.length > 1 ? 's' : ''}`
            : 'Aucun fichier sélectionné'}
        </p>
      </div>
    </div>
  );
}

export default App;
