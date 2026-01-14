import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import type { ProgramWithDaysUntil, ProgramStats, ProgramFilters } from "@shared/schema";

interface ProgramsResponse {
  total: number;
  programs: ProgramWithDaysUntil[];
  filtersApplied: ProgramFilters;
}

interface UpcomingResponse {
  upcomingCount: number;
  programs: ProgramWithDaysUntil[];
}

export function usePrograms() {
  const [filters, setFilters] = useState<ProgramFilters>({ sortBy: "deadline" });

  const queryParams = new URLSearchParams();
  if (filters.field) queryParams.set("field", filters.field);
  if (filters.country) queryParams.set("country", filters.country);
  if (filters.sortBy) queryParams.set("sortBy", filters.sortBy);

  const queryString = queryParams.toString();
  const url = `/api/programs${queryString ? `?${queryString}` : ""}`;

  const { data, isLoading, error } = useQuery<ProgramsResponse>({
    queryKey: ["/api/programs", filters],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch programs");
      return response.json();
    },
  });

  const countries = useMemo(() => {
    if (!data?.programs) return [];
    const allCountries = data.programs.flatMap(p => p.countries);
    return [...new Set(allCountries)].sort();
  }, [data?.programs]);

  return {
    programs: data?.programs ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    filters,
    setFilters,
    countries,
  };
}

export function useProgram(id: string) {
  return useQuery<ProgramWithDaysUntil>({
    queryKey: ["/api/programs", id],
    queryFn: async () => {
      const response = await fetch(`/api/programs/${id}`);
      if (!response.ok) throw new Error("Program not found");
      return response.json();
    },
    enabled: !!id,
  });
}

export function useUpcomingDeadlines(days: number = 30) {
  return useQuery<UpcomingResponse>({
    queryKey: ["/api/deadlines/upcoming", days],
    queryFn: async () => {
      const response = await fetch(`/api/deadlines/upcoming?days=${days}`);
      if (!response.ok) throw new Error("Failed to fetch deadlines");
      return response.json();
    },
  });
}

export function useStats() {
  return useQuery<ProgramStats>({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      const response = await fetch("/api/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });
}
