import React from 'react';
import { SERVICES } from '../constants';
import { ShoppingCart, Wrench, ClipboardCheck, Building2 } from 'lucide-react';

const iconMap: Record<string, React.FC<any>> = {
  ShoppingCart,
  Wrench,
  ClipboardCheck,
  Building2
};

const Services: React.FC = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Soluciones Corporativas</h2>
            <p className="text-xl text-gray-500">
              Ofrecemos ingeniería aplicada para garantizar la eficiencia operativa en edificios, plantas industriales y comercios.
            </p>
          </div>
          <a href="#contact" className="text-sures-primary font-semibold hover:text-sures-dark transition-colors flex items-center">
            Solicitar asesoramiento técnico <span className="ml-2">→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
          {SERVICES.map((service, index) => {
            const Icon = iconMap[service.iconName];
            return (
              <div key={index} className="bg-white p-10 hover:bg-gray-50 transition-colors group">
                <div className="mb-6 inline-flex p-3 rounded-lg bg-gray-100 text-sures-primary group-hover:bg-sures-primary group-hover:text-white transition-colors">
                  <Icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;