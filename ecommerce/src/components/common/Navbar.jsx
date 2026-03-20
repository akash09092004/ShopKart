import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Search, Heart, Menu, X, MapPin, ChevronDown, User, Check } from 'lucide-react';
import { toggleCart, selectCartCount } from '../../store/cartSlice';
import { selectWishlistItems } from '../../store/wishlistSlice';

const navCategories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports', 'Books', 'Toys', 'Grocery'];
const catIcons = { Electronics:'💻', Fashion:'👗', 'Home & Kitchen':'🏠', Beauty:'💄', Sports:'⚽', Books:'📚', Toys:'🧸', Grocery:'🛒' };

const CITIES = [
  { name: 'Delhi', pin: '110001' }, { name: 'Mumbai', pin: '400001' },
  { name: 'Bangalore', pin: '560001' }, { name: 'Chennai', pin: '600001' },
  { name: 'Kolkata', pin: '700001' }, { name: 'Hyderabad', pin: '500001' },
  { name: 'Pune', pin: '411001' }, { name: 'Ahmedabad', pin: '380001' },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useSelector(selectCartCount);
  const wishlistItems = useSelector(selectWishlistItems);

  const [search, setSearch] = useState('');
  const [searchCat, setSearchCat] = useState('All');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [city, setCity] = useState({ name: 'Delhi', pin: '110001' });
  const [pinInput, setPinInput] = useState('');
  const [pinSaved, setPinSaved] = useState(false);

  const signInRef = useRef(null);
  const locationRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname, location.search]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const fn = (e) => {
      if (signInRef.current && !signInRef.current.contains(e.target)) setShowSignIn(false);
      if (locationRef.current && !locationRef.current.contains(e.target)) setShowLocation(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    const params = new URLSearchParams();
    if (q) params.set('search', q);
    if (searchCat !== 'All') params.set('category', searchCat);
    navigate(`/products${params.toString() ? '?' + params.toString() : ''}`);
    setSearch('');
    setMobileOpen(false);
    // reset category selector back to All after search
    setSearchCat('All');
  };

  const handleCatChange = (e) => {
    const cat = e.target.value;
    setSearchCat(cat);
    if (cat !== 'All') {
      navigate(`/products?category=${encodeURIComponent(cat)}`);
    } else {
      navigate('/products');
    }
    // Focus search input after category select so user can type
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const handleNavCategory = (cat) => {
    navigate(`/products?category=${encodeURIComponent(cat)}`);
    setMobileOpen(false);
  };

  const handleCitySelect = (c) => {
    setCity(c);
    setPinInput('');
    setPinSaved(false);
    setShowLocation(false);
  };

  const handlePinSave = () => {
    if (pinInput.length === 6) {
      setCity({ name: 'Custom', pin: pinInput });
      setPinSaved(true);
      setTimeout(() => { setShowLocation(false); setPinSaved(false); }, 900);
    }
  };

  return (
    <>
      {/* Promo bar */}
      <div className="bg-primary-600 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>🎉 10% off on first order! Code: <strong>FIRST10</strong></span>
          <div className="hidden md:flex items-center gap-4">
            <span className="cursor-pointer hover:underline">Sell on ShopKart</span>
            <span>|</span>
            <span className="cursor-pointer hover:underline">Customer Support</span>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-lg' : ''} glass border-b border-gray-100`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4">

          {/* Top row */}
          <div className="flex items-center gap-2 sm:gap-3 h-14 sm:h-16">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="font-display font-black text-xl sm:text-2xl text-primary-600 tracking-tight">
                Shop<span className="text-dark-800">Kart</span>
              </span>
            </Link>

            {/* ── Location dropdown ── */}
            <div className="relative hidden lg:block flex-shrink-0" ref={locationRef}>
              <button
                onClick={() => setShowLocation(v => !v)}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors group"
              >
                <MapPin size={15} className="text-primary-600 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-[10px] text-gray-400 leading-none">Deliver to</div>
                  <div className="font-semibold text-dark-800 text-xs flex items-center gap-0.5 group-hover:text-primary-600 transition-colors">
                    {city.name} {city.pin} <ChevronDown size={11} className={`transition-transform ${showLocation ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </button>

              {showLocation && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-fade-in">
                  <h4 className="font-semibold text-dark-800 text-sm mb-3 flex items-center gap-2">
                    <MapPin size={14} className="text-primary-600" /> Choose Delivery Location
                  </h4>
                  {/* Pincode input */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="number"
                      value={pinInput}
                      onChange={e => setPinInput(e.target.value.slice(0,6))}
                      placeholder="Enter 6-digit pincode"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400 transition-colors"
                      onKeyDown={e => e.key === 'Enter' && handlePinSave()}
                    />
                    <button
                      onClick={handlePinSave}
                      className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${pinSaved ? 'bg-green-500 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}
                    >
                      {pinSaved ? <Check size={14} /> : 'Apply'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">Or select a city:</p>
                  <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto">
                    {CITIES.map(c => (
                      <button key={c.pin} onClick={() => handleCitySelect(c)}
                        className={`text-left px-3 py-2 rounded-xl text-xs transition-colors ${city.pin === c.pin ? 'bg-primary-50 text-primary-700 font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-gray-400">{c.pin}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Search bar ── */}
            <form onSubmit={handleSearch} className="hidden sm:flex flex-1 min-w-0">
              <div className="flex w-full rounded-full overflow-hidden border border-gray-200 focus-within:border-primary-500 focus-within:shadow-sm transition-all">
                <select
                  value={searchCat}
                  onChange={handleCatChange}
                  className="hidden md:block border-r border-gray-200 bg-gray-50 px-2 py-2 text-xs text-gray-600 outline-none cursor-pointer hover:bg-gray-100 flex-shrink-0 transition-colors"
                  style={{ minWidth: 78 }}
                >
                  <option value="All">All</option>
                  {navCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="flex-1 min-w-0 py-2 px-3 text-sm outline-none bg-white placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-4 sm:px-5 flex items-center transition-colors flex-shrink-0"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* Right icons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto sm:ml-0">

              {/* Sign In */}
              <div className="relative hidden md:block" ref={signInRef}>
                <button onClick={() => setShowSignIn(v => !v)}
                  className="flex items-center gap-1 text-sm font-medium text-dark-700 hover:text-primary-600 transition-colors">
                  <User size={20} />
                  <span className="text-xs hidden lg:block">Sign In</span>
                </button>
                {showSignIn && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50 animate-fade-in">
                    <h3 className="font-display font-bold text-lg text-dark-900 mb-4">Sign In</h3>
                    <div className="space-y-3">
                      <input type="email" placeholder="Email / Mobile Number"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400 transition-colors" />
                      <input type="password" placeholder="Password"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400 transition-colors" />
                      <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-full transition-colors">
                        Sign In
                      </button>
                    </div>
                    <div className="relative my-3">
                      <div className="border-t border-gray-100" />
                      <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-400">or</span>
                    </div>
                    <button className="w-full border border-gray-200 text-dark-700 font-medium py-2.5 rounded-full text-sm hover:border-gray-300 flex items-center justify-center gap-2 transition-colors">
                      🔍 Continue with Google
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-3">
                      New user? <span className="text-primary-600 font-semibold cursor-pointer hover:underline">Create Account</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative text-dark-700 hover:text-primary-600 transition-colors hidden sm:block">
                <Heart size={22} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button onClick={() => dispatch(toggleCart())}
                className="relative flex items-center gap-1 text-dark-700 hover:text-primary-600 transition-colors">
                <div className="relative">
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-0.5">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs hidden lg:block font-medium">Cart</span>
              </button>

              {/* Hamburger (mobile) */}
              <button onClick={() => setMobileOpen(v => !v)} className="sm:hidden p-1 text-dark-700">
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Category nav bar (desktop) */}
          <div className="hidden sm:block border-t border-gray-100 -mx-3 sm:-mx-4 px-3 sm:px-4">
            <div className="flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-hide">
              <button onClick={() => navigate('/products')}
                className="whitespace-nowrap px-3 py-1 text-xs font-semibold bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors flex-shrink-0">
                All Products
              </button>
              {navCategories.map(cat => (
                <button key={cat} onClick={() => handleNavCategory(cat)}
                  className="whitespace-nowrap px-3 py-1 text-xs font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors flex-shrink-0">
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden bg-white border-t border-gray-100 px-3 pb-4 pt-3 animate-fade-in">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-3">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-primary-400" />
              <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-full flex items-center">
                <Search size={15} />
              </button>
            </form>
            {/* Mobile location */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 mb-3">
              <MapPin size={14} className="text-primary-600 flex-shrink-0" />
              <span className="text-xs text-gray-600">Delivering to <strong>{city.name} {city.pin}</strong></span>
              <button onClick={() => { setMobileOpen(false); setShowLocation(true); }} className="ml-auto text-xs text-primary-600 font-semibold">Change</button>
            </div>
            {/* Category grid */}
            <div className="grid grid-cols-4 gap-2">
              {navCategories.map(cat => (
                <button key={cat} onClick={() => handleNavCategory(cat)}
                  className="flex flex-col items-center gap-1 py-2 bg-gray-50 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                  <span className="text-xl">{catIcons[cat]}</span>
                  <span className="text-[9px] font-medium text-center leading-tight">{cat}</span>
                </button>
              ))}
            </div>
            {/* Mobile bottom actions */}
            <div className="flex items-center justify-around mt-3 pt-3 border-t border-gray-100">
              <button onClick={() => { setShowSignIn(true); setMobileOpen(false); }}
                className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary-600">
                <User size={20} /><span className="text-xs">Sign In</span>
              </button>
              <Link to="/wishlist" onClick={() => setMobileOpen(false)}
                className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary-600 relative">
                <Heart size={20} />
                {wishlistItems.length > 0 && <span className="absolute -top-1 right-0 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{wishlistItems.length}</span>}
                <span className="text-xs">Wishlist</span>
              </Link>
              <Link to="/cart" onClick={() => setMobileOpen(false)}
                className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary-600 relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="absolute -top-1 right-2 bg-primary-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{cartCount}</span>}
                <span className="text-xs">Cart</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
