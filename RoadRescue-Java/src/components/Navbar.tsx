import { Link, NavLink, useNavigate } from '@/lib/router-compat';
import { useState } from 'react';
import { Wrench, Menu, X, LogOut, LayoutDashboard, User as UserIcon, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
  const { user, logout, isAdmin, isMechanic } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-accent-500' : 'text-navy-600 hover:text-navy-900'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900">
            <Wrench className="h-5 w-5 text-accent-500" />
          </div>
          <span className="font-heading text-lg font-bold text-navy-900">
            Road<span className="text-accent-500">Rescue</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLink} end>Home</NavLink>
          <NavLink to="/track" className={navLink}>Track Request</NavLink>
          <NavLink to="/contact" className={navLink}>Contact</NavLink>
          {user && !isAdmin && !isMechanic && (
            <>
              <NavLink to="/request" className={navLink}>Request Help</NavLink>
              <NavLink to="/dashboard" className={navLink}>My Requests</NavLink>
            </>
          )}
          {isAdmin && <NavLink to="/admin/dashboard" className={navLink}>Admin Dashboard</NavLink>}
          {isMechanic && <NavLink to="/mechanic/dashboard" className={navLink}>Mechanic Jobs</NavLink>}
        </div>

        {/* Desktop auth */}
        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <>
              <Link to="/mechanic/login" className="btn-ghost">For Mechanics</Link>
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-navy-600">
                {isAdmin ? <Shield className="h-4 w-4 text-accent-500" /> : <UserIcon className="h-4 w-4" />}
                <span className="font-medium">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn-ghost">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6 text-navy-700" /> : <Menu className="h-6 w-6 text-navy-700" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-navy-100 bg-white md:hidden animate-slide-down">
          <div className="flex flex-col gap-1 px-4 py-4">
            <NavLink to="/" className={navLink} end onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/track" className={navLink} onClick={() => setOpen(false)}>Track Request</NavLink>
            <NavLink to="/contact" className={navLink} onClick={() => setOpen(false)}>Contact</NavLink>
            {user && !isAdmin && !isMechanic && (
              <>
                <NavLink to="/request" className={navLink} onClick={() => setOpen(false)}>Request Help</NavLink>
                <NavLink to="/dashboard" className={navLink} onClick={() => setOpen(false)}>My Requests</NavLink>
              </>
            )}
            {isMechanic && (
              <NavLink to="/mechanic/dashboard" className={navLink} onClick={() => setOpen(false)}>Mechanic Jobs</NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin/dashboard" className={navLink} onClick={() => setOpen(false)}>
                <span className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> Admin Dashboard</span>
              </NavLink>
            )}
            <div className="my-2 border-t border-navy-100" />
            {!user ? (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="btn-secondary" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/mechanic/login" className="btn-secondary" onClick={() => setOpen(false)}>For Mechanics</Link>
                <Link to="/register" className="btn-primary" onClick={() => setOpen(false)}>Get Started</Link>
              </div>
            ) : (
              <button onClick={handleLogout} className="btn-ghost justify-start">
                <LogOut className="h-4 w-4" /> Logout ({user.name})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
