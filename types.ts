export interface Product {
  id: string;
  name: string;
  type: string; // 'Ventana', 'Split', 'Piso Techo', 'Baja Silueta', 'Rooftop', 'Chiller', 'Conductos', 'Calefactor'
  frigorias: number;
  kcal?: number;
  voltage: string;
  power?: string; // Optional for commercial units
  refrigerant?: string;
  weight?: string;
  dimensions?: string; // W x H x D
  features: string[];
  image: string;
  category: 'residential' | 'commercial';
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