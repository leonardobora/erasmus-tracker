import { usePrograms } from "@/hooks/usePrograms";
import { FilterPanel } from "@/components/FilterPanel";
import { ProgramCard } from "@/components/ProgramCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, SlidersHorizontal, X, GraduationCap } from "lucide-react";

export default function ProgramList() {
  const { programs, total, isLoading, filters, setFilters, countries } = usePrograms();

  const activeFilterCount = [filters.field, filters.country].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Programs</h1>
          <p className="text-muted-foreground">
            Discover Erasmus Mundus Joint Master scholarships
          </p>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                countries={countries}
              />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <Skeleton className="h-6 w-32" />
                ) : (
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{total}</span> programs found
                  </p>
                )}
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                  </Badge>
                )}
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2" data-testid="button-mobile-filters">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge className="ml-1">{activeFilterCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="p-6">
                    <FilterPanel
                      filters={filters}
                      onFiltersChange={setFilters}
                      countries={countries}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {(filters.field || filters.country) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.field && (
                  <Badge variant="secondary" className="gap-1 pr-1" data-testid="filter-tag-field">
                    Field: {filters.field}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => setFilters({ ...filters, field: undefined })}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                {filters.country && (
                  <Badge variant="secondary" className="gap-1 pr-1" data-testid="filter-tag-country">
                    Country: {filters.country}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => setFilters({ ...filters, country: undefined })}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex justify-between mb-3">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <div className="grid grid-cols-2 gap-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-between">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : programs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No programs found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Try adjusting your filters or search criteria to find programs that match your interests.
                  </p>
                  <Button 
                    onClick={() => setFilters({ sortBy: "deadline" })}
                    data-testid="button-clear-all-filters"
                  >
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {programs.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
