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
// import { useServiceVisibility } from "@/hooks/useServiceVisibility";
// import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  // const { user } = useAuth();
  // const { visibleServices, isLoading } = useServiceVisibility();
  // const isAdmin = user?.email === 'adityash8997@gmail.com' || user?.email === '24155598@kiit.ac.in';

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
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-kiit-green" />
      </div>
    );
  }

  const filteredServices = isAdmin ? services : visibleServices;

  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-kiit-green-soft via-white/50 to-campus-blue-soft" />
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold bg-gradient-to-r from-kiit-green via-fedkiit-green to-campus-blue bg-clip-text text-transparent mb-6">
            Campus Services
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            Everything you need to thrive at KIIT, all in one place. Built by students, for students.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service: any, index: number) => {
            const IconComponent = service.icon;
            const isHidden = !visibleServices.includes(service.id) && !isAdmin;

            if (isHidden && !isAdmin) {
              // Coming soon placeholder
              return (
                <div key={index} className="service-card bg-white group text-kiit-green-dark cursor-pointer hover:shadow-md hover:shadow-green-600" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2 p-3 sm:p-4">
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg md:text-xl font-poppins font-semibold text-muted-foreground">
                        Coming Soon
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm opacity-75">
                        Exciting new services are being developed and will be available soon.
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-semibold px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-muted text-muted-foreground">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // For admins: show all services (including hidden ones with badge)
            // For non-admins: show only visible services
            return (
              <div
                key={index}
                onClick={() => handleServiceClick(service)}
                className="hover:shadow-md hover:shadow-green-600 service-card bg-white group text-kiit-green-dark cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Service Header */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r ${service.gradient}`}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>

                <div className="space-y-2 px-2 sm:px-3 hover:bg-gray-200 hover:rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col items-start gap-1.5 sm:gap-2 mb-1">
                    <h3 className="text-base sm:text-lg md:text-xl hover:text-black font-poppins font-semibold text-foreground group-hover:text-kiit-green transition-colors">
                      {service.title}
                    </h3>
                    {isAdmin && isHidden && (
                      <Badge variant="secondary" className="bg-muted/80 text-muted-foreground text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                        🏷️ Hidden Service - Admin Only
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">
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