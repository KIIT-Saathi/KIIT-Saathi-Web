'use client';
import React, { useState } from "react";
import { Linkedin, Instagram, Github } from "lucide-react";
// import { teamData } from "@/data/team.js";
import Image from 'next/image';

interface TeamMember {
  id?: number;
  name: string;
  role?: string;
  Image?: string;
  LinkedIn?: string;
  Instagram?: string;
  Github?: string;
}

// Temporary team data until the actual data file is available
const teamData: TeamMember[] = [
  {
    id: 1,
    name: "Aditya Sharma",
    role: "Founder & CEO",
    LinkedIn: "https://linkedin.com/in/adityasharma",
    Instagram: "https://instagram.com/adityasharma",
    Github: "https://github.com/adityasharma"
  },
  {
    id: 2,
    name: "John Doe",
    role: "CTO",
    LinkedIn: "https://linkedin.com/in/johndoe",
    Instagram: "https://instagram.com/johndoe",
    Github: "https://github.com/johndoe"
  },
  {
    id: 3,
    name: "Jane Smith",
    role: "Lead Developer",
    LinkedIn: "https://linkedin.com/in/janesmith",
    Instagram: "https://instagram.com/janesmith",
    Github: "https://github.com/janesmith"
  },
  {
    id: 4,
    name: "Mike Johnson",
    role: "UI/UX Designer",
    LinkedIn: "https://linkedin.com/in/mikejohnson",
    Instagram: "https://instagram.com/mikejohnson"
  }
];

const TeamCard = ({ member }: { member: TeamMember }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="[perspective:1000px] h-72 sm:h-80">
      <div
        className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-500 ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        onTouchStart={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT FACE */}
        <div className="hover:cursor-pointer hover:kiit-green-soft absolute inset-0 [backface-visibility:hidden] rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-lg">
          <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6">
            {/* Image */}
            <div className="relative w-32 h-32 mb-3 overflow-hidden bg-gray-200 rounded-full sm:w-40 sm:h-40 sm:mb-4">
              {!imageError && member.Image ? (
                <Image
                  src={member.Image}
                  alt={member.name}
                  onError={() => setImageError(true)}
                  width={160}
                  height={160}
                  className="object-cover w-full h-full border border-gray-300"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-purple-400">
                  <span className="text-4xl font-bold text-white">
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Member info */}
            <h3 className="text-base font-semibold text-center text-gray-800 sm:text-lg md:text-xl">
              {member.name}
            </h3>
          </div>
        </div>

        {/* BACK FACE */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl sm:rounded-2xl bg-kiit-green-light overflow-hidden shadow-lg shadow-kiit-green-dark">
          <div className="flex flex-col items-center justify-center h-full p-4 text-white sm:p-6">
            <div className="relative w-32 h-32 mb-3 overflow-hidden bg-gray-200 rounded-full sm:w-40 sm:h-40 sm:mb-4">
              {/* Back face image placeholder or repeat front if needed */}
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-purple-400">
                <span className="text-4xl font-bold text-white">
                  {member.name.charAt(0)}
                </span>
              </div>
            </div>
            <h3 className="mb-4 text-base font-semibold text-center sm:text-lg md:text-xl">
              {member.name}
            </h3>
            <p className="mb-4 text-sm text-center opacity-90">
              {member.role || 'Team Member'}
            </p>
            <div className="flex items-center gap-4">
              {member.LinkedIn && (
                <a
                  href={member.LinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-200 transform hover:scale-125"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Linkedin className="w-6 h-6 text-white sm:w-7 sm:h-7 md:w-8 md:h-8 hover:text-gray-200" />
                </a>
              )}
              {member.Instagram && (
                <a
                  href={member.Instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-200 transform hover:scale-125"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Instagram className="w-6 h-6 text-white sm:w-7 sm:h-7 md:w-8 md:h-8 hover:text-gray-200" />
                </a>
              )}
              {member.Github && (
                <a
                  href={member.Github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-200 transform hover:scale-125"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="w-6 h-6 text-white sm:w-7 sm:h-7 md:w-8 md:h-8 hover:text-gray-200" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MeetOurTeam: React.FC = () => {
  const teamMembers: TeamMember[] = teamData;

  const rows = [
    teamMembers.slice(0, 4),
    teamMembers.slice(4, 8),
    teamMembers.slice(8, 12),
    teamMembers.slice(12, 16),
    teamMembers.slice(16, 17),
  ];

  return (
    <section className="relative px-3 py-12 overflow-hidden sm:py-16 md:py-20 lg:py-24 sm:px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute w-48 h-48 rounded-full top-20 left-10 sm:w-72 sm:h-72 bg-blue-200/20 blur-3xl" />
        <div className="absolute w-64 h-64 rounded-full bottom-20 right-10 sm:w-96 sm:h-96 bg-purple-200/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-pink-200/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl">
        <div className="container relative z-10 max-w-6xl mx-auto">
          {/* Heading */}
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="px-4 mb-2 text-2xl font-bold text-transparent sm:text-3xl md:text-4xl lg:text-5xl sm:mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text">
              Meet Our Team
            </h2>
            <p className="px-4 text-base italic text-muted-foreground sm:text-lg">
              Helping you connect with the best.
            </p>
          </div>
        </div>

          {/* Team Grid */}
          <div className="space-y-6 sm:space-y-8">
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`grid gap-4 sm:gap-6 ${rowIndex === 4
                    ? "grid-cols-1 max-w-xs mx-auto"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  }`}
              >
                {row.map((member, index) => (
                  <TeamCard key={index} member={member} />
                ))}
              </div>
            ))}
          </div>
        </div>
    </section>
  );
};

export default MeetOurTeam;