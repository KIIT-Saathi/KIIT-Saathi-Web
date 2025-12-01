import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const sampleQuestions = [
    "How do I book a carton for hostel move?",
    "Where's the nearest printer?",
    "Which seniors are available for mentoring?",
    "What's happening in campus today?",
    "Help me find my lost ID card",
  ];
  const handleSampleClick = (question: string) => {
    setMessage(question);
  };
  return (
    <>
      {/* Chat Button */}
      <div className="fixed z-50 bottom-6 right-6">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-kiit-green to-campus-blue hover:shadow-xl hover:scale-110"
        >
          <div className="relative">
            <div className="absolute w-3 h-3 rounded-full -top-1 -right-1 bg-campus-orange animate-pulse"></div>
          </div>
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed z-50 bottom-24 right-6 w-80 sm:w-96">
          <div className="overflow-hidden glass-card">
            {/* Header */}
            <div className="p-4 text-white bg-gradient-to-r from-kiit-green to-campus-blue">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-semibold">KIIT Saathi</h3>
                    <p className="text-sm text-white/80">Your campus assistant</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-64 p-4 overflow-y-auto bg-white/50 backdrop-blur-sm">
              {/* Welcome Message */}
              <div className="flex items-start gap-3 mb-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-sm">Hey there! 👋 I'm your KIIT Buddy. What can I help you with today?</p>
                </div>
              </div>

              {/* Sample Questions */}
              <div className="space-y-2">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  <Sparkles className="inline w-3 h-3 mr-1" />
                  Try asking:
                </p>
                {sampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleClick(question)}
                    className="block w-full p-2 text-xs text-left transition-colors rounded-lg bg-kiit-green-soft hover:bg-kiit-green-light/30"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kiit-green/50"
                  onKeyPress={(e) => e.key === "Enter" && console.log("Send message:", message)}
                />
                <Button
                  size="sm"
                  className="text-white bg-kiit-green hover:bg-kiit-green-dark"
                  onClick={() => console.log("Send message:", message)}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
