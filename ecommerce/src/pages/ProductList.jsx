import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SlidersHorizontal, Grid3X3, List, ChevronDown, X, ShoppingCart, Zap } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { products, categories, formatPrice } from '../data/products';
import { addToCart, openCart } from '../store/cartSlice';

const sortOptions = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
  { label: 'Discount', value: 'discount' },
];

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Derive directly from URL — single source of truth
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';

  const [sort, setSort] = useState('relevance');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // When category filter changes via sidebar
  const handleCategorySelect = (catName) => {
    const params = new URLSearchParams(searchParams);
    if (catName) {
      params.set('category', catName);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({});
    setPriceRange([0, 200000]);
    setMinRating(0);
  };

  const filtered = useMemo(() => {
    let result = [...products];
    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    // Filter by category (from URL param — always in sync)
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    result = result.filter(p => p.rating >= minRating);
    switch (sort) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'discount': result.sort((a, b) => b.discount - a.discount); break;
    }
    return result;
  }, [searchQuery, selectedCategory, priceRange, minRating, sort]);

  const activeFilters = [
    selectedCategory && { label: selectedCategory, clear: () => handleCategorySelect('') },
    searchQuery && { label: `"${searchQuery}"`, clear: () => { const p = new URLSearchParams(searchParams); p.delete('search'); setSearchParams(p); } },
    minRating > 0 && { label: `${minRating}★+`, clear: () => setMinRating(0) },
  ].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-dark-900">
            {searchQuery && selectedCategory
              ? `"${searchQuery}" in ${selectedCategory}`
              : searchQuery
              ? `Results for "${searchQuery}"`
              : selectedCategory || 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} products found</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium hover:border-primary-400 transition-colors md:hidden">
            <SlidersHorizontal size={14} />
            Filters {activeFilters.length > 0 && <span className="bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFilters.length}</span>}
          </button>
          <div className="flex items-center gap-1 border border-gray-200 rounded-full p-1">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-primary-600'}`}><Grid3X3 size={14} /></button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-primary-600'}`}><List size={14} /></button>
          </div>
          <div className="relative">
            <select value={sort} onChange={e => setSort(e.target.value)} className="border border-gray-200 rounded-full px-4 py-2 text-sm font-medium outline-none appearance-none pr-8 cursor-pointer hover:border-primary-400 transition-colors bg-white">
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-xs text-gray-500">Active filters:</span>
          {activeFilters.map(f => (
            <button key={f.label} onClick={f.clear} className="flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-primary-100 transition-colors">
              {f.label} <X size={12} />
            </button>
          ))}
          <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-red-500 underline transition-colors">Clear all</button>
        </div>
      )}

      <div className="flex gap-6">
        <aside className={`w-56 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-36">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-dark-800">Filters</h3>
              {activeFilters.length > 0 && <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline">Reset</button>}
            </div>
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</h4>
              <div className="space-y-1">
                <button onClick={() => handleCategorySelect('')} className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${!selectedCategory ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>All Categories</button>
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => handleCategorySelect(cat.name)} className={`w-full text-left text-sm px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors ${selectedCategory === cat.name ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <span className="flex items-center gap-1.5"><span>{cat.icon}</span>{cat.name}</span>
                    <span className="text-xs text-gray-400">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Price Range</h4>
              <input type="range" min={0} max={200000} step={500} value={priceRange[1]} onChange={e => setPriceRange([0, parseInt(e.target.value)])} className="w-full accent-primary-600" />
              <div className="flex justify-between text-xs text-gray-500 mt-1"><span>₹0</span><span>Up to ₹{priceRange[1].toLocaleString()}</span></div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Min Rating</h4>
              <div className="space-y-1">
                {[4, 3, 2, 0].map(r => (
                  <button key={r} onClick={() => setMinRating(r)} className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${minRating === r ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {r > 0 ? `${r}★ & above` : 'All ratings'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-display text-xl font-bold text-dark-800 mb-2">No products found</h3>
              <p className="text-gray-500 text-sm">Try different filters or search terms</p>
              <button onClick={clearFilters} className="mt-4 btn-primary text-sm">Clear Filters</button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'flex flex-col gap-3'}>
              {filtered.map(product => (
                viewMode === 'grid'
                  ? <ProductCard key={product.id} product={product} />
                  : <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductListItem({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleAddToCart = (e) => { e.stopPropagation(); dispatch(addToCart(product)); dispatch(openCart()); };
  const handleBuyNow = (e) => { e.stopPropagation(); dispatch(addToCart(product)); navigate('/checkout'); };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all p-4 flex gap-4 cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
      <img src={product.image} alt={product.name} className="w-28 h-28 object-cover rounded-xl flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-primary-600 uppercase">{product.brand}</p>
        <h3 className="font-medium text-dark-800 mt-0.5 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{product.description}</p>
        <div className="flex items-center gap-3 mb-3">
          <span className="font-bold text-dark-900">{formatPrice(product.price)}</span>
          {product.originalPrice && <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>}
          <span className="text-xs font-semibold text-green-600">{product.discount}% off</span>
        </div>
        <div className="flex gap-2">
          <button onClick={handleAddToCart} className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"><ShoppingCart size={13} /> Add to Cart</button>
          <button onClick={handleBuyNow} className="flex items-center gap-1.5 bg-dark-800 hover:bg-dark-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"><Zap size={13} /> Buy Now</button>
        </div>
      </div>
    </div>
  );
}
