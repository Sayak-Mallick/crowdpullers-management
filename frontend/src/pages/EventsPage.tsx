import { useState, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEvents } from "@/services/api/events.endpoints";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  CirclePlus,
  MapPin,
  MoreHorizontal,
  Search,
  Building2,
  Tag,
  Calendar,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

interface IEvents {
  _id: string;
  title: string;
  description: string;
  year: number;
  month: number;
  location: string;
  organization: string;
  category: string;
  eventImage: string;
  createdAt: string;
  updatedAt: string;
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

/**
 * Maps event categories to shadcn Badge variant class overrides.
 * Extend as needed for new categories.
 */
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

function getInitials(title: string): string {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function formatUpdatedAt(date: string): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EventImage({ src, title }: { src: string; title: string }) {
  const [error, setError] = useState(false);

  if (!error) {
    return (
      <img
        src={src}
        alt={title}
        onError={() => setError(true)}
        className="h-10 w-10 rounded-md object-cover border border-border shrink-0"
      />
    );
  }

  return (
    <div className="h-10 w-10 rounded-md shrink-0 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-medium">
      {getInitials(title)}
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const classes = CATEGORY_CLASSES[category] ?? DEFAULT_CATEGORY_CLASS;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${classes}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {category}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const EventsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: eventsData } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    staleTime: 1000 * 60 * 5,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allEvents: IEvents[] = eventsData?.data?.data ?? [];

  const filteredEvents = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return allEvents;
    return allEvents.filter((e) =>
      [e.title, e.organization, e.category, e.location].some((f) =>
        f?.toLowerCase().includes(q),
      ),
    );
  }, [allEvents, search]);

  // Derived stats
  const totalEvents = allEvents.length;
  const totalCategories = new Set(allEvents.map((e) => e.category)).size;
  const totalOrganizations = new Set(allEvents.map((e) => e.organization)).size;

  return (
    <div className="space-y-5">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Breadcrumb className="mb-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Events</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-xl font-medium tracking-tight">Events</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and organise all your events
          </p>
        </div>

        <Link to="/events/create">
          <Button size="sm" className="gap-1.5">
            <CirclePlus className="h-4 w-4" />
            Add new event
          </Button>
        </Link>
      </div>

      {/* ── Stats strip ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total events", value: totalEvents, icon: Calendar },
          { label: "Categories", value: totalCategories, icon: Tag },
          {
            label: "Organisations",
            value: totalOrganizations,
            icon: Building2,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-lg bg-muted/60 px-4 py-3 flex items-center gap-3"
          >
            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <div className="text-xl font-medium leading-none">{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table card ──────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
          <div>
            <CardTitle className="text-sm font-medium">All events</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Showing {filteredEvents.length} event
              {filteredEvents.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>

          {/* Search */}
          <div className="relative max-w-55 w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[34%]">Event</TableHead>
                <TableHead className="w-[16%]">Organisation</TableHead>
                <TableHead className="w-[14%]">Category</TableHead>
                <TableHead className="w-[12%]">Date</TableHead>
                <TableHead className="w-[16%]">Location</TableHead>
                <TableHead className="w-[8%] text-right">Updated</TableHead>
                <TableHead className="w-[5%]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredEvents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Calendar className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium mt-1">
                        No events found
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Try adjusting your search query
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {filteredEvents.map((event) => (
                <TableRow key={event._id}>
                  {/* Event (image + title + description) */}
                  <TableCell>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <EventImage src={event.eventImage} title={event.title} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate leading-snug">
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5 leading-snug">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Organisation */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground truncate">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{event.organization}</span>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <CategoryBadge category={event.category} />
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground whitespace-nowrap">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                      {MONTHS[event.month - 1]} {event.year}
                    </div>
                  </TableCell>

                  {/* Location */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground truncate">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </TableCell>

                  {/* Updated at */}
                  <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                    {formatUpdatedAt(event.updatedAt)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          aria-haspopup="true"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem>Edit event</DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => navigate(`/events/${event._id}`)}
                        >
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="pt-3 pb-3">
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            <strong className="font-medium text-foreground">
              {filteredEvents.length}
            </strong>{" "}
            of{" "}
            <strong className="font-medium text-foreground">
              {totalEvents}
            </strong>{" "}
            events
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EventsPage;
