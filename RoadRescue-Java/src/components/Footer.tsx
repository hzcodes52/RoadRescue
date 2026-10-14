import { Link } from '@/lib/router-compat';
import { Wrench, Phone, MapPin, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800">
                <Wrench className="h-5 w-5 text-accent-500" />
              </div>
              <span className="font-heading text-lg font-bold text-white">
                Road<span className="text-accent-500">Rescue</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-navy-300">
              Stranded on the Road? Help Is on the Way. Professional roadside
              assistance available 24/7 across Jaipur, Rajasthan.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/" className="hover:text-accent-400 transition-colors">Home</Link></li>
              <li><Link to="/track" className="hover:text-accent-400 transition-colors">Track a Request</Link></li>
              <li><Link to="/request" className="hover:text-accent-400 transition-colors">Request Assistance</Link></li>
              <li><Link to="/contact" className="hover:text-accent-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/admin/login" className="hover:text-accent-400 transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-accent-500 shrink-0" />
                <span>ACEIT, Kukas, Jaipur, Rajasthan, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent-500 shrink-0" />
                <a href="tel:9116438827" className="hover:text-accent-400 transition-colors">
                  9116438827
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent-500 shrink-0" />
                <a href="mailto:admin@roadrescue.in" className="hover:text-accent-400 transition-colors">
                  admin@roadrescue.in
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-accent-500 shrink-0" />
                <span>24/7 Emergency Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-navy-800 pt-6 text-center text-xs text-navy-400">
          &copy; {new Date().getFullYear()} RoadRescue. All rights reserved. Built as a college PBL project.
        </div>
      </div>
    </footer>
  );
}
