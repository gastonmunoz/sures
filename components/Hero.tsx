import React, { useState, useEffect } from 'react';
import { ArrowRight, Snowflake, Sun, ChevronRight, ChevronLeft } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

const SLIDES = [
  {
    id: 1,
    // Technician with gauges / tools
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop",
    alt: "Técnico especialista midiendo presión en equipo industrial"
  },
  {
    id: 2,
    // Industrial green/metal pipes (Chillers/Cooling Towers)
    image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=2070&auto=format&fit=crop",
    alt: "Sistemas industriales de tuberías y refrigeración central"
  },
  {
    id: 3,
    // Rooftop units / Ventilation
    image: "https://images.unsplash.com/photo-1563931307-a276b1152a13?auto=format&fit=crop&q=80", 
    alt: "Unidades Rooftop de tratamiento de aire en terraza corporativa"
  }
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Carousel Background */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-sures-dark/90 via-sures-dark/60 to-black/40" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="max-w-3xl space-y-8 animate-slide-up">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold border border-white/20 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Dealers Oficiales Carrier & Midea
          </div>
          
          {/* Heading - SEO Optimized for Corporate/Industrial */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] drop-shadow-lg">
            Climatización <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Corporativa
            </span> e <br />
            Industrial
          </h1>
          
          {/* Description - SEO Optimized */}
          <p className="text-xl text-gray-200 max-w-lg leading-relaxed drop-shadow-md">
            Soluciones integrales para empresas, edificios y grandes superficies en Buenos Aires. Mantenimiento, venta e instalación de Chillers, VRF y Centrales.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a 
              href={whatsappQuoteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center px-8 py-4 bg-sures-primary text-white rounded-full font-semibold transition-all hover:bg-white hover:text-sures-primary hover:shadow-lg hover:-translate-y-1"
            >
              Solicitar Cotización
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a href="#catalog" className="inline-flex justify-center items-center px-8 py-4 bg-white/10 text-white border border-white/30 rounded-full font-semibold transition-all hover:bg-white hover:text-sures-dark backdrop-blur-sm">
              Ver Catálogo
            </a>
          </div>

          {/* Stats / Features */}
          <div className="pt-8 flex items-center gap-8 text-gray-300 border-t border-white/10 mt-8">
            <div className="flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-cyan-400" />
              <span className="text-sm font-medium">Refrigeración de Precisión</span>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-orange-400" />
              <span className="text-sm font-medium">Grandes Proyectos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-2">
        <button 
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-white hover:text-sures-primary transition-all border border-white/20 backdrop-blur-md"
          aria-label="Imagen anterior"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-white hover:text-sures-primary transition-all border border-white/20 backdrop-blur-md"
          aria-label="Siguiente imagen"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir a diapositiva ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;