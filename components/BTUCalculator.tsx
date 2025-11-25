import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  ChevronRight, 
  ChevronLeft, 
  Ruler, 
  Compass, 
  Sun, 
  Users, 
  Monitor, 
  Home, 
  Zap,
  Snowflake,
  CheckCircle,
  Loader2,
  MessageCircle,
  RotateCcw,
  Sparkles,
  ThermometerSun,
  Wind
} from 'lucide-react';
import { PRODUCTS, COMPANY_INFO } from '../constants';
import { Product } from '../types';
import { getAIRecommendation } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

// Types
interface CalculatorData {
  squareMeters: number;
  ceilingHeight: number;
  orientation: 'norte' | 'sur' | 'este' | 'oeste' | '';
  windowCount: number;
  windowType: 'simple' | 'dvh' | '';
  sunExposure: 'alta' | 'media' | 'baja' | '';
  peopleCount: number;
  electronics: 'ninguno' | 'pocos' | 'muchos' | '';
  roofType: 'losa' | 'chapa' | 'aislado' | '';
  roomType: 'dormitorio' | 'living' | 'oficina' | 'comercial' | '';
}

const initialData: CalculatorData = {
  squareMeters: 20,
  ceilingHeight: 2.6,
  orientation: '',
  windowCount: 1,
  windowType: '',
  sunExposure: '',
  peopleCount: 2,
  electronics: '',
  roofType: '',
  roomType: ''
};

// Calculation constants
const BASE_BTU_PER_M2 = 600; // BTU base por m²

const BTUCalculator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<CalculatorData>(initialData);
  const [showResults, setShowResults] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);

  // Steps configuration
  const steps = [
    { id: 'dimensions', title: 'Dimensiones', icon: Ruler },
    { id: 'orientation', title: 'Orientación', icon: Compass },
    { id: 'windows', title: 'Ventanas', icon: Sun },
    { id: 'occupancy', title: 'Ocupación', icon: Users },
    { id: 'environment', title: 'Ambiente', icon: Home },
  ];

  // Calculate BTU/Frigorías
  const calculatedBTU = useMemo(() => {
    // Base calculation: m² × altura × factor base
    let btu = data.squareMeters * (data.ceilingHeight / 2.6) * BASE_BTU_PER_M2;

    // Orientation adjustment
    const orientationFactors: Record<string, number> = {
      norte: 1.15,
      oeste: 1.20,
      este: 1.05,
      sur: 0.95,
      '': 1
    };
    btu *= orientationFactors[data.orientation];

    // Window adjustment
    const windowBaseBTU = data.windowType === 'simple' ? 800 : 400;
    btu += data.windowCount * windowBaseBTU;

    // Sun exposure
    const sunFactors: Record<string, number> = {
      alta: 1.15,
      media: 1.05,
      baja: 1,
      '': 1
    };
    btu *= sunFactors[data.sunExposure];

    // People (after 2 people, add 400 BTU each)
    if (data.peopleCount > 2) {
      btu += (data.peopleCount - 2) * 400;
    }

    // Electronics
    const electronicsBTU: Record<string, number> = {
      ninguno: 0,
      pocos: 600,
      muchos: 1500,
      '': 0
    };
    btu += electronicsBTU[data.electronics];

    // Roof type
    const roofFactors: Record<string, number> = {
      chapa: 1.20,
      losa: 1.05,
      aislado: 0.95,
      '': 1
    };
    btu *= roofFactors[data.roofType];

    // Room type adjustment
    const roomFactors: Record<string, number> = {
      dormitorio: 0.95,
      living: 1.05,
      oficina: 1.10,
      comercial: 1.20,
      '': 1
    };
    btu *= roomFactors[data.roomType];

    return Math.round(btu);
  }, [data]);

  // Convert BTU to Frigorías (1 frigoría = 3.97 BTU)
  const calculatedFrigorias = useMemo(() => {
    return Math.round(calculatedBTU / 3.97);
  }, [calculatedBTU]);

  // Find matching products
  const recommendedProducts = useMemo(() => {
    const targetFrigorias = calculatedFrigorias;
    const tolerance = 0.3; // 30% tolerance

    return PRODUCTS
      .filter(p => p.frigorias > 0)
      .filter(p => {
        const minFrig = targetFrigorias * (1 - tolerance);
        const maxFrig = targetFrigorias * (1 + tolerance);
        return p.frigorias >= minFrig && p.frigorias <= maxFrig;
      })
      .sort((a, b) => {
        // Prioritize inverter products
        const aInverter = a.features.some(f => f.toLowerCase().includes('inverter')) ? 1 : 0;
        const bInverter = b.features.some(f => f.toLowerCase().includes('inverter')) ? 1 : 0;
        if (bInverter !== aInverter) return bInverter - aInverter;
        
        // Then sort by closest match
        return Math.abs(a.frigorias - targetFrigorias) - Math.abs(b.frigorias - targetFrigorias);
      })
      .slice(0, 4);
  }, [calculatedFrigorias]);

  // Get AI recommendation
  const fetchAIRecommendation = async () => {
    setLoadingAI(true);
    try {
      const recommendation = await getAIRecommendation({
        squareMeters: data.squareMeters,
        ceilingHeight: data.ceilingHeight,
        orientation: data.orientation,
        windowCount: data.windowCount,
        windowType: data.windowType,
        sunExposure: data.sunExposure,
        peopleCount: data.peopleCount,
        electronics: data.electronics,
        roofType: data.roofType,
        roomType: data.roomType,
        calculatedFrigorias,
        recommendedProducts: recommendedProducts.map(p => p.name)
      });
      setAiRecommendation(recommendation);
    } catch (error) {
      console.error('AI Error:', error);
      setAiRecommendation('');
    } finally {
      setLoadingAI(false);
    }
  };

  // Handle step completion
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
      fetchAIRecommendation();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setData(initialData);
    setCurrentStep(0);
    setShowResults(false);
    setAiRecommendation('');
  };

  // Check if current step is complete
  const isStepComplete = () => {
    switch (currentStep) {
      case 0: return data.squareMeters > 0 && data.ceilingHeight > 0;
      case 1: return data.orientation !== '';
      case 2: return data.windowType !== '' && data.sunExposure !== '';
      case 3: return data.peopleCount > 0 && data.electronics !== '';
      case 4: return data.roofType !== '' && data.roomType !== '';
      default: return false;
    }
  };

  // WhatsApp link generator
  const getWhatsAppLink = (products?: Product[]) => {
    const productList = products?.map(p => `• ${p.name}`).join('\n') || '';
    const message = `Hola Sures! Usé la calculadora de frigorías y necesito aproximadamente *${calculatedFrigorias} frigorías* para mi ambiente de ${data.squareMeters}m².

Me interesan estos equipos:
${productList}

¿Podrían asesorarme sobre disponibilidad y precio?`;
    
    return `https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8 animate-fade-in">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Metros cuadrados del ambiente
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="10"
                  max="150"
                  value={data.squareMeters}
                  onChange={(e) => setData({ ...data, squareMeters: Number(e.target.value) })}
                  className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-sures-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>10 m²</span>
                  <span className="text-2xl font-bold text-sures-primary">{data.squareMeters} m²</span>
                  <span>150 m²</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Altura del techo
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[2.4, 2.6, 3.0].map((height) => (
                  <button
                    key={height}
                    onClick={() => setData({ ...data, ceilingHeight: height })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.ceilingHeight === height
                        ? 'border-sures-primary bg-sures-primary/10 text-sures-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl font-bold">{height}m</span>
                    <span className="block text-xs text-gray-500 mt-1">
                      {height <= 2.4 ? 'Bajo' : height <= 2.6 ? 'Estándar' : 'Alto'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-gray-600 text-sm mb-4">
              ¿Hacia dónde mira la ventana principal del ambiente?
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'norte', label: 'Norte', desc: 'Sol fuerte todo el día', icon: '☀️' },
                { id: 'sur', label: 'Sur', desc: 'Menos exposición solar', icon: '🌤️' },
                { id: 'este', label: 'Este', desc: 'Sol por la mañana', icon: '🌅' },
                { id: 'oeste', label: 'Oeste', desc: 'Sol por la tarde', icon: '🌇' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setData({ ...data, orientation: option.id as any })}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${
                    data.orientation === option.id
                      ? 'border-sures-primary bg-sures-primary/10 shadow-lg shadow-sures-primary/20'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-3xl mb-2 block">{option.icon}</span>
                  <span className="font-bold text-gray-900 block">{option.label}</span>
                  <span className="text-xs text-gray-500">{option.desc}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8 animate-fade-in">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Cantidad de ventanas
              </label>
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setData({ ...data, windowCount: Math.max(0, data.windowCount - 1) })}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600"
                >
                  -
                </button>
                <span className="text-4xl font-bold text-sures-primary w-16 text-center">{data.windowCount}</span>
                <button
                  onClick={() => setData({ ...data, windowCount: Math.min(10, data.windowCount + 1) })}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Tipo de vidrio
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setData({ ...data, windowType: 'simple' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    data.windowType === 'simple'
                      ? 'border-sures-primary bg-sures-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-bold block">Vidrio Simple</span>
                  <span className="text-xs text-gray-500">Común, una capa</span>
                </button>
                <button
                  onClick={() => setData({ ...data, windowType: 'dvh' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    data.windowType === 'dvh'
                      ? 'border-sures-primary bg-sures-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-bold block">DVH</span>
                  <span className="text-xs text-gray-500">Doble vidriado hermético</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Exposición solar directa
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'baja', label: 'Baja', icon: '🌥️' },
                  { id: 'media', label: 'Media', icon: '⛅' },
                  { id: 'alta', label: 'Alta', icon: '☀️' },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setData({ ...data, sunExposure: option.id as any })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.sunExposure === option.id
                        ? 'border-sures-primary bg-sures-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{option.icon}</span>
                    <span className="font-medium text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8 animate-fade-in">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Cantidad de personas habitual
              </label>
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setData({ ...data, peopleCount: Math.max(1, data.peopleCount - 1) })}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600"
                >
                  -
                </button>
                <div className="text-center">
                  <span className="text-4xl font-bold text-sures-primary">{data.peopleCount}</span>
                  <span className="block text-xs text-gray-500 mt-1">personas</span>
                </div>
                <button
                  onClick={() => setData({ ...data, peopleCount: Math.min(20, data.peopleCount + 1) })}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Equipos electrónicos (PC, TV, etc.)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'ninguno', label: 'Ninguno', desc: 'Sin equipos', icon: '📱' },
                  { id: 'pocos', label: 'Pocos', desc: '1-2 equipos', icon: '💻' },
                  { id: 'muchos', label: 'Muchos', desc: '3+ equipos', icon: '🖥️' },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setData({ ...data, electronics: option.id as any })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.electronics === option.id
                        ? 'border-sures-primary bg-sures-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{option.icon}</span>
                    <span className="font-bold text-sm block">{option.label}</span>
                    <span className="text-[10px] text-gray-500">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8 animate-fade-in">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Tipo de techo
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'losa', label: 'Losa', desc: 'Hormigón', icon: '🏢' },
                  { id: 'chapa', label: 'Chapa', desc: 'Metálico', icon: '🏭' },
                  { id: 'aislado', label: 'Aislado', desc: 'Con aislación', icon: '🏠' },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setData({ ...data, roofType: option.id as any })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.roofType === option.id
                        ? 'border-sures-primary bg-sures-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{option.icon}</span>
                    <span className="font-bold text-sm block">{option.label}</span>
                    <span className="text-[10px] text-gray-500">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Tipo de ambiente
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'dormitorio', label: 'Dormitorio', icon: '🛏️' },
                  { id: 'living', label: 'Living/Comedor', icon: '🛋️' },
                  { id: 'oficina', label: 'Oficina', icon: '💼' },
                  { id: 'comercial', label: 'Local Comercial', icon: '🏪' },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setData({ ...data, roomType: option.id as any })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.roomType === option.id
                        ? 'border-sures-primary bg-sures-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mr-2">{option.icon}</span>
                    <span className="font-bold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Results view
  if (showResults) {
    return (
      <section className="py-20 bg-gradient-to-br from-sures-dark via-gray-900 to-black min-h-screen relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sures-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Result Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <CheckCircle size={18} />
              Cálculo completado
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tu ambiente necesita
            </h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
                <Snowflake className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <div className="text-5xl md:text-6xl font-black text-white mb-2">
                  {calculatedFrigorias.toLocaleString()}
                </div>
                <div className="text-gray-400 font-medium">Frigorías</div>
              </div>
              
              <div className="text-gray-500 text-2xl">=</div>
              
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
                <ThermometerSun className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <div className="text-5xl md:text-6xl font-black text-white mb-2">
                  {calculatedBTU.toLocaleString()}
                </div>
                <div className="text-gray-400 font-medium">BTU/h</div>
              </div>
            </div>

            {/* Summary badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <span className="bg-white/10 px-4 py-2 rounded-full text-sm text-gray-300">
                📐 {data.squareMeters} m²
              </span>
              <span className="bg-white/10 px-4 py-2 rounded-full text-sm text-gray-300">
                🧭 {data.orientation.charAt(0).toUpperCase() + data.orientation.slice(1)}
              </span>
              <span className="bg-white/10 px-4 py-2 rounded-full text-sm text-gray-300">
                👥 {data.peopleCount} personas
              </span>
              <span className="bg-white/10 px-4 py-2 rounded-full text-sm text-gray-300">
                🏠 {data.roomType.charAt(0).toUpperCase() + data.roomType.slice(1)}
              </span>
            </div>
          </div>

          {/* AI Recommendation */}
          {(loadingAI || aiRecommendation) && (
            <div className="mb-12 animate-slide-up">
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Recomendación del Experto IA</h3>
                </div>
                
                {loadingAI ? (
                  <div className="flex items-center gap-3 text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analizando tu ambiente...</span>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown className="text-gray-300 leading-relaxed">
                      {aiRecommendation}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommended Products */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Wind className="text-sures-primary" />
              Equipos Recomendados
            </h3>
            
            {recommendedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProducts.map((product, index) => {
                  const isInverter = product.features.some(f => f.toLowerCase().includes('inverter'));
                  return (
                    <div 
                      key={product.id}
                      className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-sures-primary/50 transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative aspect-square bg-white/5 p-4">
                        {isInverter && (
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <Zap size={10} className="fill-current" />
                            INVERTER
                          </div>
                        )}
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-bold text-white text-sm mb-2 line-clamp-2">
                          {product.name}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Snowflake size={12} className="text-blue-400" />
                            {product.frigorias} fg
                          </span>
                          <span className="bg-white/10 px-2 py-1 rounded">
                            {product.type}
                          </span>
                        </div>
                        
                        <a
                          href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(`Hola! Vi el ${product.name} en la calculadora de frigorías. ¿Podrían darme más información?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
                        >
                          <MessageCircle size={16} />
                          Consultar
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <p className="text-gray-400 mb-4">
                  No encontramos equipos exactos para esa capacidad en nuestro catálogo estándar.
                </p>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-sures-primary hover:bg-sures-dark text-white px-6 py-3 rounded-xl font-bold transition-colors"
                >
                  <MessageCircle size={18} />
                  Solicitar asesoramiento personalizado
                </a>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw size={18} />
              Calcular otro ambiente
            </button>
            
            <a
              href={getWhatsAppLink(recommendedProducts)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3 bg-[#25D366] hover:bg-[#128C7E] rounded-xl text-white font-bold transition-colors shadow-lg shadow-green-500/25"
            >
              <MessageCircle size={18} />
              Consultar por estos equipos
            </a>
          </div>
        </div>
      </section>
    );
  }

  // Wizard view
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-sures-primary/10 text-sures-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Calculator size={18} />
            Calculadora Inteligente
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Cuántas Frigorías Necesitás?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Respondé 5 preguntas simples y te decimos exactamente qué equipo necesitás para tu ambiente.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
              <div 
                className="h-full bg-sures-primary transition-all duration-500"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
            
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isComplete = index < currentStep;
              
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isComplete 
                        ? 'bg-sures-primary text-white' 
                        : isActive 
                          ? 'bg-sures-primary text-white ring-4 ring-sures-primary/20' 
                          : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle size={20} />
                    ) : (
                      <StepIcon size={18} />
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium hidden sm:block ${
                    isActive || isComplete ? 'text-sures-primary' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Step Header */}
          <div className="bg-gray-50 px-8 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {React.createElement(steps[currentStep].icon, { 
                size: 24, 
                className: 'text-sures-primary' 
              })}
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Paso {currentStep + 1} de {steps.length}
                </span>
                <h3 className="text-xl font-bold text-gray-900">
                  {steps[currentStep].title}
                </h3>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-8">
            {renderStepContent()}
          </div>

          {/* Live Preview */}
          <div className="bg-sures-dark px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Snowflake className="text-blue-400" size={20} />
              <span className="text-gray-400 text-sm">Estimación actual:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">
                {calculatedFrigorias.toLocaleString()}
              </span>
              <span className="text-gray-400 text-sm">frigorías</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="px-8 py-6 border-t border-gray-100 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                currentStep === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={18} />
              Anterior
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepComplete()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                isStepComplete()
                  ? 'bg-sures-primary text-white hover:bg-sures-dark shadow-lg shadow-sures-primary/25'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Ver Resultado
                  <Sparkles size={18} />
                </>
              ) : (
                <>
                  Siguiente
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BTUCalculator;

