"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, Download, RotateCcw, TrendingUp, BookOpen } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { curriculum } from './data/curriculum';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '@/hooks/use-auth';

const kiitMascot = '/assets/kiitMascot.jpg';

interface Subject {
  name: string;
  credits: number;
  grade?: string;
  gradePoints?: number;
}

interface SemesterData {
  semester: number;
  subjects: Subject[];
  sgpa: number;
}

export default function SGPACalculatorPage() {
  const { user } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesterHistory, setSemesterHistory] = useState<SemesterData[]>([]);
  const [currentSGPA, setCurrentSGPA] = useState<number>(0);
  const [cgpa, setCGPA] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [pastCGPA, setPastCGPA] = useState<number | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);

  const branches = Object.keys(curriculum);
  const semesters = selectedBranch ? Object.keys(curriculum[selectedBranch]) : [];

  const gradeOptions = [
    { label: 'O', value: 'O', points: 10 },
    { label: 'E', value: 'E', points: 9 },
    { label: 'A', value: 'A', points: 8 },
    { label: 'B', value: 'B', points: 7 },
    { label: 'C', value: 'C', points: 6 },
    { label: 'D', value: 'D', points: 5 },
    { label: 'F', value: 'F', points: 0 }
  ];

  const getGradePoints = (grade: string): number => {
    const gradeOption = gradeOptions.find(g => g.value === grade);
    return gradeOption ? gradeOption.points : 0;
  };

  useEffect(() => {
    if (selectedBranch && selectedSemester) {
      const semesterSubjects = curriculum[selectedBranch][selectedSemester] || [];
      setSubjects(semesterSubjects.map(sub => ({ ...sub, grade: undefined, gradePoints: undefined })));
      setShowResults(false);
    }
  }, [selectedBranch, selectedSemester]);

  useEffect(() => {
    calculateSGPA();
  }, [subjects]);

  useEffect(() => {
    calculateCGPA();
  }, [semesterHistory, currentSGPA, pastCGPA]);

  const calculateSGPA = () => {
    const validGrades = subjects.filter(sub => sub.grade !== undefined && sub.grade !== null && sub.grade !== '');
    if (validGrades.length === 0) {
      setCurrentSGPA(0);
      return;
    }

    const totalCredits = validGrades.reduce((sum, sub) => sum + sub.credits, 0);
    const totalPoints = validGrades.reduce((sum, sub) => {
      const gradePoints = getGradePoints(sub.grade || '');
      return sum + (sub.credits * gradePoints);
    }, 0);

    const sgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    setCurrentSGPA(Math.round(sgpa * 100) / 100);
  };

  const calculateCGPA = () => {
    // If there is no semester history and no current SGPA, CGPA is 0
    if ((semesterHistory.length === 0) && (!currentSGPA || currentSGPA === 0) && (!pastCGPA || pastCGPA === 0)) {
      setCGPA(0);
      return;
    }

    // Weighted CGPA: use total credits across semesters
    const allSems = [...semesterHistory];
    // include current semester if calculated
    if (showResults && currentSGPA > 0) {
      const currentCredits = subjects.filter(s => s.grade).reduce((sum, s) => sum + s.credits, 0);
      if (currentCredits > 0) {
        allSems.push({ semester: Number(selectedSemester || 0), subjects: subjects.filter(s => s.grade), sgpa: currentSGPA });
      }
    }

    // If pastCGPA is provided and no detailed semester history for past, average it with computed CGPA
    if (pastCGPA && allSems.length === 0) {
      setCGPA(Math.round(pastCGPA * 100) / 100);
      return;
    }

    // Compute weighted average using credits
    let totalCredits = 0;
    let totalWeightedPoints = 0;

    allSems.forEach(sem => {
      const semCredits = sem.subjects.reduce((sum, s) => sum + s.credits, 0);
      const semWeighted = sem.subjects.reduce((sum, s) => sum + (s.credits * getGradePoints(s.grade || '')), 0);
      totalCredits += semCredits;
      totalWeightedPoints += semWeighted;
    });

    if (pastCGPA && pastCGPA > 0 && totalCredits > 0) {
      // naive approach: average the past CGPA with computed CGPA
      const computedCGPA = totalWeightedPoints / totalCredits;
      const newCGPA = (computedCGPA + pastCGPA) / 2;
      setCGPA(Math.round(newCGPA * 100) / 100);
      return;
    }

    if (totalCredits === 0) {
      setCGPA(0);
      return;
    }

    const finalCGPA = totalWeightedPoints / totalCredits;
    setCGPA(Math.round(finalCGPA * 100) / 100);
  };

  const handleGradeChange = (index: number, grade: string) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].grade = grade;
    updatedSubjects[index].gradePoints = getGradePoints(grade);
    setSubjects(updatedSubjects);
  };

  const calculateResults = () => {
    const validGrades = subjects.filter(sub => sub.grade && sub.grade !== '');
    if (validGrades.length === 0) {
      toast.error('Please select grades for at least one subject');
      return;
    }

    calculateSGPA();
    setShowResults(true);
    toast.success('SGPA calculated successfully!');
  };

  const addSemesterToHistory = () => {
    if (!selectedSemester || currentSGPA === 0) {
      toast.error('Please complete current semester calculation first');
      return;
    }

    const semesterData: SemesterData = {
      semester: parseInt(selectedSemester),
      subjects: subjects.filter(sub => sub.grade !== undefined && sub.grade !== ''),
      sgpa: currentSGPA
    };

    const existingIndex = semesterHistory.findIndex(sem => sem.semester === semesterData.semester);
    if (existingIndex >= 0) {
      const updated = [...semesterHistory];
      updated[existingIndex] = semesterData;
      setSemesterHistory(updated);
      toast.success('Semester data updated successfully');
    } else {
      setSemesterHistory([...semesterHistory, semesterData].sort((a, b) => a.semester - b.semester));
      toast.success('Semester added to CGPA calculation');
    }
  };

  const resetCalculator = () => {
    setSelectedBranch('');
    setSelectedSemester('');
    setSubjects([]);
    setSemesterHistory([]);
    setCurrentSGPA(0);
    setCGPA(0);
    setShowResults(false);
    setPastCGPA(null);
    toast.success('Calculator reset successfully');
  };

  const exportToPDF = async () => {
    if (!selectedBranch || !selectedSemester) {
      toast.error('Please select branch and semester first');
      return;
    }

    const validSubjects = subjects.filter(sub => sub.grade && sub.grade !== '');
    if (validSubjects.length === 0 && semesterHistory.length === 0) {
      toast.error('No data to export. Please enter grades first.');
      return;
    }

    setIsGeneratingPDF(true);

    try {
      toast.info('Generating PDF - please wait...', { duration: 3000 });
      await new Promise(resolve => setTimeout(resolve, 100));

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      const checkAddPage = (requiredSpace: number) => {
        if (yPos + requiredSpace > pageHeight - 25) {
          doc.addPage();
          yPos = 20;
          return true;
        }
        return false;
      };

      try {
        const logoImg = new Image();
        logoImg.src = kiitMascot as unknown as string;
        doc.addImage(logoImg, 'JPEG', 15, yPos, 20, 20);
      } catch (err) {
        // ignore image errors
      }

      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('SGPA & CGPA Report', 45, yPos + 8);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('KIIT Saathi', 45, yPos + 15);
      yPos += 30;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const now = new Date();
      const timestamp = now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

      doc.text(`Branch: ${selectedBranch}`, 15, yPos);
      doc.text(`Generated: ${timestamp}`, pageWidth - 15, yPos, { align: 'right' });
      yPos += 6;

      if (user?.email) {
        doc.text(`Generated by: ${user.email}`, 15, yPos);
      }
      yPos += 10;

      doc.setDrawColor(200, 200, 200);
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 10;

      if (showResults && validSubjects.length > 0) {
        checkAddPage(60);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Semester ${selectedSemester} - Current Calculation`, 15, yPos);
        yPos += 8;

        const currentSemData = validSubjects.map(sub => [
          sub.name,
          sub.credits.toString(),
          sub.grade || '',
          getGradePoints(sub.grade || '').toString(),
          (sub.credits * getGradePoints(sub.grade || '')).toFixed(2)
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [['Course Title', 'Credits', 'Grade', 'Grade Point', 'Weighted Points']],
          body: currentSemData,
          theme: 'striped',
          headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold', fontSize: 10 },
          columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 20, halign: 'center' }, 2: { cellWidth: 20, halign: 'center' }, 3: { cellWidth: 25, halign: 'center' }, 4: { cellWidth: 30, halign: 'right' } },
          styles: { fontSize: 9, cellPadding: 3, overflow: 'linebreak', cellWidth: 'wrap' },
          margin: { left: 15, right: 15 }
        });

        yPos = (doc as any).lastAutoTable.finalY + 8;

        const totalCredits = validSubjects.reduce((sum, sub) => sum + sub.credits, 0);
        const totalWeightedPoints = validSubjects.reduce((sum, sub) => sum + (sub.credits * getGradePoints(sub.grade || '')), 0);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Credits: ${totalCredits}`, 15, yPos);
        doc.text(`Weighted Grade Points: ${totalWeightedPoints.toFixed(2)}`, 15, yPos + 6);
        doc.text(`SGPA: ${currentSGPA.toFixed(2)}`, 15, yPos + 12);

        yPos += 22;
      }

      if (semesterHistory.length > 0) {
        checkAddPage(60);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Semester History', 15, yPos);
        yPos += 8;

        semesterHistory.forEach((sem, index) => {
          checkAddPage(50);

          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(`Semester ${sem.semester}`, 15, yPos);
          doc.setFont('helvetica', 'normal');
          doc.text(`SGPA: ${sem.sgpa.toFixed(2)}`, pageWidth - 15, yPos, { align: 'right' });
          yPos += 6;

          const semTableData = sem.subjects.map(sub => [
            sub.name,
            sub.credits.toString(),
            sub.grade || '',
            getGradePoints(sub.grade || '').toString(),
            (sub.credits * getGradePoints(sub.grade || '')).toFixed(2)
          ]);

          autoTable(doc, {
            startY: yPos,
            head: [['Course Title', 'Credits', 'Grade', 'Grade Point', 'Weighted Points']],
            body: semTableData,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold', fontSize: 9 },
            columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 20, halign: 'center' }, 2: { cellWidth: 20, halign: 'center' }, 3: { cellWidth: 25, halign: 'center' }, 4: { cellWidth: 30, halign: 'right' } },
            styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak', cellWidth: 'wrap' },
            margin: { left: 15, right: 15 }
          });

          yPos = (doc as any).lastAutoTable.finalY + 10;
        });

        if (cgpa > 0) {
          checkAddPage(30);

          doc.setFillColor(240, 240, 240);
          doc.rect(15, yPos, pageWidth - 30, 25, 'F');

          yPos += 8;
          doc.setFontSize(13);
          doc.setFont('helvetica', 'bold');
          doc.text('Overall CGPA Summary', 20, yPos);

          yPos += 8;
          doc.setFontSize(11);
          doc.text(`Based on ${semesterHistory.length} semester(s)`, 20, yPos);

          yPos += 8;
          doc.setFontSize(16);
          doc.setTextColor(34, 197, 94);
          doc.text(`CGPA: ${cgpa.toFixed(2)}`, 20, yPos);
          doc.setTextColor(0, 0, 0);
        }
      }

      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(128, 128, 128);
        doc.text('Generated by KIIT Saathi', 15, pageHeight - 10);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 15, pageHeight - 10, { align: 'right' });
      }

      const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');
      const filename = `KIIT_SGPA_Report_${selectedBranch.replace(/\s+/g, '_')}_Sem${selectedSemester}_${dateStr}_${timeStr}.pdf`;

      doc.save(filename);

      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const exportToCSV = () => {
    if (!selectedBranch || !selectedSemester) {
      toast.error('Please select branch and semester first');
      return;
    }

    const validSubjects = subjects.filter(sub => sub.grade && sub.grade !== '');
    if (validSubjects.length === 0 && semesterHistory.length === 0) {
      toast.error('No data to export. Please enter grades first.');
      return;
    }

    try {
      const now = new Date();
      const timestamp = now.toISOString();
      const userEmail = user?.email || 'N/A';

      let csvContent = '\uFEFF';
      csvContent += 'Branch,Semester,Course Code,Course Title,Credits,Grade,Grade Point,Total Credits (Semester),Weighted Grade Points (Semester),SGPA,CGPA,GeneratedAt,GeneratedBy\n';

      const escapeCSV = (field: string): string => {
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      };

      if (showResults && validSubjects.length > 0) {
        const totalCredits = validSubjects.reduce((sum, sub) => sum + sub.credits, 0);
        const totalWeightedPoints = validSubjects.reduce((sum, sub) => sum + (sub.credits * getGradePoints(sub.grade || '')), 0);

        validSubjects.forEach((sub, index) => {
          const gradePoint = getGradePoints(sub.grade || '');
          const weightedPoints = (sub.credits * gradePoint).toFixed(3);

          const sgpaValue = index === validSubjects.length - 1 ? currentSGPA.toFixed(2) : '';
          const cgpaValue = index === validSubjects.length - 1 && cgpa > 0 ? cgpa.toFixed(2) : '';
          const semTotalCredits = index === validSubjects.length - 1 ? totalCredits.toString() : '';
          const semWeightedPoints = index === validSubjects.length - 1 ? totalWeightedPoints.toFixed(3) : '';

          csvContent += `${escapeCSV(selectedBranch)},`;
          csvContent += `${selectedSemester},`;
          csvContent += `,`;
          csvContent += `${escapeCSV(sub.name)},`;
          csvContent += `${sub.credits},`;
          csvContent += `${sub.grade || ''},`;
          csvContent += `${gradePoint.toFixed(3)},`;
          csvContent += `${semTotalCredits},`;
          csvContent += `${semWeightedPoints},`;
          csvContent += `${sgpaValue},`;
          csvContent += `${cgpaValue},`;
          csvContent += `${timestamp},`;
          csvContent += `${escapeCSV(userEmail)}\n`;
        });
      }

      semesterHistory.forEach(sem => {
        const semTotalCredits = sem.subjects.reduce((sum, sub) => sum + sub.credits, 0);
        const semWeightedPoints = sem.subjects.reduce((sum, sub) => sum + (sub.credits * getGradePoints(sub.grade || '')), 0);

        sem.subjects.forEach((sub, index) => {
          const gradePoint = getGradePoints(sub.grade || '');
          const weightedPoints = (sub.credits * gradePoint).toFixed(3);

          const sgpaValue = index === sem.subjects.length - 1 ? sem.sgpa.toFixed(2) : '';
          const cgpaValue = index === sem.subjects.length - 1 && cgpa > 0 ? cgpa.toFixed(2) : '';
          const semTotalCreditsStr = index === sem.subjects.length - 1 ? semTotalCredits.toString() : '';
          const semWeightedPointsStr = index === sem.subjects.length - 1 ? semWeightedPoints.toFixed(3) : '';

          csvContent += `${escapeCSV(selectedBranch)},`;
          csvContent += `${sem.semester},`;
          csvContent += `,`;
          csvContent += `${escapeCSV(sub.name)},`;
          csvContent += `${sub.credits},`;
          csvContent += `${sub.grade || ''},`;
          csvContent += `${gradePoint.toFixed(3)},`;
          csvContent += `${semTotalCreditsStr},`;
          csvContent += `${semWeightedPointsStr},`;
          csvContent += `${sgpaValue},`;
          csvContent += `${cgpaValue},`;
          csvContent += `${timestamp},`;
          csvContent += `${escapeCSV(userEmail)}\n`;
        });
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');
      a.download = `KIIT_SGPA_Data_${selectedBranch.replace(/\s+/g, '_')}_Sem${selectedSemester}_${dateStr}_${timeStr}.csv`;

      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('Data exported to CSV successfully');
    } catch (error) {
      toast.error('Failed to export CSV. Please try again.');
    }
  };

  const chartData = semesterHistory.map(sem => ({ semester: `Sem ${sem.semester}`, sgpa: sem.sgpa }));
  const highestSGPA = semesterHistory.length ? Math.max(...semesterHistory.map(s => s.sgpa)) : 0;
  const lowestSGPA = semesterHistory.length ? Math.min(...semesterHistory.map(s => s.sgpa)) : 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Calculator className="h-12 w-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-gradient">SGPA & CGPA Calculator</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Calculate your SGPA and CGPA with accurate KIIT curriculum. Track your academic progress with real-time calculations and visual insights.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Branch & Semester Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map(branch => (<SelectItem key={branch} value={branch}>{branch}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="semester">Semester</Label>
                      <Select value={selectedSemester} onValueChange={setSelectedSemester} disabled={!selectedBranch}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters.map(sem => (<SelectItem key={sem} value={sem}>Semester {sem}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {subjects.length > 0 && (
                <Card className="bg-card/80 backdrop-blur-sm border-2">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Subject Grades</CardTitle>
                    <p className="text-sm text-muted-foreground">Select grades for each subject. Leave blank if you don't have this subject.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {subjects.map((subject, index) => (
                        <div key={index} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg bg-background/50">
                          <div className="flex-1 mb-2 md:mb-0">
                            <div className="font-semibold text-lg">{subject.name}</div>
                            <div className="text-sm text-muted-foreground">Credit: {subject.credits}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Select value={subject.grade || ''} onValueChange={(value) => handleGradeChange(index, value)}>
                              <SelectTrigger className="w-24 bg-background"><SelectValue placeholder="Grade" /></SelectTrigger>
                              <SelectContent>
                                {gradeOptions.map((grade) => (<SelectItem key={grade.value} value={grade.value}>{grade.label}</SelectItem>))}
                              </SelectContent>
                            </Select>
                            <div className="text-sm text-muted-foreground w-16 text-center">{subject.grade ? `${(subject.credits * getGradePoints(subject.grade)).toFixed(1)} pts` : '0.0 pts'}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 text-sm p-4 rounded border-2 font-bold  text-muted-foreground">
                      <h3>Past CGPA</h3>

                      <input type="number" step="0.01" placeholder="Your CGPA" value={pastCGPA ?? ""} onChange={(e) => setPastCGPA(parseFloat(e.target.value) || null)} className="border p-2 rounded-md w-full" />
                      <p className="text-xs mt-1">Enter your previous CGPA to include it in the calculation.</p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button onClick={calculateResults} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6">Calculate</Button>
                      {showResults && (
                        <Button onClick={addSemesterToHistory} disabled={currentSGPA === 0} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">Add to CGPA Calculation</Button>
                      )}
                      <Button variant="outline" onClick={resetCalculator}><RotateCcw className="h-4 w-4 mr-2" />Reset</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {showResults && (
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800">Current SGPA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-green-700 mb-3">{currentSGPA.toFixed(2)}</div>
                      <Badge variant={currentSGPA >= 8.5 ? "default" : currentSGPA >= 7.0 ? "secondary" : "destructive"} className="text-lg px-4 py-1">{currentSGPA >= 8.5 ? "Excellent" : currentSGPA >= 7.0 ? "Good" : currentSGPA > 0 ? "Average" : "Not Calculated"}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {semesterHistory.length > 0 && (
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-800">Overall CGPA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-blue-700 mb-3">{cgpa.toFixed(2)}</div>
                      <Badge variant={cgpa >= 8.5 ? "default" : cgpa >= 7.0 ? "secondary" : "destructive"} className="text-lg px-4 py-1">{cgpa >= 8.5 ? "Excellent" : cgpa >= 7.0 ? "Good" : cgpa > 0 ? "Average" : "Not Calculated"}</Badge>
                      <div className="mt-3 text-sm text-blue-600 font-medium">Based on {semesterHistory.length} semester(s)</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Download className="h-5 w-5" />Export Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" onClick={exportToPDF} disabled={isGeneratingPDF || (!showResults && semesterHistory.length === 0)} title={(!showResults && semesterHistory.length === 0) ? "Please enter course grades to export" : ""}>{isGeneratingPDF ? (<><span className="animate-spin mr-2">⏳</span>Generating PDF...</>) : ('Export PDF Report')}</Button>
                    <Button variant="outline" className="w-full" onClick={exportToCSV} disabled={!showResults && semesterHistory.length === 0} title={(!showResults && semesterHistory.length === 0) ? "Please enter course grades to export" : ""}>Export CSV Data</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {chartData.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Academic Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="semester" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip formatter={(value) => [value, 'SGPA']} labelFormatter={(label) => `${label}`} />
                      <Line type="monotone" dataKey="sgpa" strokeWidth={3} dot={{ strokeWidth: 2, r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {semesterHistory.length > 1 && (
                  <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-sm text-muted-foreground">Highest SGPA</div>
                      <div className="text-2xl font-bold text-green-600">{highestSGPA.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Lowest SGPA</div>
                      <div className="text-2xl font-bold text-red-600">{lowestSGPA.toFixed(2)}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {semesterHistory.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Semester History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {semesterHistory.map((sem, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Semester {sem.semester}</h4>
                        <Badge variant="outline">SGPA: {sem.sgpa.toFixed(2)}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                        {sem.subjects.map((sub, subIndex) => (
                          <div key={subIndex} className="flex justify-between">
                            <span className="truncate mr-2">{sub.name}</span>
                            <span className="font-semibold">{sub.grade}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
