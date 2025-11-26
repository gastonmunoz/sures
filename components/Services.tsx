import React from 'react';
import { SERVICES } from '../constants';
import {
  ShoppingCart,
  Wrench,
  ClipboardCheck,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const iconMap: Record<string, React.FC<any>> = {
  ShoppingCart,
  Wrench,
  ClipboardCheck,
  Building2
};

const gradients = [
  "from-sures-primary via-blue-500 to-sures-accent",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-amber-500 via-orange-500 to-red-500",
  "from-purple-500 via-violet-500 to-fuchsia-500",
];

const Services: React.FC = () => {
  return (
    <section className="relative py-32 bg-sures-dark overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-sures-primary/5 rounded-full blur-[150px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-sures-accent/5 rounded-full blur-[120px] -translate-y-1/2" />

      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sures-primary/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Sparkles className="h-4 w-4 text-sures-accent" />
              <span className="text-sures-accent text-sm font-semibold uppercase tracking-widest">
                Nuestros Servicios
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Soluciones <span className="gradient-text">Corporativas</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Ofrecemos ingeniería aplicada para garantizar la eficiencia
              operativa en edificios, plantas industriales y comercios.
            </p>
          </div>

          <a
            href="#contact"
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card hover:bg-white/10 transition-all"
          >
            <span className="text-white font-medium">
              Solicitar asesoramiento
            </span>
            <ArrowRight className="h-5 w-5 text-sures-accent group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service, index) => {
            const Icon = iconMap[service.iconName];
            const gradient = gradients[index % gradients.length];

            return (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card */}
                <div className="relative glass-card rounded-3xl p-8 md:p-10 hover-card overflow-hidden h-full">
                  {/* Background Gradient on Hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-700`}
                  />

                  {/* Glow Effect */}
                  <div
                    className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${gradient} rounded-full blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700`}
                  />

                  <div className="relative">
                    {/* Icon */}
                    <div
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                    >
                      <Icon size={32} className="text-white" />
                    </div>

                    {/* Number Badge */}
                    <div className="absolute top-0 right-0 font-display text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                      0{index + 1}
                    </div>

                    {/* Content */}
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-sures-accent transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-lg">
                      {service.description}
                    </p>

                    {/* Arrow Link */}
                    <div className="mt-6 flex items-center gap-2 text-sures-accent opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span className="text-sm font-medium">
                        Más información
                      </span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 p-2 rounded-full glass-card">
            <div className="flex -space-x-2">
              {["🏢", "🏭", "🏪", "🏥"].map((emoji, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg ring-2 ring-sures-dark"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div className="pr-4">
              <p className="text-white text-sm font-medium">
                +500 empresas confían en nosotros
              </p>
              <p className="text-gray-500 text-xs">
                Capital Federal y Gran Buenos Aires
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
