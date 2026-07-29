import React from 'react';
import { X } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
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
  } | null;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  data 
}) => {
  if (!isOpen || !data) return null;

  const isFieldFilled = (value: any) => value && value !== '—' && value !== null && value !== undefined;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-600 text-white p-6 flex justify-between items-center sticky top-0">
          <div>
            <h2 className="text-2xl font-bold">Prévisualisation Guichet Unique</h2>
            <p className="text-cyan-100 text-sm mt-1">Les champs suivants seront pré-remplis</p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white hover:bg-opacity-20 p-2 rounded transition"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          
          {/* Section 1: Identification */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b-2 border-cyan-500 flex items-center gap-2">
              📋 Identification de l'entreprise
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Dénomination sociale
                </label>
                <div className={`rounded p-3 font-medium transition ${
                  isFieldFilled(data.denomination)
                    ? 'bg-green-50 border-2 border-green-300 text-green-900'
                    : 'bg-gray-50 border border-gray-200 text-gray-500'
                }`}>
                  {data.denomination || '—'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Forme juridique
                </label>
                <div className={`rounded p-3 font-medium transition ${
                  isFieldFilled(data.forme_juridique)
                    ? 'bg-green-50 border-2 border-green-300 text-green-900'
                    : 'bg-gray-50 border border-gray-200 text-gray-500'
                }`}>
                  {data.forme_juridique || '—'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Capital social
                </label>
                <div className={`rounded p-3 font-medium transition ${
                  isFieldFilled(data.capital_montant)
                    ? 'bg-green-50 border-2 border-green-300 text-green-900'
                    : 'bg-gray-50 border border-gray-200 text-gray-500'
                }`}>
                  {data.capital_montant || '—'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Durée de la société
                </label>
                <div className={`rounded p-3 font-medium transition ${
                  isFieldFilled(data.durée_années)
                    ? 'bg-green-50 border-2 border-green-300 text-green-900'
                    : 'bg-gray-50 border border-gray-200 text-gray-500'
                }`}>
                  {data.durée_années ? `${data.durée_années} ans` : '—'}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Objet social
                </label>
                <div className={`rounded p-3 font-medium transition min-h-20 ${
                  isFieldFilled(data.objet_social)
                    ? 'bg-green-50 border-2 border-green-300 text-green-900'
                    : 'bg-gray-50 border border-gray-200 text-gray-500'
                }`}>
                  {data.objet_social || '—'}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Activité principale
                </label>
                <div className={`rounded p-3 font-medium transition min-h-16 ${
                  isFieldFilled(data.activite)
                    ? 'bg-green-50 border-2 border-green-300 text-green-900'
                    : 'bg-gray-50 border border-gray-200 text-gray-500'
                }`}>
                  {data.activite || '—'}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Siège Social */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b-2 border-cyan-500 flex items-center gap-2">
              🏢 Siège social
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Adresse
                </label>
                <div className={`rounded p-3 font-medium transition ${
                  isFieldFilled(data.siege_adresse)
                    ? 'bg-green-50 border-2 border-green-300 text-green-900'
                    : 'bg-gray-50 border border-gray-200 text-gray-500'
                }`}>
                  {data.siege_adresse || '—'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Code postal
                </label>
                <div className={`rounded p-3 font-medium transition ${
                  isFieldFilled(data.siege_codepostal)
                    ? 'bg-green-50 border-2 border-green-300 text-green-900'
                    : 'bg-gray-50 border border-gray-200 text-gray-500'
                }`}>
                  {data.siege_codepostal || '—'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Commune
                </label>
                <div className={`rounded p-3 font-medium transition ${
                  isFieldFilled(data.siege_commune)
                    ? 'bg-green-50 border-2 border-green-300 text-green-900'
                    : 'bg-gray-50 border border-gray-200 text-gray-500'
                }`}>
                  {data.siege_commune || '—'}
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Dirigeant */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b-2 border-cyan-500 flex items-center gap-2">
              👤 Dirigeant
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nom
                </label>
                <div className={`rounded p-3 font-medium transition ${
                  isFieldFilled(data.dirigeant_nom)
                    ? 'bg-green-50 border-2 border-green-300 text-green-900'
                    : 'bg-gray-50 border border-gray-200 text-gray-500'
                }`}>
                  {data.dirigeant_nom || '—'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Prénom
                </label>
                <div className={`rounded p-3 font-medium transition ${
                  isFieldFilled(data.dirigeant_prenom)
                    ? 'bg-green-50 border-2 border-green-300 text-green-900'
                    : 'bg-gray-50 border border-gray-200 text-gray-500'
                }`}>
                  {data.dirigeant_prenom || '—'}
                </div>
              </div>
            </div>
          </section>

          {/* Info Banner */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-4">
            <p className="text-sm text-blue-900">
              <strong>✅ Champs pré-remplis :</strong> Les informations en <span className="text-green-700">vert</span> seront automatiquement remplies sur le Guichet Unique lors de votre dépôt.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold py-3 rounded transition"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onClose();
                // Ici tu peux ajouter une action (ex: redirection Guichet Unique)
              }}
              className="flex-1 bg-gradient-to-r from-slate-900 to-cyan-600 hover:from-slate-800 hover:to-cyan-700 text-white font-bold py-3 rounded transition"
            >
              Continuer vers Guichet Unique
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};