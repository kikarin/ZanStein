import Link from 'next/link';
import { FaGithub, FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-transparent to-primary/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">ZanStein Solution</h3>
            <p className="text-gray-600">
              Providing professional coding services and innovative solutions for your digital needs.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/yourusername" className="text-gray-600 hover:text-primary transition-colors">
                <FaGithub size={24} />
              </a>
              <a href="https://instagram.com/yourusername" className="text-gray-600 hover:text-primary transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="https://wa.me/yourwhatsapp" className="text-gray-600 hover:text-primary transition-colors">
                <FaWhatsapp size={24} />
              </a>
              <a href="mailto:your@email.com" className="text-gray-600 hover:text-primary transition-colors">
                <FaEnvelope size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-600 hover:text-primary transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">Web Development</li>
              <li className="text-gray-600">Mobile Apps</li>
              <li className="text-gray-600">UI/UX Design</li>
              <li className="text-gray-600">Consulting</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Stay Updated</h3>
            <p className="text-gray-600">Subscribe to our newsletter for updates and tips.</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600">
              © {new Date().getFullYear()} ZanStein Solution. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-600 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
