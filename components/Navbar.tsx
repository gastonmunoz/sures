import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Nosotros', href: '#about' },
    { name: 'Servicios', href: '#services' },
    { name: 'Catálogo', href: '#catalog' },
    { name: 'IA Analyzer', href: '#analyzer' },
    { name: 'Contacto', href: '#contact' },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass-panel-dark py-3 shadow-lg' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <a href="#home" className="flex items-center gap-2 group">
              {/* Sures Logo Recreation - SVG ensures no background and perfect scaling */}
              <div className="relative h-12 w-auto flex items-center">
                 <svg 
                   viewBox="0 0 200 60" 
                   className={`h-full w-auto transition-all duration-300 transform origin-left group-hover:scale-105`}
                   fill="none" 
                   xmlns="http://www.w3.org/2000/svg"
                 >
                   {/* Colors adapt to scroll state: ALWAYS WHITE now due to dark hero, but keeping logic just in case */}
                   <style>
                     {`
                       .logo-fill { fill: #ffffff; transition: fill 0.3s ease; }
                       .logo-stroke { stroke: #ffffff; transition: stroke 0.3s ease; }
                     `}
                   </style>
                   
                   {/* Circle Emblem */}
                   <circle cx="25" cy="30" r="22" className="logo-stroke" strokeWidth="3" />
                   <circle cx="25" cy="30" r="16" className="logo-stroke" strokeWidth="1" opacity="0.5" />
                   
                   {/* Text */}
                   <text x="58" y="38" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="34" className="logo-fill" letterSpacing="-1">SURES</text>
                   <text x="60" y="52" fontFamily="Arial, sans-serif" fontWeight="600" fontSize="8" className="logo-fill" letterSpacing="3.5">CLIMATIZACION</text>
                 </svg>
              </div>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-gray-300 text-white shadow-sm`}
              >
                {link.name}
              </a>
            ))}
            <a 
              href={`tel:${COMPANY_INFO.phone1}`}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 shadow-lg bg-white text-sures-primary hover:bg-gray-100`}
            >
              <Phone size={16} />
              <span>Llamar</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md transition-colors text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-panel-dark border-t border-white/10 animate-fade-in">
          <div className="px-4 pt-2 pb-8 space-y-1 sm:px-3 flex flex-col items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-3 py-4 text-white hover:bg-white/10 rounded-md text-lg font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;