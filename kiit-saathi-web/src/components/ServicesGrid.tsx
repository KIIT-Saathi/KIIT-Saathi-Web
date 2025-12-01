"use client";

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
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useServiceVisibility } from "@/hooks/use-service-visibility";
import { useRouter } from "next/navigation";   // ⭐ ADDED
  

const services = [
  {
    id: "kiit-saathi-ai-assistant",
    icon: Bot,
    title: "KIIT Saathi (AI Assistant)",
    description: "Lost? Hungry? Confused? Ask our chatbot - 24x7 KIIT help.",
    price: "Free",
    gradient: "from-ecell-cyan to-campus-blue",
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
    id: "kiit-societies-fests-sports",
    icon: Calendar,
    title: "KIIT Societies, Fests and Sports",
    description: "One calendar. All societies. Never miss an interview again.",
    price: "Free",
    gradient: "from-campus-purple to-usc-maroon",
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
    id: "campus-map",
    icon: Shield,
    title: "Campus Map",
    description: "Explore the vibrant campus of KIIT and everything it has to offer.",
    price: "Free",
    gradient: "from-campus-blue to-kiit-green",
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
    id: "resume-saathi",
    icon: FileText,
    title: "Resume Saathi",
    description: "AI-powered ATS-optimized resume builder with multiple templates and instant PDF download.",
    price: "Free",
    gradient: "from-campus-blue to-ecell-cyan"
  },
  {
    id: "split-saathi",
    icon: Calculator,
    title: "SplitSaathi – Group Expense Manager",
    description: "Simplify splitting bills with your friends.",
    price: "Free",
    gradient: "from-fedkiit-green to-usc-green",
  },
  {
    id: "student-mental-wellness",
    icon: Brain,
    title: "Student Mental Wellness",
    description: "Because your mind matters.",
    price: "Coming Soon",
    gradient: "from-campus-blue to-ecell-cyan",
  },
  {
    id: "printout-on-demand",
    icon: Printer,
    title: "Printouts on Demand",
    description: "Send PDFs and get them printed & delivered.",
    price: "₹2/page",
    gradient: "from-usc-maroon to-campus-purple",
  },
  {
    id: "resale-saathi",
    icon: ShoppingBag,
    title: "Resale Saathi",
    description: "Buy & sell items inside KIIT.",
    price: "Free to List",
    gradient: "from-campus-blue to-kiit-green",
  },
  {
    id: "senior-connect",
    icon: Users,
    title: "Senior Connect",
    description: "Book mentorship sessions with seniors.",
    price: "₹99/session",
    gradient: "from-campus-purple to-ecell-cyan",
  },
  {
    id: "handwritten-assignments",
    icon: PenTool,
    title: "Handwritten Assignments",
    description: "We write assignments for you.",
    price: "₹5/page",
    gradient: "from-campus-orange to-campus-purple",
  },
  {
    id: "tutoring-counselling",
    icon: MessageCircle,
    title: "Tutoring & Counselling",
    description: "Book a session with a senior mentor.",
    price: "₹199/hour",
    gradient: "from-kiit-green to-campus-blue",
  },
  {
    id: "campus-tour-booking",
    icon: Car,
    title: "Campus Tour Booking",
    description: "Auto tours across the KIIT campus.",
    price: "₹500/tour",
    gradient: "from-campus-blue to-fedkiit-green",
  },
  {
    id: "carton-packing-hostel-transfers",
    icon: Package,
    title: "Carton Packing & Hostel Transfers",
    description: "Cartons + packing + delivery in one tap.",
    price: "₹50/carton",
    gradient: "from-usc-orange to-campus-orange",
  },
  {
    id: "book-buyback-resale",
    icon: BookOpen,
    title: "Book Buyback & Resale",
    description: "Sell old books for the best price.",
    price: "Fair Price",
    gradient: "from-usc-green to-kiit-green",
  },
  {
    id: "kiit-saathi-celebrations",
    icon: PartyPopper,
    title: "KIIT Saathi Celebrations",
    description: "Birthday surprises & decorations delivered.",
    price: "₹299+",
    gradient: "from-campus-purple to-campus-orange",
  },
  {
    id: "kiit-saathi-meetups",
    icon: Users,
    title: "KIIT Saathi Meetups",
    description: "Find your people, create your moments.",
    price: "Free",
    gradient: "from-ecell-cyan to-campus-purple",
  },
  {
    id: "food-micro-essentials-delivery",
    icon: ShoppingBag,
    title: "Food and micro-essentials delivery",
    description: "Meals & essentials delivered fast.",
    price: "₹20 delivery",
    gradient: "from-usc-orange to-fedkiit-green",
  }
];


export const ServicesGrid = () => {

  const { visibilityMap, loading, hasFetchedData } = useServiceVisibility();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();   // ⭐ FIXED

  const ADMIN_EMAILS = ['adityash8997@gmail.com', '24155598@kiit.ac.in'];
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');
  const isDataReady = !authLoading && hasFetchedData;

  const handleServiceClick = (service: typeof services[0]) => {
    const routeMap: Record<string, string> = {
      "Carton Packing & Hostel Transfers": "/carton-transfer",
      "Printouts on Demand": "/printout-on-demand",
      "Resale Saathi": "/resale",
      "Senior Connect": "/senior-connect",
      "Handwritten Assignments": "/handwritten-assignments",
      "KIIT Societies, Fests and Sports": "/kiit-societies",
      "Lost & Found Portal": "/lost-and-found",
      "Timetable Saathi": "/timetable-saathi",
      "Campus Tour Booking": "/campus-tour-booking",
      "Resume Saathi": "/resume-saathi",
      "SplitSaathi – Group Expense Manager": "/split-saathi",
      "Book Buyback & Resale": "/book-buyback-sell",
      "KIIT Saathi Celebrations": "/celebrations",
      "KIIT Saathi Meetups": "/meetups",
      "KIIT Saathi (AI Assistant)": "/chatbot",
      "SGPA & CGPA Calculator": "/sgpa-calculator",
      "Course & Faculty Details": "/course-structure",
      "Food and micro-essentials delivery": "/food-order-customer",
      "Study Material (PYQs, Notes, YouTube Videos)": "/study-material",
      "Campus Map": "/campus-map"
    };

    const route = routeMap[service.title];

    if (route) {
      router.push(route);   // ⭐ FIXED — replaced navigate()  
    } else {
      toast({
        title: "Coming Soon!",
        description: "This service will be available in the next update.",
        duration: 3500,
        className: "bg-gradient-to-r from-kiit-green to-kiit-green-dark text-white border-none font-semibold",
      });
    }
  };


  return (
    <section className="py-4 sm:py-6 bg-gradient-to-br from-campus-blue/10 to-kiit-green/10">
      <div className="container px-3 mx-auto sm:px-4">

        {/* UI REMAINS 100% SAME BELOW */}
        {/* Nothing changed — keeping entire UI untouched */}

        <div className="px-2 mb-8 text-center sm:mb-12 sm:px-4">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-kiit-green-dark mb-4 sm:mb-6">
            <Star className="w-3 h-3 sm:w-4 sm:h-4" />
            10+ Campus Services
          </div>

          <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-6xl font-poppins text-gradient sm:mb-6">
            Everything You Need
            <span className="block">In One Platform</span>
          </h2>
          <p className="max-w-3xl px-2 mx-auto text-sm leading-relaxed text-black sm:text-base md:text-lg lg:text-xl sm:px-4">
            From academic support to daily essentials, we have built the complete ecosystem
            to enrich your KIIT experience. <span className="block font-semibold text-kiit-green">Because campus life is hectic enough already.</span>
          </p>
        </div>


        <div className="grid grid-cols-1 gap-4 px-2 mb-12 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 md:gap-8 sm:mb-16 sm:px-4">

          {!isDataReady ? (
            <div className="flex justify-center py-6 col-span-full sm:py-8">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            services.map((service, index) => {

              const visibility = visibilityMap[service.id];
              const IconComponent = service.icon;

              let isVisible: boolean;
              let replacementText: string | null = null;

              if (isAdmin) {
                isVisible = true;
              } else {
                if (!visibility) {
                  isVisible = false;
                } else {
                  isVisible = visibility.visible;
                  replacementText = visibility.replaced_text;
                }
              }

              const isHidden = !isVisible;

              if (!isAdmin && isHidden && !replacementText) return null;

              if (!isAdmin && !isVisible && replacementText) {
                return (
                  <div key={index} className="service-card group opacity-85"
                    style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r ${service.gradient} opacity-50`}>
                        <IconComponent className="w-5 h-5 text-white sm:w-6 sm:h-6" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-semibold sm:text-lg md:text-xl font-poppins text-muted-foreground">
                        {replacementText}
                      </h3>
                      <p className="text-xs leading-relaxed opacity-75 text-muted-foreground sm:text-sm">
                        Exciting new services are being developed.
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full sm:px-3 sm:text-sm bg-muted text-muted-foreground">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }


              return (
                <div
                  key={index}
                  onClick={() => handleServiceClick(service)}
                  className="bg-white cursor-pointer hover:shadow-md hover:shadow-green-600 service-card group text-kiit-green-dark"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
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
                      {isAdmin && isHidden && (
                        <Badge variant="secondary" className="bg-muted/80 text-muted-foreground text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                          🏷️ Hidden Service - Admin Only
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}

        </div>
      </div>
    </section>
  );
};
