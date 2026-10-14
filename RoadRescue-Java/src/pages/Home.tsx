import { Link } from '@/lib/router-compat';
import {
  Wrench, Phone, MapPin, Shield, Clock, CheckCircle, ArrowRight,
  Car, Battery, Anchor, Settings, CircleDot, Truck, Search, ClipboardList, Bell,
} from 'lucide-react';
import { SERVICE_LABELS } from '@/lib/types';

const services = [
  { key: 'VEHICLE_BREAKDOWN', icon: Car, desc: 'Expert help when your vehicle stops running on the road.' },
  { key: 'PUNCTURE_TYRE', icon: CircleDot, desc: 'On-spot puncture repair and tyre replacement services.' },
  { key: 'BATTERY_JUMPSTART', icon: Battery, desc: 'Quick battery jump-start to get you moving again.' },
  { key: 'EMERGENCY_TOWING', icon: Truck, desc: 'Safe and reliable towing to your nearest service center.' },
  { key: 'MECHANICAL_REPAIRS', icon: Settings, desc: 'On-site minor mechanical repairs by trained mechanics.' },
  { key: 'OTHER', icon: Wrench, desc: 'Any other roadside emergency — we are here to help.' },
] as const;

const steps = [
  { icon: ClipboardList, title: 'Submit Request', desc: 'Fill out a quick form with your vehicle and breakdown details.' },
  { icon: Bell, title: 'Get Notified', desc: 'Our team reviews and approves your request promptly.' },
  { icon: Search, title: 'Track Status', desc: 'Use your unique request ID to track progress in real time.' },
  { icon: CheckCircle, title: 'Problem Solved', desc: 'A mechanic arrives and resolves your roadside issue.' },
];

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900">
        <div className="absolute inset-0">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-accent-600/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent-500/10 px-4 py-1.5 text-sm font-medium text-accent-400 ring-1 ring-accent-500/20">
                <Clock className="h-4 w-4" /> 24/7 Emergency Roadside Assistance
              </div>
              <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Stranded on the Road?<br />
                <span className="text-accent-500">Help Is on the Way.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-navy-200">
                RoadRescue provides fast, reliable roadside assistance across Jaipur —
                from breakdowns and punctures to towing and mechanical repairs.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/request" className="btn-primary">
                  Request Assistance <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/track" className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20">
                  Track a Request
                </Link>
              </div>
              <a href="tel:9116438827" className="mt-6 inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 transition-colors">
                <Phone className="h-5 w-5" /> Call Emergency: 9116438827
              </a>
            </div>

            <div className="hidden lg:block animate-slide-up">
              <div className="relative rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 p-8 ring-1 ring-white/10">
                <div className="grid grid-cols-2 gap-4">
                  {services.slice(0, 4).map((s) => (
                    <div key={s.key} className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10 transition-all hover:bg-white/10">
                      <s.icon className="h-8 w-8 text-accent-500" />
                      <p className="mt-3 text-sm font-semibold text-white">{SERVICE_LABELS[s.key]}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl bg-accent-500/10 p-5 ring-1 ring-accent-500/20">
                  <Shield className="h-8 w-8 text-accent-500" />
                  <p className="mt-3 text-sm font-semibold text-white">Trained & Verified Mechanics</p>
                  <p className="mt-1 text-xs text-navy-300">Every service provider is vetted for quality and safety.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-navy-900 sm:text-4xl">Our Services</h2>
          <p className="mt-4 text-lg text-navy-500">Comprehensive roadside assistance, anytime you need it.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.key} className="card group p-6 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-900 transition-colors group-hover:bg-accent-500">
                <s.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-navy-900">{SERVICE_LABELS[s.key]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-navy-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-navy-900 sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-navy-500">Getting help is simple — just four steps.</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-navy-100">
                  <step.icon className="h-8 w-8 text-accent-500" />
                </div>
                <div className="mx-auto mt-4 flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-sm text-navy-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-navy-900 px-8 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Need Help Right Now?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-navy-200">
            Don't wait on the side of the road. Submit a request or call us directly.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/request" className="btn-primary">
              Request Assistance <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="tel:9116438827" className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Phone className="h-4 w-4" /> Call 9116438827
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
