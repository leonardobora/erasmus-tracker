import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface DeadlineBadgeProps {
  daysUntil: number;
  className?: string;
}

export function DeadlineBadge({ daysUntil, className = "" }: DeadlineBadgeProps) {
  if (daysUntil < 0) {
    return (
      <Badge 
        variant="secondary" 
        className={`bg-muted text-muted-foreground ${className}`}
        data-testid="badge-deadline-passed"
      >
        <Clock className="w-3 h-3 mr-1" />
        Closed
      </Badge>
    );
  }
  
  if (daysUntil <= 7) {
    return (
      <Badge 
        variant="destructive" 
        className={className}
        data-testid="badge-deadline-urgent"
      >
        <AlertTriangle className="w-3 h-3 mr-1" />
        {daysUntil === 0 ? "Today" : `${daysUntil}d left`}
      </Badge>
    );
  }
  
  if (daysUntil <= 30) {
    return (
      <Badge 
        className={`bg-amber-500 text-white dark:bg-amber-600 ${className}`}
        data-testid="badge-deadline-soon"
      >
        <Clock className="w-3 h-3 mr-1" />
        {daysUntil}d left
      </Badge>
    );
  }
  
  return (
    <Badge 
      className={`bg-emerald-500 text-white dark:bg-emerald-600 ${className}`}
      data-testid="badge-deadline-open"
    >
      <CheckCircle className="w-3 h-3 mr-1" />
      {daysUntil}d left
    </Badge>
  );
}
