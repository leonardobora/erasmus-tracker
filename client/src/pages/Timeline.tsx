import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useUpcomingDeadlines } from "@/hooks/usePrograms";
import { DeadlineBadge } from "@/components/DeadlineBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  ChevronRight,
  Clock,
  GraduationCap,
  MapPin,
} from "lucide-react";
import type { ProgramWithDaysUntil } from "@shared/schema";

type TimeRange = 7 | 30 | 90 | 365;

export default function Timeline() {
  const [timeRange, setTimeRange] = useState<TimeRange>(90);
  const { data, isLoading } = useUpcomingDeadlines(timeRange);

  const groupedByMonth = useMemo(() => {
    if (!data?.programs) return new Map<string, ProgramWithDaysUntil[]>();

    const groups = new Map<string, ProgramWithDaysUntil[]>();
    
    data.programs.forEach((program) => {
      const date = new Date(program.deadline);
      const monthKey = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      
      if (!groups.has(monthKey)) {
        groups.set(monthKey, []);
      }
      groups.get(monthKey)!.push(program);
    });

    return groups;
  }, [data?.programs]);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Deadline Timeline</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Track all upcoming application deadlines at a glance
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Tabs 
            value={String(timeRange)} 
            onValueChange={(v) => setTimeRange(Number(v) as TimeRange)}
          >
            <TabsList>
              <TabsTrigger value="7" data-testid="tab-7-days">7 Days</TabsTrigger>
              <TabsTrigger value="30" data-testid="tab-30-days">30 Days</TabsTrigger>
              <TabsTrigger value="90" data-testid="tab-90-days">3 Months</TabsTrigger>
              <TabsTrigger value="365" data-testid="tab-365-days">1 Year</TabsTrigger>
            </TabsList>
          </Tabs>

          {!isLoading && (
            <Badge variant="secondary" className="text-sm">
              {data?.upcomingCount || 0} deadline{(data?.upcomingCount || 0) !== 1 ? "s" : ""} in this period
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="h-8 w-40 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.programs?.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Deadlines Found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                There are no program deadlines in the next {timeRange} days. Try expanding your search range.
              </p>
              {timeRange < 365 && (
                <Button onClick={() => setTimeRange(365)} data-testid="button-expand-range">
                  Show Full Year
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-10">
            {Array.from(groupedByMonth.entries()).map(([month, programs]) => (
              <section key={month}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <h2 className="text-xl font-bold">{month}</h2>
                  <Badge variant="outline">{programs.length}</Badge>
                </div>

                <div className="ml-1.5 pl-6 border-l-2 border-border space-y-4">
                  {programs.map((program) => {
                    const deadlineDate = new Date(program.deadline);
                    const dayOfMonth = deadlineDate.getDate();
                    const dayName = deadlineDate.toLocaleDateString("en-US", { weekday: "short" });

                    return (
                      <Link key={program.id} href={`/programs/${program.id}`}>
                        <Card 
                          className="hover-elevate cursor-pointer transition-all group"
                          data-testid={`timeline-item-${program.id}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-14 text-center">
                                <div className="text-2xl font-bold font-mono">{dayOfMonth}</div>
                                <div className="text-xs text-muted-foreground uppercase">{dayName}</div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                                    {program.name}
                                  </h3>
                                  <DeadlineBadge daysUntil={program.daysUntilDeadline} />
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                                  {program.consortium}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <GraduationCap className="w-3 h-3" />
                                    {program.field}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {program.countries.slice(0, 2).join(", ")}
                                  </span>
                                </div>
                              </div>

                              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
