import React, { useState } from 'react';
import { COMPANY_INFO } from '../constants';
import { MapPin, Phone, Mail, Clock, AlertCircle, MessageCircle } from 'lucide-react';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', phone: '', email: '' };

    // Name Validation
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre completo es obligatorio.';
      isValid = false;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Por favor, ingrese un correo válido.';
      isValid = false;
    }

    // Phone Validation (Format check if provided)
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
      // Construir mensaje de WhatsApp
      const mensaje = `¡Hola SURES! 👋

*Nombre:* ${formData.name}
${formData.phone ? `*Teléfono:* ${formData.phone}\n` : ''}*Email:* ${formData.email}

*Consulta:*
${formData.message || 'Me gustaría recibir más información.'}`;

      // Abrir WhatsApp con el mensaje
      const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
      window.open(whatsappUrl, '_blank');
      
      // Limpiar formulario
      setFormData({ name: '', phone: '', email: '', message: '' });
    }
  };

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY_INFO.address)}`;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Form */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contacto</h2>
            <p className="text-gray-500 mb-8">Estamos listos para asesorarlo. Complete el formulario y un representante se comunicará a la brevedad.</p>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-sures-primary focus:border-transparent outline-none transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="Juan Pérez"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.name}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-sures-primary focus:border-transparent outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      placeholder="11 1234 5678"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-sures-primary focus:border-transparent outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      placeholder="juan@ejemplo.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consulta</label>
                  <textarea 
                    name="message"
                    rows={4} 
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sures-primary focus:border-transparent outline-none transition-all"
                    placeholder="Escriba su mensaje aquí..."
                  ></textarea>
                </div>
                
                <button type="submit" className="w-full py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30 flex items-center justify-center gap-3">
                  <MessageCircle size={22} />
                  Enviar por WhatsApp
                </button>
              </form>
          </div>

          {/* Info & Map */}
          <div className="space-y-8">
             <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Información de Contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-sures-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Ubicación</p>
                      <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-sures-primary transition-colors hover:underline">
                        {COMPANY_INFO.address}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="text-sures-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Teléfonos</p>
                      <div className="flex flex-col gap-1">
                        <a href={`tel:+5491132401124`} className="text-gray-500 hover:text-sures-primary transition-colors hover:underline">
                          {COMPANY_INFO.phone1}
                        </a>
                        <a href={`tel:+5491132401768`} className="text-gray-500 hover:text-sures-primary transition-colors hover:underline">
                          {COMPANY_INFO.phone2}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="text-sures-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a href={`mailto:${COMPANY_INFO.email}`} className="text-gray-500 hover:text-sures-primary transition-colors hover:underline">
                        {COMPANY_INFO.email}
                      </a>
                    </div>
                  </div>
                   <div className="flex items-start gap-4">
                    <Clock className="text-sures-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Horarios</p>
                      <p className="text-gray-500">Lunes a Viernes de 08:00 a 17:00hs</p>
                    </div>
                  </div>
                </div>
             </div>
             
             {/* Map Section */}
             <div className="w-full h-64 bg-gray-200 rounded-2xl overflow-hidden relative group">
                <img 
                  src="/maps.jpg" 
                  className="w-full h-full object-cover transition-all group-hover:scale-105" 
                  alt="Ubicación de SURES" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <a 
                    href={mapLink}
                    target="_blank" 
                    rel="noreferrer"
                    className="px-6 py-3 bg-white/90 backdrop-blur text-sures-primary font-bold rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    <MapPin size={18} />
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