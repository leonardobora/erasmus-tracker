import { useParams, Link } from "wouter";
import { useProgram } from "@/hooks/usePrograms";
import { DeadlineBadge } from "@/components/DeadlineBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Clock,
  GraduationCap,
  Euro,
  Calendar,
  BookOpen,
  CheckCircle,
  Globe,
} from "lucide-react";

export default function ProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: program, isLoading, error } = useProgram(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Program Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The program you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/programs">
              <Button data-testid="button-back-to-programs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Programs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const deadlineDate = new Date(program.deadline);
  const formattedDeadline = deadlineDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/programs">
            <Button variant="ghost" className="gap-2 mb-4" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
              Back to Programs
            </Button>
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary">{program.field}</Badge>
                <DeadlineBadge daysUntil={program.daysUntilDeadline} />
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2" data-testid="text-program-name">
                {program.name}
              </h1>
              <p className="text-lg text-muted-foreground">{program.consortium}</p>
            </div>
            <Button size="lg" className="gap-2 flex-shrink-0" asChild data-testid="button-apply">
              <a href={program.url} target="_blank" rel="noopener noreferrer">
                Apply Now
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                About This Program
              </h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {program.description || 
                      `The ${program.name} is a prestigious Erasmus Mundus Joint Master program offered by a consortium of leading European universities: ${program.consortium}. This ${program.durationMonths}-month program provides students with cutting-edge knowledge and skills in ${program.field}.`
                    }
                  </p>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Partner Countries
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {program.countries.map((country) => (
                      <Badge key={country} variant="outline" className="text-sm py-1.5 px-3">
                        <MapPin className="w-3 h-3 mr-1" />
                        {country}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {program.englishRequirement && (
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Requirements
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">English Proficiency</p>
                        <p className="text-sm text-muted-foreground">{program.englishRequirement}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Application Deadline</p>
                    <p className="font-semibold font-mono">{formattedDeadline}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{program.durationMonths} months</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tuition</p>
                    <p className="font-semibold">
                      {program.tuitionCovered ? "Fully Covered" : "Fees Apply"}
                    </p>
                  </div>
                </div>

                {program.monthlyAllowance && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <Euro className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Allowance</p>
                        <p className="font-semibold">{program.monthlyAllowance}/month</p>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <Button className="w-full gap-2" asChild>
                  <a href={program.url} target="_blank" rel="noopener noreferrer">
                    Visit Official Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
