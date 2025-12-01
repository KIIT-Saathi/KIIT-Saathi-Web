import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Loader2, CheckCircle2, CircleAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const access_token = params.get("access_token");

  fetch(`/api/auth/callback?access_token=${access_token}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        toast.success("Email confirmed! You are now signed in.");
        navigate("/");
      } else {
        toast.error(data.message || "Email confirmation failed.");
        navigate("/auth?reason=confirm_failed");
      }
    })
    .catch(() => {
      toast.error("Something went wrong. Please try again.");
      navigate("/auth?reason=confirm_failed");
    });
}, [navigate]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-kiit-green-soft via-background to-campus-blue/20">
      <Navbar />
      <main className="container px-4 py-20 mx-auto">
        <section className="max-w-md mx-auto text-center">
          <h1 className="mb-4 text-2xl font-semibold">Confirming your email…</h1>
          <p className="mb-8 text-muted-foreground">Please wait while we finalize your account.</p>
          <div className="flex items-center justify-center gap-3 text-kiit-green">
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <CheckCircle2 className="w-6 h-6" />
            )}
            <span>{isProcessing ? 'Setting up your session' : 'Processing complete'}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-10 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-kiit-green" />
              <span>Link opened</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              {isProcessing ? (
                <CircleAlert className="w-4 h-4 text-campus-blue" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-kiit-green" />
              )}
              <span>{isProcessing ? 'Verifying session' : 'Session verified'}</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
