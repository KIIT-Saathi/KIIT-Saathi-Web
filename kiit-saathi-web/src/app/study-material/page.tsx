"use client"

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  MessageSquare,
  X,
  AlertTriangle,
  Loader,
  Youtube,
  ChevronRight,
  Clock,
  Users,
  Upload,
  File,
  BookOpen,
  Bot,
  Search,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/study-materials/FilterBar";
import { DataTable } from "@/components/study-materials/DataTable"
import { TabNavigation } from "@/components/study-materials/TabNavigation";
import  StudyMaterialUploadDialog  from "../../components/study-materials/StudyMaterialUploadDialog";
import { toast } from "sonner";
import { semesters, years, semesterSubjects } from "../data/studyMaterials";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
    
// Types
interface StudyMaterialItem {
  id: number;
  title: string;
  subject: string;
  semester: string;
  branch?: string;
  year?: string;
  type?: "note" | "pyq" | "ppt" | "ebook";
  views: number;
  uploadedBy: string;
  uploadDate?: string;
  pdf_url: string;
}

export default function StudyMaterial() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [activeSection, setActiveSection] = useState("notes");
  const [materials, setMaterials] = useState<StudyMaterialItem[]>([]);

  const [addResourceDialogOpen, setAddResourceDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useAuth();

  //playlist from youtube
  const playlistYoutube = [
    {
      course_name: "Data Structures & Algorithms (DSA)",
      playlist_name: "Master Data Structures & Algorithms: DSA Bootcamp 2025",
      channel_name: "HelloWorld by Prince",
      videos: "60+",
      playlist_link:
        "https://www.youtube.com/playlist?list=PLA3GkZPtsafYzRj2lk6OyquJtRXoDLR_S",
    },
    {
      course_name: "Data Structures & Algorithms (DSA)",
      playlist_name: "Ultimate Playlist - Master DSA for Free",
      channel_name: "Take U Forward",
      videos: "90+",
      playlist_link:
        "https://www.youtube.com/playlist?list=PLKtofb3HgEyygy1CDrP17k2xKfvETIMr5",
    },
    {
      course_name: "Object Oriented Programming (OOPS)",
      playlist_name: "Object Oriented Programming (OOP) in Java Course",
      channel_name: "Kunal Kushwaha",
      videos: "28+",
      playlist_link:
        "https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk",
    },
    {
      course_name: "Design and Analysis of Algorithms (DAA)",
      playlist_name: "Design and Analysis of Algorithms (DAA)",
      channel_name: "Gate Smashers",
      videos: "45+",
      playlist_link:
        "https://www.youtube.com/playlist?list=PLxCzCOWd7aiHcmS4i14bI0VrMbZTUvlTa",
    },
    {
      course_name: "Java (Full Course)",
      playlist_name: "Java Full Course for free ☕ (2025)",
      channel_name: "Bro Code",
      videos: "1 (full course)",
      playlist_link: "https://www.youtube.com/watch?v=xTtL8E4LzTQ",
    },
    {
      course_name: "Java (Beginner to Advanced)",
      playlist_name: "Java Tutorial for Beginners",
      channel_name: "CodeWithHarry",
      videos: "75+",
      playlist_link: "https://www.youtube.com/watch?v=BGTx91t8q50",
    },
    {
      course_name: "SQL (Complete Course)",
      playlist_name: "Complete SQL Course For Beginners",
      channel_name: "Edureka",
      videos: "1 (full course)",
      playlist_link: "https://www.youtube.com/watch?v=q_JsgpiuY98",
    },
    {
      course_name: "SQL (Hindi, Full Tutorial)",
      playlist_name: "SQL Tutorial for Beginners | Full SQL Course In Hindi",
      channel_name: "Rishabh Mishra",
      videos: "1 (full course)",
      playlist_link: "https://www.youtube.com/watch?v=On9eSN3F8w0",
    },
    {
      course_name: "SQL for Beginners",
      playlist_name:
        "SQL Playlist 2025 | SQL Tutorial For Beginners | SQL Course",
      channel_name: "Simplilearn",
      videos: "25+",
      playlist_link:
        "https://www.youtube.com/playlist?list=PLEiEAq2VkUUKL3yPbn8yWnatjUg0P0I-Z",
    },
    {
      course_name: "Data Structures & Algorithms (DSA)",
      playlist_name: "Master Data Structures & Algorithms: DSA Bootcamp 2025",
      channel_name: "HelloWorld by Prince",
      videos: "60+",
      playlist_link:
        "https://www.youtube.com/playlist?list=PLA3GkZPtsafYzRj2lk6OyquJtRXoDLR_S",
    },
    {
      course_name: "Data Structures & Algorithms (DSA)",
      playlist_name: "Ultimate Playlist - Master DSA for Free",
      channel_name: "Take U Forward",
      videos: "90+",
      playlist_link:
        "https://www.youtube.com/playlist?list=PLKtofb3HgEyygy1CDrP17k2xKfvETIMr5",
    },
    {
      course_name: "Object Oriented Programming (OOPS)",
      playlist_name: "Object Oriented Programming (OOP) in Java Course",
      channel_name: "Kunal Kushwaha",
      videos: "28+",
      playlist_link:
        "https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk",
    },
    {
      course_name: "Design and Analysis of Algorithms (DAA)",
      playlist_name: "Design and Analysis of Algorithms (DAA)",
      channel_name: "Gate Smashers",
      videos: "45+",
      playlist_link:
        "https://www.youtube.com/playlist?list=PLxCzCOWd7aiHcmS4i14bI0VrMbZTUvlTa",
    },
    {
      course_name: "Java (Full Course)",
      playlist_name: "Java Full Course for free ☕ (2025)",
      channel_name: "Bro Code",
      videos: "1 (full course)",
      playlist_link: "https://www.youtube.com/watch?v=xTtL8E4LzTQ",
    },
    {
      course_name: "Java (Beginner to Advanced)",
      playlist_name: "Java Tutorial for Beginners",
      channel_name: "CodeWithHarry",
      videos: "75+",
      playlist_link: "https://www.youtube.com/watch?v=BGTx91t8q50",
    },
    {
      course_name: "SQL (Complete Course)",
      playlist_name: "Complete SQL Course For Beginners",
      channel_name: "Edureka",
      videos: "1 (full course)",
      playlist_link: "https://www.youtube.com/watch?v=q_JsgpiuY98",
    },
    {
      course_name: "SQL (Hindi, Full Tutorial)",
      playlist_name: "SQL Tutorial for Beginners | Full SQL Course In Hindi",
      channel_name: "Rishabh Mishra",
      videos: "1 (full course)",
      playlist_link: "https://www.youtube.com/watch?v=On9eSN3F8w0",
    },
    {
      course_name: "SQL for Beginners",
      playlist_name:
        "SQL Playlist 2025 | SQL Tutorial For Beginners | SQL Course",
      channel_name: "Simplilearn",
      videos: "25+",
      playlist_link:
        "https://www.youtube.com/playlist?list=PLEiEAq2VkUUKL3yPbn8yWnatjUg0P0I-Z",
    },
  ];

  const isAdmin = user?.email === 'adityash8997@gmail.com' || user?.email === '24155598@kiit.ac.in';


  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    setError("");

    // Don't fetch for playlists and groups - they're static data
    if (activeSection === "playlists" || activeSection === "groups") {
      setLoading(false);
      setError("");
      return;
    }
    if (
      activeSection === "ppt" ||
      activeSection === "notes" ||
      activeSection === "ebooks"
    ) {
      setLoading(false);
      setError("");
    }
    try {
      const params = new URLSearchParams();

      // Always include type

      params.append("type", activeSection); // pyqs, notes, ebooks, ppts

      // Only add other params if they have values
      if (selectedSubject !== "all" && selectedSubject) {
        params.append("subject", selectedSubject);
      }
      if (selectedSemester !== "all" && selectedSemester) {
        params.append("semester", selectedSemester);
      }
      if (selectedYear !== "all" && selectedYear) {
        params.append("year", selectedYear);
      }
      if (searchQuery && searchQuery.trim()) {
        params.append("search", searchQuery);
      }

      const finalUrl = `/api/study-materials?${params.toString()}`;

      const response = await fetch(finalUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch materials: ${response.status} - ${errorText}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          `Invalid response: Expected JSON, got ${contentType} - ${text.slice(
            0,
            100
          )}...`
        );
      }

      const { data } = await response.json();
      setMaterials(data || []);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load materials");
    } finally {
      setLoading(false);
    }
  }, [
    activeSection,
    selectedSubject,
    selectedSemester,
    selectedYear,
    searchQuery,
  ]);

  useEffect(() => {
    if (user) {
      fetchMaterials();
    }
  }, [user, fetchMaterials]);

  const availableSubjects =
    selectedSemester === "all"
      ? semesterSubjects.flatMap((s) => s.subjects) // all subjects
      : semesterSubjects.find((s) => s.semester === selectedSemester)
          ?.subjects || [];

  // Filter function for study materials
  const filterMaterials = (materials: StudyMaterialItem[]) => {
    return materials.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject =
        selectedSubject === "all" || item.subject === selectedSubject;
      const matchesSemester =
        selectedSemester === "all" || item.semester === selectedSemester;
      const matchesYear =
        selectedYear === "all" || (item.year && item.year === selectedYear);

      return matchesSearch && matchesSubject && matchesSemester && matchesYear;
    });
  };

  // ✅ Enhanced handleView with better logging and feedback
  const handleView = async (id: number) => {
    try {
      const material = materials.find((m) => m.id === id);

      if (!material || !material.pdf_url) {
        toast.error("No file available to view");
        return;
      }
      setMaterials((prev) =>
        prev.map((m) => (m.id === id ? { ...m, views: (m.views || 0) + 1 } : m))
      );
      const newWindow = window.open(
        material.pdf_url,
        "_blank",
        "noopener,noreferrer"
      );
      if (newWindow) {
        toast.success(`Opening ${material.title}...`);
      } else {
        toast.error("Please allow pop-ups to preview files");
      }
    } catch (error) {
      toast.error("Failed to open file");
    }
  };

  const handleDownload = async (material: StudyMaterialItem) => {
    try {
      if (!material || !material.pdf_url) {
        toast.error("No file available to download");
        return;
      }

      const loadingToast = toast.loading(`Downloading ${material.title}...`);

      const response = await fetch(material.pdf_url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch file`);
      }

      const blob = await response.blob();
      const fileURL = window.URL.createObjectURL(blob);
      const fileName = material.title?.includes(".")
        ? material.title
        : `${material.title}.pdf`;
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(fileURL);
      toast.dismiss(loadingToast);
      toast.success(`Downloaded ${material.title}`);
    } catch (error: any) {
      toast.error("Failed to download file");
    }
  };

  // ✅ Add debugging on material load
  useEffect(() => {
    if (materials.length > 0) {
    }
  }, [materials]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 rounded-full border-kiit-primary/20"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 rounded-full border-kiit-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="mb-4 text-xl font-semibold">
            Authentication Required
          </h2>
          <p>Please login to access study materials.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      <div className="container px-4 py-8 pt-24 mx-auto">
        {/* Enhanced Hero Header */}
        <div className="mb-12 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-kiit-primary/10 via-kiit-secondary/10 to-kiit-primary/10 rounded-3xl blur-3xl -z-10"></div>
            <div className="p-8 border glass-card rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg bg-gradient-to-br from-kiit-primary to-kiit-secondary rounded-2xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-kiit-primary via-kiit-secondary to-kiit-primary bg-clip-text">
                Study Materials
              </h1>
              <p className="max-w-2xl mx-auto text-lg leading-relaxed text-muted-foreground">
                Access comprehensive notes, previous year questions,
                presentations, and curated study resources to excel in your
                academic journey
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col justify-center gap-4 mt-8 sm:flex-row">
                {isAdmin && (
                  <Button
                    onClick={() => setUploadDialogOpen(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 transition-opacity transform shadow-lg group bg-gradient-to-r from-kiit-primary to-kiit-accent hover:opacity-90 rounded-xl hover:shadow-xl hover:-translate-y-1"
                  >
                    <Upload className="w-5 h-5 transition-transform group-hover:scale-110" />
                    Contribute Material
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                )}
                <button
                  onClick={() =>
                    window.open("https://forms.gle/5d89iETDeefruKSX9", "_blank")
                  }
                  className="group h-[40px] bg-gradient-to-r from-kiit-secondary to-kiit-secondary/90 text-white hover:opacity-90 transition-opacity px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <MessageSquare className="w-5 h-5 transition-transform group-hover:scale-110" />
                  Request Resource
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Disclaimer below the buttons */}
              <p className="mt-4 text-center text-gray-500 text-md">
                ⚠️ If you receive a notification saying “Files not found,”
                please reload the site and try again.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="mb-8">
          <TabNavigation
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>

        {/* Enhanced Error Display */}
        {error &&
          activeSection !== "playlists" &&
          activeSection !== "groups" && (
            <div className="flex items-center gap-3 p-6 mb-8 border shadow-lg bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/20 rounded-xl text-destructive">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-destructive/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Something went wrong</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="flex items-center justify-center flex-shrink-0 w-8 h-8 transition-colors rounded-full hover:bg-destructive/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

        {/* Content */}
        {(activeSection === "notes" ||
          activeSection === "pyqs" ||
          activeSection === "ppts" ||
          activeSection === "ebooks") && (
          <>
            {/* Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              selectedSemester={selectedSemester}
              setSelectedSemester={setSelectedSemester}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              subjects={availableSubjects}
              semesters={semesters}
              years={years}
            />

            {/* Enhanced Loading */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 border-4 rounded-full border-kiit-primary/20"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 rounded-full border-kiit-primary border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 text-muted-foreground animate-pulse">
                  Loading study materials...
                </p>
              </div>
            ) : (
              <div className="overflow-hidden border shadow-xl glass-card rounded-2xl border-border/50">
                <DataTable
                  materials={filterMaterials(materials)}
                  onViewPDF={handleView}
                  loading={loading}
                  materialType={
                    activeSection as "notes" | "pyqs" | "ppts" | "ebooks"
                  }
                  onDownload={handleDownload}
                />
              </div>
            )}
          </>
        )}

        {/* Enhanced Playlists Section */}
        {activeSection === "playlists" && (
          <div className="p-12 text-center border glass-card rounded-2xl border-border/50 bg-gradient-to-br from-card/50 to-muted/20">
            <div className="relative group">
              <div className="absolute transition-colors transform -translate-y-1/2 left-4 top-1/2 text-muted-foreground group-focus-within:text-kiit-primary">
                <Search className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder="Search by title, subject, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 text-base transition-all duration-300 h-14 rounded-xl border-border/50 bg-background/50 focus:bg-background focus:ring-2 focus:ring-kiit-primary/20 focus:border-kiit-primary/50"
              />
            </div>

            {/* Filter playlists based on search query */}
            {playlistYoutube
              .filter(
                (playlist) =>
                  playlist.course_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  playlist.playlist_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  playlist.channel_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
              )
              .map((playlist, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-6 p-6 my-6 text-left border shadow-md glass-card rounded-xl border-border/30 md:flex-row bg-white/60"
                >
                  <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                    <Youtube className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1 text-lg font-bold">
                      {playlist.course_name}
                    </h4>
                    <p className="mb-1 font-semibold text-md">
                      {playlist.playlist_name}
                    </p>
                    <p className="mb-1 text-sm text-muted-foreground">
                      Channel:{" "}
                      <span className="font-medium">
                        {playlist.channel_name}
                      </span>
                    </p>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Videos: {playlist.videos}
                    </p>
                    <a
                      href={playlist.playlist_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 text-sm font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      Watch Playlist
                    </a>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Enhanced Groups Section */}
        {activeSection === "groups" && (
          <div className="space-y-8">
            <div className="p-8 text-center border glass-card rounded-2xl border-border/50 bg-gradient-to-br from-card/50 to-muted/20">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 shadow-lg bg-gradient-to-br from-kiit-primary to-kiit-secondary rounded-2xl">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-transparent bg-gradient-to-r from-kiit-primary to-kiit-secondary bg-clip-text">
                Study Groups & Resources
              </h3>
              <p className="max-w-md mx-auto mb-6 text-lg leading-relaxed text-muted-foreground">
                Join collaborative study groups and access shared resources from
                students
              </p>
            </div>

            {/* Demo Groups */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 border glass-card rounded-2xl border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl">
                    📘
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">CSE Study Hub</h4>
                    <p className="text-sm text-muted-foreground">
                      Computer Science & Engineering
                    </p>
                  </div>
                </div>
                <p className="mb-4 text-muted-foreground">
                  Comprehensive notes, assignments, and project resources for
                  CSE students.
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://t.me/kiit_cse_study"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 text-sm font-medium text-center text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                  >
                    📱 Telegram Group
                  </a>
                  <a
                    href="https://drive.google.com/drive/folders/cse_resources"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 text-sm font-medium text-center text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    📁 Drive Resources
                  </a>
                </div>
              </div>

              <div className="p-6 border glass-card rounded-2xl border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-xl">
                    ⚡
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">ETC Study Group</h4>
                    <p className="text-sm text-muted-foreground">
                      Electronics & Telecommunication
                    </p>
                  </div>
                </div>
                <p className="mb-4 text-muted-foreground">
                  Circuit diagrams, lab manuals, and electronics project
                  resources.
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://t.me/kiit_etc_study"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 text-sm font-medium text-center text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                  >
                    📱 Telegram Group
                  </a>
                  <a
                    href="https://drive.google.com/drive/folders/etc_resources"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 text-sm font-medium text-center text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    📁 Drive Resources
                  </a>
                </div>
              </div>

              <div className="p-6 border glass-card rounded-2xl border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-xl">
                    🏗️
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Civil Engineering Hub</h4>
                    <p className="text-sm text-muted-foreground">
                      Civil Engineering Department
                    </p>
                  </div>
                </div>
                <p className="mb-4 text-muted-foreground">
                  Construction guides, AutoCAD files, and project documentation.
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://t.me/kiit_civil_study"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 text-sm font-medium text-center text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                  >
                    📱 Telegram Group
                  </a>
                  <a
                    href="https://drive.google.com/drive/folders/civil_resources"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 text-sm font-medium text-center text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    📁 Drive Resources
                  </a>
                </div>
              </div>

              <div className="p-6 border glass-card rounded-2xl border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-xl">
                    🧪
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Biotech Resources</h4>
                    <p className="text-sm text-muted-foreground">
                      Biotechnology Department
                    </p>
                  </div>
                </div>
                <p className="mb-4 text-muted-foreground">
                  Lab protocols, research papers, and biotech project resources.
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://t.me/kiit_biotech_study"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 text-sm font-medium text-center text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                  >
                    📱 Telegram Group
                  </a>
                  <a
                    href="https://drive.google.com/drive/folders/biotech_resources"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 text-sm font-medium text-center text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    📁 Drive Resources
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Still Need Help? Section */}
        <div className="mt-16 mb-8">
          <div className="p-8 text-center border glass-card rounded-2xl border-border/50 bg-gradient-to-br from-card/50 to-muted/20">
            <h3 className="mb-3 text-2xl font-bold text-transparent bg-gradient-to-r from-kiit-primary to-kiit-secondary bg-clip-text">
              Still Need Help?
            </h3>
            <p className="max-w-2xl mx-auto mb-8 text-lg leading-relaxed text-muted-foreground">
              Can't find what you're looking for? Our AI assistant is here 24/7
              to help, or submit a resource request and we'll add it to our
              collection.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col items-center justify-center max-w-md gap-4 mx-auto sm:flex-row">
              <button
                onClick={() => (window.location.href = "/chatbot")}
                className="flex items-center justify-center w-full gap-2 px-6 py-3 text-white transition-all duration-300 transform shadow-lg group sm:w-auto bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 hover:shadow-xl hover:-translate-y-1"
              >
                <Bot className="w-5 h-5 transition-transform group-hover:scale-110" />
                Ask AI Assistant
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() =>
                  window.open("https://forms.gle/5d89iETDeefruKSX9", "_blank")
                }
                aria-label="Request Resource Form"
                className="flex items-center justify-center w-full gap-2 px-6 py-3 text-white transition-all duration-300 transform shadow-lg group sm:w-auto bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-xl hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 hover:shadow-xl hover:-translate-y-1"
              >
                <MessageSquare className="w-5 h-5 transition-transform group-hover:scale-110" />
                Request Resource
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Upload Dialog */}
      <StudyMaterialUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </div>
  );
}
