import { useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { Loader2, MapPin, Send, Crosshair } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { useAuth } from '@/lib/auth';
import { SERVICE_LABELS, type ServiceCategory } from '@/lib/types';

export default function RequestService() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [form, setForm] = useState({
    customerName: user?.name || '',
    contactNumber: '',
    vehicleType: '',
    vehicleModel: '',
    vehicleRegNumber: '',
    serviceCategory: '' as ServiceCategory | '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    additionalNotes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.show('Geolocation is not supported by your browser.', 'error');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        toast.show('Location captured successfully.', 'success');
        setLocating(false);
      },
      () => {
        toast.show('Could not access your location. Please enter manually.', 'error');
        setLocating(false);
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.contactNumber || !form.vehicleType || !form.vehicleModel ||
        !form.serviceCategory || !form.description || !form.location) {
      toast.show('Please fill in all required fields.', 'error');
      return;
    }
    setLoading(true);
    try {
      const req = await api.createRequest({
        customerName: form.customerName,
        contactNumber: form.contactNumber,
        vehicleType: form.vehicleType,
        vehicleModel: form.vehicleModel,
        vehicleRegNumber: form.vehicleRegNumber || undefined,
        serviceCategory: form.serviceCategory as ServiceCategory,
        description: form.description,
        location: form.location,
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        additionalNotes: form.additionalNotes || undefined,
      });
      toast.show(`Request submitted! Your request ID is ${req.requestId}`, 'success');
      navigate('/dashboard');
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Failed to submit request.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-bold text-navy-900">Request Roadside Assistance</h1>
        <p className="mt-2 text-navy-500">Fill out the form below and our team will respond quickly.</p>
      </div>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-6 p-8">
        {/* Personal info */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label-field">Customer Name *</label>
            <input name="customerName" className="input-field" placeholder="Your full name" value={form.customerName} onChange={handleChange} />
          </div>
          <div>
            <label className="label-field">Contact Number *</label>
            <input name="contactNumber" className="input-field" placeholder="9876543210" value={form.contactNumber} onChange={handleChange} />
          </div>
        </div>

        {/* Vehicle info */}
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="label-field">Vehicle Type *</label>
            <select name="vehicleType" className="input-field" value={form.vehicleType} onChange={handleChange}>
              <option value="">Select type</option>
              <option value="CAR">Car</option>
              <option value="BIKE">Bike</option>
              <option value="TRUCK">Truck</option>
              <option value="BUS">Bus</option>
              <option value="AUTO_RICKSHAW">Auto Rickshaw</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="label-field">Vehicle Model *</label>
            <input name="vehicleModel" className="input-field" placeholder="e.g. Maruti Swift" value={form.vehicleModel} onChange={handleChange} />
          </div>
          <div>
            <label className="label-field">Reg. Number (optional)</label>
            <input name="vehicleRegNumber" className="input-field" placeholder="RJ01 AB 1234" value={form.vehicleRegNumber} onChange={handleChange} />
          </div>
        </div>

        {/* Service */}
        <div>
          <label className="label-field">Service Category *</label>
          <select name="serviceCategory" className="input-field" value={form.serviceCategory} onChange={handleChange}>
            <option value="">Select a service</option>
            {(Object.keys(SERVICE_LABELS) as ServiceCategory[]).map((k) => (
              <option key={k} value={k}>{SERVICE_LABELS[k]}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="label-field">Breakdown Description *</label>
          <textarea name="description" rows={3} className="input-field" placeholder="Describe what happened..." value={form.description} onChange={handleChange} />
        </div>

        {/* Location */}
        <div>
          <label className="label-field">Breakdown Location / Address *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-navy-300" />
            <textarea name="location" rows={2} className="input-field pl-11" placeholder="e.g. NH-48, near Kukas, Jaipur" value={form.location} onChange={handleChange} />
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="label-field">Latitude (optional)</label>
            <input name="latitude" className="input-field" placeholder="26.9124" value={form.latitude} onChange={handleChange} />
          </div>
          <div>
            <label className="label-field">Longitude (optional)</label>
            <input name="longitude" className="input-field" placeholder="75.7873" value={form.longitude} onChange={handleChange} />
          </div>
          <div className="flex items-end">
            <button type="button" onClick={useMyLocation} className="btn-secondary w-full" disabled={locating}>
              {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
              Use My Location
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="label-field">Additional Notes (optional)</label>
          <textarea name="additionalNotes" rows={2} className="input-field" placeholder="Any other details that might help..." value={form.additionalNotes} onChange={handleChange} />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-4 w-4" /> Submit Request</>}
        </button>
      </form>
    </div>
  );
}
