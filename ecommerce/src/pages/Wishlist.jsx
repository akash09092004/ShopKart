import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { selectWishlistItems, toggleWishlist } from '../store/wishlistSlice';
import { addToCart, openCart } from '../store/cartSlice';
import { formatPrice } from '../data/products';

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectWishlistItems);

  if (items.length === 0) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
      <Heart size={80} className="text-gray-200 mx-auto mb-6" />
      <h2 className="font-display text-3xl font-bold text-dark-900 mb-3">Your wishlist is empty</h2>
      <p className="text-gray-500 mb-8">Save items you love by clicking the heart icon</p>
      <Link to="/products" className="btn-primary inline-flex items-center gap-2">
        Explore Products <ArrowRight size={16} />
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Heart size={24} className="text-red-500" fill="currentColor" />
        <h1 className="font-display text-3xl font-bold text-dark-900">My Wishlist</h1>
        <span className="bg-primary-100 text-primary-700 text-sm font-bold px-3 py-0.5 rounded-full">{items.length}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                onClick={() => navigate(`/products/${item.id}`)}
              />
              <button
                onClick={() => dispatch(toggleWishlist(item))}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="p-3">
              <p className="text-[10px] font-bold text-primary-600 uppercase">{item.brand}</p>
              <h3
                className="text-sm font-medium text-dark-800 line-clamp-2 mb-1 cursor-pointer hover:text-primary-600 transition-colors"
                onClick={() => navigate(`/products/${item.id}`)}
              >
                {item.name}
              </h3>
              <p className="font-bold text-dark-900 mb-2">{formatPrice(item.price)}</p>
              <button
                onClick={() => { dispatch(addToCart(item)); dispatch(openCart()); }}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold py-2 rounded-full flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShoppingCart size={13} /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
