import React from 'react';
import { 
  X, 
  Heart, 
  Trash2, 
  MessageCircle, 
  Snowflake, 
  Zap,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { Product } from '../types';
import { COMPANY_INFO } from '../constants';

interface FavoritesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Product[];
  onRemove: (productId: string) => void;
  onClear: () => void;
}

const FavoritesPanel: React.FC<FavoritesPanelProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemove,
  onClear,
}) => {
  // Generate WhatsApp link with all favorites
  const getWhatsAppLink = () => {
    const productList = favorites.map(p => `• ${p.name} (${p.frigorias} fg)`).join('\n');
    const message = `Hola Sures! Me interesan estos equipos que guardé en favoritos:

${productList}

¿Me pueden pasar precio y disponibilidad?`;
    
    return `https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  // Check if product is inverter
  const isInverter = (product: Product) => 
    product.features.some(f => f.toLowerCase().includes('inverter')) || 
    product.name.toLowerCase().includes('inverter');

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-full max-w-md bg-white shadow-2xl z-[60] animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-xl">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Mis Favoritos</h2>
              <p className="text-sm text-gray-500">
                {favorites.length}{" "}
                {favorites.length === 1 ? "producto" : "productos"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tenés favoritos todavía
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Tocá el corazón en los productos que te interesen para
                guardarlos acá
              </p>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-3 bg-sures-primary text-white rounded-xl font-medium hover:bg-sures-dark transition-colors"
              >
                <ShoppingBag size={18} />
                Ver Catálogo
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {favorites.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-colors"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-white rounded-xl flex-shrink-0 p-2 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full w-auto object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                      {product.name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        <Snowflake size={10} />
                        {product.frigorias} fg
                      </span>
                      {isInverter(product) && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          <Zap size={10} />
                          Inverter
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemove(product.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Quitar de favoritos"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with CTAs */}
        {favorites.length > 0 && (
          <div className="p-4 border-t border-gray-100 space-y-3">
            {/* Clear All */}
            <button
              onClick={onClear}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
              Vaciar lista
            </button>

            {/* WhatsApp CTA */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-bold transition-all shadow-lg shadow-green-500/20 hover:shadow-xl"
            >
              <MessageCircle size={20} />
              Consultá por tus favoritos
              <ArrowRight size={18} />
            </a>
          </div>
        )}
      </div>

      {/* Custom animation */}
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default FavoritesPanel;

