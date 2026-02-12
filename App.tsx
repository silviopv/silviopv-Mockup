import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, Wand2, ArrowRight, Image as LucideImage, AlertCircle } from 'lucide-react';
import { MockupCategory, GeneratedImage } from './types';
import CategoryCard from './components/ui/CategoryCard';
import Button from './components/ui/Button';
import ResultCard from './components/ResultCard';
import { generateMockup } from './services/geminiService';

const App: React.FC = () => {
  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MockupCategory>(MockupCategory.T_SHIRT);
  const [description, setDescription] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for scrolling
  const resultsRef = useRef<HTMLDivElement>(null);

  // Constants
  const categories = Object.values(MockupCategory);

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size too large. Please upload an image under 5MB.");
        return;
      }
      setSelectedFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setGeneratedImages([]);
  };

  const handleGenerate = async () => {
    if (!filePreview || !selectedCategory) return;
    
    setIsGenerating(true);
    setGeneratedImages([]);
    setError(null);

    // Initialize 4 placeholders
    const placeholders: GeneratedImage[] = Array.from({ length: 4 }).map((_, i) => ({
      id: `img-${Date.now()}-${i}`,
      url: '',
      isLoading: true
    }));
    setGeneratedImages(placeholders);

    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // Trigger 4 parallel requests
    const promises = placeholders.map(async (placeholder) => {
      try {
        const url = await generateMockup(filePreview, selectedCategory, description);
        setGeneratedImages(prev => prev.map(img => 
          img.id === placeholder.id ? { ...img, url, isLoading: false } : img
        ));
      } catch (err) {
        setGeneratedImages(prev => prev.map(img => 
          img.id === placeholder.id ? { ...img, isLoading: false, error: 'Failed' } : img
        ));
      }
    });

    await Promise.all(promises);
    setIsGenerating(false);
  };

  const handleRedo = async (id: string) => {
    if (!filePreview) return;

    // Find index of item to redo
    setGeneratedImages(prev => prev.map(img => 
      img.id === id ? { ...img, isLoading: true, error: undefined } : img
    ));

    try {
      const url = await generateMockup(filePreview, selectedCategory, description);
      setGeneratedImages(prev => prev.map(img => 
        img.id === id ? { ...img, url, isLoading: false } : img
      ));
    } catch (err) {
      setGeneratedImages(prev => prev.map(img => 
        img.id === id ? { ...img, isLoading: false, error: 'Failed' } : img
      ));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">MockupAI Studio</h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Powered by Gemini
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Intro Section */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Turn your designs into <span className="text-indigo-600">professional mockups</span>
          </h2>
          <p className="text-lg text-gray-600">
            Upload your logo or artwork, choose a product, and let our AI generate photorealistic scenes in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Controls */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* 1. Upload Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">1</span>
                  Upload Design
                </h3>
              </div>

              {!filePreview ? (
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 transition-colors hover:border-indigo-400 hover:bg-indigo-50/50 group text-center">
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={filePreview} alt="Preview" className="w-full h-48 object-contain p-4" />
                  <button 
                    onClick={clearFile}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="bg-white border-t border-gray-200 p-3 flex items-center justify-center gap-2 text-xs font-medium text-green-600">
                    <LucideImage className="w-3 h-3" />
                    Image Ready
                  </div>
                </div>
              )}
            </div>

            {/* 2. Category Selection */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">2</span>
                Choose Context
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <CategoryCard 
                    key={cat} 
                    category={cat} 
                    isSelected={selectedCategory === cat}
                    onClick={() => setSelectedCategory(cat)}
                  />
                ))}
              </div>
            </div>

            {/* 3. Description & Action */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">3</span>
                Customize & Generate
              </h3>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optional Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., Dark moody lighting, wooden table background, minimal style..."
                className="w-full rounded-lg border-gray-300 border p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px] mb-6"
              />

              {!process.env.API_KEY && (
                <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 text-xs rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>API Key is missing. Please ensure the environment is configured correctly.</span>
                </div>
              )}

              <Button 
                onClick={handleGenerate} 
                isLoading={isGenerating} 
                disabled={!filePreview || !selectedCategory}
                className="w-full"
                size="lg"
                leftIcon={<Wand2 className="w-5 h-5" />}
              >
                {isGenerating ? 'Designing...' : 'Generate Mockups'}
              </Button>
            </div>

          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Mockups</h2>
              {generatedImages.length > 0 && !isGenerating && (
                 <span className="text-sm text-gray-500">4 variations generated</span>
              )}
            </div>

            {generatedImages.length === 0 ? (
              <div className="h-[600px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <LucideImage className="w-8 h-8 opacity-20" />
                </div>
                <p className="font-medium text-lg">No mockups generated yet</p>
                <p className="text-sm mt-2 max-w-xs text-center">Upload an image and select a category to see the magic happen.</p>
              </div>
            ) : (
              <div ref={resultsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedImages.map((img, idx) => (
                  <ResultCard 
                    key={img.id} 
                    image={img} 
                    index={idx} 
                    onRedo={handleRedo} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} MockupAI Studio. Generated by Gemini 2.5 Flash Image.
        </div>
      </footer>
    </div>
  );
};

export default App;