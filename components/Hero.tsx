import React, { useState, useEffect } from 'react';
import { ArrowRight, Snowflake, Sun, ChevronRight, ChevronLeft, Zap, Building2, Shield } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

const SLIDES = [
  {
    id: 1,
    image: "/hero_1.png",
    alt: "Sures Climatización - Servicios profesionales"
  },
  {
    id: 2,
    image: "/hero_2.png",
    alt: "Sures Climatización - Instalaciones industriales"
  },
  {
    id: 3,
    image: "/hero_3.png",
    alt: "Sures Climatización - Equipos de climatización"
  }
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const whatsappQuoteUrl = `https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent("Hola Sures, quisiera solicitar una cotización para mi empresa/hogar.")}`;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-sures-dark">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-sures-primary/30 rounded-full blur-[128px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-sures-accent/20 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sures-primary/10 rounded-full blur-[200px]" />
      
      {/* Carousel Background with Overlay */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            index === currentSlide ? 'opacity-40 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-sures-dark via-sures-dark/95 to-sures-dark/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-sures-dark via-transparent to-sures-dark/50" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className={`space-y-8 ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card group cursor-default">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-300">Dealers Oficiales</span>
              <span className="px-2 py-0.5 rounded-full bg-sures-primary/20 text-sures-accent text-xs font-bold">Carrier & Midea</span>
            </div>
            
            {/* Heading */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              <span className="text-white">Climatización</span>
              <br />
              <span className="gradient-text">Corporativa</span>
              <br />
              <span className="text-white">e Industrial</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
              Soluciones integrales para <span className="text-white font-medium">empresas, edificios y grandes superficies</span> en Buenos Aires. Especialistas en Chillers, VRF y sistemas centrales.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a 
                href={whatsappQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex justify-center items-center px-8 py-4 overflow-hidden rounded-full font-semibold transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-sures-primary to-sures-accent" />
                <span className="absolute inset-0 bg-gradient-to-r from-sures-accent to-sures-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="absolute inset-0 bg-white/20 blur-xl" />
                </span>
                <span className="relative flex items-center text-white">
                  Solicitar Cotización
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              
              <a 
                href="#catalog" 
                className="group inline-flex justify-center items-center px-8 py-4 rounded-full font-semibold transition-all duration-300 glass-card hover:bg-white/10"
              >
                <span className="text-white">Ver Catálogo</span>
                <ChevronRight className="ml-1 h-5 w-5 text-sures-accent group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Stats Row */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-white/10">
              {[
                { icon: Building2, value: '+500', label: 'Proyectos', color: 'text-sures-accent' },
                { icon: Shield, value: '3 años', label: 'Garantía', color: 'text-emerald-400' },
                { icon: Zap, value: '24/7', label: 'Soporte', color: 'text-amber-400' }
              ].map((stat, i) => (
                <div key={i} className={`${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: `${0.5 + i * 0.15}s` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <span className="text-2xl font-bold text-white font-display">{stat.value}</span>
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column - Visual Element */}
          <div className={`hidden lg:block ${isLoaded ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              {/* Glow Ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sures-primary/20 to-sures-accent/20 blur-3xl animate-pulse-glow" />
              
              {/* Main Card */}
              <div className="relative glass-card rounded-3xl p-8 animated-border">
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 p-4 glass-card rounded-2xl animate-float">
                  <Snowflake className="h-8 w-8 text-sures-accent" />
                </div>
                <div className="absolute -bottom-4 -left-4 p-3 glass-card rounded-xl animate-float" style={{ animationDelay: '2s' }}>
                  <Sun className="h-6 w-6 text-amber-400" />
                </div>
                
                {/* Brand Logos */}
                <div className="flex items-center justify-center gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white font-display tracking-tight">CARRIER</div>
                    <div className="text-xs text-sures-accent uppercase tracking-widest mt-1">Dealer Oficial</div>
                  </div>
                  <div className="h-12 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white font-display tracking-tight">MIDEA</div>
                    <div className="text-xs text-sures-accent uppercase tracking-widest mt-1">Dealer Oficial</div>
                  </div>
                </div>
                
                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '❄️', text: 'Refrigeración de Precisión' },
                    { icon: '🏭', text: 'Proyectos Industriales' },
                    { icon: '🔧', text: 'Mantenimiento 24/7' },
                    { icon: '📊', text: 'Balance Térmico' }
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-default"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-2">
        <button 
          onClick={prevSlide}
          className="p-3 rounded-full glass-card text-white hover:bg-white/10 transition-all"
          aria-label="Imagen anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={nextSlide}
          className="p-3 rounded-full glass-card text-white hover:bg-white/10 transition-all"
          aria-label="Siguiente imagen"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir a diapositiva ${index + 1}`}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentSlide 
                ? 'w-10 bg-gradient-to-r from-sures-primary to-sures-accent' 
                : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-8 z-20 hidden md:flex items-center gap-3 text-gray-500 text-sm">
        <div className="flex flex-col items-center">
          <div className="w-px h-12 bg-gradient-to-b from-sures-accent to-transparent" />
        </div>
        <span className="uppercase tracking-widest text-xs">Scroll</span>
      </div>
    </div>
  );
};

export default Hero;
