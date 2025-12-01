'use client';
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Heart, Box, Bot } from "lucide-react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
const KiitCampus3 = "/assets/KIIT-University-Camus-3-Library.jpg";
const heroCampus = "/assets/KIIT_img.webp";
const KiitCampus17 = "/assets/cam17.jpg";
const KiiTSchoolofArch = "/assets/KIIT-School-of-Architecture-Planning-.jpg";
const KiitAbout = "/assets/About-kiit.jpg";
// import { useAuth } from "@/hooks/useAuth";
import { useRef, useEffect, useState, useMemo } from "react";

const kiitMascot = "/assets/kiit-mascot.jpg";

export const Hero = () => {
  const router = useRouter();
  // const { user } = useAuth();
  const [ripples, setRipples] = useState<Array<{
    id: number;
    x: number;
    y: number;
  }>>([]);
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Grid layout config
  const [cellSize, setCellSize] = useState(40); // 40 desktop, 30 mobile
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);
  const gridCells = useMemo(() => {
    return Array.from({
      length: cols * rows
    }, (_, i) => i);
  }, [cols, rows]);

  // Compute grid layout based on hero size
  useEffect(() => {
    const computeLayout = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const size = window.innerWidth < 768 ? 30 : 40;
      setCellSize(size);
      setCols(Math.ceil(rect.width / size));
      setRows(Math.ceil(rect.height / size));
    };
    computeLayout();
    let t: number | undefined;
    const onResize = () => {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(computeLayout, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      if (t) window.clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Ripple effect and hover highlight
  useEffect(() => {
    const heroElement = heroRef.current;
    const gridElement = gridRef.current;
    if (!heroElement || !gridElement) return;
    let rippleId = 0;
    let rafPending = false;
    let lastX = 0;
    let lastY = 0;
    const highlightCell = () => {
      rafPending = false;
      const rect = heroElement.getBoundingClientRect();
      const x = lastX - rect.left;
      const y = lastY - rect.top;
      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);
      if (col < 0 || col >= cols || row < 0 || row >= rows) return;

      const cellIndex = row * cols + col;
      const cell = gridElement.children[cellIndex] as HTMLElement;
      if (cell) {
        cell.classList.add('highlight');
        setTimeout(() => cell.classList.remove('highlight'), 200);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(highlightCell);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = heroElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRipples(prev => [...prev, { id: rippleId++, x, y }]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rippleId - 1)), 600);
    };

    heroElement.addEventListener('mousemove', handleMouseMove);
    heroElement.addEventListener('click', handleClick);

    return () => {
      heroElement.removeEventListener('mousemove', handleMouseMove);
      heroElement.removeEventListener('click', handleClick);
    };
  }, [cols, rows, cellSize]);

  const slides = [
    heroCampus,
    KiitCampus3,
    KiitCampus17,
    KiiTSchoolofArch,
    KiitAbout,
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleSignIn = () => {
    router.push('/auth');
  };

  const handleExplore = () => {
    router.push('/services');
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-kiit-green to-campus-blue" ref={heroRef}>
      {/* Interactive Grid Overlay */}
      <div ref={gridRef} className="absolute inset-0 pointer-events-none">
        {gridCells.map((index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          return (
            <div
              key={index}
              className="absolute transition-colors duration-100 bg-transparent border border-transparent hover:border-kiit-green/20"
              style={{
                left: `${col * cellSize}px`,
                top: `${row * cellSize}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
              }}
            />
          );
        })}
      </div>

      {/* Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute w-4 h-4 rounded-full pointer-events-none bg-kiit-green animate-ping"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen px-4 py-12 lg:flex-row sm:px-6 lg:px-8 lg:py-16">
        {/* Left Content */}
        <div className="flex-1 mb-8 text-center lg:text-left lg:mb-0 lg:pr-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 mb-8 rounded-full bg-white/20 backdrop-blur-sm">
            <Image src={kiitMascot} alt="KIIT Mascot" width={48} height={48} className="rounded-full" />
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl font-poppins drop-shadow-lg">
                KIIT Saathi
              </h1>
              <p className="text-sm font-medium text-white/80">Your Campus Companion</p>
            </div>
          </div>

          <h2 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl font-poppins drop-shadow-2xl">
            Making KIIT Life
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-kiit-green via-fedkiit-green to-campus-blue">
              Easier, One Service
            </span>
            at a Time
          </h2>

          <p className="max-w-lg mx-auto mb-8 text-xl leading-relaxed sm:text-2xl lg:text-3xl text-white/90 lg:mx-0 drop-shadow-lg">
            Your favorite senior in app form. Study materials, lost & found, society events, food coupons, and more - all in one place.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <Button
              size="lg"
              onClick={handleExplore}
              className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 transform shadow-xl gradient-primary hover:shadow-2xl hover:scale-105"
            >
              Explore Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            {/* {!user && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleSignIn}
                className="px-8 py-4 text-lg font-semibold text-white border-white/30 hover:bg-white/10 backdrop-blur-sm"
              >
                Get Started
                <Smartphone className="w-5 h-5 ml-2" />
              </Button>
            )} */}
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 lg:justify-start">
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-white sm:text-4xl lg:text-5xl drop-shadow-lg">10+</div>
              <div className="text-sm font-medium text-white/70 sm:text-base">Campus Services</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-white sm:text-4xl lg:text-5xl drop-shadow-lg">24/7</div>
              <div className="text-sm font-medium text-white/70 sm:text-base">AI Assistant</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-white sm:text-4xl lg:text-5xl drop-shadow-lg">100K+</div>
              <div className="text-sm font-medium text-white/70 sm:text-base">Students Helped</div>
            </div>
          </div>
        </div>

        {/* Right Image Slider */}
        <div className="relative flex-1 max-w-md mx-auto lg:max-w-lg xl:max-w-xl lg:mx-0">
          <div className="relative overflow-hidden shadow-2xl rounded-3xl">
            <div
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Slides */}
              {slides.map((src, idx) => (
                <Image 
                  key={idx} 
                  src={src} 
                  className="flex-shrink-0 object-cover w-full" 
                  alt={`KIIT Campus ${idx + 1}`}
                  width={500}
                  height={400}
                  loading={idx === 0 ? "eager" : "lazy"}
                  style={{ display: 'block' }}
                />
              ))}
              {/* cloned first slide for seamless looping */}
              <Image 
                key="clone-first" 
                src={slides[0]} 
                className="flex-shrink-0 object-cover w-full" 
                alt="KIIT Campus"
                width={500}
                height={400}
                style={{ display: 'block' }}
              />
            </div>
            <div className="flex items-center mt-5 space-x-2" id="dot-indicators">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-colors ${idx === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};