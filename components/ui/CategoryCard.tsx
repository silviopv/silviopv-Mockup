import React from 'react';
import { 
  Shirt, Coffee, Box, Monitor, Smartphone, Tablet, 
  ShoppingBag, Stamp, Layout, Image as ImageIcon, Briefcase, BookOpen 
} from 'lucide-react';
import { MockupCategory } from '../../types';

interface CategoryCardProps {
  category: MockupCategory;
  isSelected: boolean;
  onClick: () => void;
}

const getIcon = (category: MockupCategory) => {
  switch (category) {
    case MockupCategory.T_SHIRT: return <Shirt className="w-6 h-6" />;
    case MockupCategory.HOODIE: return <Shirt className="w-6 h-6" />; // Reuse Shirt or find generic
    case MockupCategory.MUG: return <Coffee className="w-6 h-6" />;
    case MockupCategory.PACKAGING: return <Box className="w-6 h-6" />;
    case MockupCategory.LAPTOP: return <Monitor className="w-6 h-6" />;
    case MockupCategory.PHONE_CASE: return <Smartphone className="w-6 h-6" />;
    case MockupCategory.TABLET: return <Tablet className="w-6 h-6" />;
    case MockupCategory.TOTE_BAG: return <ShoppingBag className="w-6 h-6" />;
    case MockupCategory.STATIONERY: return <Stamp className="w-6 h-6" />;
    case MockupCategory.POSTER: return <Layout className="w-6 h-6" />;
    case MockupCategory.BILLBOARD: return <ImageIcon className="w-6 h-6" />;
    case MockupCategory.MAGAZINE: return <BookOpen className="w-6 h-6" />;
    default: return <Briefcase className="w-6 h-6" />;
  }
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200
        ${isSelected 
          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md ring-1 ring-indigo-600' 
          : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-gray-50'
        }
      `}
    >
      <div className={`${isSelected ? 'text-indigo-600' : 'text-gray-500'}`}>
        {getIcon(category)}
      </div>
      <span className="text-sm font-medium text-center">{category}</span>
    </div>
  );
};

export default CategoryCard;