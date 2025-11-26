import React, { useState, useEffect } from "react";
import { Menu, X, Phone, Sparkles, ChevronRight } from "lucide-react";

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
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? "py-2 glass-panel-dark shadow-lg shadow-black/20" 
          : "bg-gradient-to-b from-sures-dark/80 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <img
              src="/logo-sures.png"
              alt="Sures Climatización"
              className={`transition-all duration-300 ${scrolled ? "h-10" : "h-12"}`}
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all group"
              >
                {link.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-sures-primary to-sures-accent group-hover:w-2/3 transition-all duration-300" />
              </a>
            ))}

            {/* AI Advisor - Highlighted */}
            <a
              href="#advisor"
              className="group flex items-center gap-2 px-4 py-2 ml-2 text-sm font-semibold rounded-full glass-card text-white hover:bg-white/10 transition-all animated-border"
            >
              <Sparkles size={14} className="text-amber-400" />
              Asesor IA
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-sures-dark rounded">
                NUEVO
              </span>
            </a>

            {/* Contact */}
            <a
              href="#contact"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all"
            >
              Contacto
            </a>

            {/* CTA Button */}
            <a
              href="tel:+5491132401768"
              className="group flex items-center gap-2 px-5 py-2.5 ml-3 rounded-full text-sm font-bold transition-all bg-gradient-to-r from-sures-primary to-sures-accent text-white hover:shadow-lg hover:shadow-sures-primary/30 hover:-translate-y-0.5"
            >
              <Phone size={14} />
              <span>Llamar</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <a
              href="tel:+5491132401768"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-sures-primary to-sures-accent text-white"
            >
              <Phone size={18} />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl glass-card text-white hover:bg-white/10 transition-all"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden absolute top-full left-0 w-full glass-panel-dark border-t border-white/5 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-4 py-6 space-y-2">
          {navLinks.map((link, i) => (
            <a
              key={link.name}
              href={link.href}
              onClick={handleLinkClick}
              className="flex items-center justify-between px-4 py-3 text-white hover:bg-white/5 rounded-xl text-base font-medium transition-all"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {link.name}
              <ChevronRight size={16} className="text-gray-500" />
            </a>
          ))}

          {/* AI Advisor - Mobile */}
          <a
            href="#advisor"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-4 py-3 text-white glass-card rounded-xl text-base font-semibold transition-all"
          >
            <Sparkles size={18} className="text-amber-400" />
            <span className="flex-1">Asesor Inteligente</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-sures-dark rounded">
              NUEVO
            </span>
          </a>

          {/* Contact - Mobile */}
          <a
            href="#contact"
            onClick={handleLinkClick}
            className="flex items-center justify-between px-4 py-3 text-white hover:bg-white/5 rounded-xl text-base font-medium transition-all"
          >
            Contacto
            <ChevronRight size={16} className="text-gray-500" />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
