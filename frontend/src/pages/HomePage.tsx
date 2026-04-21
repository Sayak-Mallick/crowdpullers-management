import { Button } from "@/components/ui/button";
import { getEvents } from "@/services/api/events.endpoints";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  CirclePlus,
  MapPin,
  Tag,
  TrendingUp,
  Building2,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface IEvent {
  _id: string;
  title: string;
  year: number;
  month: number;
  location: string;
  organization: string;
  category: string;
  eventImage: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CATEGORY_CLASSES: Record<string, string> = {
  Conference:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  Workshop:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  Seminar:
    "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  Webinar:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  Exhibition:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
  Festival:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
};

const DEFAULT_CATEGORY_CLASS = "bg-muted text-muted-foreground border-border";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(title: string) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EventCardImage({ src, title }: { src: string; title: string }) {
  const [error, setError] = useState(false);

  if (!error) {
    return (
      <img
        src={src}
        alt={title}
        onError={() => setError(true)}
        className="w-full h-64 rounded-xl object-cover block"
      />
    );
  }
  return (
    <div className="w-full h-26 bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-lg font-medium text-blue-700 dark:text-blue-300">
      {getInitials(title)}
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const cls = CATEGORY_CLASSES[category] ?? DEFAULT_CATEGORY_CLASS;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${cls} mb-1.5`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {category}
    </span>
  );
}

function EventCard({ event }: { event: IEvent }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-border/80 transition-colors cursor-pointer">
      <EventCardImage src={event.eventImage} title={event.title} />
      <div className="p-3">
        <CategoryBadge category={event.category} />
        <p className="text-sm font-medium text-foreground truncate mb-0.5">
          {event.title}
        </p>
        <p className="text-xs text-muted-foreground truncate mb-2.5">
          {event.organization}
        </p>
        <div className="border-t border-border pt-2 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3 shrink-0" />
            {MONTHS[event.month - 1]} {event.year}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <>
      <div className="mb-5">
        <h1 className="text-xl font-medium tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Get started by creating your first event.
        </p>
      </div>

      <div className="flex flex-1 min-h-90 items-center justify-center rounded-xl border border-dashed bg-muted/40">
        <div className="flex flex-col items-center gap-2 text-center px-6 py-12 max-w-sm">
          <div className="w-14 h-14 rounded-xl bg-background border border-border flex items-center justify-center mb-2">
            <Calendar className="h-6 w-6 text-muted-foreground/60" />
          </div>
          <h3 className="text-base font-medium">No events yet</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Once you add an event, stats and recent activity will appear here.
          </p>
          <Link to="/events/create" className="mt-2">
            <Button size="sm" className="gap-1.5">
              <CirclePlus className="h-4 w-4" />
              Add your first event
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

// ─── Dashboard (has events) ───────────────────────────────────────────────────

function Dashboard({ events }: { events: IEvent[] }) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const stats = useMemo(() => {
    const thisMonth = events.filter(
      (e) => e.month === currentMonth && e.year === currentYear,
    ).length;
    const categories = new Set(events.map((e) => e.category)).size;
    const organisations = new Set(events.map((e) => e.organization)).size;
    return { total: events.length, thisMonth, categories, organisations };
  }, [events, currentMonth, currentYear]);

  // 3 most recent events (by year desc, then month desc)
  const recentEvents = useMemo(
    () =>
      [...events]
        .sort((a, b) => b.year - a.year || b.month - a.month)
        .slice(0, 3),
    [events],
  );

  return (
    <>
      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-xl font-medium tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome back. Here's what's happening with your events.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        {[
          { label: "Total events", value: stats.total, icon: Calendar },
          { label: "This month", value: stats.thisMonth, icon: TrendingUp },
          { label: "Categories", value: stats.categories, icon: Tag },
          {
            label: "Organisations",
            value: stats.organisations,
            icon: Building2,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-muted/60 rounded-lg px-4 py-3">
            <Icon className="h-4 w-4 text-muted-foreground mb-2.5" />
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-[22px] font-medium leading-none mt-0.5">
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Recent events */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium">Recent events</h2>
          <Link to="/events">
            <Button variant="outline" size="sm" className="h-7 text-xs">
              View all
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recentEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const HomePage = () => {
  const { data: eventsData } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    staleTime: 1000 * 60 * 5,
  });

  const events: IEvent[] = eventsData?.data?.data ?? [];
  const hasEvents = events.length > 0;

  return (
    <div className="flex flex-col gap-0">
      {hasEvents ? <Dashboard events={events} /> : <EmptyState />}
    </div>
  );
};

export default HomePage;
