export enum MockupCategory {
  T_SHIRT = 'T-Shirt',
  HOODIE = 'Hoodie',
  MUG = 'Coffee Mug',
  PACKAGING = 'Product Packaging',
  STATIONERY = 'Stationery',
  POSTER = 'Wall Poster',
  TOTE_BAG = 'Tote Bag',
  PHONE_CASE = 'Phone Case',
  LAPTOP = 'Laptop Screen',
  TABLET = 'Tablet Screen',
  BILLBOARD = 'City Billboard',
  MAGAZINE = 'Open Magazine'
}

export interface GeneratedImage {
  id: string;
  url: string; // Base64 data URL
  isLoading: boolean;
  error?: string;
}

export interface GenerationConfig {
  image: string; // Base64 of uploaded image
  category: MockupCategory;
  description: string;
}

export interface CategoryOption {
  id: MockupCategory;
  label: string;
  icon: string; // Icon name for lucide
}