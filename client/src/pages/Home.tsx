import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/StatsCard";
import { ProgramCard } from "@/components/ProgramCard";
import { DeadlineBadge } from "@/components/DeadlineBadge";
import { useStats, useUpcomingDeadlines } from "@/hooks/usePrograms";
import { 
  GraduationCap, 
  Globe, 
  Calendar, 
  TrendingUp,
  ArrowRight,
  Search,
  Clock
} from "lucide-react";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: upcoming, isLoading: upcomingLoading } = useUpcomingDeadlines(30);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              Erasmus Mundus Joint Masters
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Find Your Perfect
              <span className="text-primary block">European Master's</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Track {stats?.totalPrograms || "100+"}  scholarship programs across {stats?.totalCountries || "30+"} countries. 
              Never miss a deadline with real-time tracking and smart filters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/programs">
                <Button size="lg" className="gap-2 w-full sm:w-auto" data-testid="button-browse-programs">
                  <Search className="w-5 h-5" />
                  Browse Programs
                </Button>
              </Link>
              <Link href="/timeline">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto" data-testid="button-view-timeline">
                  <Calendar className="w-5 h-5" />
                  View Timeline
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {statsLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-8 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <>
                <StatsCard
                  title="Total Programs"
                  value={stats?.totalPrograms || 0}
                  icon={GraduationCap}
                  description="Active scholarships"
                />
                <StatsCard
                  title="Countries"
                  value={stats?.totalCountries || 0}
                  icon={Globe}
                  description="European destinations"
                />
                <StatsCard
                  title="Avg. Deadline"
                  value={`${stats?.avgDeadlineDays || 0}d`}
                  icon={Calendar}
                  description="Days until next deadline"
                />
                <StatsCard
                  title="Fields"
                  value={stats?.fields?.length || 0}
                  icon={TrendingUp}
                  description="Study areas covered"
                />
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Upcoming Deadlines</h2>
              <p className="text-muted-foreground mt-1">Programs closing in the next 30 days</p>
            </div>
            <Link href="/timeline">
              <Button variant="ghost" className="gap-2" data-testid="link-view-all-deadlines">
                View all <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {upcomingLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcoming?.programs?.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Urgent Deadlines</h3>
                <p className="text-muted-foreground mb-4">
                  No programs have deadlines in the next 30 days.
                </p>
                <Link href="/programs">
                  <Button data-testid="button-explore-all">Explore All Programs</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming?.programs?.slice(0, 6).map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Popular Fields</h2>
            <p className="text-muted-foreground">Explore programs by area of study</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {["AI/ML", "Data Science", "Engineering", "Sustainability", "Business", "Health", "Social Sciences", "Arts & Humanities"].map((field) => (
              <Link key={field} href={`/programs?field=${encodeURIComponent(field)}`}>
                <Card className="hover-elevate cursor-pointer h-full" data-testid={`field-card-${field.toLowerCase().replace(/[^a-z]/g, '-')}`}>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold">{field}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t bg-card/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              <span className="font-semibold">Erasmus Tracker</span>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Tracking Erasmus Mundus Joint Master programs. Data updates regularly.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Built by{" "}
                <a 
                  href="https://linkedin.com/in/leonardobora" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-linkedin"
                >
                  Leonardo Bora
                </a>
                {" | "}
                <a 
                  href="https://github.com/leonardobora" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-github"
                >
                  GitHub
                </a>
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/programs">
                <Button variant="ghost" size="sm">Programs</Button>
              </Link>
              <Link href="/timeline">
                <Button variant="ghost" size="sm">Timeline</Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
