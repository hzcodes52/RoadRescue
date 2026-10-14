import { Phone, MapPin, Mail, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 animate-fade-in">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-bold text-navy-900">Contact Us</h1>
        <p className="mt-4 text-lg text-navy-500">
          We are here to help — 24/7 emergency roadside assistance.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy-900">
                <MapPin className="h-6 w-6 text-accent-500" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-navy-900">Address</h3>
                <p className="mt-1 text-navy-500">ACEIT, Kukas, Jaipur, Rajasthan, India</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy-900">
                <Phone className="h-6 w-6 text-accent-500" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-navy-900">Phone</h3>
                <a href="tel:9116438827" className="mt-1 block text-navy-500 hover:text-accent-500 transition-colors">
                  9116438827
                </a>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy-900">
                <Mail className="h-6 w-6 text-accent-500" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-navy-900">Email</h3>
                <a href="mailto:admin@roadrescue.in" className="mt-1 block text-navy-500 hover:text-accent-500 transition-colors">
                  admin@roadrescue.in
                </a>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy-900">
                <Clock className="h-6 w-6 text-accent-500" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-navy-900">Hours</h3>
                <p className="mt-1 text-navy-500">24/7 Emergency Service — Every day of the year</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map / illustration */}
        <div className="card overflow-hidden">
          <div className="flex h-full flex-col items-center justify-center bg-navy-900 p-12 text-center">
            <MapPin className="h-16 w-16 text-accent-500" />
            <h3 className="mt-6 font-heading text-2xl font-bold text-white">ACEIT, Kukas</h3>
            <p className="mt-2 text-navy-200">Jaipur, Rajasthan, India</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=ACEIT+Kukas+Jaipur+Rajasthan"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 btn-primary"
            >
              View on Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
