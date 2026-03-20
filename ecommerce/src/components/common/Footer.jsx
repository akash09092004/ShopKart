import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-800 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="font-display font-black text-2xl sm:text-3xl text-white mb-3">
              Shop<span className="text-primary-400">Kart</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 leading-relaxed">India's most trusted e-commerce platform. Delivering happiness to millions.</p>
            <div className="flex gap-2">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="w-7 h-7 sm:w-8 sm:h-8 bg-dark-600 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                  <Icon size={13} />
                </button>
              ))}
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              {['About Us', 'Careers', 'Press', 'Blog', 'Affiliate'].map(l => (
                <li key={l}><a href="#" className="hover:text-primary-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          {/* Customer */}
          <div>
            <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm">Customer Service</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              {['Help Center', 'Track Order', 'Returns', 'Payment', 'Shipping'].map(l => (
                <li key={l}><a href="#" className="hover:text-primary-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm">Contact</h4>
            <div className="space-y-2 text-xs sm:text-sm mb-4">
              <div className="flex items-start gap-2"><MapPin size={13} className="text-primary-400 mt-0.5 flex-shrink-0" /><span>123 Commerce St, New Delhi - 110001</span></div>
              <div className="flex items-center gap-2"><Phone size={13} className="text-primary-400 flex-shrink-0" /><span>1800-123-4567</span></div>
              <div className="flex items-center gap-2"><Mail size={13} className="text-primary-400 flex-shrink-0" /><span>support@shopkart.in</span></div>
            </div>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="flex-1 min-w-0 bg-dark-600 border border-dark-500 rounded-l-full px-3 py-1.5 text-xs outline-none focus:border-primary-500 text-white placeholder-gray-500" />
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-r-full text-xs font-medium transition-colors">Go</button>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-600 mt-8 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[10px] sm:text-xs text-gray-500 text-center sm:text-left">© 2025 ShopKart. All rights reserved.</p>
          <div className="flex gap-3 text-[10px] sm:text-xs text-gray-500">
            {['Privacy', 'Terms', 'Cookies'].map(t => <a key={t} href="#" className="hover:text-primary-400">{t}</a>)}
          </div>
          <div className="flex gap-1.5">
            {['VISA', 'MC', 'UPI', 'GPay'].map(p => (
              <div key={p} className="bg-white text-dark-800 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
