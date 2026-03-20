import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Star, ShoppingCart, Zap, ImageOff } from 'lucide-react';
import { useState } from 'react';
import { addToCart, openCart } from '../../store/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../../store/wishlistSlice';
import { formatPrice } from '../../data/products';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isWishlisted = useSelector(selectIsWishlisted(product.id));
  const [imgError, setImgError] = useState(false);

  const stopAndDo = (e, fn) => { e.preventDefault(); e.stopPropagation(); fn(); };

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative h-full flex flex-col">

        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 aspect-square">
          {imgError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 gap-2">
              <ImageOff size={28} className="text-gray-300" />
              <span className="text-[10px] text-gray-400 text-center px-2">{product.name.slice(0,20)}...</span>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}

          {/* Discount badge */}
          {product.discount > 0 && (
            <div className="absolute top-1.5 left-1.5 bg-primary-600 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full z-10">
              -{product.discount}%
            </div>
          )}

          {/* Product badge */}
          {product.badge && (
            <div className={`absolute top-1.5 right-8 text-[9px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full hidden sm:block z-10 ${product.badgeColor}`}>
              {product.badge}
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={e => stopAndDo(e, () => dispatch(toggleWishlist(product)))}
            className={`absolute top-1.5 right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all shadow-sm z-10 ${isWishlisted ? 'bg-red-500 text-white scale-110' : 'bg-white/90 text-gray-400 hover:text-red-500 hover:scale-110'}`}
          >
            <Heart size={12} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Hover action overlay */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 backdrop-blur-sm p-1.5 sm:p-2 hidden sm:flex gap-1.5 z-10">
            <button
              onClick={e => stopAndDo(e, () => { dispatch(addToCart(product)); dispatch(openCart()); })}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center justify-center gap-1 transition-colors"
            >
              <ShoppingCart size={12} /> Add to Cart
            </button>
            <button
              onClick={e => stopAndDo(e, () => { dispatch(addToCart(product)); navigate('/checkout'); })}
              className="bg-dark-800 hover:bg-dark-700 text-white text-xs font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1 transition-colors"
            >
              <Zap size={12} /> Buy
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-2 sm:p-3 flex flex-col flex-1">
          <div className="text-[9px] sm:text-[10px] font-semibold text-primary-600 uppercase tracking-wide mb-0.5">{product.brand}</div>
          <h3 className="text-xs sm:text-sm font-medium text-dark-800 line-clamp-2 leading-snug mb-1.5 flex-1">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex items-center gap-0.5 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              <Star size={9} fill="currentColor" />{product.rating}
            </div>
            <span className="text-[10px] text-gray-400 hidden sm:block">({product.reviews.toLocaleString()})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-dark-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          {product.stockCount <= 10 && (
            <p className="text-[9px] sm:text-[10px] text-orange-600 font-medium mt-0.5">Only {product.stockCount} left!</p>
          )}

          {/* Mobile quick-add */}
          <button
            onClick={e => stopAndDo(e, () => { dispatch(addToCart(product)); dispatch(openCart()); })}
            className="sm:hidden mt-2 w-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors active:scale-95"
          >
            <ShoppingCart size={11} /> Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
