import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { Bell, Calendar, Check, X, Sparkles } from "lucide-react";
// Helper function to format time ago
const formatDistanceToNow = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 604800)}w ago`;
};
import { useEvents } from "@/hooks/use-events";

interface EventNotification {
  id: number;
  type: "upcoming_event";
  message: string;
  event_name: string;
  event_date: string;
  created_at: string;
}

export function NotificationBell() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<number[]>([]);
  const { upcomingEvents, loading: eventsLoading, error } = useEvents();

  // Build notifications directly from upcomingEvents
  const notifications: (EventNotification & { is_read: boolean })[] = useMemo(() => {
    if (!user || eventsLoading || error) return [];
    return upcomingEvents.map((event) => ({
      id: event.id,
      type: "upcoming_event",
      message: `${event.event_name} is coming up!`,
      event_name: event.event_name,
      event_date: event.event_date,
      created_at: new Date().toISOString(),
      is_read: readIds.includes(event.id),
    }));
  }, [upcomingEvents, user, eventsLoading, error, readIds]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = (notificationId: number) => {
    setReadIds((prev) => (prev.includes(notificationId) ? prev : [...prev, notificationId]));
  };

  const markAllAsRead = () => {
    setReadIds(notifications.map((n) => n.id));
  };

  if (!user) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-12 h-12 p-0 transition-all duration-300 transform border-2 rounded-full shadow-lg group bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:shadow-xl hover:scale-105 border-white/20"
        >
          <div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-br from-white/20 to-transparent group-hover:opacity-100" />
          <Bell className="relative z-10 w-6 h-6 text-white group-hover:animate-pulse" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute flex items-center justify-center w-6 h-6 p-0 text-xs border-2 border-white rounded-full shadow-md -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 animate-bounce"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          {unreadCount > 0 && (
            <div className="absolute inset-0 border-2 border-red-400 rounded-full opacity-75 animate-ping" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent 
        className="p-0 border shadow-2xl w-96 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border-white/20 backdrop-blur-lg" 
        align="end"
        sideOffset={8}
      >
        <Card className="bg-transparent border-0 shadow-none">
          <CardHeader className="pb-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <CardTitle className="text-lg font-bold text-transparent bg-gradient-to-r from-white to-blue-100 bg-clip-text">
                  Upcoming Events
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs transition-all duration-200 border hover:bg-white/20 text-white/90 hover:text-white border-white/30 hover:scale-105"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 transition-all duration-200 rounded-full text-white/70 hover:text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {notifications.length > 0 && (
              <CardDescription className="text-blue-100">
                {unreadCount > 0 ? (
                  <>
                    <span className="animate-pulse">●</span> {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                  </>
                ) : (
                  "All caught up! 🎉"
                )}
              </CardDescription>
            )}
            {error && (
              <CardDescription className="px-3 py-1 text-sm text-red-200 rounded-full bg-red-500/20">
                {error}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="p-0">
            {notifications.length === 0 && !error ? (
              <div className="p-8 text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <Calendar className="w-16 h-16 mx-auto text-gray-300" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-xl" />
                </div>
                <p className="mb-2 font-medium text-gray-500">No upcoming events</p>
                <p className="text-sm text-gray-400">Check back later for new notifications</p>
              </div>
            ) : (
              <ScrollArea className="h-80">
                <div className="p-2 space-y-1">
                  {notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`group relative p-4 rounded-xl transition-all duration-300 cursor-pointer border ${
                        !notification.is_read 
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50 hover:from-blue-100 hover:to-indigo-100 shadow-md hover:shadow-lg" 
                          : "bg-white/50 border-gray-200/30 hover:bg-white/80 hover:border-gray-300/50"
                      } hover:scale-[1.02] hover:-translate-y-1`}
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      {!notification.is_read && (
                        <div className="absolute w-3 h-3 rounded-full shadow-lg top-2 right-2 bg-gradient-to-br from-blue-500 to-purple-500 animate-pulse" />
                      )}
                      
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl transition-all duration-300 ${
                          !notification.is_read 
                            ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg" 
                            : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                        }`}>
                          <Calendar className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <p className={`text-sm font-semibold leading-relaxed ${
                              !notification.is_read ? "text-gray-900" : "text-gray-600"
                            }`}>
                              {notification.message}
                            </p>
                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 text-gray-400 transition-all duration-200 rounded-full opacity-0 hover:text-green-600 hover:bg-green-50 hover:scale-110 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                !notification.is_read 
                                  ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200" 
                                  : "bg-gray-100 text-gray-600"
                              }`}>
                                
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-500 truncate">
                               {notification.event_name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}