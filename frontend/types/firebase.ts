export interface UserProfile {
  id?: string;
  email: string;
  phone?: string;
  name: string;
  age?: string;
  gender?: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
  measurements?: {
    height?: string;
    weight?: string;
    bodyType?: string;
    generalSize?: string;
    tops?: string;
    bottoms?: string;
    dresses?: string;
    shoes?: string;
  };
  stylePreferences?: {
    preferredStyles?: string[];
    avoidStyles?: string[];
    colorPreferences?: {
      preferred?: string[];
      avoid?: string[];
    };
    patternPreferences?: {
      preferred?: string[];
      avoid?: string[];
    };
    materialPreferences?: {
      preferred?: string[];
      avoid?: string[];
    };
  };
  surveyData?: any;
  lastSurveyUpdate?: string;
}

export interface Order {
  id?: string;
  orderId: string;
  userId: string;
  products: any[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}
