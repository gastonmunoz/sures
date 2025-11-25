import React from 'react';
import { Award, ShieldCheck, Clock, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-sures-secondary uppercase tracking-widest mb-2">Sobre Nosotros</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-sures-primary mb-6">Expertos en Climatización desde hace Generaciones</h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            Hijos y Nietos de Maria Asunción Cornejo S.R.L. "Sures" es sinónimo de calidad en Zona Sur.
            Proyectamos y ejecutamos balances térmicos para sistemas de refrigeración, calefacción y ventilación en grandes empresas de Capital Federal y Buenos Aires.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Award,
              title: "Dealers Oficiales",
              text: "Representantes certificados de Carrier y Midea."
            },
            {
              icon: Clock,
              title: "Respuesta Inmediata",
              text: "Capacidad de respuesta rápida con flota propia."
            },
            {
              icon: Users,
              title: "Personal Especializado",
              text: "Técnicos matriculados y en capacitación constante."
            },
            {
              icon: ShieldCheck,
              title: "Garantía Total",
              text: "Servicio de guardia 24hs para equipos vitales."
            }
          ].map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-sures-primary/10 rounded-xl flex items-center justify-center mb-6 text-sures-primary">
                <item.icon size={24} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
              <p className="text-gray-500">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;