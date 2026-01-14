import { useState } from "react";
import { usePrograms } from "@/hooks/usePrograms";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { programFields, type InsertProgram, type ProgramWithDaysUntil } from "@shared/schema";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Upload, 
  Shield,
  ExternalLink,
  Calendar,
  Save,
  LogOut
} from "lucide-react";
import { useLocation } from "wouter";

interface FormData {
  name: string;
  url: string;
  consortium: string;
  countries: string[];
  field: string;
  deadline: Date | string | undefined;
  durationMonths: number;
  tuitionCovered: boolean;
  monthlyAllowance: number | undefined;
  englishRequirement: string;
  description: string;
}

const emptyProgram: FormData = {
  name: "",
  url: "",
  consortium: "",
  countries: [],
  field: "",
  deadline: undefined,
  durationMonths: 24,
  tuitionCovered: true,
  monthlyAllowance: 1400,
  englishRequirement: "",
  description: "",
};

export default function Admin() {
  const { toast } = useToast();
  const { programs, isLoading } = usePrograms();
  const { logout } = useAuth();
  const [, setLocation] = useLocation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramWithDaysUntil | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyProgram);
  const [countriesInput, setCountriesInput] = useState("");

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      setLocation("/login");
    } catch (error) {
      toast({ title: "Failed to sign out", description: String(error), variant: "destructive" });
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: InsertProgram) => {
      return apiRequest("POST", "/api/programs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/deadlines/upcoming"] });
      toast({ title: "Program created successfully" });
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Failed to create program", description: String(error), variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertProgram> }) => {
      return apiRequest("PUT", `/api/programs/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/deadlines/upcoming"] });
      toast({ title: "Program updated successfully" });
      setEditingProgram(null);
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Failed to update program", description: String(error), variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/programs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/deadlines/upcoming"] });
      toast({ title: "Program deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete program", description: String(error), variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData(emptyProgram);
    setCountriesInput("");
  };

  const handleEdit = (program: ProgramWithDaysUntil) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      url: program.url,
      consortium: program.consortium,
      countries: program.countries,
      field: program.field,
      deadline: program.deadline,
      durationMonths: program.durationMonths,
      tuitionCovered: program.tuitionCovered,
      monthlyAllowance: program.monthlyAllowance ?? undefined,
      englishRequirement: program.englishRequirement ?? "",
      description: program.description ?? "",
    });
    setCountriesInput(program.countries.join(", "));
  };

  const validateForm = (): string | null => {
    if (!formData.name?.trim()) return "Program name is required";
    if (!formData.url?.trim()) return "Program URL is required";
    if (!formData.consortium?.trim()) return "Consortium is required";
    if (!countriesInput.trim()) return "At least one country is required";
    if (!formData.field) return "Field of study is required";
    if (!formData.deadline) return "Application deadline is required";
    if (!formData.durationMonths || formData.durationMonths < 1) return "Duration must be at least 1 month";
    return null;
  };

  const handleSubmit = () => {
    const validationError = validateForm();
    if (validationError) {
      toast({ title: validationError, variant: "destructive" });
      return;
    }

    const countries = countriesInput.split(",").map(c => c.trim()).filter(c => c);
    const deadline = formData.deadline 
      ? (typeof formData.deadline === 'string' ? formData.deadline : (formData.deadline as Date).toISOString())
      : "";
    
    const programData = {
      name: formData.name,
      url: formData.url,
      consortium: formData.consortium,
      countries,
      field: formData.field,
      deadline,
      durationMonths: formData.durationMonths,
      tuitionCovered: formData.tuitionCovered,
      monthlyAllowance: formData.monthlyAllowance,
      englishRequirement: formData.englishRequirement,
      description: formData.description,
    };

    if (editingProgram) {
      updateMutation.mutate({ id: editingProgram.id, data: programData as unknown as Partial<InsertProgram> });
    } else {
      createMutation.mutate(programData as unknown as InsertProgram);
    }
  };

  const handleCSVImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split("\n").filter(line => line.trim());
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      
      let imported = 0;
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map(v => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx] || "";
        });

        if (row.name && row.url && row.field && row.deadline) {
          const program: InsertProgram = {
            name: row.name,
            url: row.url,
            consortium: row.consortium || "Consortium TBD",
            countries: (row.countries || "").split(";").map(c => c.trim()).filter(c => c),
            field: row.field,
            deadline: new Date(row.deadline),
            durationMonths: parseInt(row.durationmonths || row.duration || "24") || 24,
            tuitionCovered: row.tuitioncovered !== "false",
            monthlyAllowance: parseInt(row.monthlyallowance || "1400") || undefined,
            englishRequirement: row.englishrequirement || undefined,
            description: row.description || undefined,
          };

          await apiRequest("POST", "/api/programs", program);
          imported++;
        }
      }

      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: `Imported ${imported} programs from CSV` });
    } catch (error) {
      toast({ title: "CSV import failed", description: String(error), variant: "destructive" });
    }
    
    event.target.value = "";
  };

  const ProgramForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Program Name *</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., EMJMD in Data Science"
            data-testid="input-program-name"
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="url">Program URL *</Label>
          <Input
            id="url"
            value={formData.url || ""}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://..."
            data-testid="input-program-url"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="consortium">Consortium *</Label>
          <Input
            id="consortium"
            value={formData.consortium || ""}
            onChange={(e) => setFormData({ ...formData, consortium: e.target.value })}
            placeholder="University A + University B + ..."
            data-testid="input-consortium"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="countries">Countries (comma-separated) *</Label>
          <Input
            id="countries"
            value={countriesInput}
            onChange={(e) => setCountriesInput(e.target.value)}
            placeholder="Germany, France, Spain"
            data-testid="input-countries"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field">Field of Study *</Label>
          <Select
            value={formData.field || ""}
            onValueChange={(value) => setFormData({ ...formData, field: value })}
          >
            <SelectTrigger data-testid="select-field">
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {programFields.map((field) => (
                <SelectItem key={field} value={field}>{field}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Application Deadline *</Label>
          <Input
            id="deadline"
            type="date"
            value={formData.deadline 
              ? (typeof formData.deadline === 'string' 
                  ? formData.deadline.split('T')[0] 
                  : (formData.deadline as Date).toISOString().split('T')[0])
              : ""
            }
            onChange={(e) => setFormData({ ...formData, deadline: new Date(e.target.value) })}
            data-testid="input-deadline"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (months)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.durationMonths || 24}
            onChange={(e) => setFormData({ ...formData, durationMonths: parseInt(e.target.value) })}
            data-testid="input-duration"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="allowance">Monthly Allowance (EUR)</Label>
          <Input
            id="allowance"
            type="number"
            value={formData.monthlyAllowance || ""}
            onChange={(e) => setFormData({ ...formData, monthlyAllowance: parseInt(e.target.value) || undefined })}
            placeholder="1400"
            data-testid="input-allowance"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="english">English Requirement</Label>
          <Input
            id="english"
            value={formData.englishRequirement || ""}
            onChange={(e) => setFormData({ ...formData, englishRequirement: e.target.value })}
            placeholder="IELTS 6.5 or TOEFL 90"
            data-testid="input-english"
          />
        </div>

        <div className="flex items-center gap-2 md:col-span-2">
          <Switch
            id="tuition"
            checked={formData.tuitionCovered ?? true}
            onCheckedChange={(checked) => setFormData({ ...formData, tuitionCovered: checked })}
            data-testid="switch-tuition"
          />
          <Label htmlFor="tuition">Tuition fees covered by scholarship</Label>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the program..."
            rows={3}
            data-testid="input-description"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Manage Erasmus Mundus programs
              </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => resetForm()} data-testid="button-add-program">
                <Plus className="w-4 h-4" />
                Add Program
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Program</DialogTitle>
                <DialogDescription>
                  Enter the program details. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <ProgramForm />
              <DialogFooter>
                <Button 
                  onClick={handleSubmit} 
                  disabled={createMutation.isPending}
                  className="gap-2"
                  data-testid="button-save-program"
                >
                  <Save className="w-4 h-4" />
                  {createMutation.isPending ? "Creating..." : "Create Program"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              className="absolute inset-0 opacity-0 cursor-pointer"
              data-testid="input-csv-import"
            />
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Import CSV
            </Button>
          </div>

          <Badge variant="secondary" className="ml-auto">
            {programs.length} programs
          </Badge>
        </div>

        <Dialog open={!!editingProgram} onOpenChange={(open) => !open && setEditingProgram(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Program</DialogTitle>
              <DialogDescription>
                Update the program details.
              </DialogDescription>
            </DialogHeader>
            <ProgramForm />
            <DialogFooter>
              <Button 
                onClick={handleSubmit} 
                disabled={updateMutation.isPending}
                className="gap-2"
                data-testid="button-update-program"
              >
                <Save className="w-4 h-4" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-64" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {programs.map((program) => (
              <Card key={program.id} className="hover-elevate" data-testid={`admin-program-${program.id}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold truncate">{program.name}</h3>
                        <Badge variant="outline" className="text-xs">{program.field}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {program.consortium}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(program.deadline).toLocaleDateString()}
                        </span>
                        <a 
                          href={program.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3" />
                          Visit
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(program)}
                        className="gap-1"
                        data-testid={`button-edit-${program.id}`}
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1 text-destructive hover:text-destructive"
                            data-testid={`button-delete-${program.id}`}
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Program?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove "{program.name}" from the tracker. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(program.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">API Integration</CardTitle>
            <CardDescription>
              Use these endpoints to integrate with automation tools like n8n or Zapier
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Webhook Endpoint</h4>
              <code className="block p-3 bg-muted rounded-md text-sm break-all">
                POST /api/webhooks/programs
              </code>
              <p className="text-xs text-muted-foreground mt-2">
                Send JSON with action ("create", "update", "delete") and program data
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">CRUD Endpoints</h4>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex gap-2">
                  <Badge>GET</Badge>
                  <span>/api/programs</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">POST</Badge>
                  <span>/api/programs</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">PUT</Badge>
                  <span>/api/programs/:id</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="destructive">DELETE</Badge>
                  <span>/api/programs/:id</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
