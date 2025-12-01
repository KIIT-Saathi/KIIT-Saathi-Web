'use client'; // Optional; server by default
import { Heart, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import Image from 'next/image';
const kiitMascot = "/assets/kiit-mascot.jpg";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="text-white bg-gradient-to-br from-kiit-green-dark to-foreground">
      <div className="container px-4 py-8 mx-auto sm:py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 sm:mb-12">
          {/* Brand Section */}
          <div className="text-center lg:col-span-2 sm:text-left">
            <div className="flex items-center justify-center gap-3 mb-6 sm:justify-start">
              <Image src={kiitMascot} alt="KIIT Buddy" width={40} height={40} className="rounded-full" />
              <div className="text-xl font-bold font-poppins sm:text-2xl">KIIT Saathi</div>
            </div>
            
            <p className="max-w-md mx-auto mb-6 text-sm leading-relaxed text-white/80 sm:text-base sm:mx-0">
              Your favorite senior in app form. We're here to make campus life easier, 
              one service at a time. Because KIIT life is hectic enough already! 🎓
            </p>
            
            <div className="flex items-center justify-center gap-4 sm:justify-start">
              <a href="#" className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-white/10 hover:bg-white/20">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-white/10 hover:bg-white/20">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-white/10 hover:bg-white/20">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="mb-4 text-base font-semibold sm:text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm sm:space-y-3 sm:text-base">
              <li><a href="#services" className="transition-colors text-white/80 hover:text-white">Services</a></li>
              <li><a href="#how-it-works" className="transition-colors text-white/80 hover:text-white">How It Works</a></li>
              <li><a href="#testimonials" className="transition-colors text-white/80 hover:text-white">Testimonials</a></li>
              <li><a href="#faq" className="transition-colors text-white/80 hover:text-white">FAQ</a></li>
              <li><a href="/privacy-policy" className="transition-colors text-white/80 hover:text-white">Privacy Policy</a></li>
              <li><a href="/terms-and-conditions" className="transition-colors text-white/80 hover:text-white">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h3 className="mb-4 text-base font-semibold sm:text-lg">Get in Touch</h3>
            <div className="space-y-2 text-sm sm:space-y-3 sm:text-base">
              <div className="flex items-center justify-center gap-3 sm:justify-start">
                <Phone className="flex-shrink-0 w-4 h-4 text-campus-orange" />
                <span className="text-white/80">To be added later</span>
              </div>
              <div className="flex items-center justify-center gap-3 sm:justify-start">
                <Mail className="flex-shrink-0 w-4 h-4 text-campus-orange" />
                <span className="break-all text-white/80">official@kiitsaathi.in</span>
              </div>
              <div className="flex items-start justify-center gap-3 sm:justify-start">
                <MapPin className="flex-shrink-0 w-4 h-4 mt-1 text-campus-orange" />
                <span className="text-center text-white/80 sm:text-left">
                  KIIT University<br />
                  Bhubaneswar, Odisha
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-6 mb-6 border-t border-white/20 sm:pt-8 sm:mb-8">
          <div className="p-4 rounded-lg bg-white/5 sm:p-6">
            <h4 className="flex items-center gap-2 mb-2 text-sm font-semibold sm:text-base">
              <span>⚠️</span> Important Disclaimer
            </h4>
            <p className="text-xs leading-relaxed text-white/80 sm:text-sm">KIIT Saathi is an independent student-run initiative and is not officially affiliated with KIIT University. We are students serving fellow students with campus-related services. All academic assistance is meant to supplement learning, not replace it. Use responsibly! The university name and logos are used for identification purposes only.</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-6 border-t border-white/20 sm:pt-8 sm:flex-row">
          <div className="text-xs text-center text-white/80 sm:text-sm sm:text-left">
            © {currentYear} KIIT Saathi. All rights reserved.
          </div>
          
          <div className="flex items-center gap-2 text-xs text-white/80 sm:text-sm">
            Made with <Heart className="w-4 h-4 text-red-400" /> by KIIT students, for KIIT students
          </div>
        </div>
      </div>
    </footer>
  );
};