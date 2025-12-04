"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, FileText, DollarSign, Receipt } from "lucide-react";

interface ExportSummaryProps {
  groupId: string;
  groupName: string;
  currency: string;
}

interface ExportData {
  expenses: any[];
  members: any[];
  balances: any[];
  settlements: any[];
}

export const ExportSummary = ({
  groupId,
  groupName,
  currency,
}: ExportSummaryProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [exportData, setExportData] = useState<ExportData | null>(null);

  useEffect(() => {
    if (!groupId) return;
    loadExportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const loadExportData = async () => {
    try {
      setLoading(true);

      // Fetch expenses (with joined member and splits)
      const { data: expenses, error: expensesError } = await supabase
        .from("expenses")
        .select(`
          id,
          title,
          amount,
          date,
          notes,
          paid_by_member_id,
          group_members!expenses_paid_by_member_id_fkey(name, email_phone),
          expense_splits(
            member_id,
            amount,
            group_members(name)
          )
        `)
        .eq("group_id", groupId)
        .order("date", { ascending: false });

      if (expensesError) throw expensesError;

      // Fetch members
      const { data: members, error: membersError } = await supabase
        .from("group_members")
        .select("*")
        .eq("group_id", groupId);

      if (membersError) throw membersError;

      // Calculate balances
      const memberBalances = new Map<
        string,
        { member_name: string; total_paid: number; total_owed: number; net_balance: number }
      >();

      (expenses || []).forEach((expense: any) => {
        const paidByMemberId = expense.paid_by_member_id;
        const paidByMemberName = expense.group_members?.name || "Unknown";

        if (!memberBalances.has(paidByMemberId)) {
          memberBalances.set(paidByMemberId, {
            member_name: paidByMemberName,
            total_paid: 0,
            total_owed: 0,
            net_balance: 0,
          });
        }

        const paidObj = memberBalances.get(paidByMemberId)!;
        paidObj.total_paid += Number(expense.amount || 0);

        (expense.expense_splits || []).forEach((split: any) => {
          const memberId = split.member_id;
          const memberName = split.group_members?.name || "Unknown";

          if (!memberBalances.has(memberId)) {
            memberBalances.set(memberId, {
              member_name: memberName,
              total_paid: 0,
              total_owed: 0,
              net_balance: 0,
            });
          }

          const owedObj = memberBalances.get(memberId)!;
          owedObj.total_owed += Number(split.amount || 0);
        });
      });

      const balancesArray = Array.from(memberBalances.values()).map((balance) => ({
        ...balance,
        net_balance: Number((balance.total_paid - balance.total_owed).toFixed(2)),
      }));

      // Calculate settlements
      const settlements = calculateSettlements(balancesArray);

      setExportData({
        expenses: expenses || [],
        members: members || [],
        balances: balancesArray,
        settlements,
      });
    } catch (error: any) {
      console.error("Export load error:", error);
      toast({
        title: "Error",
        description: `Failed to load export data: ${error?.message || error}`,
        variant: "destructive",
      });
      setExportData(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateSettlements = (balances: any[]): any[] => {
    const creditors = balances
      .filter((b) => b.net_balance > 0.01)
      .map((b) => ({ name: b.member_name, amount: Number(b.net_balance) }))
      .sort((a, b) => b.amount - a.amount);

    const debtors = balances
      .filter((b) => b.net_balance < -0.01)
      .map((b) => ({ name: b.member_name, amount: Math.abs(Number(b.net_balance)) }))
      .sort((a, b) => b.amount - a.amount);

    const settlements: any[] = [];
    let i = 0;
    let j = 0;

    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      const settleAmount = Math.min(creditor.amount, debtor.amount);

      if (settleAmount > 0.01) {
        settlements.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(settleAmount * 100) / 100,
        });
      }

      creditor.amount -= settleAmount;
      debtor.amount -= settleAmount;

      if (creditor.amount < 0.01) i++;
      if (debtor.amount < 0.01) j++;
    }

    return settlements;
  };

  const exportToCSV = () => {
    if (!exportData) return;

    let csv = "";

    // Header
    csv += `Group Name: ${groupName}\n`;
    csv += `Currency: ${currency}\n`;
    csv += `Export Date: ${new Date().toLocaleDateString()}\n\n`;

    // Expenses Section
    csv += `EXPENSES\n`;
    csv += `Date,Title,Amount,Paid By,Notes\n`;
    exportData.expenses.forEach((expense) => {
      const date = new Date(expense.date).toLocaleDateString();
      const title = (expense.title || "").replace(/,/g, ";");
      const amount = Number(expense.amount || 0).toFixed(2);
      const paidBy = (expense.group_members?.name || "Unknown").replace(/,/g, ";");
      const notes = (expense.notes || "").replace(/,/g, ";");
      csv += `${date},${title},${amount},${paidBy},${notes}\n`;
    });
    csv += `\n`;

    // Members Section
    csv += `MEMBERS\n`;
    csv += `Name,Email/Phone,Roll Number\n`;
    exportData.members.forEach((member) => {
      const name = (member.name || "").replace(/,/g, ";");
      const emailPhone = (member.email_phone || "").replace(/,/g, ";");
      const rollNumber = member.roll_number || "";
      csv += `${name},${emailPhone},${rollNumber}\n`;
    });
    csv += `\n`;

    // Balances Section
    csv += `BALANCES\n`;
    csv += `Member,Total Paid,Total Owed,Net Balance\n`;
    exportData.balances.forEach((balance) => {
      const name = (balance.member_name || "").replace(/,/g, ";");
      csv += `${name},${Number(balance.total_paid || 0).toFixed(2)},${Number(
        balance.total_owed || 0
      ).toFixed(2)},${Number(balance.net_balance || 0).toFixed(2)}\n`;
    });
    csv += `\n`;

    // Settlements Section
    csv += `SUGGESTED SETTLEMENTS\n`;
    csv += `From,To,Amount\n`;
    exportData.settlements.forEach((settlement) => {
      const from = (settlement.from || "").replace(/,/g, ";");
      const to = (settlement.to || "").replace(/,/g, ";");
      csv += `${from},${to},${Number(settlement.amount || 0).toFixed(2)}\n`;
    });

    // Download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${groupName.replace(/\s+/g, "_")}_summary_${new Date()
      .toISOString()
      .split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful! 📊",
      description: "Your group summary has been downloaded as CSV.",
    });
  };

  const exportToPDF = () => {
    if (!exportData) return;

    let content = "";

    // Header + styles
    content += `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${groupName} - Summary Report</title>
<style>
  body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#333}
  h1{color:#2563eb;border-bottom:3px solid #2563eb;padding-bottom:10px}
  h2{color:#1e40af;margin-top:30px;margin-bottom:15px;border-bottom:1px solid #e5e7eb;padding-bottom:5px}
  .meta{color:#6b7280;margin-bottom:30px}
  table{width:100%;border-collapse:collapse;margin-bottom:30px}
  th{background:#f3f4f6;padding:12px;text-align:left;border-bottom:2px solid #d1d5db;font-weight:600}
  td{padding:10px 12px;border-bottom:1px solid #e5e7eb}
  tr:hover{background:#f9fafb}
  .positive{color:#10b981;font-weight:600}
  .negative{color:#ef4444;font-weight:600}
  .settlement{background:#fef3c7;padding:10px;margin:5px 0;border-radius:4px;border-left:4px solid #f59e0b}
  @media print{body{margin:0;padding:20px}}
</style></head><body>`;

    content += `<h1>${groupName}</h1><div class="meta"><strong>Currency:</strong> ${currency} | <strong>Export Date:</strong> ${new Date().toLocaleDateString()} | <strong>Total Expenses:</strong> ${exportData.expenses.length}</div>`;

    // Expenses
    content += `<h2>📋 Expenses</h2><table><thead><tr><th>Date</th><th>Title</th><th>Amount</th><th>Paid By</th></tr></thead><tbody>`;
    exportData.expenses.forEach((expense) => {
      content += `<tr>
        <td>${new Date(expense.date).toLocaleDateString()}</td>
        <td>${(expense.title || "").replace(/</g, "&lt;")}</td>
        <td>${currency}${Number(expense.amount || 0).toFixed(2)}</td>
        <td>${(expense.group_members?.name || "Unknown").replace(/</g, "&lt;")}</td>
      </tr>`;
    });
    content += `</tbody></table>`;

    // Balances
    content += `<h2>💰 Balances</h2><table><thead><tr><th>Member</th><th>Paid</th><th>Owes</th><th>Net Balance</th></tr></thead><tbody>`;
    exportData.balances.forEach((balance) => {
      const netClass = balance.net_balance > 0 ? "positive" : balance.net_balance < 0 ? "negative" : "";
      const netPrefix = balance.net_balance > 0 ? "+" : "";
      content += `<tr>
        <td><strong>${(balance.member_name || "").replace(/</g, "&lt;")}</strong></td>
        <td>${currency}${Number(balance.total_paid || 0).toFixed(2)}</td>
        <td>${currency}${Number(balance.total_owed || 0).toFixed(2)}</td>
        <td class="${netClass}">${netPrefix}${currency}${Number(balance.net_balance || 0).toFixed(2)}</td>
      </tr>`;
    });
    content += `</tbody></table>`;

    // Settlements
    content += `<h2>🔄 Suggested Settlements</h2>`;
    if (exportData.settlements.length === 0) {
      content += `<p style="color:#10b981;font-weight:600;">✓ All settled! No payments needed.</p>`;
    } else {
      exportData.settlements.forEach((settlement, index) => {
        content += `<div class="settlement"><strong>#${index + 1}:</strong> ${settlement.from} → ${settlement.to}: <strong>${currency}${Number(settlement.amount || 0).toFixed(2)}</strong></div>`;
      });
    }

    content += `</body></html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 250);
    }

    toast({
      title: "Opening Print Dialog 🖨️",
      description: "You can save as PDF from the print dialog.",
    });
  };

  if (loading || !exportData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading export data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalAmount = exportData.expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Export Summary
          </CardTitle>
          <CardDescription>Download a complete summary of your group expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Expenses</span>
              </div>
              <div className="text-2xl font-bold">{exportData.expenses.length}</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Amount</span>
              </div>
              <div className="text-2xl font-bold">{currency}{totalAmount.toFixed(2)}</div>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={exportToCSV} className="w-full" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download as CSV
            </Button>
            <Button onClick={exportToPDF} variant="outline" className="w-full" size="lg">
              <FileText className="w-4 h-4 mr-2" />
              Export as PDF (Print)
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Export includes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ All expenses with dates and details</li>
              <li>✓ Member information</li>
              <li>✓ Individual balance calculations</li>
              <li>✓ Suggested settlements to minimize transactions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
