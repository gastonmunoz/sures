import React, { useState, useEffect } from "react";
import { Menu, X, Phone, Sparkles } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { name: "Inicio", href: "#home" },
    { name: "Nosotros", href: "#about" },
    { name: "Servicios", href: "#services" },
    { name: "Catálogo", href: "#catalog" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "glass-panel-dark py-2 shadow-lg" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <a href="#home" className="flex items-center gap-2 group">
              <img
                src="/logo-sures.png"
                alt="Sures Climatización"
                className={`transition-all duration-300 transform origin-left group-hover:scale-105 ${
                  scrolled ? "h-10" : "h-12"
                }`}
              />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-white hover:text-white/80 transition-colors rounded-lg hover:bg-white/10"
              >
                {link.name}
              </a>
            ))}

            {/* Smart Advisor Link - Destacado */}
            <a
              href="#advisor"
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20"
            >
              <Sparkles size={16} className="text-yellow-300" />
              Asesor IA
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-yellow-400 text-gray-900 rounded">
                NUEVO
              </span>
            </a>

            {/* Contact Link */}
            <a
              href="#contact"
              className="px-4 py-2 text-sm font-medium text-white hover:text-white/80 transition-colors rounded-lg hover:bg-white/10"
            >
              Contacto
            </a>

            {/* CTA Button */}
            <a
              href="tel:+5491132401768"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 shadow-lg bg-white text-sures-primary hover:bg-gray-100 ml-2"
            >
              <Phone size={16} />
              <span>Llamar</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <a
              href="tel:+5491132401768"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-sures-primary"
            >
              <Phone size={18} />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-colors text-white hover:bg-white/10"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full glass-panel-dark border-t border-white/10 animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className="block px-4 py-3 text-white hover:bg-white/10 rounded-xl text-base font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}

            {/* Smart Advisor Link - Destacado */}
            <a
              href="#advisor"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-4 py-3 text-white bg-white/10 hover:bg-white/20 rounded-xl text-base font-bold transition-colors border border-white/20"
            >
              <Sparkles size={18} className="text-yellow-300" />
              Asesor Inteligente
              <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-400 text-gray-900 rounded ml-auto">
                NUEVO
              </span>
            </a>

            {/* Contact Link */}
            <a
              href="#contact"
              onClick={handleLinkClick}
              className="block px-4 py-3 text-white hover:bg-white/10 rounded-xl text-base font-medium transition-colors"
            >
              Contacto
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
