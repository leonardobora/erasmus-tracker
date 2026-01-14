import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Filter } from "lucide-react";
import { programFields, type ProgramFilters } from "@shared/schema";

interface FilterPanelProps {
  filters: ProgramFilters;
  onFiltersChange: (filters: ProgramFilters) => void;
  countries: string[];
  className?: string;
}

export function FilterPanel({ filters, onFiltersChange, countries, className = "" }: FilterPanelProps) {
  const hasFilters = filters.field || filters.country;

  const handleClearFilters = () => {
    onFiltersChange({ sortBy: filters.sortBy });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
          {hasFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearFilters}
              data-testid="button-clear-filters"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="field-filter">Field of Study</Label>
          <Select
            value={filters.field || "all"}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, field: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger id="field-filter" data-testid="select-field">
              <SelectValue placeholder="All fields" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All fields</SelectItem>
              {programFields.map((field) => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country-filter">Country</Label>
          <Select
            value={filters.country || "all"}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, country: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger id="country-filter" data-testid="select-country">
              <SelectValue placeholder="All countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort-filter">Sort by</Label>
          <Select
            value={filters.sortBy || "deadline"}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, sortBy: value as "deadline" | "name" })
            }
          >
            <SelectTrigger id="sort-filter" data-testid="select-sort">
              <SelectValue placeholder="Sort by deadline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">Deadline (soonest)</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
