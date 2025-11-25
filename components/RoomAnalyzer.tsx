import React, { useState, useRef } from 'react';
import { Upload, Camera, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { analyzeRoomImage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const RoomAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix for Gemini API if necessary, but generateContent handles mime type in inlineData usually.
        // The service expects the full base64 string or we strip it inside the service.
        // Let's strip the prefix here to be safe: data:image/jpeg;base64,
        const base64Data = base64String.split(',')[1];
        setImage(base64String); // For preview
        handleAnalyze(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (base64Data: string) => {
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeRoomImage(base64Data);
      setAnalysis(result);
    } catch (error) {
      setAnalysis("Error al analizar la imagen. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Asesoramiento por IA</h2>
          <p className="text-lg text-gray-600 mb-8">
            Suba una foto de su ambiente y nuestra Inteligencia Artificial analizará las dimensiones y características térmicas para recomendarle el equipo ideal.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-sures-primary/10 rounded-lg text-sures-primary mt-1">
                <Camera size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Análisis Visual</h4>
                <p className="text-sm text-gray-500">Detectamos ventanas, exposición solar y tamaño aparente.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
               <div className="p-2 bg-sures-primary/10 rounded-lg text-sures-primary mt-1">
                <CheckCircle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Recomendación Precisa</h4>
                <p className="text-sm text-gray-500">Sugerimos las frigorías exactas y el modelo compatible.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
           {!image ? (
             <div 
               className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer"
               onClick={() => fileInputRef.current?.click()}
             >
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*"
                 onChange={handleFileChange}
               />
               <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
               <p className="text-gray-900 font-medium">Haga clic para subir una foto</p>
               <p className="text-xs text-gray-500 mt-2">JPG, PNG (Max 5MB)</p>
             </div>
           ) : (
             <div className="space-y-6">
               <div className="relative rounded-xl overflow-hidden h-64 bg-gray-100">
                 <img src={image} alt="Room Preview" className="w-full h-full object-cover" />
                 {loading && (
                   <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                     <Loader2 className="animate-spin h-10 w-10 mb-2" />
                     <span className="font-medium">Analizando ambiente...</span>
                   </div>
                 )}
               </div>

               {analysis && (
                 <div className="bg-sures-light p-6 rounded-xl border border-sures-primary/10 animate-fade-in">
                   <h4 className="font-bold text-sures-primary mb-2 flex items-center gap-2">
                     <AlertCircle size={18} />
                     Resultado del Análisis
                   </h4>
                   <div className="prose prose-sm text-gray-700">
                     <ReactMarkdown className="markdown-body">
                        {analysis}
                     </ReactMarkdown>
                   </div>
                 </div>
               )}
               
               <button 
                 onClick={() => { setImage(null); setAnalysis(null); }}
                 className="w-full py-2 text-sm text-gray-500 hover:text-gray-900"
               >
                 Analizar otra foto
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default RoomAnalyzer;