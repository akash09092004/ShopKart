import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { closeCart, removeFromCart, updateQuantity, selectCartItems, selectCartTotal, selectCartOpen } from '../../store/cartSlice';
import { formatPrice } from '../../data/products';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectCartOpen);
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => dispatch(closeCart())} />}
      <div className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary-600" />
            <h2 className="font-display font-bold text-lg sm:text-xl">Your Cart</h2>
            {items.length > 0 && <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>}
          </div>
          <button onClick={() => dispatch(closeCart())} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag size={56} className="text-gray-200 mb-4" />
              <h3 className="font-display text-xl font-bold text-dark-800 mb-1">Cart is empty</h3>
              <p className="text-sm text-gray-400 mb-6">Add items to get started</p>
              <button onClick={() => dispatch(closeCart())} className="btn-primary text-sm">Continue Shopping</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-2 sm:gap-3 bg-gray-50 rounded-xl p-2.5 sm:p-3">
                <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-[72px] sm:h-[72px] object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-dark-800 line-clamp-2 leading-snug">{item.name}</h4>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="font-bold text-sm text-dark-900">{formatPrice(item.price)}</span>
                    <button onClick={() => dispatch(removeFromCart(item.id))} className="text-gray-400 hover:text-red-500 transition-colors p-0.5">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary-400 hover:text-primary-600 transition-colors">
                      <Minus size={11} />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary-400 hover:text-primary-600 transition-colors">
                      <Plus size={11} />
                    </button>
                    <span className="text-xs text-gray-400">= {formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-3 sm:p-4 border-t border-gray-100">
            <div className="space-y-1.5 mb-3 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Delivery</span><span className="text-green-600 font-medium">FREE</span></div>
              <div className="border-t pt-1.5 flex justify-between font-bold text-dark-900">
                <span>Total</span><span className="text-lg">{formatPrice(total)}</span>
              </div>
            </div>
            <Link to="/checkout" onClick={() => dispatch(closeCart())}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all active:scale-95">
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <button onClick={() => dispatch(closeCart())} className="w-full text-center text-xs text-gray-400 hover:text-primary-600 mt-2 transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
