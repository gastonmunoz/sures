import { Product, ServiceItem } from './types';

export const LOGO_URL = "data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2225%22%20cy%3D%2230%22%20r%3D%2222%22%20stroke%3D%22black%22%20stroke-width%3D%223%22%20fill%3D%22none%22%2F%3E%3Ccircle%20cx%3D%2225%22%20cy%3D%2230%22%20r%3D%2216%22%20stroke%3D%22black%22%20stroke-width%3D%221%22%20opacity%3D%220.5%22%20fill%3D%22none%22%2F%3E%3Ctext%20x%3D%2258%22%20y%3D%2238%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2234%22%20fill%3D%22black%22%20letter-spacing%3D%22-1%22%3ESURES%3C%2Ftext%3E%3Ctext%20x%3D%2260%22%20y%3D%2252%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22600%22%20font-size%3D%228%22%20fill%3D%22black%22%20letter-spacing%3D%223.5%22%3ECLIMATIZACION%3C%2Ftext%3E%3C%2Fsvg%3E";

export const COMPANY_INFO = {
  name: "Sures",
  legalName: "Hijos y Nietos de Maria Asunción Cornejo S.R.L.",
  address: "Aristóbulo del Valle 2518, Lanús Oeste, Buenos Aires",
  phone1: "11 3240-1124",
  phone2: "11 3240-1768",
  whatsapp: "5491132401768",
  email: "administracion@sures.com.ar",
  dealers: ["Carrier", "Midea"],
  website: "www.sures.com.ar"
};

// --- Helper for Images ---
// Using placeholder service until client replaces with real images
const getPlaceholder = (text: string) => `https://placehold.co/600x400/f3f4f6/00007c?text=${encodeURIComponent(text)}`;

export const PRODUCTS: Product[] = [
  // --- VENTANA MIDEA ---
  {
    id: "midea-mcve09",
    name: "Midea Ventana 2250 Frío Solo",
    type: "Compacto de Ventana",
    frigorias: 2193,
    kcal: 2193,
    voltage: "220 V (50 hz)",
    power: "0,81 kW",
    refrigerant: "R-410A",
    weight: "34.7 kg", 
    dimensions: "60 x 38 x 56 cm",
    features: ["Modo Sleep", "Función Timer", "1 Año de Garantía", "Eficiencia B"],
    image: "/2250 FRIO SOLO MIDEA.jpg", 
    category: "residential"
  },
  {
    id: "midea-mcve12",
    name: "Midea Ventana 3000 Frío Solo",
    type: "Compacto de Ventana",
    frigorias: 3000,
    kcal: 3010,
    voltage: "220 V (50 hz)",
    power: "1,14 kW",
    refrigerant: "R-410A",
    weight: "37 kg",
    dimensions: "60 x 38 x 56 cm",
    features: ["Modo Sleep", "Función Timer", "1 Año de Garantía", "Eficiencia B"],
    image: "/3000 FRIO SOLO MIDEA.jpg",
    category: "residential"
  },
  {
    id: "midea-mcve18",
    name: "Midea Ventana 4500 Frío Solo",
    type: "Compacto de Ventana",
    frigorias: 4438,
    kcal: 4438,
    voltage: "220 V (50 hz)",
    power: "1,66 kW",
    refrigerant: "R-410A",
    weight: "53 kg",
    dimensions: "68 x 42.8 x 66 cm",
    features: ["Modo Sleep", "Función Timer", "1 Año de Garantía", "Eficiencia B"],
    image: "/4500 FRIO SOLO MIDEA.webp",
    category: "residential"
  },

  // --- PISO TECHO CARRIER ELITE ---
  {
    id: "carrier-elite-3tr-mono",
    name: "Carrier Elite 3TR Monofásico",
    type: "Piso Techo",
    frigorias: 9000,
    kcal: 9000,
    voltage: "220 V (50 hz)",
    refrigerant: "R-410A",
    weight: "Cond: 80kg",
    dimensions: "Int: 128x23x67 cm",
    features: ["Compresor Scroll", "Diseño Moderno", "3 Años de Garantía", "Descarga Vertical"],
    image: "/3 TR MONOFASICO FRIO CALOR ELITE.jpg",
    category: "residential"
  },
  {
    id: "carrier-elite-3tr-tri",
    name: "Carrier Elite 3TR Trifásico",
    type: "Piso Techo",
    frigorias: 9000,
    kcal: 9000,
    voltage: "380 V (50 hz)",
    refrigerant: "R-410A",
    weight: "Cond: 77kg",
    dimensions: "Int: 128x23x67 cm",
    features: ["Trifásico", "Compresor Scroll", "3 Años de Garantía"],
    image: "/3 TR TRIFASICO FRIO CALOR ELITE.jpg",
    category: "residential"
  },
  {
    id: "carrier-elite-5tr",
    name: "Carrier Elite 5TR Inverter",
    type: "Piso Techo",
    frigorias: 15000,
    kcal: 15000,
    voltage: "380 V (50 hz)",
    refrigerant: "R-410A",
    weight: "Cond: 80kg",
    dimensions: "Int: 128x23x41 cm",
    features: ["Tecnología Inverter", "Wi-Fi Integrado", "Trifásico"],
    image: "/5 TR TRIFASICO FRIO CALOR ELITE.png",
    category: "commercial"
  },
  {
    id: "carrier-elite-6tr",
    name: "Carrier Elite 6TR Trifásico",
    type: "Piso Techo",
    frigorias: 18000,
    kcal: 18000,
    voltage: "380 V (50 hz)",
    refrigerant: "R-410A",
    weight: "Cond: 97kg",
    dimensions: "Int: 165x23x67 cm",
    features: ["Alta Capacidad", "Trifásico", "Eficiencia B"],
    image: "/6 TR TRIFASICO FRIO CALOR ELITE.webp",
    category: "commercial"
  },

  // --- PISO TECHO CARRIER INVERTER ---
  {
    id: "carrier-elite-inv-3tr",
    name: "Carrier Elite Inverter 3TR",
    type: "Piso Techo",
    frigorias: 9000,
    kcal: 9000,
    voltage: "220 V (50 hz)",
    refrigerant: "R-410A",
    weight: "Cond: 67kg",
    dimensions: "Int: 165x23x67 cm",
    features: ["Inverter", "Refrigerante Ecológico", "Súper Silencioso"],
    image: "/3 TR TRIFASICO FRIO CALOR ELITE INVERTER.jpg",
    category: "residential"
  },
  {
    id: "carrier-elite-inv-5tr-r32",
    name: "Carrier Elite Inverter 5TR R-32",
    type: "Piso Techo",
    frigorias: 15000,
    kcal: 15000,
    voltage: "380 V (50 hz)",
    refrigerant: "R-32",
    weight: "Cond: 76kg",
    dimensions: "Int: 165x23x41 cm",
    features: ["Gas R-32 Ecológico", "Inverter", "Wi-Fi"],
    image: "/5 TR TRIFASICO FRIO CALOR ELITE INVERTER R-32.png",
    category: "commercial"
  },
  {
    id: "carrier-elite-inv-6tr-r32",
    name: "Carrier Elite Inverter 6TR R-32",
    type: "Piso Techo",
    frigorias: 18000,
    kcal: 18000,
    voltage: "380 V (50 hz)",
    refrigerant: "R-32",
    weight: "Cond: 85kg",
    dimensions: "Int: 165x23x37 cm",
    features: ["Gas R-32 Ecológico", "Inverter", "Alta Eficiencia"],
    image: "/6 TR TRIFASICO FRIO CALOR ELITE INVERTER R-32.png",
    category: "commercial"
  },

  // --- MIDEA PISO TECHO / PARED ---
  {
    id: "midea-8750-inv",
    name: "Midea Inverter Smart 8750",
    type: "Piso Techo",
    frigorias: 9000,
    kcal: 8394,
    voltage: "220 V",
    refrigerant: "R-410A",
    weight: "Cond: 48kg",
    dimensions: "Int: 125x36x34 cm",
    features: ["Inverter", "Compatible Google/Alexa", "Gold Cover", "Función Gear"],
    image: "/8750 FRIO CALOR MIDEA INVERTER.jpg",
    category: "residential"
  },

  // --- SPLIT CARRIER XPOWER INVERTER R32 ---
  {
    id: "carrier-split-2250-r32",
    name: "Carrier XPower Inverter 2250 R-32",
    type: "Split",
    frigorias: 2356,
    kcal: 2492,
    voltage: "220 V",
    refrigerant: "R-32",
    features: ["Gas R-32", "Inverter", "Wi-Fi", "Ahorro 35%"],
    image: getPlaceholder("Carrier Split R32"),
    category: "residential"
  },
  {
    id: "carrier-split-3000-r32",
    name: "Carrier XPower Inverter 3000 R-32",
    type: "Split",
    frigorias: 3096,
    kcal: 2993,
    voltage: "220 V",
    refrigerant: "R-32",
    features: ["Gas R-32", "Inverter", "Wi-Fi", "Follow Me"],
    image: getPlaceholder("Carrier Split R32"),
    category: "residential"
  },
  {
    id: "carrier-split-4500-r32",
    name: "Carrier XPower Inverter 4500 R-32",
    type: "Split",
    frigorias: 4601,
    kcal: 4420,
    voltage: "220 V",
    refrigerant: "R-32",
    features: ["Gas R-32", "Inverter", "Wi-Fi", "Silver Ion Filter"],
    image: getPlaceholder("Carrier Split R32"),
    category: "residential"
  },
  {
    id: "carrier-split-5500-r32",
    name: "Carrier XPower Inverter 5500 R-32",
    type: "Split",
    frigorias: 5590,
    kcal: 5796,
    voltage: "220 V",
    refrigerant: "R-32",
    features: ["Gas R-32", "Inverter", "Wi-Fi", "Alta Potencia"],
    image: getPlaceholder("Carrier Split R32"),
    category: "residential"
  },

  // --- SPLIT MIDEA STANDARD ---
  {
    id: "midea-split-2250",
    name: "Midea Standard 2250",
    type: "Split",
    frigorias: 2348,
    kcal: 2245,
    voltage: "220 V",
    refrigerant: "R-410A",
    features: ["Led Display", "Gold Cover", "Modo Sleep", "Eficiencia A"],
    image: getPlaceholder("Midea Split"),
    category: "residential"
  },
  {
    id: "midea-split-3000",
    name: "Midea Standard 3000",
    type: "Split",
    frigorias: 2950,
    kcal: 2666,
    voltage: "220 V",
    refrigerant: "R-410A",
    features: ["Led Display", "Gold Cover", "Auto-limpieza"],
    image: getPlaceholder("Midea Split"),
    category: "residential"
  },
  {
    id: "midea-split-4300",
    name: "Midea Standard 4300",
    type: "Split",
    frigorias: 4420,
    kcal: 4162,
    voltage: "220 V",
    refrigerant: "R-410A",
    features: ["Led Display", "Gold Cover", "Alta Capacidad"],
    image: getPlaceholder("Midea Split"),
    category: "residential"
  },
  {
    id: "midea-split-5400",
    name: "Midea Standard 5400",
    type: "Split",
    frigorias: 5607,
    kcal: 5400,
    voltage: "220 V",
    refrigerant: "R-410A",
    features: ["Led Display", "Gold Cover", "Alta Potencia"],
    image: getPlaceholder("Midea Split"),
    category: "residential"
  },

  // --- SPLIT MIDEA INVERTER R32 ---
  {
    id: "midea-inv-r32-2250",
    name: "Midea Inverter 2250 R-32",
    type: "Split",
    frigorias: 2356,
    kcal: 2494,
    voltage: "220 V",
    refrigerant: "R-32",
    features: ["Gas R-32", "Inverter", "Wi-Fi", "Ahorro Energía"],
    image: getPlaceholder("Midea Inverter R32"),
    category: "residential"
  },
  {
    id: "midea-inv-r32-3000",
    name: "Midea Inverter 3000 R-32",
    type: "Split",
    frigorias: 3096,
    kcal: 2958,
    voltage: "220 V",
    refrigerant: "R-32",
    features: ["Gas R-32", "Inverter", "Wi-Fi"],
    image: getPlaceholder("Midea Inverter R32"),
    category: "residential"
  },
  {
    id: "midea-inv-r32-4500",
    name: "Midea Inverter 4500 R-32",
    type: "Split",
    frigorias: 4601,
    kcal: 4420,
    voltage: "220 V",
    refrigerant: "R-32",
    features: ["Gas R-32", "Inverter", "Wi-Fi"],
    image: getPlaceholder("Midea Inverter R32"),
    category: "residential"
  },
  {
    id: "midea-inv-r32-5500",
    name: "Midea Inverter 5500 R-32",
    type: "Split",
    frigorias: 5590,
    kcal: 5796,
    voltage: "220 V",
    refrigerant: "R-32",
    features: ["Gas R-32", "Inverter", "Wi-Fi"],
    image: getPlaceholder("Midea Inverter R32"),
    category: "residential"
  },

  // --- SPLIT MIDEA INVERTER (R410) ---
  {
    id: "midea-inv-3000",
    name: "Midea Inverter 3000",
    type: "Split",
    frigorias: 2967,
    kcal: 2967,
    voltage: "220 V",
    refrigerant: "R-410A",
    features: ["Inverter", "Gold Cover", "Wi-Fi", "High Density Filter"],
    image: getPlaceholder("Midea Inverter"),
    category: "residential"
  },
  {
    id: "midea-inv-4500",
    name: "Midea Inverter 4500",
    type: "Split",
    frigorias: 4400,
    kcal: 4400,
    voltage: "220 V",
    refrigerant: "R-410A",
    features: ["Inverter", "Gold Cover", "Wi-Fi"],
    image: getPlaceholder("Midea Inverter"),
    category: "residential"
  },

  // --- MIDEA BREEZELESS ---
  {
    id: "midea-breeze-3000",
    name: "Midea Breezeless E 3000",
    type: "Split",
    frigorias: 3139,
    kcal: 3300,
    voltage: "220 V",
    refrigerant: "R-32",
    features: ["Breezeless Technology", "Inverter", "Wi-Fi", "Micro-orificios"],
    image: getPlaceholder("Midea Breezeless"),
    category: "residential"
  },
  {
    id: "midea-breeze-5500",
    name: "Midea Breezeless E 5500",
    type: "Split",
    frigorias: 4859,
    kcal: 5000,
    voltage: "220 V",
    refrigerant: "R-32",
    features: ["Breezeless Technology", "Inverter", "Wi-Fi", "Alta Eficiencia"],
    image: getPlaceholder("Midea Breezeless"),
    category: "residential"
  },

  // --- COMERCIAL: BAJA SILUETA TRADICIONAL ---
  {
    id: "bs-trad-1.5",
    name: "Baja Silueta 1.5TR Monofásico",
    type: "Baja Silueta",
    frigorias: 4500,
    kcal: 4500,
    voltage: "220 V",
    refrigerant: "R-410A",
    features: ["Perfil Bajo", "Bajo Ruido", "Control Alámbrico"],
    image: getPlaceholder("Baja Silueta"),
    category: "commercial"
  },
  {
    id: "bs-trad-2",
    name: "Baja Silueta 2TR Monofásico",
    type: "Baja Silueta",
    frigorias: 6000,
    kcal: 6000,
    voltage: "220 V",
    refrigerant: "R-410A",
    features: ["Perfil Bajo", "Bajo Ruido"],
    image: getPlaceholder("Baja Silueta"),
    category: "commercial"
  },
  {
    id: "bs-trad-3",
    name: "Baja Silueta 3TR Monofásico",
    type: "Baja Silueta",
    frigorias: 9000,
    kcal: 9000,
    voltage: "220 V",
    refrigerant: "R-410A",
    features: ["Perfil Bajo", "Bajo Ruido"],
    image: getPlaceholder("Baja Silueta"),
    category: "commercial"
  },
  {
    id: "bs-trad-5",
    name: "Baja Silueta 5TR Trifásico",
    type: "Baja Silueta",
    frigorias: 15000,
    kcal: 15000,
    voltage: "380 V",
    refrigerant: "R-410A",
    features: ["Trifásico", "Alta Capacidad"],
    image: getPlaceholder("Baja Silueta"),
    category: "commercial"
  },
  {
    id: "bs-trad-6",
    name: "Baja Silueta 6TR Trifásico",
    type: "Baja Silueta",
    frigorias: 18000,
    kcal: 18000,
    voltage: "380 V",
    refrigerant: "R-410A",
    features: ["Trifásico", "Máxima Capacidad"],
    image: getPlaceholder("Baja Silueta"),
    category: "commercial"
  },

  // --- COMERCIAL: BAJA SILUETA INVERTER ---
  {
    id: "bs-inv-3",
    name: "Baja Silueta Inverter 3TR",
    type: "Baja Silueta",
    frigorias: 9000,
    kcal: 9000,
    voltage: "220 V",
    refrigerant: "R-410A",
    features: ["Inverter", "Wi-Fi", "Ahorro Energético"],
    image: getPlaceholder("Baja Silueta Inverter"),
    category: "commercial"
  },
  {
    id: "bs-inv-5",
    name: "Baja Silueta Inverter 5TR",
    type: "Baja Silueta",
    frigorias: 15000,
    kcal: 15000,
    voltage: "220 V",
    refrigerant: "R-410A",
    features: ["Inverter", "Wi-Fi", "Alta Eficiencia"],
    image: getPlaceholder("Baja Silueta Inverter"),
    category: "commercial"
  },
  {
    id: "bs-inv-6",
    name: "Baja Silueta Inverter 6TR",
    type: "Baja Silueta",
    frigorias: 18000,
    kcal: 18000,
    voltage: "220 V",
    refrigerant: "R-410A",
    features: ["Inverter", "Wi-Fi", "Máximo Rendimiento"],
    image: getPlaceholder("Baja Silueta Inverter"),
    category: "commercial"
  },

  // --- CONDUCTOS SEPARADOS ---
  {
    id: "cond-sep-5",
    name: "Sistema Conductos 5TR",
    type: "Conductos",
    frigorias: 15000,
    kcal: 15000,
    voltage: "380 V",
    refrigerant: "R-410A",
    features: ["Compresor Scroll", "Protección de Fase"],
    image: getPlaceholder("Conductos Separados"),
    category: "commercial"
  },
  {
    id: "cond-sep-6",
    name: "Sistema Conductos 6TR",
    type: "Conductos",
    frigorias: 18000,
    kcal: 18000,
    voltage: "380 V",
    refrigerant: "R-410A",
    features: ["Compresor Scroll", "Alta Durabilidad"],
    image: getPlaceholder("Conductos Separados"),
    category: "commercial"
  },
  {
    id: "cond-sep-7.5",
    name: "Sistema Conductos 7.5TR",
    type: "Conductos",
    frigorias: 23500,
    kcal: 23500,
    voltage: "380 V",
    refrigerant: "R-410A",
    features: ["Gran Capacidad", "Bajo Nivel Sonoro"],
    image: getPlaceholder("Conductos Separados"),
    category: "commercial"
  },
  {
    id: "cond-sep-10",
    name: "Sistema Conductos 10TR",
    type: "Conductos",
    frigorias: 30000,
    kcal: 30000,
    voltage: "380 V",
    refrigerant: "R-410A",
    features: ["Industrial", "Compresor Scroll"],
    image: getPlaceholder("Conductos Comercial"),
    category: "commercial"
  },
  {
    id: "cond-sep-12.5",
    name: "Sistema Conductos 12.5TR",
    type: "Conductos",
    frigorias: 37500,
    kcal: 37500,
    voltage: "380 V",
    refrigerant: "R-410A",
    features: ["Industrial", "Máxima Potencia"],
    image: getPlaceholder("Conductos Comercial"),
    category: "commercial"
  },

  // --- CALEFACTORES ---
  {
    id: "calefactor-100",
    name: "Calefactor a Gas 24.000 Kcal",
    type: "Calefactor",
    frigorias: 0,
    kcal: 24444,
    voltage: "220 V",
    power: "Gas",
    features: ["Eficiencia 93%", "Multiposición"],
    image: getPlaceholder("Calefactor Gas"),
    category: "commercial"
  },
  {
    id: "calefactor-120",
    name: "Calefactor a Gas 29.000 Kcal",
    type: "Calefactor",
    frigorias: 0,
    kcal: 29484,
    voltage: "220 V",
    power: "Gas",
    features: ["Eficiencia 93.6%", "Ignición Superficie Caliente"],
    image: getPlaceholder("Calefactor Gas"),
    category: "commercial"
  },
  {
    id: "calefactor-140",
    name: "Calefactor a Gas 34.000 Kcal",
    type: "Calefactor",
    frigorias: 0,
    kcal: 34020,
    voltage: "220 V",
    power: "Gas",
    features: ["Eficiencia 93.5%", "Alta Potencia"],
    image: getPlaceholder("Calefactor Gas"),
    category: "commercial"
  },

  // --- ROOFTOP ---
  {
    id: "rooftop-eco-5",
    name: "Rooftop Ecológico 5TR",
    type: "Rooftop",
    frigorias: 15000,
    kcal: 15000,
    voltage: "380 V",
    refrigerant: "R-407C",
    features: ["Calefactor a Gas", "Compresor Scroll"],
    image: getPlaceholder("Rooftop Ecológico"),
    category: "commercial"
  },
  {
    id: "rooftop-eco-6",
    name: "Rooftop Ecológico 6TR",
    type: "Rooftop",
    frigorias: 18000,
    kcal: 18000,
    voltage: "380 V",
    refrigerant: "R-407C",
    features: ["Calefactor a Gas", "Exterior"],
    image: getPlaceholder("Rooftop Ecológico"),
    category: "commercial"
  },
  {
    id: "rooftop-wm-10",
    name: "Rooftop Weathermaker 10TR",
    type: "Rooftop",
    frigorias: 30000,
    kcal: 30000,
    voltage: "380 V",
    refrigerant: "R-410A",
    features: ["Certificación LEED", "Alta Eficiencia"],
    image: getPlaceholder("Rooftop Weathermaker"),
    category: "commercial"
  },
  {
    id: "rooftop-wm-20",
    name: "Rooftop Weathermaker 20TR",
    type: "Rooftop",
    frigorias: 60000,
    kcal: 60000,
    voltage: "380 V",
    refrigerant: "R-410A",
    features: ["Certificación LEED", "Doble Circuito"],
    image: getPlaceholder("Rooftop Weathermaker"),
    category: "commercial"
  },
  {
    id: "rooftop-midea-8.5",
    name: "Midea Rooftop 8.5TR",
    type: "Rooftop",
    frigorias: 25500,
    kcal: 25500,
    voltage: "380 V",
    refrigerant: "R-410A",
    features: ["Instalación Simple", "Scroll Eficiente"],
    image: getPlaceholder("Midea Rooftop"),
    category: "commercial"
  },
  {
    id: "rooftop-midea-20",
    name: "Midea Rooftop 20TR",
    type: "Rooftop",
    frigorias: 60000,
    kcal: 60000,
    voltage: "380 V",
    refrigerant: "R-410A",
    features: ["Gran Capacidad", "Industrial"],
    image: getPlaceholder("Midea Rooftop"),
    category: "commercial"
  },

  // --- CHILLER ---
  {
    id: "chiller-6",
    name: "Chiller 6TR Trifásico",
    type: "Chiller",
    frigorias: 18000,
    kcal: 18000,
    voltage: "380 V",
    refrigerant: "R-410A",
    features: ["Control Touch", "Módulo Hidrónico"],
    image: getPlaceholder("Chiller"),
    category: "commercial"
  },
  {
    id: "chiller-10",
    name: "Chiller 10TR Trifásico",
    type: "Chiller",
    frigorias: 30000,
    kcal: 30000,
    voltage: "380 V",
    refrigerant: "R-410A",
    features: ["Alta Eficiencia", "Bajo Ruido"],
    image: getPlaceholder("Chiller"),
    category: "commercial"
  }
];

export const SERVICES: ServiceItem[] = [
  {
    title: "Venta e Instalación",
    description: "Comercialización y montaje de equipos individuales, centrales, fan-coil y chillers.",
    iconName: "ShoppingCart"
  },
  {
    title: "Mantenimiento Preventivo",
    description: "Planes a medida para empresas, consorcios y particulares. Limpieza de conductos y filtros.",
    iconName: "Wrench"
  },
  {
    title: "Proyectos y Balances",
    description: "Cálculo de balance térmico, asesoramiento profesional y diseño de sistemas de ventilación.",
    iconName: "ClipboardCheck"
  },
  {
    title: "Obras de Envergadura",
    description: "Especialistas en grandes superficies, laboratorios, centros de cómputos y plantas industriales.",
    iconName: "Building2"
  }
];