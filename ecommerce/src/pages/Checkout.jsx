import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, CreditCard, Truck, CheckCircle, Lock, ArrowLeft } from 'lucide-react';
import { selectCartItems, selectCartTotal, clearCart } from '../store/cartSlice';
import { formatPrice } from '../data/products';

const steps = ['Address', 'Payment', 'Confirmation'];

export default function Checkout() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);

  const [address, setAddress] = useState({ name: '', phone: '', pincode: '', address: '', city: '', state: '' });
  const [payment, setPayment] = useState('upi');

  const handlePlaceOrder = () => {
    setPlaced(true);
    dispatch(clearCart());
  };

  if (placed) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fade-in">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={44} className="text-green-500" />
      </div>
      <h2 className="font-display text-3xl font-bold text-dark-900 mb-3">Order Placed! 🎉</h2>
      <p className="text-gray-500 mb-2">Thank you for your order. We'll send a confirmation shortly.</p>
      <p className="text-primary-600 font-semibold mb-8">Order #SK{Math.floor(Math.random() * 900000 + 100000)}</p>
      <div className="bg-green-50 rounded-2xl p-4 mb-8">
        <div className="flex items-center gap-2 text-green-700">
          <Truck size={16} />
          <span className="text-sm font-medium">Expected delivery: Tomorrow by 9 PM</span>
        </div>
      </div>
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        Continue Shopping
      </Link>
    </div>
  );

  if (items.length === 0) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <p className="text-gray-500 mb-4">Your cart is empty</p>
      <Link to="/products" className="btn-primary">Shop Now</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Cart
      </Link>
      <h1 className="font-display text-3xl font-bold text-dark-900 mb-6">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-shrink-0">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                i === step ? 'bg-primary-600 text-white shadow-md' :
                i < step ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-400'
              }`}
              onClick={() => i < step && setStep(i)}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-white text-primary-600' : i < step ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                {i < step ? '✓' : i + 1}
              </span>
              {s}
            </div>
            {i < steps.length - 1 && <div className={`h-0.5 w-8 mx-1 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step content */}
        <div className="lg:col-span-2">
          {step === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <MapPin size={18} className="text-primary-600" />
                <h2 className="font-semibold text-dark-800 text-lg">Delivery Address</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name', placeholder: 'Enter full name', span: 1 },
                  { key: 'phone', label: 'Phone Number', placeholder: '10-digit phone number', span: 1 },
                  { key: 'address', label: 'Address', placeholder: 'House/Flat No, Street, Colony', span: 2 },
                  { key: 'pincode', label: 'Pincode', placeholder: '6-digit pincode', span: 1 },
                  { key: 'city', label: 'City', placeholder: 'City', span: 1 },
                  { key: 'state', label: 'State', placeholder: 'State', span: 1 },
                ].map(({ key, label, placeholder, span }) => (
                  <div key={key} className={span === 2 ? 'md:col-span-2' : ''}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={address[key]}
                      onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep(1)}
                disabled={!address.name || !address.phone || !address.address}
                className="mt-6 btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment <ChevronRight size={16} />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={18} className="text-primary-600" />
                <h2 className="font-semibold text-dark-800 text-lg">Payment Method</h2>
              </div>
              <div className="space-y-3">
                {[
                  { id: 'upi', label: 'UPI', sub: 'Pay using any UPI app', icon: '📱' },
                  { id: 'card', label: 'Credit / Debit Card', sub: 'All major cards accepted', icon: '💳' },
                  { id: 'netbanking', label: 'Net Banking', sub: 'All major banks', icon: '🏦' },
                  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when you receive', icon: '💵' },
                ].map(opt => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment === opt.id ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <input type="radio" value={opt.id} checked={payment === opt.id} onChange={e => setPayment(e.target.value)} className="sr-only" />
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-dark-800">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.sub}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payment === opt.id ? 'border-primary-500' : 'border-gray-300'}`}>
                      {payment === opt.id && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />}
                    </div>
                  </label>
                ))}
              </div>

              {payment === 'upi' && (
                <div className="mt-4">
                  <input type="text" placeholder="Enter UPI ID (e.g. yourname@upi)" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400 transition-colors" />
                </div>
              )}

              {payment === 'card' && (
                <div className="mt-4 space-y-3">
                  <input type="text" placeholder="Card Number" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400 transition-colors" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM/YY" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400 transition-colors" />
                    <input type="text" placeholder="CVV" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400 transition-colors" />
                  </div>
                  <input type="text" placeholder="Name on Card" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400 transition-colors" />
                </div>
              )}

              <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
                <Lock size={11} /> All transactions are 100% secure and encrypted
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={() => setStep(0)} className="btn-outline flex items-center gap-1 text-sm">
                  <ArrowLeft size={14} /> Back
                </button>
                <button onClick={handlePlaceOrder} className="btn-primary flex items-center gap-2">
                  Place Order ({formatPrice(total)}) <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-36">
            <h3 className="font-semibold text-dark-800 mb-4">Order Summary ({items.length} items)</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-dark-700 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-dark-900 flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span><span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Delivery</span><span>FREE</span>
              </div>
              <div className="flex justify-between font-bold text-dark-900 pt-1 border-t">
                <span>Total</span><span className="text-lg">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
