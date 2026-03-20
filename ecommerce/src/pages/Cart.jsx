import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { removeFromCart, updateQuantity, selectCartItems, selectCartTotal, clearCart } from '../store/cartSlice';
import { formatPrice } from '../data/products';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  if (items.length === 0) return (
    <div className="max-w-lg mx-auto px-4 py-16 sm:py-20 text-center animate-fade-in">
      <ShoppingBag size={64} className="text-gray-200 mx-auto mb-5" />
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark-900 mb-3">Your cart is empty</h2>
      <p className="text-gray-500 mb-7 text-sm">Add items you love to your cart</p>
      <Link to="/products" className="btn-primary inline-flex items-center gap-2">Continue Shopping <ArrowRight size={15} /></Link>
    </div>
  );

  const savings = items.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-5 sm:py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-dark-900">Shopping Cart</h1>
        <button onClick={() => dispatch(clearCart())} className="text-xs sm:text-sm text-red-400 hover:text-red-600 transition-colors">Clear All</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-2 sm:space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 flex gap-3 sm:gap-4">
              <Link to={`/products/${item.id}`} className="flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-18 h-18 sm:w-24 sm:h-24 w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] object-cover rounded-lg sm:rounded-xl" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] sm:text-xs font-semibold text-primary-600 uppercase">{item.brand}</p>
                    <h3 className="text-xs sm:text-sm font-medium text-dark-800 line-clamp-2">{item.name}</h3>
                  </div>
                  <button onClick={() => dispatch(removeFromCart(item.id))} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                  <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                    <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-50 hover:text-primary-600 transition-colors"><Minus size={12} /></button>
                    <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-50 hover:text-primary-600 transition-colors"><Plus size={12} /></button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm sm:text-base text-dark-900">{formatPrice(item.price * item.quantity)}</div>
                    {item.originalPrice && <div className="text-[10px] text-green-600">Save {formatPrice((item.originalPrice - item.price) * item.quantity)}</div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Coupon */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Tag size={15} className="text-primary-600" />
              <h3 className="font-semibold text-dark-800 text-sm">Apply Coupon</h3>
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter coupon code" className="flex-1 min-w-0 border border-gray-200 rounded-full px-3 py-2 text-xs sm:text-sm outline-none focus:border-primary-400 transition-colors" />
              <button className="btn-outline text-xs sm:text-sm py-2 px-3 sm:px-4">Apply</button>
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {['FIRST10','SAVE20','FREESHIP'].map(c => (
                <span key={c} className="text-[10px] sm:text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full font-mono cursor-pointer hover:bg-primary-100">{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-5 lg:sticky lg:top-36">
            <h2 className="font-semibold text-dark-800 text-base sm:text-lg mb-3 sm:mb-4">Order Summary</h2>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm mb-3 sm:mb-4">
              <div className="flex justify-between text-gray-600"><span>Price ({items.length} item{items.length>1?'s':''})</span><span>{formatPrice(items.reduce((s,i)=>s+(i.originalPrice||i.price)*i.quantity,0))}</span></div>
              {savings > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(savings)}</span></div>}
              <div className="flex justify-between text-gray-600"><span>Delivery</span><span className="text-green-600 font-medium">FREE</span></div>
            </div>
            <div className="border-t border-dashed pt-3 mb-4">
              <div className="flex justify-between font-bold text-dark-900"><span>Total</span><span className="text-lg sm:text-xl">{formatPrice(total)}</span></div>
              {savings > 0 && <p className="text-[10px] sm:text-xs text-green-600 mt-1">🎉 You save {formatPrice(savings)}!</p>}
            </div>
            <Link to="/checkout" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 text-sm">
              Proceed to Checkout <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
