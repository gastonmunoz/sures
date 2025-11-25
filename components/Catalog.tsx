import React, { useState, useMemo, useEffect } from 'react';
import { PRODUCTS, COMPANY_INFO } from '../constants';
import { Product } from '../types';
import { Search, Info, Filter, X, Zap, Thermometer, ChevronLeft, ChevronRight, LayoutGrid, Snowflake, Scale, CheckSquare, Square, Trash2, Home, Building2, SlidersHorizontal, Check, MessageCircle, Ruler, Weight, Plug, Wind, Box } from 'lucide-react';

const Catalog: React.FC = () => {
  // Search & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'residential' | 'commercial'>('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRange, setSelectedRange] = useState('all');
  const [isInverterOnly, setIsInverterOnly] = useState(false);

  // Comparison State
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Detail Modal State
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedType, selectedRange, isInverterOnly, itemsPerPage]);

  // --- Derived Data for Filters ---

  // 1. Get Types based on selected Category
  const availableTypes = useMemo(() => {
    let productsToScan = PRODUCTS;
    if (selectedCategory !== 'all') {
      productsToScan = PRODUCTS.filter(p => p.category === selectedCategory);
    }
    const types = new Set(productsToScan.map(p => p.type));
    return Array.from(types).sort();
  }, [selectedCategory]);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // 1. Search Text (Name or Type)
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.type.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Category Filter
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      // 3. Type Filter
      const matchesType = selectedType === 'all' || product.type === selectedType;

      // 4. Inverter Filter (Simplified "Feature" filter)
      const isProductInverter = product.features.some(f => f.toLowerCase().includes('inverter')) || product.name.toLowerCase().includes('inverter');
      const matchesInverter = !isInverterOnly || isProductInverter;

      // 5. Frigorias Range
      let matchesRange = true;
      if (selectedRange === 'low') matchesRange = product.frigorias < 3000;
      if (selectedRange === 'mid') matchesRange = product.frigorias >= 3000 && product.frigorias <= 5500;
      if (selectedRange === 'high') matchesRange = product.frigorias > 5500;

      return matchesSearch && matchesCategory && matchesType && matchesRange && matchesInverter;
    });
  }, [searchTerm, selectedCategory, selectedType, selectedRange, isInverterOnly]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedRange('all');
    setIsInverterOnly(false);
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || selectedType !== 'all' || selectedRange !== 'all' || isInverterOnly;

  // Scroll to top of catalog when page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const catalogSection = document.getElementById('catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Comparison Logic
  const toggleCompare = (product: Product) => {
    if (compareList.find(p => p.id === product.id)) {
      setCompareList(prev => prev.filter(p => p.id !== product.id));
    } else {
      if (compareList.length >= 3) return;
      setCompareList(prev => [...prev, product]);
    }
  };

  const isInCompare = (productId: string) => !!compareList.find(p => p.id === productId);

  // Helper to check inverter status
  const checkInverter = (product: Product) => 
    product.features.some(f => f.toLowerCase().includes('inverter')) || 
    product.name.toLowerCase().includes('inverter');

  // WhatsApp Smart Link Generator
  const getWhatsAppLink = (productName: string) => {
    const message = `Hola Sures, estoy viendo el equipo ${productName} y quisiera consultar precio y disponibilidad.`;
    return `https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="py-24 bg-gray-900 text-white min-h-screen relative" id="catalog-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Catálogo <span className="text-sures-primary">Sures</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            Encuentre el equipo ideal. Tecnología inverter, eficiencia y diseño superior para su confort.
          </p>
        </div>

        {/* --- DYNAMIC FILTER BAR --- */}
        <div className="max-w-5xl mx-auto mb-10">
          
          {/* Top Bar: Search + Filter Toggle */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-sures-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Buscar por modelo, nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sures-primary/50 focus:bg-white/10 transition-all backdrop-blur-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all border ${
                showFilters 
                  ? 'bg-sures-primary border-sures-primary text-white shadow-lg shadow-sures-primary/20' 
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal size={20} />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>

          {/* Collapsible Filter Panel */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 backdrop-blur-md">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                
                {/* 1. Category Segmented Control */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Categoría Principal</label>
                  <div className="flex p-1 bg-black/20 rounded-xl overflow-hidden w-full sm:w-fit">
                    {[
                      { id: 'all', label: 'Todo', icon: LayoutGrid },
                      { id: 'residential', label: 'Residencial', icon: Home },
                      { id: 'commercial', label: 'Comercial', icon: Building2 }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id as any);
                          setSelectedType('all'); // Reset type when category changes
                        }}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                          selectedCategory === cat.id 
                            ? 'bg-white text-sures-dark shadow-md' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <cat.icon size={16} />
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Dynamic Types */}
                <div className="col-span-1 md:col-span-2">
                  <div className="flex justify-between items-center mb-3">
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo de Equipo</label>
                     {selectedType !== 'all' && (
                        <button onClick={() => setSelectedType('all')} className="text-xs text-sures-primary hover:underline">Limpiar</button>
                     )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(selectedType === type ? 'all' : type)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          selectedType === type
                            ? 'bg-sures-primary/20 border-sures-primary text-sures-primary'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Capacity Range */}
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Capacidad</label>
                   <div className="space-y-2">
                      {[
                        { id: 'all', label: 'Cualquier capacidad' },
                        { id: 'low', label: 'Pequeños (< 3000 fg)' },
                        { id: 'mid', label: 'Medianos (3000-5500 fg)' },
                        { id: 'high', label: 'Grandes (> 5500 fg)' }
                      ].map((range) => (
                        <button
                          key={range.id}
                          onClick={() => setSelectedRange(range.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                             selectedRange === range.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'
                          }`}
                        >
                          {range.label}
                          {selectedRange === range.id && <Check size={14} className="text-sures-primary" />}
                        </button>
                      ))}
                   </div>
                </div>

                {/* 4. Tech / Features */}
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tecnología</label>
                   <button
                     onClick={() => setIsInverterOnly(!isInverterOnly)}
                     className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        isInverterOnly 
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-emerald-500/30'
                     }`}
                   >
                     <div className={`p-2 rounded-full ${isInverterOnly ? 'bg-emerald-500 text-white' : 'bg-white/10'}`}>
                        <Zap size={18} className={isInverterOnly ? 'fill-current' : ''} />
                     </div>
                     <div className="text-left">
                        <span className="block text-sm font-bold">Solo Inverter</span>
                        <span className="block text-[10px] opacity-70">Máximo ahorro energético</span>
                     </div>
                   </button>
                </div>

              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
             <div className="flex items-center gap-4">
                <span className="text-white font-bold text-lg">{filteredProducts.length} <span className="text-gray-400 font-normal text-base">resultados encontrados</span></span>
                
                {hasActiveFilters && (
                  <button 
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-1 bg-red-500/10 rounded-full"
                  >
                    <X size={14} />
                    Limpiar todo
                  </button>
                )}
             </div>

             <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Mostrar:</span>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-gray-300 focus:outline-none focus:border-sures-primary"
                >
                  <option value={9} className="bg-gray-800">9</option>
                  <option value={12} className="bg-gray-800">12</option>
                  <option value={24} className="bg-gray-800">24</option>
                </select>
             </div>
          </div>
        </div>

        {/* Product Grid */}
        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProducts.map((product, index) => {
                const isInverter = checkInverter(product);
                const isSelected = isInCompare(product.id);

                return (
                  <div 
                    key={product.id}
                    className="animate-slide-up h-full"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Glassmorphic Card Container */}
                    <div className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white/5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl hover:shadow-sures-primary/20 ${isSelected ? 'border-sures-primary ring-1 ring-sures-primary' : 'border-white/10'}`}>
                      
                      {/* Compare Checkbox (Top Left) */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleCompare(product); }}
                        className={`absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-all backdrop-blur-md ${
                          isSelected 
                            ? 'bg-sures-primary text-white shadow-lg' 
                            : 'bg-black/40 text-gray-300 hover:bg-white hover:text-sures-primary'
                        }`}
                      >
                        {isSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                        {isSelected ? 'Seleccionado' : 'Comparar'}
                      </button>

                      {/* Image Section */}
                      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-white/10 to-transparent p-6">
                        {/* Radial Glow on Hover */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                        
                        {/* Inverter Badge */}
                        {isInverter && (
                          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                            <Zap size={10} className="fill-current" />
                            Inverter
                          </div>
                        )}

                        {/* Product Type Badge */}
                        <div className="absolute top-4 right-4 z-10 rounded-md bg-black/40 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-gray-300 backdrop-blur-md">
                          {product.type}
                        </div>

                        <img 
                          src={product.image} 
                          alt={product.name} 
                          loading="lazy"
                          decoding="async"
                          className="relative z-0 max-h-full w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-2 mix-blend-multiply filter drop-shadow-xl" 
                        />
                      </div>
                      
                      {/* Content Section */}
                      <div className="flex flex-1 flex-col p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold leading-tight text-white transition-colors group-hover:text-sures-primary">
                            {product.name}
                          </h3>
                        </div>
                        
                        {/* Stats Row */}
                        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4 text-xs font-medium text-gray-400">
                          {product.frigorias > 0 ? (
                             <div className="flex items-center gap-2">
                                <div className="rounded-full bg-blue-500/20 p-1.5 text-blue-400">
                                   <Snowflake size={14} />
                                </div>
                                <span>{product.frigorias} Frigorías</span>
                             </div>
                          ) : (
                            <div className="flex items-center gap-2">
                                <div className="rounded-full bg-orange-500/20 p-1.5 text-orange-400">
                                   <Thermometer size={14} />
                                </div>
                                <span>Calefacción</span>
                             </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                             <div className="rounded-full bg-purple-500/20 p-1.5 text-purple-400">
                                <Zap size={14} />
                             </div>
                             <span>{product.kcal} Kcal/h</span>
                          </div>
                        </div>
                        
                        {/* Features List */}
                        <div className="mb-6 flex-1 space-y-2.5">
                          {product.features.slice(0, 3).map((feat, i) => (
                            <div key={i} className="flex items-center text-sm text-gray-300">
                              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-sures-secondary group-hover:bg-sures-primary transition-colors"></span>
                              {feat}
                            </div>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {/* Ver Especificaciones Button */}
                            <button 
                              onClick={() => setViewingProduct(product)}
                              className="group/btn relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/20 bg-transparent py-3.5 text-xs font-bold text-white transition-all hover:border-sures-primary hover:bg-sures-primary hover:shadow-lg hover:shadow-sures-primary/25"
                            >
                              <span className="relative z-10 flex items-center gap-2">
                                <Info size={14} />
                                Info
                              </span>
                            </button>

                            {/* WhatsApp Smart Action */}
                            <a 
                                href={getWhatsAppLink(product.name)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-xs font-bold text-white transition-all hover:bg-[#128C7E] hover:shadow-lg hover:scale-105"
                                title="Consultar por WhatsApp"
                            >
                                <MessageCircle size={16} fill="white" />
                                <span className="hidden xl:inline">Consultar</span>
                            </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-16 gap-2 animate-fade-in">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-sures-primary disabled:opacity-30 disabled:hover:bg-white/5 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex gap-2 mx-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
                    if (
                      number === 1 ||
                      number === totalPages ||
                      (number >= currentPage - 1 && number <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={number}
                          onClick={() => handlePageChange(number)}
                          className={`w-10 h-10 rounded-full text-sm font-bold border transition-all ${
                            currentPage === number
                              ? 'bg-sures-primary border-sures-primary text-white scale-110 shadow-lg shadow-sures-primary/30'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {number}
                        </button>
                      );
                    } else if (
                      number === currentPage - 2 ||
                      number === currentPage + 2
                    ) {
                      return <span key={number} className="text-gray-600 self-end px-1">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-sures-primary disabled:opacity-30 disabled:hover:bg-white/5 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
             <div className="bg-white/5 p-6 rounded-full mb-4">
                <Search className="h-10 w-10 text-gray-500" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">No se encontraron resultados</h3>
             <p className="text-gray-400 max-w-md mx-auto">
               Intente ajustar los filtros o buscar con otros términos.
             </p>
             <button 
               onClick={clearFilters}
               className="mt-6 px-6 py-2 bg-sures-primary text-white rounded-full font-medium hover:bg-sures-dark transition-colors"
             >
               Limpiar Filtros
             </button>
          </div>
        )}
      </div>

      {/* Comparison Floating Bar (Dock) */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
          <div className="flex items-center gap-4 bg-gray-900/90 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sures-primary text-sm font-bold text-white">
                {compareList.length}
              </span>
              <span className="text-sm font-medium text-white">
                Producto{compareList.length > 1 ? 's' : ''} seleccionado{compareList.length > 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="h-6 w-px bg-white/20"></div>

            <button 
              onClick={() => setIsCompareOpen(true)}
              disabled={compareList.length < 2}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Scale size={16} />
              Comparar ahora
            </button>

            <button 
              onClick={() => setCompareList([])}
              className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
             onClick={() => setViewingProduct(null)}
           ></div>

           {/* Modal Content */}
           <div className="relative bg-gray-900 border border-white/10 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col md:flex-row animate-slide-up">
              
              {/* Close Button Mobile */}
              <button 
                onClick={() => setViewingProduct(null)}
                className="absolute top-4 right-4 z-20 rounded-full bg-black/40 p-2 text-white hover:bg-white/20 md:hidden"
              >
                <X size={20} />
              </button>

              {/* Left Column: Image */}
              <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex items-center justify-center relative">
                 <img 
                   src={viewingProduct.image} 
                   alt={viewingProduct.name} 
                   className="relative z-10 w-full max-h-[400px] object-contain"
                 />
                 {checkInverter(viewingProduct) && (
                    <div className="absolute bottom-6 left-6 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                      <Zap size={12} className="fill-current" />
                      Tecnología Inverter
                    </div>
                 )}
              </div>

              {/* Right Column: Details */}
              <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-blue-400 font-bold text-sm tracking-widest uppercase">{viewingProduct.type}</span>
                    <button 
                      onClick={() => setViewingProduct(null)}
                      className="hidden md:block rounded-full hover:bg-white/10 p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={24} />
                    </button>
                 </div>
                 
                 <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">{viewingProduct.name}</h2>

                 {/* Technical Specs Grid */}
                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                       <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs uppercase font-bold">
                          <Snowflake size={14} /> Capacidad Frío
                       </div>
                       <div className="text-white font-semibold text-lg">{viewingProduct.frigorias > 0 ? `${viewingProduct.frigorias} fg` : '-'}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                       <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs uppercase font-bold">
                          <Thermometer size={14} /> Capacidad Calor
                       </div>
                       <div className="text-white font-semibold text-lg">{viewingProduct.kcal ? `${viewingProduct.kcal} Kcal/h` : '-'}</div>
                    </div>
                    
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                       <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs uppercase font-bold">
                          <Plug size={14} /> Voltaje
                       </div>
                       <div className="text-white font-medium">{viewingProduct.voltage}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                       <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs uppercase font-bold">
                          <Wind size={14} /> Refrigerante
                       </div>
                       <div className="text-white font-medium">{viewingProduct.refrigerant || 'N/A'}</div>
                    </div>

                    {viewingProduct.dimensions && (
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 col-span-2">
                         <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs uppercase font-bold">
                            <Ruler size={14} /> Dimensiones
                         </div>
                         <div className="text-white font-medium text-sm">{viewingProduct.dimensions}</div>
                      </div>
                    )}
                 </div>

                 {/* Features List */}
                 <div className="mb-8 flex-1">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                       <Box size={18} className="text-sures-secondary" /> 
                       Características Principales
                    </h4>
                    <ul className="space-y-3">
                       {viewingProduct.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                             <Check className="text-sures-primary shrink-0 mt-0.5" size={16} />
                             {feature}
                          </li>
                       ))}
                    </ul>
                 </div>

                 {/* Modal CTA */}
                 <a 
                    href={getWhatsAppLink(viewingProduct.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#128C7E] hover:shadow-lg transition-all transform hover:-translate-y-1"
                 >
                    <MessageCircle size={24} />
                    Consultar Disponibilidad
                 </a>

              </div>
           </div>
        </div>
      )}

      {/* Comparison Modal */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl bg-gray-900 border border-white/10 shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6 bg-gray-900/50">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Scale className="text-sures-primary" />
                Comparador de Productos
              </h3>
              <button 
                onClick={() => setIsCompareOpen(false)}
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 hover:text-red-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="min-w-[800px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="w-1/4 p-4 text-left"></th>
                      {compareList.map(product => (
                        <th key={product.id} className="w-1/4 p-4 align-top">
                          <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-white/5 p-4">
                            <img src={product.image} alt={product.name} className="h-full w-full object-contain mix-blend-multiply" />
                            <button 
                              onClick={() => {
                                toggleCompare(product);
                                if (compareList.length <= 1) setIsCompareOpen(false);
                              }}
                              className="absolute top-2 right-2 rounded-full bg-black/40 p-1 text-white hover:bg-red-500/80"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <h4 className="text-lg font-bold text-white">{product.name}</h4>
                          <span className="text-sm text-sures-primary">{product.type}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-gray-300">
                    <tr>
                      <td className="p-4 font-bold text-white">Capacidad (Frío)</td>
                      {compareList.map(p => (
                        <td key={p.id} className="p-4 text-center">
                          {p.frigorias > 0 ? `${p.frigorias} fg` : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-white">Capacidad (Calor)</td>
                      {compareList.map(p => (
                        <td key={p.id} className="p-4 text-center">
                          {p.kcal ? `${p.kcal} Kcal/h` : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-white">Tecnología</td>
                      {compareList.map(p => (
                        <td key={p.id} className="p-4 text-center">
                          {checkInverter(p) ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                              <Zap size={12} /> INVERTER
                            </span>
                          ) : (
                            <span className="text-gray-500">Estándar (On/Off)</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-white">Gas Refrigerante</td>
                      {compareList.map(p => (
                        <td key={p.id} className="p-4 text-center">{p.refrigerant || 'N/A'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-white">Voltaje</td>
                      {compareList.map(p => (
                        <td key={p.id} className="p-4 text-center">{p.voltage}</td>
                      ))}
                    </tr>
                     <tr>
                      <td className="p-4 font-bold text-white">Dimensiones</td>
                      {compareList.map(p => (
                        <td key={p.id} className="p-4 text-center text-sm">{p.dimensions || 'Consultar manual'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-white align-top">Características</td>
                      {compareList.map(p => (
                        <td key={p.id} className="p-4 align-top">
                          <ul className="list-disc pl-4 text-left text-sm space-y-1">
                            {p.features.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-4 bg-gray-900 border-t border-white/10 text-center">
              <a 
                href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(`Hola Sures, me interesa recibir asesoramiento comparativo sobre: ${compareList.map(p => p.name).join(', ')}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E] transition-colors"
              >
                <MessageCircle size={20} />
                Consultar por estos modelos en WhatsApp
              </a>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

export default Catalog;