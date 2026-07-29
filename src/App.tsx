import { useState } from 'react';
import { Cloud } from 'lucide-react';
import { PreviewModal } from './components/PreviewModal';

interface ExtractedData {
  denomination?: string;
  forme_juridique?: string;
  capital_montant?: string;
  siege_adresse?: string;
  siege_codepostal?: string;
  siege_commune?: string;
  objet_social?: string;
  dirigeant_nom?: string;
  dirigeant_prenom?: string;
  durée_années?: string;
  activite?: string;
}

const N8N_WEBHOOK_URL = 'https://legal2digital.app.n8n.cloud/webhook-test/11c30306-9c8b-4ffe-9fb7-d953cbf61511';

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      console.log('Envoi du fichier à N8N:', selectedFile.name);
      
      // Envoie le PDF à N8N
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        setError(`❌ Erreur N8N: ${response.status}`);
        setIsLoading(false);
        return;
      }

      // N8N retourne un ID
      const result = await response.json();
      const id = result.id;
      
      console.log('ID reçu de N8N:', id);
      
      // Attends 3 secondes pour que N8N finisse de traiter
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Récupère les données depuis la Vercel Function
      const dataResponse = await fetch(`/api/save-preview?id=${id}`);
      
      if (!dataResponse.ok) {
        setError('❌ Erreur lors de la récupération des données');
        setIsLoading(false);
        return;
      }
      
      const data = await dataResponse.json();
      
      console.log('Données reçues:', data);
      
      // Affiche le modal avec les données
      setExtractedData(data);
      setShowPreview(true);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Erreur:', error);
      setError(`❌ Erreur: ${error}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      
      {/* Logo */}
      <div className="mb-8">
        <img 
          src="/SVG-Logo_favicon.svg" 
          alt="Formaliste Logo" 
          className="w-16 h-16"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-2xl w-full">
        
        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-slate-900 mb-2">
          Déposez vos documents
        </h1>
        
        {/* Subtitle */}
        <p className="text-center text-slate-600 mb-12">
          Glissez-déposez un ou plusieurs fichiers, ou parcourez votre ordinateur.
        </p>

        {/* Upload Card */}
        <div className="bg-white border-2 border-slate-200 rounded-lg p-12 mb-6">
          
          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center mb-6 transition ${
              isDragging
                ? 'border-slate-400 bg-slate-50'
                : 'border-slate-300 bg-slate-50'
            }`}
          >
            <Cloud size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-700 font-semibold">Glissez vos fichiers ici</p>
            <p className="text-slate-500 text-sm mt-2">ou cliquez pour parcourir</p>
            
            <input
              type="file"
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
              accept=".pdf,.doc,.docx,.txt"
            />
          </div>

          {/* File Input Label */}
          <label
            htmlFor="file-input"
            className="block w-full cursor-pointer mb-6"
          >
            <div className="text-center p-4 rounded border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition">
              <Cloud size={20} className="mx-auto text-slate-400 mb-2" />
              <p className="text-slate-600 text-sm font-medium">Cliquez pour sélectionner des fichiers</p>
            </div>
          </label>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="bg-green-50 border border-green-200 rounded p-3 mb-6">
              <p className="text-green-900 font-semibold">✅ Fichier sélectionné:</p>
              <p className="text-green-800 text-sm">{selectedFile.name}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-6">
              <p className="text-red-900 font-semibold">{error}</p>
            </div>
          )}

          {/* Submit Button - BLEU */}
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || isLoading}
            className={`w-full font-semibold py-3 px-6 rounded transition ${
              !selectedFile || isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? 'Traitement en cours...' : 'Soumettre le document'}
          </button>
        </div>

        {/* File Status */}
        <p className="text-center text-slate-400 text-sm">
          {selectedFile ? `1 - ${selectedFile.name}` : 'Aucun fichier sélectionné'}
        </p>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-900 font-semibold">Traitement en cours...</p>
            <p className="text-slate-600 text-sm mt-2">L'IA analyse votre document...</p>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
          setSelectedFile(null);
          setError(null);
        }}
        data={extractedData}
      />
    </div>
  );
}