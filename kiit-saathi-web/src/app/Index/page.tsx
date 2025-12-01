"use client"

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/(home)/hero";
import { ServicesGrid } from "@/components/ServicesGrid";
import { Testimonials } from "@/components/(home)/testimonials";
import { FAQ } from "@/components/(home)/FAQ";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/(home)/ChatBot";
import { NotificationBell } from "@/components/(home)/NotificationBell";
import { AdminCommandExecutor } from "@/components/(home)/AdminCommandExecutor";
import  MeetOurTeam  from "@/components/(home)/meetOurTeam";
import OurMentors from "@/components/(home)/ourMentors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import  InspirationSection  from "@/components/(home)/inspiration"

const contactFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const Index = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });


const handleContactSubmit = async (data: ContactFormData) => {
  setIsSubmitting(true);
  try {
    const res = await fetch(`${HOSTED_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let errorMessage = `Server error: ${res.status}`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = res.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    toast({
      title: "Message Sent!",
      description: `Thanks, we'll get back to you soon.`,
    });

    form.reset();
  } catch (error) {
    console.error("Contact form error:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to send message.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <div className="relative min-h-screen">
      <Navbar />
      <div className="fixed top-20 right-4 sm:right-8 lg:right-14 z-[10000] ">
        <NotificationBell />
      </div>
      <Hero />
      <InspirationSection/>


      <div className="bg-gradient-to-br from-kiit-green-soft to-white/10">

        {/* Services Section */}
        <section id="services" className="py-0 my-auto ">
          <ServicesGrid />
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-8 sm:py-12 lg:py-16">
          <div className="container px-4 mx-auto text-center">
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl font-poppins text-gradient">
              How KIIT Saathi Works
            </h2>
            <p className="max-w-2xl px-4 mx-auto mb-8 text-base sm:text-lg text-muted-foreground sm:mb-12">
              Your campus life made easier in just a few simple steps
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
              <div className="px-4 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-xl font-bold text-white rounded-full sm:w-16 sm:h-16 bg-gradient-primary sm:text-2xl">
                  1
                </div>
                <h3 className="mb-2 text-lg font-semibold sm:text-xl">Choose Your Service</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Browse through our campus services and select what you need</p>
              </div>

              <div className="px-4 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-xl font-bold text-white rounded-full sm:w-16 sm:h-16 bg-gradient-primary sm:text-2xl">
                  2
                </div>
                <h3 className="mb-2 text-lg font-semibold sm:text-xl">Connect & Request</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Get connected with verified students or service providers instantly</p>
              </div>

              <div className="px-4 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-xl font-bold text-white rounded-full sm:w-16 sm:h-16 bg-gradient-primary sm:text-2xl">
                  3
                </div>
                <h3 className="mb-2 text-lg font-semibold sm:text-xl">Get It Done</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Enjoy hassle-free campus services with trusted fellow students</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-8 sm:py-12 lg:py-16">
          <Testimonials />
        </section>

        {/* Our Mentors Section */}
        <section id="mentors">
          <OurMentors />
        </section>

        {/* Meet Our Team Section */}
        <section id="team">
          <MeetOurTeam />
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-8 sm:py-12 lg:py-16 bg-gradient-soft">
          <FAQ />
        </section>
      </div>

      {/* Contact Section */}
      <section id="contact" className="py-8 sm:py-12 lg:py-16">
        <div className="container px-4 mx-auto">
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl font-poppins text-gradient">
              Get In Touch
            </h2>
            <p className="max-w-2xl px-4 mx-auto text-base sm:text-lg text-muted-foreground">
              Have questions? We're here to help make your campus life better
            </p>
          </div>

          <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto lg:grid-cols-2 sm:gap-12">
            {/* Contact Info */}
            <div className="mb-8 space-y-6 sm:space-y-8 lg:mb-0">
              <div className="flex items-start gap-4 px-4 sm:items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full sm:w-12 sm:h-12 bg-gradient-primary">
                  <Mail className="w-5 h-5 text-white sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold sm:text-lg">Email Us</h3>
                  <p className="text-sm break-all sm:text-base text-muted-foreground">official@kiitsaathi.in</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 px-4 sm:items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full sm:w-12 sm:h-12 bg-gradient-primary">
                  <MapPin className="w-5 h-5 text-white sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold sm:text-lg">Visit Us</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">KIIT University, Bhubaneswar, Odisha</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient">
                  <Mail className="w-5 h-5" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleContactSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@kiit.ac.in" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+91 9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject *</FormLabel>
                          <FormControl>
                            <Input placeholder="How can we help you?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about your query..."
                              className="min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 text-base font-semibold text-white gradient-primary"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <ChatBot />
      <AdminCommandExecutor />
    </div>
  );
};

export default Index;
