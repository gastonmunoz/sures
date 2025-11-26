import React from 'react';
import { COMPANY_INFO } from '../constants';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUpRight, Send, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const navLinks = [
    { label: 'Inicio', href: '#home' },
    { label: 'Nosotros', href: '#about' },
    { label: 'Servicios', href: '#services' },
    { label: 'Catálogo', href: '#catalog' },
    { label: 'Asesor IA', href: '#advisor' },
    { label: 'Contacto', href: '#contact' }
  ];

  const socialLinks = [
    { 
      icon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382C17.112 14.202 15.344 13.332 15.016 13.212C14.688 13.092 14.448 13.032 14.208 13.392C13.968 13.752 13.28 14.562 13.064 14.802C12.856 15.042 12.632 15.072 12.272 14.892C11.912 14.712 10.752 14.332 9.376 13.102C8.288 12.132 7.552 10.932 7.336 10.562C7.12 10.192 7.312 9.992 7.496 9.812C7.656 9.652 7.848 9.392 8.024 9.192C8.2 8.992 8.256 8.842 8.376 8.602C8.496 8.362 8.432 8.152 8.344 7.972C8.256 7.792 7.552 6.062 7.256 5.362C6.968 4.682 6.672 4.772 6.456 4.772C6.264 4.772 6.04 4.772 5.816 4.772C5.592 4.772 5.232 4.862 4.928 5.192C4.624 5.522 3.768 6.332 3.768 7.982C3.768 9.632 4.944 11.222 5.112 11.442C5.28 11.662 7.424 14.972 10.712 16.392C11.496 16.732 12.104 16.932 12.584 17.082C13.432 17.352 14.208 17.312 14.824 17.222C15.512 17.122 16.936 16.362 17.232 15.522C17.528 14.682 17.528 13.972 17.472 13.882V14.382Z" />
        </svg>
      ),
      label: 'WhatsApp', 
      href: `https://wa.me/${COMPANY_INFO.whatsapp}`,
      color: 'hover:bg-emerald-500'
    },
    { icon: Facebook, label: 'Facebook', href: '#', color: 'hover:bg-blue-600' },
    { icon: Instagram, label: 'Instagram', href: '#', color: 'hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/sures-climatizaci%C3%B3n/', color: 'hover:bg-blue-700' }
  ];

  return (
    <footer className="relative bg-sures-dark overflow-hidden">
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sures-primary to-transparent" />
      
      {/* Background Effects */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-sures-primary/5 rounded-full blur-[150px]" />
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-sures-accent/5 rounded-full blur-[100px]" />
      
      {/* Main Footer Content */}
      <div className="relative">
        {/* CTA Section */}
        <div className="border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="glass-card rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
                  ¿Listo para tu proyecto?
                </h3>
                <p className="text-gray-400">Contactanos y recibí asesoramiento personalizado</p>
              </div>
              <a 
                href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-sures-primary to-sures-accent font-semibold text-white transition-all hover:shadow-lg hover:shadow-sures-primary/25 hover:-translate-y-1"
              >
                <Send className="h-5 w-5" />
                Iniciar Conversación
                <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Links Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <img 
                src="/logo-sures.png" 
                alt="Sures Climatización" 
                className="h-14 w-auto mb-6"
              />
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {COMPANY_INFO.legalName}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Líderes en climatización integral. Compromiso, calidad y tecnología al servicio de su confort.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-display font-bold text-white mb-6">Navegación</h4>
              <ul className="space-y-3">
                {navLinks.map((link, i) => (
                  <li key={i}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-sures-accent transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-bold text-white mb-6">Contacto</h4>
              <ul className="space-y-4">
                <li>
                  <a 
                    href={`mailto:${COMPANY_INFO.email}`} 
                    className="flex items-start gap-3 text-gray-400 hover:text-sures-accent transition-colors group"
                  >
                    <Mail className="h-5 w-5 mt-0.5 text-sures-primary" />
                    <span className="text-sm">{COMPANY_INFO.email}</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={`tel:${COMPANY_INFO.phone1.replace(/\s/g, '')}`} 
                    className="flex items-center gap-3 text-gray-400 hover:text-sures-accent transition-colors"
                  >
                    <Phone className="h-5 w-5 text-sures-primary" />
                    <span className="text-sm">{COMPANY_INFO.phone1}</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={`tel:${COMPANY_INFO.phone2.replace(/\s/g, '')}`} 
                    className="flex items-center gap-3 text-gray-400 hover:text-sures-accent transition-colors"
                  >
                    <Phone className="h-5 w-5 text-sures-primary" />
                    <span className="text-sm">{COMPANY_INFO.phone2}</span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <MapPin className="h-5 w-5 mt-0.5 text-sures-primary flex-shrink-0" />
                  <span className="text-sm">{COMPANY_INFO.address}</span>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-display font-bold text-white mb-6">Seguinos</h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-xl glass-card text-gray-400 hover:text-white transition-all ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon />
                  </a>
                ))}
              </div>
              
              {/* Dealer Badges */}
              <div className="mt-8 space-y-3">
                <a 
                  href="https://www.carrier.com.ar/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-sures-accent transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-sures-primary" />
                  Dealer Oficial Carrier
                </a>
                <a 
                  href="https://store.midea.com.ar/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-sures-accent transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-sures-accent" />
                  Dealer Oficial Midea
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <p>© {currentYear} Sures Climatización. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
