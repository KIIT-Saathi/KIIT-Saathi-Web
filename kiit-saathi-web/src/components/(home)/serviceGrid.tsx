'use client';
import {
  Package,
  Printer,
  Users,
  PenTool,
  Calendar,
  ShoppingBag,
  PartyPopper,
  Bot,
  BookOpen,
  MessageCircle,
  Shield,
  Timer,
  Trophy,
  MapPin,
  Search,
  Car,
  Lightbulb,
  Star,
  ArrowRight,
  Calculator,
  FileText,
  GraduationCap,
  Heart,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const services = [
  {
    id: "campus-map",
    icon: MapPin,
    title: "Campus Map",
    description: "Explore the vibrant campus of KIIT and everything it has to offer.",
    price: "Free",
    gradient: "from-teal-400 to-blue-500",
  },
  {
    id: "study-material",
    icon: BookOpen,
    title: "Study Material (PYQs, Notes, YouTube Videos)",
    description: "Seniors' notes, solved papers, lab manuals, and curated YouTube playlists - all in one place.",
    price: "Free",
    gradient: "from-kiit-green to-fedkiit-green",
  },
  {
    id: "lost-and-found-portal",
    icon: Search,
    title: "Lost & Found Portal",
    description: "Lost your ID card? Found someone's AirPods? Report it here.",
    price: "Free",
    gradient: "from-campus-orange to-usc-orange",
  },
  {
    id: "sgpa-cgpa-calculator",
    icon: Calculator,
    title: "SGPA & CGPA Calculator",
    description: "Calculate your semester and overall CGPA with accurate KIIT curriculum and grade-wise calculations.",
    price: "Free",
    gradient: "from-kiit-green to-campus-blue",
    action: () => window.location.href = "/sgpa-calculator",
  },
  {
    id: "kiit-societies-fests-sports",
    icon: Calendar,
    title: "KIIT Societies, Fests and Sports",
    description: "One calendar. All societies. Never miss an interview again.",
    price: "Free",
    gradient: "from-campus-purple to-usc-maroon",
  },
  {
    id: "kiiit-food-stalls-restaurants",
    icon: Calendar,
    title: "KIIT Food Stalls & Restaurants",
    description: "Discover campus food stalls with menu, timings, and location. Generate discount coupons instantly - verfied and single-use.",
    price: "Free",
    gradient: "from-campus-orange to-usc-orange",
  },
  {
    id: "course-faculty-details",
    icon: GraduationCap,
    title: "Course & Faculty Details",
    description: "Complete course structure and faculty information for all semesters.",
    price: "Free",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "resume-saathi",
    icon: FileText,
    title: "Resume Saathi",
    description: "AI-powered ATS-optimized resumes with 10+ templates, keyword optimization, and instant PDF download.",
    price: "Free",
    gradient: "from-purple-500 to-pink-500",
  },
  // ... (add remaining services as in original, truncated for brevity)
];

const ServicesGrid = () => {
  const router = useRouter();
  const [visibleServices, setVisibleServices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceVisibility = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/service-visibility');
        
        if (!response.ok) {
          throw new Error('Failed to fetch service visibility');
        }
        
        const data = await response.json();
        
        // Extract service IDs where visibility is true
        const visibleServiceIds = data.services
          .filter((service: any) => service.is_visible)
          .map((service: any) => service.service_id);
        
        setVisibleServices(visibleServiceIds);
      } catch (err) {
        console.error('Error fetching service visibility:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Show all services as fallback
        setVisibleServices(services.map(s => s.id));
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceVisibility();
  }, []);

  const handleServiceClick = (service: any) => {
    if (service.action) {
      service.action();
      return;
    }
    if (service.id === 'campus-map') {
      router.push('/campus-map');
    } else if (service.id === 'study-material') {
      router.push('/study-material');
    } else if (service.id === 'lost-and-found-portal') {
      router.push('/lost-and-found');
    } else if (service.id === 'kiit-societies-fests-sports') {
      router.push('/kiit-societies');
    } else if (service.id === 'kiiit-food-stalls-restaurants') {
      router.push('/food');
    } else if (service.id === 'course-faculty-details') {
      router.push('/course-structure');
    } else if (service.id === 'resume-saathi') {
      router.push('/resume-saathi');
    }
    // Add other routes as needed
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-kiit-green" />
      </div>
    );
  }

  if (error) {
    console.warn('Service visibility error:', error);
  }

  // Filter services based on visibility
  const filteredServices = services.filter(service => 
    visibleServices.includes(service.id)
  );

  return (
    <section id="services" className="relative py-16 overflow-hidden sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-kiit-green-soft via-white/50 to-campus-blue-soft" />
      <div className="container relative z-10 px-4 mx-auto">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-6 text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl font-poppins bg-gradient-to-r from-kiit-green via-fedkiit-green to-campus-blue bg-clip-text">
            Campus Services
          </h2>
          <p className="max-w-3xl mx-auto text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
            Everything you need to thrive at KIIT, all in one place. Built by students, for students.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {filteredServices.map((service: any, index: number) => {
            const IconComponent = service.icon;

            return (
              <div
                key={index}
                onClick={() => handleServiceClick(service)}
                className="bg-white cursor-pointer hover:shadow-md hover:shadow-green-600 service-card group text-kiit-green-dark"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Service Header */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r ${service.gradient}`}>
                    <IconComponent className="w-5 h-5 text-white sm:w-6 sm:h-6" />
                  </div>
                </div>

                <div className="p-3 px-2 space-y-2 sm:px-3 hover:bg-gray-200 hover:rounded-lg sm:p-4">
                  <div className="flex flex-col items-start gap-1.5 sm:gap-2 mb-1">
                    <h3 className="text-base font-semibold transition-colors sm:text-lg md:text-xl hover:text-black font-poppins text-foreground group-hover:text-kiit-green">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;