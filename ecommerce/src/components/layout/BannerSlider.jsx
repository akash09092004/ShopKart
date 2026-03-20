import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BANNERS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=500&fit=crop&q=80",
    title: "Sale is LIVE",
    subtitle: "Up to 80% off on Electronics",
    cta: "Shop Now",
    link: "/products?category=Electronics",
    overlay: "rgba(234,88,12,0.55)",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=500&fit=crop&q=80",
    title: "Fashion Arrivals",
    subtitle: "Trendy styles at unbeatable prices",
    cta: "Explore Now",
    link: "/products?category=Fashion",
    overlay: "rgba(124,58,237,0.55)",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=500&fit=crop&q=80",
    title: "Home Essentials",
    subtitle: "Make your space beautiful",
    cta: "Shop Home",
    link: "/products?category=Home+%26+Kitchen",
    overlay: "rgba(13,148,136,0.55)",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&h=500&fit=crop&q=80",
    title: "Beauty & Skincare",
    subtitle: "Glow up with top brands",
    cta: "Shop Beauty",
    link: "/products?category=Beauty",
    overlay: "rgba(219,39,119,0.5)",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&h=500&fit=crop&q=80",
    title: "Sports & Fitness",
    subtitle: "Gear up for your best performance",
    cta: "Shop Sports",
    link: "/products?category=Sports",
    overlay: "rgba(5,150,105,0.5)",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=500&fit=crop&q=80",
    title: "Books for Every Reader",
    subtitle: "Bestsellers starting at ₹199",
    cta: "Shop Books",
    link: "/products?category=Books",
    overlay: "rgba(30,64,175,0.5)",
  },
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => goNext(), 4500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (idx) => {
    if (isTransitioning || idx === current) return;
    setIsTransitioning(true);
    setCurrent(idx);
    setTimeout(() => setIsTransitioning(false), 700);
    startTimer();
  };

  const goPrev = () => goTo((current - 1 + BANNERS.length) % BANNERS.length);
  const goNext = () => goTo((current + 1) % BANNERS.length);

  return (
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl w-full bg-gray-900" style={{ aspectRatio: '2.4/1' }}>
      {/* Slides */}
      {BANNERS.map((banner, i) => (
        <div
          key={banner.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          {/* Full background image */}
          <img
            src={banner.image}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          {/* Color overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to right, ${banner.overlay} 0%, ${banner.overlay} 50%, transparent 100%)` }}
          />
          {/* Text content */}
          <div
            className="absolute inset-0 flex items-center cursor-pointer"
            onClick={() => navigate(banner.link)}
          >
            <div className="px-6 sm:px-10 md:px-14">
              <p className="text-white/80 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold mb-1 sm:mb-2">
                Limited Time Offer
              </p>
              <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-white mb-1 sm:mb-2 leading-tight drop-shadow-lg">
                {banner.title}
              </h2>
              <p className="text-white/90 text-xs sm:text-base mb-4 sm:mb-6 font-medium drop-shadow">
                {banner.subtitle}
              </p>
              <span className="inline-block bg-white text-dark-900 font-bold px-5 sm:px-7 py-2 sm:py-3 rounded-full text-xs sm:text-sm shadow-xl hover:bg-gray-100 active:scale-95 transition-all">
                {banner.cta} →
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next buttons */}
      <button
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/25 hover:bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
      >
        <ChevronLeft size={16} className="text-white hover:text-dark-900 transition-colors" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/25 hover:bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
      >
        <ChevronRight size={16} className="text-white hover:text-dark-900 transition-colors" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 items-center">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-3 right-3 z-10 bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full font-mono">
        {current + 1}/{BANNERS.length}
      </div>
    </div>
  );
}
