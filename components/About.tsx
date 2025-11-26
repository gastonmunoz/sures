import React, { useState, useEffect, useRef } from "react";
import {
  Award,
  ShieldCheck,
  Clock,
  Users,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

// Animated Counter Hook
const useCounter = (
  end: number,
  duration: number = 2000,
  start: number = 0
) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * (end - start) + start));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, start, duration]);

  return { count, ref };
};

const About: React.FC = () => {
  const counter1 = useCounter(500, 2500);
  const counter2 = useCounter(25, 2000);
  const counter3 = useCounter(98, 2000);
  const counter4 = useCounter(24, 1500);

  const stats = [
    {
      ref: counter1.ref,
      count: counter1.count,
      suffix: "+",
      label: "Proyectos Completados",
      icon: "🏢",
    },
    {
      ref: counter2.ref,
      count: counter2.count,
      suffix: "+",
      label: "Años de Experiencia",
      icon: "📅",
    },
    {
      ref: counter3.ref,
      count: counter3.count,
      suffix: "%",
      label: "Clientes Satisfechos",
      icon: "⭐",
    },
    {
      ref: counter4.ref,
      count: counter4.count,
      suffix: "/7",
      label: "Soporte Técnico",
      icon: "🔧",
    },
  ];

  const features = [
    {
      icon: Award,
      title: "Dealers Oficiales",
      text: "Representantes certificados de Carrier y Midea en Argentina.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Clock,
      title: "Respuesta Inmediata",
      text: "Capacidad de respuesta rápida con flota propia y técnicos disponibles.",
      gradient: "from-sures-primary to-sures-accent",
    },
    {
      icon: Users,
      title: "Personal Especializado",
      text: "Técnicos matriculados en capacitación constante.",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: ShieldCheck,
      title: "Garantía Total",
      text: "Servicio de guardia 24hs para equipos vitales.",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section className="relative py-32 bg-sures-dark overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sures-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-sures-accent/10 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <span className="text-sures-accent text-sm font-semibold uppercase tracking-widest">
              Sobre Nosotros
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Expertos en Climatización <br />
            <span className="gradient-text">desde hace Generaciones</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
            <span className="text-white font-medium">
              Hijos y Nietos de Maria Asunción Cornejo S.R.L.
            </span>{" "}
            "Sures" es sinónimo de calidad en Zona Sur. Proyectamos y ejecutamos
            balances térmicos para sistemas de refrigeración, calefacción y
            ventilación.
          </p>
        </div>

        {/* Stats Counter Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} ref={stat.ref} className="relative group">
              <div className="glass-card rounded-2xl p-6 md:p-8 text-center hover-card">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.count}
                  <span className="text-sures-accent">{stat.suffix}</span>
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative glass-card rounded-2xl p-8 hover-card overflow-hidden"
            >
              {/* Gradient Border on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              <div className="relative flex items-start gap-6">
                <div
                  className={`p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                >
                  <feature.icon size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white font-display">
                      {feature.title}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 text-gray-600 group-hover:text-sures-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-wrap justify-center items-center gap-4 md:gap-8">
            {[
              "Capital Federal",
              "GBA Sur",
              "La Plata",
              "Zona Norte",
              "Zona Oeste",
            ].map((zone, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-500">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">{zone}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
