import React from 'react';
import { COMPANY_INFO } from '../constants';

const WhatsAppFloat: React.FC = () => {
  const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsapp}?text=Hola%20Sures,%20quisiera%20asesoramiento%20sobre%20climatización.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 group"
      aria-label="Contactar por WhatsApp"
    >
      <div className="relative flex items-center justify-center p-4 bg-[#25D366] rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[#25D366]/40">
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        
        {/* WhatsApp SVG Icon */}
        <svg 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="white" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          <path d="M17.472 14.382C17.112 14.202 15.344 13.332 15.016 13.212C14.688 13.092 14.448 13.032 14.208 13.392C13.968 13.752 13.28 14.562 13.064 14.802C12.856 15.042 12.632 15.072 12.272 14.892C11.912 14.712 10.752 14.332 9.376 13.102C8.288 12.132 7.552 10.932 7.336 10.562C7.12 10.192 7.312 9.992 7.496 9.812C7.656 9.652 7.848 9.392 8.024 9.192C8.2 8.992 8.256 8.842 8.376 8.602C8.496 8.362 8.432 8.152 8.344 7.972C8.256 7.792 7.552 6.062 7.256 5.362C6.968 4.682 6.672 4.772 6.456 4.772C6.264 4.772 6.04 4.772 5.816 4.772C5.592 4.772 5.232 4.862 4.928 5.192C4.624 5.522 3.768 6.332 3.768 7.982C3.768 9.632 4.944 11.222 5.112 11.442C5.28 11.662 7.424 14.972 10.712 16.392C11.496 16.732 12.104 16.932 12.584 17.082C13.432 17.352 14.208 17.312 14.824 17.222C15.512 17.122 16.936 16.362 17.232 15.522C17.528 14.682 17.528 13.972 17.472 13.882C17.416 13.792 17.176 13.732 16.816 13.552H17.472V14.382ZM12.008 24C16.328 24 20.072 21.682 22.184 18.042C24.296 14.402 24.296 9.882 22.184 6.242C20.072 2.602 16.328 0.282 12.008 0.282C7.688 0.282 3.944 2.602 1.832 6.242C-0.28 9.882 -0.28 14.402 1.832 18.042L0.28 23.722L6.104 22.192C7.848 23.352 9.896 24 12.008 24Z" />
        </svg>
      </div>

      {/* Tooltip */}
      <div className="absolute left-16 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 px-3 py-1.5 rounded-lg shadow-lg text-sm font-semibold whitespace-nowrap pointer-events-none">
        Consultar por WhatsApp
      </div>
    </a>
  );
};

export default WhatsAppFloat;