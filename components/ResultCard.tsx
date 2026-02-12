import React from 'react';
import { Download, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { GeneratedImage } from '../types';
import Button from './ui/Button';

interface ResultCardProps {
  image: GeneratedImage;
  onRedo: (id: string) => void;
  index: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ image, onRedo, index }) => {
  const handleDownload = () => {
    if (!image.url) return;
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `mockup-${index + 1}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col">
      <div className="relative aspect-square w-full bg-gray-100 flex items-center justify-center group overflow-hidden">
        {image.isLoading ? (
          <div className="flex flex-col items-center gap-3">
             <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
             <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Generating...</p>
          </div>
        ) : image.error ? (
           <div className="p-6 text-center">
             <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
               <ImageIcon className="w-6 h-6 text-red-500" />
             </div>
             <p className="text-sm text-red-600 font-medium mb-1">Failed to generate</p>
             <p className="text-xs text-gray-500 mb-4">Please try again</p>
           </div>
        ) : (
          <img 
            src={image.url} 
            alt={`Generated Mockup ${index + 1}`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-3 bg-gray-50/50">
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={() => onRedo(image.id)}
          disabled={image.isLoading}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          className="w-full text-xs font-semibold"
        >
          Redo
        </Button>
        <Button 
          size="sm" 
          variant="primary" 
          onClick={handleDownload}
          disabled={image.isLoading || !!image.error}
          leftIcon={<Download className="w-4 h-4" />}
          className="w-full text-xs font-semibold"
        >
          Download
        </Button>
      </div>
    </div>
  );
};

export default ResultCard;