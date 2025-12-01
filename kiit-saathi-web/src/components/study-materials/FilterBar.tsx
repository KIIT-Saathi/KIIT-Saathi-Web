import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  selectedSemester: string;
  setSelectedSemester: (semester: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  subjects: string[];
  semesters: string[];
  years: string[];
}

export function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedSubject,
  setSelectedSubject,
  selectedSemester,
  setSelectedSemester,
  selectedYear,
  setSelectedYear,
  subjects,
  semesters,
  years,
}: FilterBarProps) {
  return (
    <div className="sticky z-10 p-6 mb-8 border shadow-xl glass-card top-4 bg-card/80 backdrop-blur-md border-border/50 rounded-2xl">
      <div className="space-y-6">
        {/* Search Bar */}
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

        {/* Enhanced Filter Dropdowns */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="h-12 transition-all duration-300 rounded-xl border-border/50 bg-background/50 hover:bg-background focus:ring-2 focus:ring-kiit-primary/20 focus:border-kiit-primary/50">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
              <SelectItem value="all" className="rounded-lg">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject} className="rounded-lg">
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="h-12 transition-all duration-300 rounded-xl border-border/50 bg-background/50 hover:bg-background focus:ring-2 focus:ring-kiit-primary/20 focus:border-kiit-primary/50">
              <SelectValue placeholder="All Semesters" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
              <SelectItem value="all" className="rounded-lg">All Semesters</SelectItem>
              {semesters.map((semester) => (
                <SelectItem key={semester} value={semester} className="rounded-lg">
                  {semester} 
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-12 transition-all duration-300 rounded-xl border-border/50 bg-background/50 hover:bg-background focus:ring-2 focus:ring-kiit-primary/20 focus:border-kiit-primary/50">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
              <SelectItem value="all" className="rounded-lg">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year} className="rounded-lg">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}