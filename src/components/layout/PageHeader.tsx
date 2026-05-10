import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName?: string;
  className?: string;
}

export function PageHeader({ 
  icon: Icon, 
  title, 
  description, 
  iconClassName,
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3 mb-6 animate-fade-in", className)}>
      <div className={cn(
        "p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400", 
        iconClassName
      )}>
        <Icon size={24} />
      </div>
      <div>
        <h1 className="text-xl font-bold text-primary tracking-tight">{title}</h1>
        <p className="text-sm text-muted">{description}</p>
      </div>
    </div>
  );
}
