"use client";
// touch: trigger dev server rebuild

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ViewBalances } from "@/components/splitsaathi/ViewBalances";
import { ExportSummary } from "@/components/splitsaathi/ExportSummary";
import { GroupSettings } from "@/components/splitsaathi/GroupSettings";
import { useGroupAutoLink } from "@/hooks/useGroupAutoLink";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import {
  Button
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Users,
  Calculator,
  Receipt,
  Calendar,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  ArrowLeft
} from "lucide-react";

interface Group {
  id: string;
  name: string;
  description?: string;
  currency: string;
}

interface Member {
  id: string;
  name: string;
  email_phone: string;
  roll_number?: string;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  notes?: string;
  paid_by_member?: Member | null;
}

const HOSTED_URL = process.env.NEXT_PUBLIC_HOSTED_URL || "";

export default function GroupDashboardPage() {
  const params = useParams();
  const groupId = params?.groupId as string | undefined;
  const router = useRouter();
  const { user, session } = useAuth();
  const { toast } = useToast();

  // Auto-link groups when user logs in
  useGroupAutoLink();

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddingExpense, setIsAddingExpense] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<"expenses" | "balances" | "export" | "settings">("expenses");

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    paid_by_member_id: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    split_type: "equal",
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }
    if (groupId) {
      ensureUserProfile();
      loadGroupData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, user]);

  async function ensureUserProfile() {
    if (!user) return;
    try {
      await fetch("/api/profile/ensure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email,
        }),
      });
    } catch (err) {
      console.warn("ensure profile failed", err);
    }
  }

  async function loadGroupData() {
    if (!user || !session?.access_token || !groupId) return;
    try {
      setLoading(true);

      // Call Next.js API route (server-side supabase)
      const res = await fetch(`/api/split-saathi/group/${groupId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      // Attempt to parse JSON (server returns JSON)
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // show server error text if available
        throw new Error(data?.error || "Failed to load group data");
      }

      setGroup(data.group || null);
      setMembers(data.members || []);
      setExpenses(data.expenses || []);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || String(err),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const addExpense = async () => {
    if (!expenseForm.title || !expenseForm.amount || !expenseForm.paid_by_member_id) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Insert expense via client-side supabase (ok for non-sensitive ops)
      const { data: expense, error: expenseError } = await supabase
        .from("expenses")
        .insert({
          group_id: groupId,
          title: expenseForm.title,
          amount: parseFloat(expenseForm.amount),
          paid_by_member_id: expenseForm.paid_by_member_id,
          date: expenseForm.date,
          notes: expenseForm.notes,
        })
        .select(`
          *,
          paid_by_member:group_members(*)
        `)
        .single();

      if (expenseError) throw expenseError;

      // Equal split by default
      const splitAmount = parseFloat(expenseForm.amount) / Math.max(1, members.length);
      const splits = members.map((m) => ({
        expense_id: expense.id,
        member_id: m.id,
        amount: splitAmount,
      }));

      const { error: splitsError } = await supabase.from("expense_splits").insert(splits);
      if (splitsError) throw splitsError;

      toast({
        title: "Expense Added! 💰",
        description: `${expenseForm.title} has been added to the group.`,
      });

      setIsAddingExpense(false);
      setExpenseForm({
        title: "",
        amount: "",
        paid_by_member_id: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
        split_type: "equal",
      });

      await loadGroupData();
    } catch (err: any) {
      toast({
        title: "Error",
        description: `Failed to add expense: ${err?.message || String(err)}`,
        variant: "destructive",
      });
    }
  };

  // Sum amounts in cents to avoid float precision issues and coerce strings safely
  const totalExpensesCents = expenses.reduce((acc, e) => {
    const raw = e?.amount ?? 0;
    // coerce to number: handle numbers, numeric strings, and strings with commas
    const num = typeof raw === "number" ? raw : parseFloat(String(raw).replace(/,/g, ""));
    const safeNum = Number.isFinite(num) ? num : 0;
    return acc + Math.round(safeNum * 100);
  }, 0);
  const totalExpenses = totalExpensesCents / 100;
  const avgPerPerson = members.length > 0 ? totalExpenses / members.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-lg">Loading group data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <Navbar />
        <div className="pt-24 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Group Not Found</h1>
          <Button onClick={() => router.push("/split-saathi")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to SplitSaathi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Navbar />

      <div className="pt-24 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/split-saathi")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{group.name}</h1>
                {group.description && <p className="text-muted-foreground">{group.description}</p>}
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {group.currency}
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{group.currency}{totalExpenses.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{members.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Avg per Person</CardTitle>
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{group.currency}{avgPerPerson.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expenses.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            {members.length === 0 && (
              <Card className="w-full border-amber-200 bg-amber-50 mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-amber-800 flex items-center gap-2">⚠️ No Members Found</CardTitle>
                  <CardDescription className="text-amber-700">This group doesn't have any members yet. Add members to start tracking expenses.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveView("settings")} className="bg-amber-600 hover:bg-amber-700">
                    <Users className="w-4 h-4 mr-2" />
                    Add Members Now
                  </Button>
                </CardContent>
              </Card>
            )}

            <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
              <DialogTrigger asChild>
                <Button disabled={members.length === 0} className="bg-gradient-to-r from-green-500 to-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>Record a new expense for the group</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="expenseTitle">Title *</Label>
                    <Input id="expenseTitle" placeholder="Dinner, Cab, Snacks..." value={expenseForm.title} onChange={(e) => setExpenseForm(prev => ({ ...prev, title: e.target.value }))} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input id="amount" value={expenseForm.amount} onChange={(e) => {
                        const v = e.target.value;
                        if (v === "" || /^\d*\.?\d*$/.test(v)) setExpenseForm(prev => ({ ...prev, amount: v }));
                      }} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" value={expenseForm.date} onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paidBy">Paid by *</Label>
                    <Select value={expenseForm.paid_by_member_id} onValueChange={(val) => setExpenseForm(prev => ({ ...prev, paid_by_member_id: val }))} disabled={members.length === 0}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={members.length === 0 ? "No members available" : "Select who paid"} />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map(m => <SelectItem key={m.id} value={m.id}>{m.name} ({m.email_phone || "—"})</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">{members.length} member{members.length !== 1 ? "s" : ""} available</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Optional notes..." value={expenseForm.notes} onChange={(e) => setExpenseForm(prev => ({ ...prev, notes: e.target.value }))} />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={addExpense} className="flex-1">Add Expense</Button>
                    <Button variant="outline" onClick={() => setIsAddingExpense(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant={activeView === "balances" ? "default" : "outline"} onClick={() => setActiveView("balances")}>
              <BarChart3 className="w-4 h-4 mr-2" /> View Balances
            </Button>

            <Button variant={activeView === "export" ? "default" : "outline"} onClick={() => setActiveView("export")}>
              <FileText className="w-4 h-4 mr-2" /> Export Summary
            </Button>

            <Button variant={activeView === "settings" ? "default" : "outline"} onClick={() => setActiveView("settings")}>
              <Settings className="w-4 h-4 mr-2" /> Group Settings
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            <Button size="sm" variant={activeView === "expenses" ? "default" : "outline"} onClick={() => setActiveView("expenses")}>
              <Receipt className="w-4 h-4 mr-2" /> Expenses
            </Button>
            <Button size="sm" variant={activeView === "balances" ? "default" : "outline"} onClick={() => setActiveView("balances")}>
              <BarChart3 className="w-4 h-4 mr-2" /> Balances
            </Button>
            <Button size="sm" variant={activeView === "export" ? "default" : "outline"} onClick={() => setActiveView("export")}>
              <FileText className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button size="sm" variant={activeView === "settings" ? "default" : "outline"} onClick={() => setActiveView("settings")}>
              <Settings className="w-4 h-4 mr-2" /> Settings
            </Button>
          </div>

          {/* Views */}
          {activeView === "expenses" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Receipt className="w-5 h-5" /> Recent Expenses</CardTitle>
                <CardDescription>All group expenses in chronological order</CardDescription>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div className="text-center py-8">
                    <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No expenses yet</h3>
                    <p className="text-muted-foreground mb-4">Start by adding your first group expense</p>
                    <Button onClick={() => setIsAddingExpense(true)}><Plus className="w-4 h-4 mr-2" /> Add First Expense</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {expenses.map(exp => (
                      <div key={exp.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{exp.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(exp.date).toLocaleDateString()}</span>
                              <span>Paid by {exp.paid_by_member?.name || "—"}</span>
                              {exp.notes && <span className="flex items-center gap-1"><FileText className="w-3 h-3" />Notes</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{group.currency}{(exp.amount || 0).toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">{group.currency}{((exp.amount || 0) / Math.max(1, members.length)).toFixed(2)} per person</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeView === "balances" && <ViewBalances groupId={groupId!} currency={group.currency} />}

          {activeView === "export" && <ExportSummary groupId={groupId!} groupName={group.name} currency={group.currency} />}

          {activeView === "settings" && <GroupSettings groupId={groupId!} currentUser={user} onGroupUpdated={loadGroupData} />}
        </div>
      </div>
    </div>
  );
}
