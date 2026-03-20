import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Heart, Star, Zap, Truck, Shield, RotateCcw, ChevronRight, Plus, Minus, Check } from 'lucide-react';
import { addToCart, openCart } from '../store/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../store/wishlistSlice';
import { products, formatPrice } from '../data/products';
import ProductCard from '../components/product/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));
  const isWishlisted = useSelector(selectIsWishlisted(product?.id));
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const related = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0,4);

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="font-display text-2xl font-bold mb-2">Product not found</h2>
      <Link to="/products" className="btn-primary mt-4 inline-block">Browse Products</Link>
    </div>
  );

  const handleAddToCart = () => {
    for (let i=0;i<quantity;i++) dispatch(addToCart(product));
    setAddedToCart(true); dispatch(openCart());
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const allImages = product.images?.length > 0 ? product.images : [product.image];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide whitespace-nowrap">
        <Link to="/" className="hover:text-primary-600 flex-shrink-0">Home</Link>
        <ChevronRight size={11} className="flex-shrink-0" />
        <Link to="/products" className="hover:text-primary-600 flex-shrink-0">Products</Link>
        <ChevronRight size={11} className="flex-shrink-0" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary-600 flex-shrink-0">{product.category}</Link>
        <ChevronRight size={11} className="flex-shrink-0" />
        <span className="text-dark-700 line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-10 sm:mb-14">
        {/* Images */}
        <div className="space-y-2 sm:space-y-3">
          <div className="bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden aspect-square">
            <img src={allImages[selectedImg]} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onError={e => { e.target.onerror=null; e.target.src="https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=700&h=700&fit=crop"; }} />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2">
              {allImages.map((img,i) => (
                <button key={i} onClick={() => setSelectedImg(i)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImg===i?'border-primary-500 scale-105':'border-gray-200 hover:border-gray-300'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
            <div>
              <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-0.5 sm:mb-1">{product.brand}</p>
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-dark-900 leading-tight">{product.name}</h1>
            </div>
            <button onClick={() => dispatch(toggleWishlist(product))}
              className={`p-2 rounded-full border-2 flex-shrink-0 transition-all ${isWishlisted?'border-red-400 bg-red-50 text-red-500':'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'}`}>
              <Heart size={16} fill={isWishlisted?'currentColor':'none'} />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
            <div className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
              <Star size={11} fill="currentColor" />{product.rating}
            </div>
            <span className="text-xs text-gray-500">{product.reviews.toLocaleString()} ratings</span>
            {product.badge && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.badgeColor}`}>{product.badge}</span>}
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4">
            <div className="flex items-baseline gap-2 sm:gap-3 mb-0.5 flex-wrap">
              <span className="font-display text-2xl sm:text-3xl font-black text-dark-900">{formatPrice(product.price)}</span>
              {product.originalPrice && <>
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                <span className="text-sm font-bold text-green-600">{product.discount}% off</span>
              </>}
            </div>
            <p className="text-[10px] text-gray-400">Inclusive of all taxes</p>
            {product.stockCount <= 10 && <p className="text-xs font-semibold text-orange-600 mt-1">⚡ Only {product.stockCount} left!</p>}
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 sm:mb-4">{product.description}</p>

          {/* Features */}
          <div className="mb-4 sm:mb-5">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Key Features</p>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {product.features?.map(f => (
                <div key={f} className="flex items-center gap-1.5 text-xs text-dark-700">
                  <Check size={12} className="text-green-500 flex-shrink-0" />{f}
                </div>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-gray-600">Qty:</span>
            <div className="flex items-center border border-gray-200 rounded-full">
              <button onClick={() => setQuantity(q=>Math.max(1,q-1))} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:text-primary-600 transition-colors"><Minus size={13}/></button>
              <span className="w-8 text-center text-sm font-bold">{quantity}</span>
              <button onClick={() => setQuantity(q=>q+1)} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:text-primary-600 transition-colors"><Plus size={13}/></button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
            <button onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3 px-3 sm:px-6 rounded-full transition-all active:scale-95 text-sm ${addedToCart?'bg-green-500 text-white':'bg-primary-600 hover:bg-primary-700 text-white'}`}>
              {addedToCart?<><Check size={16}/>Added!</>:<><ShoppingCart size={16}/>Add to Cart</>}
            </button>
            <button onClick={() => { dispatch(addToCart(product)); navigate('/checkout'); }}
              className="flex-1 flex items-center justify-center gap-2 bg-dark-900 hover:bg-dark-700 text-white font-semibold py-3 px-3 sm:px-6 rounded-full transition-all active:scale-95 text-sm">
              <Zap size={16}/>Buy Now
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[{icon:Truck,label:'Free Delivery',sub:'By tomorrow'},{icon:Shield,label:'Secure Pay',sub:'100% safe'},{icon:RotateCcw,label:'Easy Return',sub:'10 days'}].map(({icon:Icon,label,sub})=>(
              <div key={label} className="bg-gray-50 rounded-lg sm:rounded-xl p-2 text-center">
                <Icon size={14} className="text-primary-600 mx-auto mb-0.5 sm:mb-1"/>
                <p className="text-[9px] sm:text-xs font-semibold text-dark-800">{label}</p>
                <p className="text-[8px] sm:text-[10px] text-gray-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="section-title mb-4 sm:mb-6">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {related.map(p => <ProductCard key={p.id} product={p}/>)}
          </div>
        </div>
      )}
    </div>
  );
}
