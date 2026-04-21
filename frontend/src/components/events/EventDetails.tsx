import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEventByID } from "@/services/api/events.endpoints";
import {
  CalendarDays,
  MapPin,
  Building2,
  Tag,
  Pencil,
  ArrowLeft,
  Clock,
  Share2,
  Bookmark,
} from "lucide-react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CATEGORY_COLORS: Record<string, string> = {
  Conference: "bg-blue-50   text-blue-700   border-blue-200",
  Workshop: "bg-amber-50  text-amber-700  border-amber-200",
  Meetup: "bg-green-50  text-green-700  border-green-200",
  Webinar: "bg-purple-50 text-purple-700 border-purple-200",
  Hackathon: "bg-rose-50   text-rose-700   border-rose-200",
  Seminar: "bg-cyan-50   text-cyan-700   border-cyan-200",
  Networking: "bg-orange-50 text-orange-700 border-orange-200",
  Other: "bg-zinc-50   text-zinc-700   border-zinc-200",
};

/* ── meta chip ── */
function MetaChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ── skeleton loader ── */
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />
  );
}

function EventDetailsSkeleton() {
  return (
    <section className="mx-auto max-w-2xl px-4 pb-20">
      <div className="py-5">
        <Skeleton className="h-5 w-48" />
      </div>
      <Skeleton className="h-72 w-full rounded-2xl" />
      <div className="mt-6 space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-20 w-full" />
      </div>
    </section>
  );
}

/* ── main component ── */
const EventDetails = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: event,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events", id],
    queryFn: () => getEventByID(id!),
    enabled: !!id,
  });

  if (isLoading) return <EventDetailsSkeleton />;

  if (isError || !event) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-sm text-muted-foreground">
          Event not found or failed to load.
        </p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link to="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
      </section>
    );
  }

  const monthName = MONTHS[(event?.data?.data?.month ?? 1) - 1];
  const categoryColor =
    CATEGORY_COLORS[event?.data?.data?.category] ?? CATEGORY_COLORS["Other"];

  return (
    <section className="mx-auto max-w-2xl px-4 pb-20">
      {/* ── top bar ── */}
      <div className="flex items-center justify-between py-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link
                to="/events"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Events
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium max-w-40 truncate">
                {event?.data?.data?.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground gap-1.5"
          >
            <Bookmark className="h-3.5 w-3.5" />
            Save
          </Button>
          <Button size="sm" className="gap-1.5" asChild>
            <Link to={`/events/${id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* ── hero image ── */}
      <div className="relative overflow-hidden rounded-2xl border bg-muted">
        {event?.data?.data?.eventImage ? (
          <img
            src={event?.data?.data?.eventImage}
            alt={event?.data?.data?.title}
            className="h-72 w-full object-cover"
          />
        ) : (
          <div className="flex h-72 w-full items-center justify-center bg-muted">
            <p className="text-sm text-muted-foreground">No image uploaded</p>
          </div>
        )}

        {/* category badge overlaid on image */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${categoryColor}`}
          >
            <Tag className="h-3 w-3" />
            {event?.data?.data?.category}
          </span>
        </div>
      </div>

      {/* ── title + date ── */}
      <div className="mt-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {event?.data?.data?.title}
        </h1>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>
            {monthName} {event?.data?.data?.year}
          </span>
        </div>
      </div>

      <Separator className="my-6" />

      {/* ── meta grid ── */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <MetaChip
          icon={CalendarDays}
          label="Date"
          value={`${monthName} ${event?.data?.data?.year}`}
        />
        <MetaChip
          icon={MapPin}
          label="Location"
          value={event?.data?.data?.location}
        />
        <MetaChip
          icon={Building2}
          label="Organisation"
          value={event?.data?.data?.organization}
        />
        <MetaChip
          icon={Tag}
          label="Category"
          value={event?.data?.data?.category}
        />
      </div>

      <Separator className="my-6" />

      {/* ── description ── */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          About this Event
        </p>
        <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
          {event?.data?.data?.description}
        </p>
      </div>

      {/* ── bottom actions ── */}
      <div className="mt-10 flex items-center justify-between rounded-xl border bg-muted/30 px-5 py-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          asChild
        >
          <Link to="/events">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        <Button size="sm" className="gap-2" asChild>
          <Link to={`/events/${id}/edit`}>
            <Pencil className="h-4 w-4" />
            Edit Event
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default EventDetails;
