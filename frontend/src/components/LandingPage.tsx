import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const testimonials = [
  {
    name: 'Amit S.',
    role: 'Project Manager',
    text: 'HireHelper has streamlined our workflow and made team collaboration effortless. Highly recommended!',
    avatar: '/default-pfp.jpg',
  },
  {
    name: 'Priya K.',
    role: 'Freelancer',
    text: 'The intuitive interface and powerful features make managing my tasks a breeze.',
    avatar: '/default-pfp.jpg',
  },
  {
    name: 'Rahul D.',
    role: 'Team Lead',
    text: 'Notifications and task tracking are spot on. Our productivity has improved a lot!',
    avatar: '/default-pfp.jpg',
  },
];

const features = [
  {
    title: 'Task Management',
    desc: 'Create, assign, and track tasks with ease. Stay on top of your work and deadlines.',
    icon: '📝',
    color: 'bg-gradient-to-tr from-blue-400 to-blue-600 text-white',
  },
  {
    title: 'Team Collaboration',
    desc: 'Work together with your team, share updates, and communicate efficiently.',
    icon: '🤝',
    color: 'bg-gradient-to-tr from-green-400 to-green-600 text-white',
  },
  {
    title: 'Real-time Notifications',
    desc: 'Get instant updates on important activities and never miss a thing.',
    icon: '🔔',
    color: 'bg-gradient-to-tr from-yellow-400 to-yellow-600 text-white',
  },
  {
    title: 'Secure & Reliable',
    desc: 'Your data is protected with industry-standard security and privacy.',
    icon: '🔒',
    color: 'bg-gradient-to-tr from-indigo-400 to-indigo-600 text-white',
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  // For cache-busting the GIF to force animation on refresh
  const gifSrc = `/Live collaboration.gif?v=${Date.now()}`;

  // Scroll-to-top button state
  const [showScroll, setShowScroll] = useState(false);
  // Section highlight state
  const [activeSection, setActiveSection] = useState('');
  const featuresRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
      // Section highlight logic
      const scrollY = window.scrollY + 120;
      if (contactRef.current && scrollY >= contactRef.current.offsetTop) {
        setActiveSection('contact');
      } else if (testimonialsRef.current && scrollY >= testimonialsRef.current.offsetTop) {
        setActiveSection('testimonials');
      } else if (featuresRef.current && scrollY >= featuresRef.current.offsetTop) {
        setActiveSection('features');
      } else {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Feature card animation on scroll
  useEffect(() => {
    const cards = document.querySelectorAll('.feature-card');
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeinup');
          }
        });
      },
      { threshold: 0.2 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-x-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-blue-200 opacity-30 rounded-full blur-3xl z-0" />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-indigo-200 opacity-20 rounded-full blur-2xl z-0" />
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-4 sm:px-8 py-4 bg-white/70 shadow-sm border-b border-gray-100 sticky top-0 z-30 backdrop-blur-xl transition-all">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'} tabIndex={0} aria-label="Go to home" onKeyDown={e => {if(e.key==='Enter'){window.location.href='/'}}}>
          <img src="/WhatsApp Image 2025-08-29 at 13.54.47_e67163a7.jpg" alt="HireHelper Logo" className="w-10 h-10 rounded-xl" />
          <span className="text-2xl font-bold text-blue-700 tracking-tight">HireHelper</span>
        </div>
        <div className="flex gap-2 sm:gap-4 items-center">
          <button
            className={`text-gray-700 font-medium hover:text-blue-600 transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeSection==='features' ? 'bg-blue-100 text-blue-700' : ''}`}
            onClick={() => featuresRef.current?.scrollIntoView({behavior:'smooth'})}
            aria-current={activeSection==='features' ? 'page' : undefined}
          >Features</button>
          <button
            className={`text-gray-700 font-medium hover:text-blue-600 transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeSection==='testimonials' ? 'bg-blue-100 text-blue-700' : ''}`}
            onClick={() => testimonialsRef.current?.scrollIntoView({behavior:'smooth'})}
            aria-current={activeSection==='testimonials' ? 'page' : undefined}
          >Testimonials</button>
          <button
            className={`text-gray-700 font-medium hover:text-blue-600 transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeSection==='contact' ? 'bg-blue-100 text-blue-700' : ''}`}
            onClick={() => contactRef.current?.scrollIntoView({behavior:'smooth'})}
            aria-current={activeSection==='contact' ? 'page' : undefined}
          >Contact</button>
          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg hover:bg-blue-700 transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => navigate('/login')}
          >Login</button>
          <button
            className="px-5 py-2 border border-green-600 text-green-600 rounded-xl font-semibold shadow hover:bg-green-50 hover:scale-105 transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => navigate('/login', { state: { signup: true } })}
          >Sign Up</button>
        </div>
      </nav>

      {/* Hero Section - Redesigned to match reference layout */}
      <section className="flex flex-1 items-center justify-center py-4 px-2 sm:px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative">
        <div className="max-w-7xl w-full min-h-[540px] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-14 bg-white/70 rounded-3xl shadow-2xl border border-gray-100 p-4 sm:p-8 md:p-14 backdrop-blur-lg z-10 relative">
          {/* Left: Text Content */}
          <div className="flex-1 flex flex-col items-start justify-center">
            <span className="text-blue-600 font-semibold uppercase tracking-widest mb-2 text-base bg-blue-100/60 px-3 py-1 rounded-full shadow-sm">Empower your workflow</span>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight drop-shadow-sm">
              Welcome to <span className="text-blue-700">HireHelper</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Your trusted platform for managing tasks, collaborating with your team, and staying organized.<br className="hidden md:block" /> Secure, efficient, and designed for modern professionals.
            </p>
            <div className="flex gap-4">
              <button
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl hover:bg-blue-700 transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                onClick={() => navigate('/login')}
                tabIndex={0}
                aria-label="Get Started"
              >
                Get Started
              </button>
              <button
                className="px-8 py-3 border border-blue-600 text-blue-600 font-semibold rounded-xl shadow hover:bg-blue-50 hover:scale-105 transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                onClick={() => navigate('/login', { state: { signup: true } })}
                tabIndex={0}
                aria-label="Sign Up"
              >
                Sign Up
              </button>
            </div>
          </div>
          {/* Right: Animated SVG Illustration */}
          <div className="flex-1 flex items-center justify-center relative w-full md:w-auto mt-10 md:mt-0">
            <div className="relative flex items-center justify-center">
              {/* Animated GIF illustration */}
              <div className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] bg-gradient-to-tr from-blue-100 via-white to-indigo-100 rounded-2xl flex items-center justify-center shadow-inner">
                <img src={gifSrc} alt="Live collaboration" className="w-full h-full object-contain drop-shadow-xl rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 px-2 sm:px-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-b border-gray-100" id="features">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Features</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`feature-card bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center border border-gray-100 transition-transform duration-300 hover:scale-105 hover:shadow-xl group opacity-0`}
              style={{ transitionDelay: `${i * 80}ms` }}
              tabIndex={0}
              aria-label={feature.title}
            >
              <div className={`text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 w-16 h-16 flex items-center justify-center rounded-full shadow-lg ${feature.color}`}>{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-16 px-2 sm:px-4 bg-white border-b border-gray-100" id="testimonials">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">What Our Users Say</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-blue-50 rounded-2xl shadow p-6 flex flex-col items-center border border-blue-100">
              <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-4 border-2 border-white shadow" />
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 italic mb-3">"{t.text}"</p>
              <div className="font-semibold text-blue-700">{t.name}</div>
              <div className="text-sm text-gray-500">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section ref={contactRef} className="py-16 px-2 sm:px-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-100" id="contact">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-lg text-gray-600 mb-8">Join HireHelper today and experience seamless task management and collaboration.</p>
          <button className="px-10 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow hover:scale-105 hover:shadow-xl hover:bg-blue-700 transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2" onClick={() => navigate('/login')} tabIndex={0} aria-label="Get Started Now">Get Started Now</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t border-gray-100 text-center text-gray-400 text-sm relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 rounded-full opacity-40 mb-4" />
        <div className="mb-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span className="font-bold text-blue-700">HireHelper</span> &copy; {new Date().getFullYear()} | All rights reserved.
          <span className="flex gap-2 ml-2">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.916 4.916 0 0 0 16.616 3c-2.72 0-4.924 2.206-4.924 4.924 0 .386.044.762.127 1.124C7.728 8.807 4.1 6.884 1.671 4.149c-.423.724-.666 1.562-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/></svg></a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg></a>
            <a href="mailto:info@hirehelper.com" aria-label="Email" className="hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 13.065l-11.99-7.065v14h24v-14l-12.01 7.065zm11.99-9.065h-23.98l11.99 7.065 11.99-7.065z"/></svg></a>
          </span>
        </div>
        <div>
          Made with <span className="text-red-500">♥</span> by Civix Team 04
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => window.scrollTo({top:0,behavior:'smooth'})}
          aria-label="Scroll to top"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7"/></svg>
        </button>
      )}
      {/* Animations */}
      <style>{`
        @keyframes fadeinup {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeinup {
          opacity: 1 !important;
          animation: fadeinup 0.7s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
      </div>
    );
};

export default LandingPage;
