import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeadlineBadge } from "./DeadlineBadge";
import { MapPin, Clock, GraduationCap, Euro, ArrowRight } from "lucide-react";
import type { ProgramWithDaysUntil } from "@shared/schema";

interface ProgramCardProps {
  program: ProgramWithDaysUntil;
}

export function ProgramCard({ program }: ProgramCardProps) {
  const deadlineDate = new Date(program.deadline);
  const formattedDeadline = deadlineDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <Link href={`/programs/${program.id}`}>
      <Card 
        className="h-full hover-elevate cursor-pointer transition-all duration-200 group"
        data-testid={`program-card-${program.id}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {program.field}
            </Badge>
            <DeadlineBadge daysUntil={program.daysUntilDeadline} />
          </div>
          <h3 className="text-lg font-semibold leading-tight mt-2 group-hover:text-primary transition-colors line-clamp-2">
            {program.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {program.consortium}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{program.countries.slice(0, 2).join(", ")}{program.countries.length > 2 ? ` +${program.countries.length - 2}` : ""}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{program.durationMonths} months</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="w-4 h-4 flex-shrink-0" />
              <span>{program.tuitionCovered ? "Tuition free" : "Tuition fees"}</span>
            </div>
            {program.monthlyAllowance && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Euro className="w-4 h-4 flex-shrink-0" />
                <span>{program.monthlyAllowance}/mo</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-mono">
              Deadline: {formattedDeadline}
            </span>
            <Button variant="ghost" size="sm" className="gap-1 group-hover:gap-2 transition-all">
              View <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
