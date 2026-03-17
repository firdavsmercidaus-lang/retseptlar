import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChefHat, 
  Zap, 
  Clock, 
  Flame, 
  Dna, 
  Sparkles, 
  X, 
  ChevronRight,
  Filter,
  Cpu
} from 'lucide-react';
import { INITIAL_RECIPES, Recipe, generateRecipe } from './services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [selectedCountry, setSelectedCountry] = useState('Barchasi');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Barchasi');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const categories = ['Barchasi', ...Array.from(new Set(recipes.map(r => r.category)))];
  const countries = ['Barchasi', ...Array.from(new Set(recipes.map(r => r.country)))];

  const subCategories = useMemo(() => {
    if (selectedCategory === 'Barchasi' && selectedCountry === 'Barchasi') return [];
    const subs = recipes
      .filter(r => (selectedCategory === 'Barchasi' || r.category === selectedCategory) && 
                   (selectedCountry === 'Barchasi' || r.country === selectedCountry))
      .map(r => r.name);
    return ['Barchasi', ...Array.from(new Set(subs))];
  }, [recipes, selectedCategory, selectedCountry]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Barchasi' || recipe.category === selectedCategory;
      const matchesCountry = selectedCountry === 'Barchasi' || recipe.country === selectedCountry;
      const matchesSubCategory = selectedSubCategory === 'Barchasi' || recipe.name === selectedSubCategory;
      return matchesSearch && matchesCategory && matchesCountry && matchesSubCategory;
    });
  }, [recipes, searchQuery, selectedCategory, selectedCountry, selectedSubCategory]);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubCategory('Barchasi');
  };

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country);
    setSelectedSubCategory('Barchasi');
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    const newRecipe = await generateRecipe(aiPrompt);
    if (newRecipe) {
      setRecipes(prev => [newRecipe, ...prev]);
      setSelectedRecipe(newRecipe);
      setAiPrompt('');
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center border border-neon-cyan/30">
              <ChefHat className="text-neon-cyan w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight neon-text text-neon-cyan">
                LAZZATLANGAN OSHPAZ
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                Kelajak Retseptlari Markazi
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-8 text-sm font-medium text-white/70">
              <a href="#" className="hover:text-neon-cyan transition-colors">Bosh sahifa</a>
            </nav>
            <button className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-neon-cyan transition-all">
              Kirish
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        {/* Hero / AI Generator */}
        <section className="mb-16">
          <div className="glass-card p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/20 blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/20 blur-[100px] -z-10" />
            
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/30 text-neon-purple text-xs font-bold mb-6">
                <Sparkles size={14} />
                AI OSHPAZ TAYYOR
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Xohlagan taomingizni <span className="text-neon-cyan">kelajak</span> versiyasini yarating
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Masalan: 'Uchar manti' yoki 'Galaktik sho'rva'..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-neon-cyan/50 transition-all"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                    <Cpu size={20} />
                  </div>
                </div>
                <button 
                  onClick={handleAiGenerate}
                  disabled={isGenerating}
                  className="px-8 py-4 rounded-xl bg-neon-cyan text-black font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Zap size={20} />
                    </motion.div>
                  ) : <Zap size={20} />}
                  SINTEZ QILISH
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input 
                type="text" 
                placeholder="Retseptlarni qidirish..."
                className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 focus:outline-none focus:border-neon-cyan/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                <Filter size={18} className="text-white/40 shrink-0" />
                <div className="flex gap-2 border-r border-white/10 pr-4">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                        selectedCategory === cat 
                          ? "bg-white text-black border-white" 
                          : "bg-white/5 text-white/60 border-white/10 hover:border-white/30"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {countries.map(country => (
                    <button
                      key={country}
                      onClick={() => handleCountryClick(country)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                        selectedCountry === country 
                          ? "bg-neon-purple text-white border-neon-purple" 
                          : "bg-white/5 text-white/60 border-white/10 hover:border-white/30"
                      )}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>

              {subCategories.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar pl-8"
                >
                  <ChevronRight size={16} className="text-neon-cyan shrink-0" />
                  {subCategories.map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubCategory(sub)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border",
                        selectedSubCategory === sub 
                          ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50" 
                          : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
                      )}
                    >
                      {sub}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Recipe Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredRecipes.map((recipe, index) => (
              <motion.div
                layout
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedRecipe(recipe)}
                className="glass-card group cursor-pointer overflow-hidden flex flex-col"
              >
                <div className="h-48 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-500">
                    <ChefHat size={80} className="text-white" />
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-widest uppercase">
                      {recipe.country}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-widest uppercase">
                      {recipe.category}
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-neon-cyan transition-colors">
                    {recipe.name}
                  </h3>
                  <p className="text-white/60 text-sm line-clamp-2 mb-6 flex-1">
                    {recipe.description}
                  </p>
                  <div className="flex items-center justify-between text-xs font-medium text-white/40">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {recipe.prepTime}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Flame size={14} />
                      {recipe.calories} kcal
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Dna size={14} />
                      {recipe.difficulty}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <ChefHat className="text-neon-cyan w-6 h-6" />
            <span className="font-bold tracking-tight">LAZZATLANGAN OSHPAZ</span>
          </div>
          <p className="text-white/40 text-sm">
            © 2026 Kelajak Oshxonasi. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </footer>

      {/* Recipe Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecipe(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] glass-card overflow-hidden flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-neon-cyan hover:text-black transition-all"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-2/5 h-64 md:h-auto bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 flex items-center justify-center p-12">
                <div className="text-center">
                  <ChefHat size={120} className="mx-auto mb-6 text-white/50" />
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-bold">
                    <Zap size={16} className="text-neon-cyan" />
                    KELAJAK TAOMI
                  </div>
                </div>
              </div>

              <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
                <div className="mb-8">
                  <div className="text-neon-cyan text-xs font-bold tracking-widest uppercase mb-2">
                    {selectedRecipe.category}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{selectedRecipe.name}</h2>
                  <p className="text-white/70 leading-relaxed italic">
                    "{selectedRecipe.description}"
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-10">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Vaqt</div>
                    <div className="font-bold text-sm">{selectedRecipe.prepTime}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Energiya</div>
                    <div className="font-bold text-sm">{selectedRecipe.calories} kcal</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Daraja</div>
                    <div className="font-bold text-sm">{selectedRecipe.difficulty}</div>
                  </div>
                </div>

                <div className="space-y-10">
                  <section>
                    <h4 className="flex items-center gap-2 text-lg font-bold mb-4 text-neon-cyan">
                      <ChevronRight size={20} />
                      MASALLIQLAR
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedRecipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-3 text-white/80 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h4 className="flex items-center gap-2 text-lg font-bold mb-4 text-neon-cyan">
                      <ChevronRight size={20} />
                      TAYYORLASH BOSQICHLARI
                    </h4>
                    <div className="space-y-4">
                      {selectedRecipe.instructions.map((step, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="shrink-0 w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-bold">
                            {i + 1}
                          </div>
                          <p className="text-white/80 text-sm leading-relaxed">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="p-6 rounded-2xl bg-neon-purple/10 border border-neon-purple/30">
                    <h4 className="flex items-center gap-2 text-sm font-bold mb-3 text-neon-purple uppercase tracking-widest">
                      <Sparkles size={16} />
                      KELAJAK TEXNOLOGIYASI
                    </h4>
                    <p className="text-white/90 text-sm italic">
                      {selectedRecipe.futuristicTwist}
                    </p>
                  </section>

                  <div className="pt-8 border-t border-white/10 text-center">
                    <p className="text-neon-cyan font-bold tracking-[0.3em] uppercase text-sm animate-pulse">
                      Muhimi mehr bilan qilish ❤️
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
