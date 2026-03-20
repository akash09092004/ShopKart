import { useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RotateCcw, Headphones, Zap, Star, TrendingUp } from 'lucide-react';
import BannerSlider from '../components/layout/BannerSlider';
import ProductCard from '../components/product/ProductCard';
import { products, categories } from '../data/products';

const features = [
  { icon: Truck, label: 'Free Delivery', sub: 'On orders above ₹499' },
  { icon: Shield, label: 'Secure Payment', sub: '100% secure' },
  { icon: RotateCcw, label: 'Easy Returns', sub: '10-day policy' },
  { icon: Headphones, label: '24/7 Support', sub: 'Dedicated team' },
];

const SIDE_BANNERS = [
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=320&fit=crop&q=80",
    label: "NEW COLLECTION",
    title: "Fashion Forward 2025",
    cta: "Explore",
    link: "/products?category=Fashion",
    overlay: "rgba(109,40,217,0.6)",
  },
  {
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=320&fit=crop&q=80",
    label: "UP TO 70% OFF",
    title: "Kitchen Essentials",
    cta: "Shop Now",
    link: "/products?category=Home+%26+Kitchen",
    overlay: "rgba(15,118,110,0.6)",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const featured = products.slice(0, 4);
  const trending = products.slice(4, 8);
  const deals = products.filter(p => p.discount >= 35).slice(0, 8);

  return (
    <div className="animate-fade-in">
      {/* ── Hero Banner ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-4 sm:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Main slider */}
          <div className="lg:col-span-2">
            <BannerSlider />
          </div>

          {/* Side banners — real images */}
          <div className="hidden lg:flex flex-col gap-3">
            {SIDE_BANNERS.map((b, i) => (
              <div
                key={i}
                className="flex-1 rounded-2xl overflow-hidden relative cursor-pointer group"
                onClick={() => navigate(b.link)}
                style={{ minHeight: 140 }}
              >
                <img
                  src={b.image}
                  alt={b.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${b.overlay} 0%, transparent 70%)` }}
                />
                <div className="relative z-10 p-5 flex flex-col justify-between h-full">
                  <div>
                    <p className="text-white/80 text-[10px] uppercase tracking-widest font-semibold mb-1">{b.label}</p>
                    <h3 className="font-display text-white text-xl font-bold leading-tight">{b.title}</h3>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-white text-dark-900 text-xs font-bold px-4 py-1.5 rounded-full self-start hover:bg-gray-50 transition-colors shadow">
                    {b.cta} <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Feature badges ── */}
      <div className="bg-white border-y border-gray-100 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {features.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-dark-800">{label}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Shop by Category ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="section-title">Shop by Category</h2>
          <button onClick={() => navigate('/products')} className="text-xs sm:text-sm text-primary-600 font-semibold flex items-center gap-1">
            View all <ArrowRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
              className="group flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all hover:-translate-y-0.5">
              <span className="text-xl sm:text-3xl">{cat.icon}</span>
              <span className="text-[9px] sm:text-xs font-medium text-dark-700 text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Flash Deals bar ── */}
      <div className="bg-gradient-to-r from-primary-600 to-orange-500 py-2.5 sm:py-3 mb-6 sm:mb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center gap-2 sm:gap-3">
          <Zap size={16} className="text-white" fill="white" />
          <span className="font-display font-bold text-white text-base sm:text-lg">Flash Deals</span>
          <span className="text-white/70 text-xs sm:text-sm hidden sm:block">— Ends in</span>
          <div className="flex gap-1 ml-1">
            {['08','45','23'].map((v,i) => (
              <div key={i} className="bg-white/20 text-white text-[10px] sm:text-xs font-mono font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">{v}</div>
            ))}
          </div>
          <button onClick={() => navigate('/products')} className="ml-auto text-white text-xs sm:text-sm font-semibold flex items-center gap-1">
            See All <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* ── Deals grid ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {deals.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* ── Category promo strip (real images) ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=200&fit=crop&q=80", label: "Electronics", link: "/products?category=Electronics", overlay: "rgba(234,88,12,0.5)" },
            { img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=200&fit=crop&q=80", label: "Fashion", link: "/products?category=Fashion", overlay: "rgba(124,58,237,0.5)" },
            { img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=200&fit=crop&q=80", label: "Beauty", link: "/products?category=Beauty", overlay: "rgba(219,39,119,0.5)" },
            { img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=200&fit=crop&q=80", label: "Sports", link: "/products?category=Sports", overlay: "rgba(5,150,105,0.5)" },
          ].map(item => (
            <div key={item.label} onClick={() => navigate(item.link)}
              className="relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group h-28 sm:h-36">
              <img src={item.img} alt={item.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0" style={{ background: item.overlay }} />
              <div className="absolute inset-0 flex items-end p-3">
                <span className="text-white font-display font-bold text-base sm:text-lg drop-shadow">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured Products ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2"><Star size={18} className="text-amber-400" fill="currentColor" /><h2 className="section-title">Featured Products</h2></div>
          <button onClick={() => navigate('/products')} className="text-xs sm:text-sm text-primary-600 font-semibold flex items-center gap-1">View all <ArrowRight size={13} /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* ── Trending ── */}
      <div className="bg-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2"><TrendingUp size={18} className="text-primary-600" /><h2 className="section-title">Trending Now</h2></div>
            <button onClick={() => navigate('/products')} className="text-xs sm:text-sm text-primary-600 font-semibold flex items-center gap-1">View all <ArrowRight size={13} /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {trending.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>

      {/* ── App Download CTA ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&h=300&fit=crop&q=80"
            alt="app" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-dark-900/80" />
          <div className="relative z-10 p-6 sm:p-10 md:p-12 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="text-center sm:text-left">
              <p className="text-primary-400 text-xs font-semibold uppercase tracking-widest mb-1">Download our app</p>
              <h2 className="font-display text-white text-2xl sm:text-3xl md:text-4xl font-black mb-1">Shop on the go</h2>
              <p className="text-gray-400 text-sm">Exclusive app-only deals & faster checkout</p>
            </div>
            <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
              <button className="bg-white text-dark-900 font-bold px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm hover:bg-gray-100 transition-colors flex items-center gap-2">
                🍎 App Store
              </button>
              <button className="bg-white text-dark-900 font-bold px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm hover:bg-gray-100 transition-colors flex items-center gap-2">
                🤖 Play Store
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
