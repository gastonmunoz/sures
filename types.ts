export interface Product {
  id: string;
  name: string;
  model?: string; // Modelo del fabricante (ej: MCVE09RE22F1)
  type: string; // 'Ventana', 'Split', 'Piso Techo', 'Baja Silueta', 'Rooftop', 'Chiller', 'Conductos', 'Calefactor'
  frigorias: number;
  kcal?: number;
  voltage: string;
  power?: string; // Potencia eléctrica (kW)
  current?: string; // Corriente (A)
  refrigerant?: string;
  weight?: string;
  dimensions?: string; // W x H x D
  color?: string; // Color del equipo
  efficiency?: string; // Eficiencia energética (A, B, C, etc.)
  isInverter?: boolean;
  hasWifi?: boolean;
  hasTimer?: boolean;
  hasDehumidifier?: boolean;
  placement?: string; // Lugar de colocación
  climateType?: string; // Frío Solo, Frío/Calor
  features: string[];
  image: string;
  category: "residential" | "commercial";
}

export enum MessageSender {
  User = 'user',
  Bot = 'bot',
  System = 'system'
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  isThinking?: boolean;
}

export interface ServiceItem {
  title: string;
  description: string;
  iconName: string;
}