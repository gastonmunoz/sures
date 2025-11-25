import React, { useState, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Home, 
  Building2, 
  Zap, 
  DollarSign,
  Wifi,
  WifiOff,
  Wrench,
  PackagePlus,
  RotateCcw,
  MessageCircle,
  Snowflake,
  Trophy,
  Target,
  CheckCircle2,
  Loader2,
  Calculator,
  Ruler,
  Compass,
  Sun,
  Users,
  Monitor,
  CheckCircle,
  ThermometerSun,
  Wind,
  Camera,
  Upload,
  ArrowLeft,
  Zap as ZapIcon,
  Image
} from 'lucide-react';
import { PRODUCTS, COMPANY_INFO } from '../constants';
import { Product } from '../types';
import { getQuizRecommendation, getAIRecommendation, analyzeRoomImage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

// ==================== TYPES ====================
type AdvisorMode = 'selector' | 'quiz' | 'calculator' | 'photo';

interface QuizState {
  usage: 'residencial' | 'comercial' | '';
  squareMeters: 'pequeño' | 'mediano' | 'grande' | 'muy-grande' | '';
  priority: 'ahorro' | 'precio' | '';
  installation: 'existente' | 'nueva' | '';
  wifi: 'si' | 'no' | '';
}

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

// ==================== INITIAL STATES ====================
const initialQuizState: QuizState = {
  usage: '',
  squareMeters: '',
  priority: '',
  installation: '',
  wifi: ''
};

const initialCalculatorData: CalculatorData = {
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

const BASE_BTU_PER_M2 = 600;

// ==================== QUIZ QUESTIONS ====================
const quizQuestions = [
  {
    id: 'usage',
    question: '¿Dónde vas a instalar el equipo?',
    subtitle: 'Elegí el tipo de ambiente principal',
    answers: [
      { id: 'residencial', label: 'Casa / Departamento', description: 'Dormitorio, living, comedor', icon: <Home className="w-8 h-8" />, value: 'residencial' },
      { id: 'comercial', label: 'Oficina / Local', description: 'Trabajo, comercio, consultorio', icon: <Building2 className="w-8 h-8" />, value: 'comercial' }
    ]
  },
  {
    id: 'squareMeters',
    question: '¿Qué tamaño tiene el ambiente?',
    subtitle: 'Aproximadamente, no hace falta ser exacto',
    answers: [
      { id: 'pequeño', label: 'Pequeño', description: 'Hasta 20 m²', icon: <span className="text-3xl">🏠</span>, value: 'pequeño' },
      { id: 'mediano', label: 'Mediano', description: '20 - 35 m²', icon: <span className="text-3xl">🏡</span>, value: 'mediano' },
      { id: 'grande', label: 'Grande', description: '35 - 60 m²', icon: <span className="text-3xl">🏢</span>, value: 'grande' },
      { id: 'muy-grande', label: 'Muy Grande', description: 'Más de 60 m²', icon: <span className="text-3xl">🏬</span>, value: 'muy-grande' }
    ]
  },
  {
    id: 'priority',
    question: '¿Qué priorizás más?',
    subtitle: 'No hay respuesta incorrecta, es según tu situación',
    answers: [
      { id: 'ahorro', label: 'Ahorro a largo plazo', description: 'Invertir más hoy, pagar menos de luz', icon: <Zap className="w-8 h-8 text-emerald-500" />, value: 'ahorro' },
      { id: 'precio', label: 'Menor inversión inicial', description: 'Presupuesto ajustado ahora', icon: <DollarSign className="w-8 h-8 text-amber-500" />, value: 'precio' }
    ]
  },
  {
    id: 'installation',
    question: '¿Tenés instalación previa?',
    subtitle: 'Esto afecta el tipo de equipo recomendado',
    answers: [
      { id: 'existente', label: 'Sí, ya tengo instalación', description: 'Reemplazo de equipo existente', icon: <Wrench className="w-8 h-8 text-blue-500" />, value: 'existente' },
      { id: 'nueva', label: 'No, es instalación nueva', description: 'Primera vez que instalo aire', icon: <PackagePlus className="w-8 h-8 text-purple-500" />, value: 'nueva' }
    ]
  },
  {
    id: 'wifi',
    question: '¿Querés controlarlo desde el celular?',
    subtitle: 'WiFi integrado para control remoto',
    answers: [
      { id: 'si', label: '¡Sí, obvio!', description: 'Control desde cualquier lugar', icon: <Wifi className="w-8 h-8 text-cyan-500" />, value: 'si' },
      { id: 'no', label: 'No es necesario', description: 'Control remoto clásico está bien', icon: <WifiOff className="w-8 h-8 text-gray-400" />, value: 'no' }
    ]
  }
];

// ==================== CALCULATOR STEPS ====================
const calculatorSteps = [
  { id: 'dimensions', title: 'Dimensiones', icon: Ruler },
  { id: 'orientation', title: 'Orientación', icon: Compass },
  { id: 'windows', title: 'Ventanas', icon: Sun },
  { id: 'occupancy', title: 'Ocupación', icon: Users },
  { id: 'environment', title: 'Ambiente', icon: Home },
];

// ==================== MAIN COMPONENT ====================
const SmartAdvisor: React.FC = () => {
  const [mode, setMode] = useState<AdvisorMode>('selector');
  
  // Quiz state
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizState>(initialQuizState);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<string | null>(null);
  const [showQuizResults, setShowQuizResults] = useState(false);
  
  // Calculator state
  const [calcStep, setCalcStep] = useState(0);
  const [calcData, setCalcData] = useState<CalculatorData>(initialCalculatorData);
  const [showCalcResults, setShowCalcResults] = useState(false);
  
  // Photo state
  const [photoImage, setPhotoImage] = useState<string | null>(null);
  const [photoAnalysis, setPhotoAnalysis] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Shared state
  const [aiRecommendation, setAiRecommendation] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);

  // ==================== QUIZ LOGIC ====================
  const getFrigoriasRange = (size: string): [number, number] => {
    switch (size) {
      case 'pequeño': return [2000, 3500];
      case 'mediano': return [3000, 5000];
      case 'grande': return [4500, 9000];
      case 'muy-grande': return [8000, 30000];
      default: return [2000, 30000];
    }
  };

  const quizRecommendedProducts = useMemo(() => {
    if (!showQuizResults) return [];
    const [minFrig, maxFrig] = getFrigoriasRange(quizAnswers.squareMeters);
    
    let filtered = PRODUCTS.filter(p => {
      if (quizAnswers.usage === 'residencial' && p.category !== 'residential') return false;
      if (quizAnswers.usage === 'comercial' && p.category !== 'commercial') return false;
      if (p.frigorias < minFrig || p.frigorias > maxFrig) return false;
      return true;
    });

    const scored = filtered.map(product => {
      let score = 0;
      const isInverter = product.features.some(f => f.toLowerCase().includes('inverter')) || product.name.toLowerCase().includes('inverter');
      const hasWifi = product.features.some(f => f.toLowerCase().includes('wi-fi') || f.toLowerCase().includes('wifi'));
      const isR32 = product.refrigerant === 'R-32';

      if (quizAnswers.priority === 'ahorro') {
        if (isInverter) score += 50;
        if (isR32) score += 20;
      } else {
        if (!isInverter) score += 30;
      }
      if (quizAnswers.wifi === 'si' && hasWifi) score += 40;
      if (quizAnswers.wifi === 'no' && !hasWifi) score += 10;
      if (quizAnswers.installation === 'nueva' && product.type === 'Split') score += 20;
      if (isR32) score += 10;

      return { product, score };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 3).map(s => s.product);
  }, [quizAnswers, showQuizResults]);

  const handleQuizAnswer = (value: string) => {
    setQuizSelectedAnswer(value);
    const questionId = quizQuestions[quizStep].id as keyof QuizState;
    setQuizAnswers(prev => ({ ...prev, [questionId]: value }));

    setTimeout(() => {
      setQuizSelectedAnswer(null);
      if (quizStep < quizQuestions.length - 1) {
        setQuizStep(prev => prev + 1);
      } else {
        setShowQuizResults(true);
        fetchQuizAIRecommendation();
      }
    }, 400);
  };

  const fetchQuizAIRecommendation = async () => {
    setLoadingAI(true);
    try {
      const recommendation = await getQuizRecommendation({
        usage: quizAnswers.usage,
        squareMeters: quizAnswers.squareMeters,
        priority: quizAnswers.priority,
        installation: quizAnswers.installation,
        wifi: quizAnswers.wifi,
        recommendedProducts: quizRecommendedProducts.map(p => p.name)
      });
      setAiRecommendation(recommendation);
    } catch (error) {
      setAiRecommendation('');
    } finally {
      setLoadingAI(false);
    }
  };

  // ==================== CALCULATOR LOGIC ====================
  const calculatedBTU = useMemo(() => {
    let btu = calcData.squareMeters * (calcData.ceilingHeight / 2.6) * BASE_BTU_PER_M2;
    const orientationFactors: Record<string, number> = { norte: 1.15, oeste: 1.20, este: 1.05, sur: 0.95, '': 1 };
    btu *= orientationFactors[calcData.orientation];
    const windowBaseBTU = calcData.windowType === 'simple' ? 800 : 400;
    btu += calcData.windowCount * windowBaseBTU;
    const sunFactors: Record<string, number> = { alta: 1.15, media: 1.05, baja: 1, '': 1 };
    btu *= sunFactors[calcData.sunExposure];
    if (calcData.peopleCount > 2) btu += (calcData.peopleCount - 2) * 400;
    const electronicsBTU: Record<string, number> = { ninguno: 0, pocos: 600, muchos: 1500, '': 0 };
    btu += electronicsBTU[calcData.electronics];
    const roofFactors: Record<string, number> = { chapa: 1.20, losa: 1.05, aislado: 0.95, '': 1 };
    btu *= roofFactors[calcData.roofType];
    const roomFactors: Record<string, number> = { dormitorio: 0.95, living: 1.05, oficina: 1.10, comercial: 1.20, '': 1 };
    btu *= roomFactors[calcData.roomType];
    return Math.round(btu);
  }, [calcData]);

  const calculatedFrigorias = useMemo(() => Math.round(calculatedBTU / 3.97), [calculatedBTU]);

  const calcRecommendedProducts = useMemo(() => {
    const targetFrigorias = calculatedFrigorias;
    const tolerance = 0.3;
    return PRODUCTS
      .filter(p => p.frigorias > 0)
      .filter(p => {
        const minFrig = targetFrigorias * (1 - tolerance);
        const maxFrig = targetFrigorias * (1 + tolerance);
        return p.frigorias >= minFrig && p.frigorias <= maxFrig;
      })
      .sort((a, b) => {
        const aInverter = a.features.some(f => f.toLowerCase().includes('inverter')) ? 1 : 0;
        const bInverter = b.features.some(f => f.toLowerCase().includes('inverter')) ? 1 : 0;
        if (bInverter !== aInverter) return bInverter - aInverter;
        return Math.abs(a.frigorias - targetFrigorias) - Math.abs(b.frigorias - targetFrigorias);
      })
      .slice(0, 4);
  }, [calculatedFrigorias]);

  const isCalcStepComplete = () => {
    switch (calcStep) {
      case 0: return calcData.squareMeters > 0 && calcData.ceilingHeight > 0;
      case 1: return calcData.orientation !== '';
      case 2: return calcData.windowType !== '' && calcData.sunExposure !== '';
      case 3: return calcData.peopleCount > 0 && calcData.electronics !== '';
      case 4: return calcData.roofType !== '' && calcData.roomType !== '';
      default: return false;
    }
  };

  const handleCalcNext = () => {
    if (calcStep < calculatorSteps.length - 1) {
      setCalcStep(prev => prev + 1);
    } else {
      setShowCalcResults(true);
      fetchCalcAIRecommendation();
    }
  };

  const fetchCalcAIRecommendation = async () => {
    setLoadingAI(true);
    try {
      const recommendation = await getAIRecommendation({
        squareMeters: calcData.squareMeters,
        ceilingHeight: calcData.ceilingHeight,
        orientation: calcData.orientation,
        windowCount: calcData.windowCount,
        windowType: calcData.windowType,
        sunExposure: calcData.sunExposure,
        peopleCount: calcData.peopleCount,
        electronics: calcData.electronics,
        roofType: calcData.roofType,
        roomType: calcData.roomType,
        calculatedFrigorias,
        recommendedProducts: calcRecommendedProducts.map(p => p.name)
      });
      setAiRecommendation(recommendation);
    } catch (error) {
      setAiRecommendation('');
    } finally {
      setLoadingAI(false);
    }
  };

  // ==================== PHOTO LOGIC ====================
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setPhotoImage(base64String);
        handlePhotoAnalyze(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoAnalyze = async (base64Data: string) => {
    setPhotoLoading(true);
    setPhotoAnalysis(null);
    try {
      const result = await analyzeRoomImage(base64Data);
      setPhotoAnalysis(result);
    } catch (error) {
      setPhotoAnalysis("Error al analizar la imagen. Intente nuevamente.");
    } finally {
      setPhotoLoading(false);
    }
  };

  // ==================== RESET FUNCTIONS ====================
  const resetAll = () => {
    setMode('selector');
    setQuizStep(0);
    setQuizAnswers(initialQuizState);
    setQuizSelectedAnswer(null);
    setShowQuizResults(false);
    setCalcStep(0);
    setCalcData(initialCalculatorData);
    setShowCalcResults(false);
    setPhotoImage(null);
    setPhotoAnalysis(null);
    setAiRecommendation('');
    setLoadingAI(false);
  };

  // ==================== WHATSAPP LINKS ====================
  const getQuizWhatsAppLink = () => {
    const productList = quizRecommendedProducts.map(p => `• ${p.name}`).join('\n');
    const message = `Hola Sures! Hice el asesor inteligente y me recomendaron:\n\n${productList}\n\nMi situación:\n- Uso: ${quizAnswers.usage}\n- Tamaño: ${quizAnswers.squareMeters}\n- Prioridad: ${quizAnswers.priority === 'ahorro' ? 'Ahorro energético' : 'Precio inicial'}\n- WiFi: ${quizAnswers.wifi === 'si' ? 'Sí' : 'No'}\n\n¿Me pueden asesorar?`;
    return `https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  const getCalcWhatsAppLink = () => {
    const productList = calcRecommendedProducts.map(p => `• ${p.name}`).join('\n');
    const message = `Hola Sures! Usé el asesor inteligente y necesito aproximadamente *${calculatedFrigorias} frigorías* para mi ambiente de ${calcData.squareMeters}m².\n\nMe interesan:\n${productList}\n\n¿Podrían asesorarme?`;
    return `https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  // ==================== RENDER MODE SELECTOR ====================
  const renderModeSelector = () => (
    <section className="py-20 bg-gradient-to-br from-sures-dark via-sures-primary/90 to-sures-dark min-h-[80vh] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sures-primary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-bold mb-6">
            <Sparkles size={18} className="animate-pulse" />
            Asesor Inteligente con IA
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
            Encontrá Tu Equipo Ideal
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Elegí cómo querés que te ayudemos a encontrar el aire acondicionado perfecto
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Quick Quiz */}
          <button
            onClick={() => setMode('quiz')}
            className="group relative bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 text-left transition-all duration-500 hover:bg-white/20 hover:border-white/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/10"
          >
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              ¡Más Popular!
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Quiz Rápido</h3>
            <p className="text-blue-200 text-sm mb-4">5 preguntas simples y listo. Perfecto si no querés complicarte.</p>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span>⏱️ ~1 minuto</span>
            </div>
            <ChevronRight className="absolute bottom-8 right-8 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" size={24} />
          </button>

          {/* Calculator */}
          <button
            onClick={() => setMode('calculator')}
            className="group relative bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 text-left transition-all duration-500 hover:bg-white/20 hover:border-white/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/10"
          >
            <div className="p-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Cálculo Técnico</h3>
            <p className="text-blue-200 text-sm mb-4">Calculá las frigorías exactas con todos los factores de tu ambiente.</p>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span>📐 Precisión máxima</span>
            </div>
            <ChevronRight className="absolute bottom-8 right-8 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" size={24} />
          </button>

          {/* Photo Analysis */}
          <button
            onClick={() => setMode('photo')}
            className="group relative bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 text-left transition-all duration-500 hover:bg-white/20 hover:border-white/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/10"
          >
            <div className="p-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Análisis con Foto</h3>
            <p className="text-blue-200 text-sm mb-4">Subí una foto de tu ambiente y la IA lo analiza por vos.</p>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span>🤖 Visión por IA</span>
            </div>
            <ChevronRight className="absolute bottom-8 right-8 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" size={24} />
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-16 text-white/60 text-sm">
          <span className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-400" />
            Sin compromiso
          </span>
          <span className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-400" />
            Potenciado por IA
          </span>
          <span className="flex items-center gap-2">
            <MessageCircle size={16} className="text-blue-400" />
            Asesoramiento gratuito
          </span>
        </div>
      </div>
    </section>
  );

  // ==================== RENDER QUIZ ====================
  const renderQuiz = () => {
    if (showQuizResults) return renderQuizResults();

    const currentQuestion = quizQuestions[quizStep];
    const progress = ((quizStep + 1) / quizQuestions.length) * 100;

    return (
      <section className="py-20 bg-gradient-to-br from-sures-primary via-sures-dark to-sures-primary min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Button */}
          <button 
            onClick={resetAll}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Volver al inicio</span>
          </button>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Target size={16} />
              Quiz Rápido
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              {currentQuestion.question}
            </h2>
            {currentQuestion.subtitle && (
              <p className="text-white/80">{currentQuestion.subtitle}</p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80 text-sm">Pregunta {quizStep + 1} de {quizQuestions.length}</span>
              <span className="text-white font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-white to-blue-300 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Answers */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in">
            <div className={`grid gap-4 ${currentQuestion.answers.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2'}`}>
              {currentQuestion.answers.map((answer) => {
                const isSelected = quizSelectedAnswer === answer.value;
                return (
                  <button
                    key={answer.id}
                    onClick={() => handleQuizAnswer(answer.value)}
                    disabled={quizSelectedAnswer !== null}
                    className={`group relative p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                      isSelected ? 'border-sures-primary bg-sures-primary/10 scale-[0.98]' : 'border-gray-200 hover:border-sures-primary/50 hover:bg-sures-primary/5 hover:shadow-lg hover:-translate-y-1'
                    } ${quizSelectedAnswer !== null && !isSelected ? 'opacity-50' : ''}`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-sures-primary">
                        <CheckCircle2 size={24} className="fill-sures-primary text-white" />
                      </div>
                    )}
                    <div className={`mb-4 transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {answer.icon}
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">{answer.label}</h4>
                    {answer.description && <p className="text-sm text-gray-500">{answer.description}</p>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {quizQuestions.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${index === quizStep ? 'w-8 bg-white' : index < quizStep ? 'w-2 bg-white/80' : 'w-2 bg-white/30'}`}
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderQuizResults = () => (
    <section className="py-20 bg-gradient-to-br from-sures-dark via-sures-primary to-sures-dark min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sures-primary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sures-primary to-blue-500 rounded-full mb-6 shadow-2xl animate-bounce">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">¡Tus Equipos Ideales!</h2>
          <p className="text-blue-200 text-lg">Basado en tus respuestas, estos son los mejores para vos</p>
        </div>

        {/* AI Recommendation */}
        {(loadingAI || aiRecommendation) && (
          <div className="mb-10 animate-slide-up">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-sures-primary to-blue-500 rounded-xl">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Recomendación Personalizada</h3>
              </div>
              {loadingAI ? (
                <div className="flex items-center gap-3 text-blue-200">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analizando tus preferencias...</span>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown className="text-blue-100 leading-relaxed">{aiRecommendation}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {quizRecommendedProducts.map((product, index) => {
            const isInverter = product.features.some(f => f.toLowerCase().includes('inverter'));
            const hasWifi = product.features.some(f => f.toLowerCase().includes('wi-fi'));
            const medals = ['🥇', '🥈', '🥉'];
            
            return (
              <div 
                key={product.id}
                className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:bg-white/20 transition-all duration-300 animate-slide-up hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute top-4 left-4 z-10 text-4xl">{medals[index]}</div>
                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {index === 0 ? 'MEJOR MATCH' : index === 1 ? 'EXCELENTE' : 'MUY BUENO'}
                </div>
                <div className="aspect-square bg-white/5 p-6 flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="max-h-full w-auto object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-white text-lg mb-2 line-clamp-2">{product.name}</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Snowflake size={12} />{product.frigorias} fg
                    </span>
                    {isInverter && <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded-full flex items-center gap-1"><ZapIcon size={12} />Inverter</span>}
                    {hasWifi && <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded-full flex items-center gap-1"><Wifi size={12} />WiFi</span>}
                  </div>
                  <a
                    href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(`Hola! Me interesa el ${product.name}. ¿Precio y disponibilidad?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl text-sm font-bold transition-colors"
                  >
                    <MessageCircle size={16} />Consultar
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={resetAll} className="flex items-center gap-2 px-6 py-3 border border-white/30 rounded-xl text-white hover:bg-white/10 transition-colors">
            <RotateCcw size={18} />Empezar de nuevo
          </button>
          <a href={getQuizWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-3 bg-[#25D366] hover:bg-[#128C7E] rounded-xl text-white font-bold transition-all shadow-lg shadow-green-500/30">
            <MessageCircle size={18} />Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );

  // ==================== RENDER CALCULATOR ====================
  const renderCalculator = () => {
    if (showCalcResults) return renderCalcResults();

    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button 
            onClick={resetAll}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Volver al inicio</span>
          </button>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-sures-primary/10 text-sures-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Calculator size={18} />
              Cálculo Técnico
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Cuántas Frigorías Necesitás?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Completá los datos de tu ambiente para un cálculo preciso.</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                <div className="h-full bg-sures-primary transition-all duration-500" style={{ width: `${(calcStep / (calculatorSteps.length - 1)) * 100}%` }}></div>
              </div>
              {calculatorSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === calcStep;
                const isComplete = index < calcStep;
                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isComplete ? 'bg-sures-primary text-white' : isActive ? 'bg-sures-primary text-white ring-4 ring-sures-primary/20' : 'bg-gray-200 text-gray-400'}`}>
                      {isComplete ? <CheckCircle size={20} /> : <StepIcon size={18} />}
                    </div>
                    <span className={`mt-2 text-xs font-medium hidden sm:block ${isActive || isComplete ? 'text-sures-primary' : 'text-gray-400'}`}>{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-8 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {React.createElement(calculatorSteps[calcStep].icon, { size: 24, className: 'text-sures-primary' })}
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Paso {calcStep + 1} de {calculatorSteps.length}</span>
                  <h3 className="text-xl font-bold text-gray-900">{calculatorSteps[calcStep].title}</h3>
                </div>
              </div>
            </div>

            <div className="p-8">{renderCalcStepContent()}</div>

            {/* Live Preview */}
            <div className="bg-sures-dark px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Snowflake className="text-blue-400" size={20} />
                <span className="text-gray-400 text-sm">Estimación actual:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{calculatedFrigorias.toLocaleString()}</span>
                <span className="text-gray-400 text-sm">frigorías</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="px-8 py-6 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => calcStep > 0 ? setCalcStep(prev => prev - 1) : resetAll()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-all"
              >
                <ChevronLeft size={18} />
                {calcStep === 0 ? 'Volver' : 'Anterior'}
              </button>
              <button
                onClick={handleCalcNext}
                disabled={!isCalcStepComplete()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${isCalcStepComplete() ? 'bg-sures-primary text-white hover:bg-sures-dark shadow-lg shadow-sures-primary/25' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                {calcStep === calculatorSteps.length - 1 ? <>Ver Resultado<Sparkles size={18} /></> : <>Siguiente<ChevronRight size={18} /></>}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderCalcStepContent = () => {
    switch (calcStep) {
      case 0:
        return (
          <div className="space-y-8 animate-fade-in">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Metros cuadrados del ambiente</label>
              <input type="range" min="10" max="150" value={calcData.squareMeters} onChange={(e) => setCalcData({ ...calcData, squareMeters: Number(e.target.value) })} className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-sures-primary" />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>10 m²</span>
                <span className="text-2xl font-bold text-sures-primary">{calcData.squareMeters} m²</span>
                <span>150 m²</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Altura del techo</label>
              <div className="grid grid-cols-3 gap-3">
                {[2.4, 2.6, 3.0].map((height) => (
                  <button key={height} onClick={() => setCalcData({ ...calcData, ceilingHeight: height })} className={`p-4 rounded-xl border-2 transition-all ${calcData.ceilingHeight === height ? 'border-sures-primary bg-sures-primary/10 text-sures-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                    <span className="text-xl font-bold">{height}m</span>
                    <span className="block text-xs text-gray-500 mt-1">{height <= 2.4 ? 'Bajo' : height <= 2.6 ? 'Estándar' : 'Alto'}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-gray-600 text-sm mb-4">¿Hacia dónde mira la ventana principal?</p>
            <div className="grid grid-cols-2 gap-4">
              {[{ id: 'norte', label: 'Norte', desc: 'Sol fuerte todo el día', icon: '☀️' }, { id: 'sur', label: 'Sur', desc: 'Menos exposición solar', icon: '🌤️' }, { id: 'este', label: 'Este', desc: 'Sol por la mañana', icon: '🌅' }, { id: 'oeste', label: 'Oeste', desc: 'Sol por la tarde', icon: '🌇' }].map((option) => (
                <button key={option.id} onClick={() => setCalcData({ ...calcData, orientation: option.id as any })} className={`p-5 rounded-2xl border-2 text-left transition-all ${calcData.orientation === option.id ? 'border-sures-primary bg-sures-primary/10 shadow-lg shadow-sures-primary/20' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
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
              <label className="block text-sm font-bold text-gray-700 mb-3">Cantidad de ventanas</label>
              <div className="flex items-center justify-center gap-6">
                <button onClick={() => setCalcData({ ...calcData, windowCount: Math.max(0, calcData.windowCount - 1) })} className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">-</button>
                <span className="text-4xl font-bold text-sures-primary w-16 text-center">{calcData.windowCount}</span>
                <button onClick={() => setCalcData({ ...calcData, windowCount: Math.min(10, calcData.windowCount + 1) })} className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">+</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Tipo de vidrio</label>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setCalcData({ ...calcData, windowType: 'simple' })} className={`p-4 rounded-xl border-2 transition-all ${calcData.windowType === 'simple' ? 'border-sures-primary bg-sures-primary/10' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span className="font-bold block">Vidrio Simple</span>
                  <span className="text-xs text-gray-500">Común, una capa</span>
                </button>
                <button onClick={() => setCalcData({ ...calcData, windowType: 'dvh' })} className={`p-4 rounded-xl border-2 transition-all ${calcData.windowType === 'dvh' ? 'border-sures-primary bg-sures-primary/10' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span className="font-bold block">DVH</span>
                  <span className="text-xs text-gray-500">Doble vidriado hermético</span>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Exposición solar directa</label>
              <div className="grid grid-cols-3 gap-3">
                {[{ id: 'baja', label: 'Baja', icon: '🌥️' }, { id: 'media', label: 'Media', icon: '⛅' }, { id: 'alta', label: 'Alta', icon: '☀️' }].map((option) => (
                  <button key={option.id} onClick={() => setCalcData({ ...calcData, sunExposure: option.id as any })} className={`p-4 rounded-xl border-2 transition-all ${calcData.sunExposure === option.id ? 'border-sures-primary bg-sures-primary/10' : 'border-gray-200 hover:border-gray-300'}`}>
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
              <label className="block text-sm font-bold text-gray-700 mb-3">Cantidad de personas habitual</label>
              <div className="flex items-center justify-center gap-6">
                <button onClick={() => setCalcData({ ...calcData, peopleCount: Math.max(1, calcData.peopleCount - 1) })} className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">-</button>
                <div className="text-center">
                  <span className="text-4xl font-bold text-sures-primary">{calcData.peopleCount}</span>
                  <span className="block text-xs text-gray-500 mt-1">personas</span>
                </div>
                <button onClick={() => setCalcData({ ...calcData, peopleCount: Math.min(20, calcData.peopleCount + 1) })} className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">+</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Equipos electrónicos (PC, TV, etc.)</label>
              <div className="grid grid-cols-3 gap-3">
                {[{ id: 'ninguno', label: 'Ninguno', desc: 'Sin equipos', icon: '📱' }, { id: 'pocos', label: 'Pocos', desc: '1-2 equipos', icon: '💻' }, { id: 'muchos', label: 'Muchos', desc: '3+ equipos', icon: '🖥️' }].map((option) => (
                  <button key={option.id} onClick={() => setCalcData({ ...calcData, electronics: option.id as any })} className={`p-4 rounded-xl border-2 transition-all ${calcData.electronics === option.id ? 'border-sures-primary bg-sures-primary/10' : 'border-gray-200 hover:border-gray-300'}`}>
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
              <label className="block text-sm font-bold text-gray-700 mb-3">Tipo de techo</label>
              <div className="grid grid-cols-3 gap-3">
                {[{ id: 'losa', label: 'Losa', desc: 'Hormigón', icon: '🏢' }, { id: 'chapa', label: 'Chapa', desc: 'Metálico', icon: '🏭' }, { id: 'aislado', label: 'Aislado', desc: 'Con aislación', icon: '🏠' }].map((option) => (
                  <button key={option.id} onClick={() => setCalcData({ ...calcData, roofType: option.id as any })} className={`p-4 rounded-xl border-2 transition-all ${calcData.roofType === option.id ? 'border-sures-primary bg-sures-primary/10' : 'border-gray-200 hover:border-gray-300'}`}>
                    <span className="text-2xl block mb-1">{option.icon}</span>
                    <span className="font-bold text-sm block">{option.label}</span>
                    <span className="text-[10px] text-gray-500">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Tipo de ambiente</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ id: 'dormitorio', label: 'Dormitorio', icon: '🛏️' }, { id: 'living', label: 'Living/Comedor', icon: '🛋️' }, { id: 'oficina', label: 'Oficina', icon: '💼' }, { id: 'comercial', label: 'Local Comercial', icon: '🏪' }].map((option) => (
                  <button key={option.id} onClick={() => setCalcData({ ...calcData, roomType: option.id as any })} className={`p-4 rounded-xl border-2 transition-all ${calcData.roomType === option.id ? 'border-sures-primary bg-sures-primary/10' : 'border-gray-200 hover:border-gray-300'}`}>
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

  const renderCalcResults = () => (
    <section className="py-20 bg-gradient-to-br from-sures-dark via-gray-900 to-black min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sures-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <CheckCircle size={18} />Cálculo completado
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Tu ambiente necesita</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
              <Snowflake className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <div className="text-5xl md:text-6xl font-black text-white mb-2">{calculatedFrigorias.toLocaleString()}</div>
              <div className="text-gray-400 font-medium">Frigorías</div>
            </div>
            <div className="text-gray-500 text-2xl">=</div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
              <ThermometerSun className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <div className="text-5xl md:text-6xl font-black text-white mb-2">{calculatedBTU.toLocaleString()}</div>
              <div className="text-gray-400 font-medium">BTU/h</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm text-gray-300">📐 {calcData.squareMeters} m²</span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm text-gray-300">🧭 {calcData.orientation.charAt(0).toUpperCase() + calcData.orientation.slice(1)}</span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm text-gray-300">👥 {calcData.peopleCount} personas</span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm text-gray-300">🏠 {calcData.roomType.charAt(0).toUpperCase() + calcData.roomType.slice(1)}</span>
          </div>
        </div>

        {/* AI Recommendation */}
        {(loadingAI || aiRecommendation) && (
          <div className="mb-12 animate-slide-up">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-xl"><Sparkles className="w-6 h-6 text-purple-400" /></div>
                <h3 className="text-xl font-bold text-white">Recomendación del Experto IA</h3>
              </div>
              {loadingAI ? (
                <div className="flex items-center gap-3 text-gray-400"><Loader2 className="w-5 h-5 animate-spin" /><span>Analizando tu ambiente...</span></div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none"><ReactMarkdown className="text-gray-300 leading-relaxed">{aiRecommendation}</ReactMarkdown></div>
              )}
            </div>
          </div>
        )}

        {/* Recommended Products */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Wind className="text-sures-primary" />Equipos Recomendados</h3>
          {calcRecommendedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {calcRecommendedProducts.map((product, index) => {
                const isInverter = product.features.some(f => f.toLowerCase().includes('inverter'));
                return (
                  <div key={product.id} className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-sures-primary/50 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="relative aspect-square bg-white/5 p-4">
                      {isInverter && <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><ZapIcon size={10} className="fill-current" />INVERTER</div>}
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-white text-sm mb-2 line-clamp-2">{product.name}</h4>
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1"><Snowflake size={12} className="text-blue-400" />{product.frigorias} fg</span>
                        <span className="bg-white/10 px-2 py-1 rounded">{product.type}</span>
                      </div>
                      <a href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(`Hola! Vi el ${product.name} en el asesor. ¿Más información?`)}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-2.5 rounded-xl text-sm font-bold transition-colors">
                        <MessageCircle size={16} />Consultar
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <p className="text-gray-400 mb-4">No encontramos equipos exactos para esa capacidad.</p>
              <a href={getCalcWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-sures-primary hover:bg-sures-dark text-white px-6 py-3 rounded-xl font-bold transition-colors">
                <MessageCircle size={18} />Solicitar asesoramiento personalizado
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={resetAll} className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors">
            <RotateCcw size={18} />Empezar de nuevo
          </button>
          <a href={getCalcWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-3 bg-[#25D366] hover:bg-[#128C7E] rounded-xl text-white font-bold transition-colors shadow-lg shadow-green-500/25">
            <MessageCircle size={18} />Consultar por estos equipos
          </a>
        </div>
      </div>
    </section>
  );

  // ==================== RENDER PHOTO ====================
  const renderPhoto = () => (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button 
          onClick={resetAll}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Volver al inicio</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Camera size={18} />
              Análisis con IA
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Subí una Foto de tu Ambiente</h2>
            <p className="text-lg text-gray-600 mb-8">
              Nuestra Inteligencia Artificial analizará las dimensiones y características térmicas para recomendarte el equipo ideal.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-sures-primary/10 rounded-lg text-sures-primary mt-1"><Camera size={24} /></div>
                <div>
                  <h4 className="font-bold text-gray-900">Análisis Visual</h4>
                  <p className="text-sm text-gray-500">Detectamos ventanas, exposición solar y tamaño aparente.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-sures-primary/10 rounded-lg text-sures-primary mt-1"><CheckCircle size={24} /></div>
                <div>
                  <h4 className="font-bold text-gray-900">Recomendación Precisa</h4>
                  <p className="text-sm text-gray-500">Sugerimos las frigorías exactas y el modelo compatible.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            {!photoImage ? (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:bg-gray-50 hover:border-sures-primary/50 transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
                <div className="p-4 bg-purple-100 rounded-2xl w-fit mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Upload className="h-10 w-10 text-purple-600" />
                </div>
                <p className="text-gray-900 font-bold text-lg">Hacé clic para subir una foto</p>
                <p className="text-sm text-gray-500 mt-2">JPG, PNG (Max 5MB)</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden h-64 bg-gray-100">
                  <img src={photoImage} alt="Room Preview" className="w-full h-full object-cover" />
                  {photoLoading && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                      <Loader2 className="animate-spin h-12 w-12 mb-3" />
                      <span className="font-bold">Analizando ambiente...</span>
                    </div>
                  )}
                </div>

                {photoAnalysis && (
                  <div className="bg-gradient-to-br from-sures-primary/5 to-purple-50 p-6 rounded-2xl border border-sures-primary/20 animate-fade-in">
                    <h4 className="font-bold text-sures-primary mb-3 flex items-center gap-2">
                      <Sparkles size={18} />Resultado del Análisis
                    </h4>
                    <div className="prose prose-sm text-gray-700">
                      <ReactMarkdown className="markdown-body">{photoAnalysis}</ReactMarkdown>
                    </div>
                    
                    <a 
                      href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(`Hola Sures! Usé el análisis con foto del asesor inteligente. ¿Pueden ayudarme a elegir el equipo ideal?`)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-4 w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-3 rounded-xl font-bold transition-colors"
                    >
                      <MessageCircle size={18} />Consultar por WhatsApp
                    </a>
                  </div>
                )}
                
                <button 
                  onClick={() => { setPhotoImage(null); setPhotoAnalysis(null); }}
                  className="w-full py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Analizar otra foto
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  // ==================== MAIN RENDER ====================
  switch (mode) {
    case 'quiz':
      return renderQuiz();
    case 'calculator':
      return renderCalculator();
    case 'photo':
      return renderPhoto();
    default:
      return renderModeSelector();
  }
};

export default SmartAdvisor;

