import React, { useState } from 'react';
import { COMPANY_INFO } from '../constants';
import { MapPin, Phone, Mail, Clock, AlertCircle, MessageCircle, Send, ArrowRight, CheckCircle2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', phone: '', email: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre completo es obligatorio.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Por favor, ingrese un correo válido.';
      isValid = false;
    }

    const phoneRegex = /^[+]?[\d\s-]{6,}$/;
    if (formData.phone.trim() && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Por favor, ingrese un número de teléfono válido.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const mensaje = `¡Hola SURES! 👋

*Nombre:* ${formData.name}
${formData.phone ? `*Teléfono:* ${formData.phone}\n` : ''}*Email:* ${formData.email}

*Consulta:*
${formData.message || 'Me gustaría recibir más información.'}`;

      const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
      window.open(whatsappUrl, '_blank');
      
      setFormData({ name: '', phone: '', email: '', message: '' });
    }
  };

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY_INFO.address)}`;

  const contactInfo = [
    { 
      icon: MapPin, 
      title: 'Ubicación', 
      content: COMPANY_INFO.address,
      href: mapLink,
      external: true
    },
    { 
      icon: Phone, 
      title: 'Teléfonos', 
      content: [COMPANY_INFO.phone1, COMPANY_INFO.phone2],
      href: `tel:+5491132401124`
    },
    { 
      icon: Mail, 
      title: 'Email', 
      content: COMPANY_INFO.email,
      href: `mailto:${COMPANY_INFO.email}`
    },
    { 
      icon: Clock, 
      title: 'Horarios', 
      content: 'Lunes a Viernes de 08:00 a 17:00hs'
    }
  ];

  return (
    <section className="relative py-32 bg-sures-dark overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-sures-primary/5 rounded-full blur-[120px]" />
      
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Send className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-semibold uppercase tracking-widest">Contacto</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Hablemos de tu <span className="gradient-text">Proyecto</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Estamos listos para asesorarte. Completá el formulario y un representante se comunicará a la brevedad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Form - Takes 3 columns */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-3xl p-8 md:p-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Name */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Nombre Completo <span className="text-emerald-400">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-4 rounded-xl bg-white/5 border text-white placeholder-gray-500 outline-none transition-all ${
                      errors.name 
                        ? 'border-red-500 bg-red-500/5' 
                        : focusedField === 'name'
                          ? 'border-sures-accent ring-2 ring-sures-accent/20'
                          : 'border-white/10 hover:border-white/20'
                    }`}
                    placeholder="Juan Pérez"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.name}
                    </p>
                  )}
                </div>
                
                {/* Phone & Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Teléfono</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-5 py-4 rounded-xl bg-white/5 border text-white placeholder-gray-500 outline-none transition-all ${
                        errors.phone 
                          ? 'border-red-500 bg-red-500/5' 
                          : focusedField === 'phone'
                            ? 'border-sures-accent ring-2 ring-sures-accent/20'
                            : 'border-white/10 hover:border-white/20'
                      }`}
                      placeholder="11 1234 5678"
                    />
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email <span className="text-emerald-400">*</span>
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-5 py-4 rounded-xl bg-white/5 border text-white placeholder-gray-500 outline-none transition-all ${
                        errors.email 
                          ? 'border-red-500 bg-red-500/5' 
                          : focusedField === 'email'
                            ? 'border-sures-accent ring-2 ring-sures-accent/20'
                            : 'border-white/10 hover:border-white/20'
                      }`}
                      placeholder="juan@ejemplo.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Consulta</label>
                  <textarea 
                    name="message"
                    rows={4} 
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-4 rounded-xl bg-white/5 border text-white placeholder-gray-500 outline-none transition-all resize-none ${
                      focusedField === 'message'
                        ? 'border-sures-accent ring-2 ring-sures-accent/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    placeholder="Escribí tu mensaje acá..."
                  />
                </div>
                
                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="group w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-3"
                >
                  <MessageCircle size={20} />
                  Enviar por WhatsApp
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                {/* Trust Badge */}
                <div className="flex items-center justify-center gap-2 pt-2 text-sm text-gray-500">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  Respuesta en menos de 24hs hábiles
                </div>
              </form>
            </div>
          </div>

          {/* Info Sidebar - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <div 
                  key={index}
                  className="glass-card rounded-2xl p-5 hover-card group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-sures-primary to-sures-accent">
                      <item.icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white mb-1">{item.title}</p>
                      {Array.isArray(item.content) ? (
                        <div className="space-y-1">
                          {item.content.map((c, i) => (
                            <a 
                              key={i}
                              href={`tel:${c.replace(/\s/g, '')}`}
                              className="block text-sm text-gray-400 hover:text-sures-accent transition-colors"
                            >
                              {c}
                            </a>
                          ))}
                        </div>
                      ) : item.href ? (
                        <a 
                          href={item.href}
                          target={item.external ? '_blank' : undefined}
                          rel={item.external ? 'noopener noreferrer' : undefined}
                          className="text-sm text-gray-400 hover:text-sures-accent transition-colors"
                        >
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-400">{item.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
             
            {/* Map */}
            <div className="relative rounded-2xl overflow-hidden group h-48">
              <img 
                src="/maps.jpg" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                alt="Ubicación de SURES" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sures-dark via-sures-dark/50 to-transparent" />
              <div className="absolute inset-0 flex items-end justify-center pb-6">
                <a 
                  href={mapLink}
                  target="_blank" 
                  rel="noreferrer"
                  className="px-5 py-2.5 glass-card text-white text-sm font-medium rounded-full hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <MapPin size={16} className="text-sures-accent" />
                  Ver en Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
