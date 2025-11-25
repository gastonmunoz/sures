import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
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
  Loader2
} from 'lucide-react';
import { PRODUCTS, COMPANY_INFO } from '../constants';
import { Product } from '../types';
import { getQuizRecommendation } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

// Quiz Types
interface QuizAnswer {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  value: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  answers: QuizAnswer[];
}

interface QuizState {
  usage: 'residencial' | 'comercial' | '';
  squareMeters: 'pequeño' | 'mediano' | 'grande' | 'muy-grande' | '';
  priority: 'ahorro' | 'precio' | '';
  installation: 'existente' | 'nueva' | '';
  wifi: 'si' | 'no' | '';
}

const initialState: QuizState = {
  usage: '',
  squareMeters: '',
  priority: '',
  installation: '',
  wifi: ''
};

// Questions Configuration
const questions: QuizQuestion[] = [
  {
    id: 'usage',
    question: '¿Dónde vas a instalar el equipo?',
    subtitle: 'Elegí el tipo de ambiente principal',
    answers: [
      { 
        id: 'residencial', 
        label: 'Casa / Departamento', 
        description: 'Dormitorio, living, comedor',
        icon: <Home className="w-8 h-8" />,
        value: 'residencial'
      },
      { 
        id: 'comercial', 
        label: 'Oficina / Local', 
        description: 'Trabajo, comercio, consultorio',
        icon: <Building2 className="w-8 h-8" />,
        value: 'comercial'
      }
    ]
  },
  {
    id: 'squareMeters',
    question: '¿Qué tamaño tiene el ambiente?',
    subtitle: 'Aproximadamente, no hace falta ser exacto',
    answers: [
      { 
        id: 'pequeño', 
        label: 'Pequeño', 
        description: 'Hasta 20 m²',
        icon: <span className="text-3xl">🏠</span>,
        value: 'pequeño'
      },
      { 
        id: 'mediano', 
        label: 'Mediano', 
        description: '20 - 35 m²',
        icon: <span className="text-3xl">🏡</span>,
        value: 'mediano'
      },
      { 
        id: 'grande', 
        label: 'Grande', 
        description: '35 - 60 m²',
        icon: <span className="text-3xl">🏢</span>,
        value: 'grande'
      },
      { 
        id: 'muy-grande', 
        label: 'Muy Grande', 
        description: 'Más de 60 m²',
        icon: <span className="text-3xl">🏬</span>,
        value: 'muy-grande'
      }
    ]
  },
  {
    id: 'priority',
    question: '¿Qué priorizás más?',
    subtitle: 'No hay respuesta incorrecta, es según tu situación',
    answers: [
      { 
        id: 'ahorro', 
        label: 'Ahorro a largo plazo', 
        description: 'Invertir más hoy, pagar menos de luz',
        icon: <Zap className="w-8 h-8 text-emerald-500" />,
        value: 'ahorro'
      },
      { 
        id: 'precio', 
        label: 'Menor inversión inicial', 
        description: 'Presupuesto ajustado ahora',
        icon: <DollarSign className="w-8 h-8 text-amber-500" />,
        value: 'precio'
      }
    ]
  },
  {
    id: 'installation',
    question: '¿Tenés instalación previa?',
    subtitle: 'Esto afecta el tipo de equipo recomendado',
    answers: [
      { 
        id: 'existente', 
        label: 'Sí, ya tengo instalación', 
        description: 'Reemplazo de equipo existente',
        icon: <Wrench className="w-8 h-8 text-blue-500" />,
        value: 'existente'
      },
      { 
        id: 'nueva', 
        label: 'No, es instalación nueva', 
        description: 'Primera vez que instalo aire',
        icon: <PackagePlus className="w-8 h-8 text-purple-500" />,
        value: 'nueva'
      }
    ]
  },
  {
    id: 'wifi',
    question: '¿Querés controlarlo desde el celular?',
    subtitle: 'WiFi integrado para control remoto',
    answers: [
      { 
        id: 'si', 
        label: '¡Sí, obvio!', 
        description: 'Control desde cualquier lugar',
        icon: <Wifi className="w-8 h-8 text-cyan-500" />,
        value: 'si'
      },
      { 
        id: 'no', 
        label: 'No es necesario', 
        description: 'Control remoto clásico está bien',
        icon: <WifiOff className="w-8 h-8 text-gray-400" />,
        value: 'no'
      }
    ]
  }
];

const ProductQuiz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizState>(initialState);
  const [showResults, setShowResults] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Get frigorias range based on size
  const getFrigoriasRange = (size: string): [number, number] => {
    switch (size) {
      case 'pequeño': return [2000, 3500];
      case 'mediano': return [3000, 5000];
      case 'grande': return [4500, 9000];
      case 'muy-grande': return [8000, 30000];
      default: return [2000, 30000];
    }
  };

  // Find matching products based on quiz answers
  const recommendedProducts = useMemo(() => {
    if (!showResults) return [];

    const [minFrig, maxFrig] = getFrigoriasRange(answers.squareMeters);
    
    let filtered = PRODUCTS.filter(p => {
      // Filter by category
      if (answers.usage === 'residencial' && p.category !== 'residential') return false;
      if (answers.usage === 'comercial' && p.category !== 'commercial') return false;
      
      // Filter by frigorias range
      if (p.frigorias < minFrig || p.frigorias > maxFrig) return false;
      
      return true;
    });

    // Score and sort products
    const scored = filtered.map(product => {
      let score = 0;
      const isInverter = product.features.some(f => f.toLowerCase().includes('inverter')) || 
                         product.name.toLowerCase().includes('inverter');
      const hasWifi = product.features.some(f => f.toLowerCase().includes('wi-fi') || f.toLowerCase().includes('wifi'));
      const isR32 = product.refrigerant === 'R-32';

      // Priority scoring
      if (answers.priority === 'ahorro') {
        if (isInverter) score += 50;
        if (isR32) score += 20;
      } else {
        if (!isInverter) score += 30;
      }

      // WiFi preference
      if (answers.wifi === 'si' && hasWifi) score += 40;
      if (answers.wifi === 'no' && !hasWifi) score += 10;

      // Installation type - Split is usually easier for new installations
      if (answers.installation === 'nueva' && product.type === 'Split') score += 20;

      // Bonus for eco-friendly
      if (isR32) score += 10;

      return { product, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => s.product);
  }, [answers, showResults]);

  // Fetch AI recommendation
  const fetchAIRecommendation = async () => {
    setLoadingAI(true);
    try {
      const recommendation = await getQuizRecommendation({
        usage: answers.usage,
        squareMeters: answers.squareMeters,
        priority: answers.priority,
        installation: answers.installation,
        wifi: answers.wifi,
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

  // Handle answer selection with animation delay
  const handleAnswer = (value: string) => {
    setSelectedAnswer(value);
    
    // Update answers
    const questionId = questions[currentStep].id as keyof QuizState;
    setAnswers(prev => ({ ...prev, [questionId]: value }));

    // Animate and move to next
    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setShowResults(true);
        setTimeout(() => fetchAIRecommendation(), 100);
      }
    }, 400);
  };

  // Reset quiz
  const handleReset = () => {
    setAnswers(initialState);
    setCurrentStep(0);
    setShowResults(false);
    setAiRecommendation('');
    setSelectedAnswer(null);
  };

  // WhatsApp link generator
  const getWhatsAppLink = () => {
    const productList = recommendedProducts.map(p => `• ${p.name}`).join('\n');
    const message = `Hola Sures! Hice el quiz y me recomendaron estos equipos:

${productList}

Mi situación:
- Uso: ${answers.usage}
- Tamaño: ${answers.squareMeters}
- Prioridad: ${answers.priority === 'ahorro' ? 'Ahorro energético' : 'Precio inicial'}
- WiFi: ${answers.wifi === 'si' ? 'Sí' : 'No'}

¿Me pueden asesorar?`;
    
    return `https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  // Progress percentage
  const progress = ((currentStep + 1) / questions.length) * 100;

  // Results View
  if (showResults) {
    return (
      <section className="py-20 bg-gradient-to-br from-sures-dark via-sures-primary to-sures-dark min-h-screen relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sures-primary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Trophy Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sures-primary to-blue-500 rounded-full mb-6 shadow-2xl shadow-sures-primary/40 animate-bounce">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              ¡Tus Equipos Ideales!
            </h2>
            <p className="text-blue-200 text-lg">
              Basado en tus respuestas, estos son los mejores para vos
            </p>
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
                    <ReactMarkdown className="text-blue-100 leading-relaxed">
                      {aiRecommendation}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {recommendedProducts.map((product, index) => {
              const isInverter = product.features.some(f => f.toLowerCase().includes('inverter'));
              const hasWifi = product.features.some(f => f.toLowerCase().includes('wi-fi'));
              const medals = ['🥇', '🥈', '🥉'];
              
              return (
                <div 
                  key={product.id}
                  className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:bg-white/20 transition-all duration-300 animate-slide-up hover:-translate-y-2"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Medal Badge */}
                  <div className="absolute top-4 left-4 z-10 text-4xl">
                    {medals[index]}
                  </div>

                  {/* Match Score */}
                  <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {index === 0 ? 'MEJOR MATCH' : index === 1 ? 'EXCELENTE' : 'MUY BUENO'}
                  </div>

                  {/* Image */}
                  <div className="aspect-square bg-white/5 p-6 flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="max-h-full w-auto object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h4 className="font-bold text-white text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h4>
                    
                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Snowflake size={12} />
                        {product.frigorias} fg
                      </span>
                      {isInverter && (
                        <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Zap size={12} />
                          Inverter
                        </span>
                      )}
                      {hasWifi && (
                        <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Wifi size={12} />
                          WiFi
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <a
                      href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(`Hola! Me interesa el ${product.name} que vi en el quiz. ¿Precio y disponibilidad?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl text-sm font-bold transition-colors"
                    >
                      <MessageCircle size={16} />
                      Consultar
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white text-sm">
              {answers.usage === 'residencial' ? '🏠 Residencial' : '🏢 Comercial'}
            </span>
            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white text-sm">
              📐 {answers.squareMeters.charAt(0).toUpperCase() + answers.squareMeters.slice(1)}
            </span>
            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white text-sm">
              {answers.priority === 'ahorro' ? '⚡ Prioriza ahorro' : '💰 Prioriza precio'}
            </span>
            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white text-sm">
              {answers.wifi === 'si' ? '📱 Con WiFi' : '📺 Sin WiFi'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 border border-white/30 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw size={18} />
              Hacer el quiz de nuevo
            </button>
            
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3 bg-[#25D366] hover:bg-[#128C7E] rounded-xl text-white font-bold transition-all shadow-lg shadow-green-500/30 hover:shadow-xl hover:-translate-y-0.5"
            >
              <MessageCircle size={18} />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    );
  }

  // Quiz View
  const currentQuestion = questions[currentStep];

  return (
    <section className="py-20 bg-gradient-to-br from-sures-primary via-sures-dark to-sures-primary min-h-screen relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Target size={16} />
            Quiz Rápido
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
            ¿Qué Equipo Necesitás?
          </h2>
          <p className="text-white/80">
            5 preguntas simples, recomendación perfecta
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 text-sm font-medium">
              Pregunta {currentStep + 1} de {questions.length}
            </span>
            <span className="text-white font-bold">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-white to-blue-300 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in">
          {/* Question */}
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {currentQuestion.question}
            </h3>
            {currentQuestion.subtitle && (
              <p className="text-gray-500">{currentQuestion.subtitle}</p>
            )}
          </div>

          {/* Answers Grid */}
          <div className={`grid gap-4 ${currentQuestion.answers.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2'}`}>
            {currentQuestion.answers.map((answer) => {
              const isSelected = selectedAnswer === answer.value;
              
              return (
                <button
                  key={answer.id}
                  onClick={() => handleAnswer(answer.value)}
                  disabled={selectedAnswer !== null}
                  className={`group relative p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                    isSelected
                      ? 'border-sures-primary bg-sures-primary/10 scale-[0.98]'
                      : 'border-gray-200 hover:border-sures-primary/50 hover:bg-sures-primary/5 hover:shadow-lg hover:-translate-y-1'
                  } ${selectedAnswer !== null && !isSelected ? 'opacity-50' : ''}`}
                >
                  {/* Selected Check */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 text-sures-primary animate-scale-in">
                      <CheckCircle2 size={24} className="fill-sures-primary text-white" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`mb-4 transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {answer.icon}
                  </div>

                  {/* Label */}
                  <h4 className="font-bold text-gray-900 text-lg mb-1">
                    {answer.label}
                  </h4>
                  
                  {answer.description && (
                    <p className="text-sm text-gray-500">
                      {answer.description}
                    </p>
                  )}

                  {/* Hover Arrow */}
                  <ChevronRight 
                    className={`absolute right-4 top-1/2 -translate-y-1/2 text-sures-primary transition-all duration-300 ${
                      isSelected ? 'opacity-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                    }`}
                    size={24}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-8 bg-white'
                  : index < currentStep
                    ? 'w-2 bg-white/80'
                    : 'w-2 bg-white/30'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes scale-in {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default ProductQuiz;

