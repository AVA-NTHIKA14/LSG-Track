import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BrandMark } from '../components/BrandMark';

interface Slide {
  title: string;
  subtitle?: string;
  body: string;
}

// Slide 1 copy and layout come directly from the shared Figma frame.
// Slides 2-3 are placeholders so the carousel mechanics (dots, Skip, Next)
// are fully working now — swap the copy below once those frames arrive.
const slides: Slide[] = [
  {
    title: 'Welcome to LSG Track',
    subtitle: 'A GIS-based Trade License Compliance Portal for Kerala Grama Panchayats.',
    body: 'Monitor licensed and unlicensed commercial establishments, manage inspections, and improve trade license compliance using spatial intelligence and real-time GIS mapping.',
  },
  {
    title: 'Slide 2 — placeholder title',
    body: 'Placeholder copy. Replace once the slide 2 design is shared.',
  },
  {
    title: 'Slide 3 — placeholder title',
    body: 'Placeholder copy. Replace once the slide 3 design is shared.',
  },
];

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const isLastSlide = step === slides.length - 1;
  const slide = slides[step];

  const goToLogin = () => navigate('/login');

  const handleNext = () => {
    if (isLastSlide) {
      goToLogin();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-brand flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg p-10 shadow-xl relative overflow-hidden">

        <BrandMark />

        {/* Decorative rings behind the headline — purely visual, matches Figma */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-24 -translate-x-1/2 w-72 h-72 rounded-full border border-slate-100"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-36 -translate-x-1/2 w-52 h-52 rounded-full border border-slate-100"
        />

        <div className="relative text-center mt-32">
          <h1 className="text-3xl font-bold text-ink mb-4">{slide.title}</h1>
          {slide.subtitle && (
            <p className="text-lg font-semibold text-brand-subtle mb-4">{slide.subtitle}</p>
          )}
          <p className="text-sm text-ink-muted leading-relaxed max-w-md mx-auto">{slide.body}</p>
        </div>

        {/* Pagination dots — clickable to jump directly to a slide */}
        <div className="flex justify-center items-center space-x-2 mt-10 mb-8">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              aria-label={`Go to slide ${i + 1} of ${slides.length}`}
              aria-current={i === step}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-8 bg-brand-dark' : 'w-4 bg-brand-dot'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={goToLogin}
            className="text-sm font-semibold text-ink-muted hover:text-ink transition"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center space-x-2 bg-brand-button hover:opacity-90 text-white rounded-full px-6 py-2.5 text-sm font-semibold transition"
          >
            <span>{isLastSlide ? 'Get started' : 'Next'}</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>

      <div className="mt-8 text-brand-footer text-[11px] uppercase font-mono tracking-wider text-center">
        © 2026 LSG Track Kerala · Department of Local Self Government
      </div>
    </div>
  );
};