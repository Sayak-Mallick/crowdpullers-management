import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "@/services/api/events.endpoints";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  LoaderCircle,
  CalendarDays,
  MapPin,
  Building2,
  Tag,
  ImagePlus,
  FileText,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

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

const CATEGORIES = [
  "Conference",
  "Workshop",
  "Meetup",
  "Webinar",
  "Hackathon",
  "Seminar",
  "Networking",
  "Celebration",
  "Workshop",
  "Other",
];

const currentYear = new Date().getFullYear();

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(2000),
  year: z.coerce.number().int().min(1900),
  month: z.coerce.number().int().min(1).max(12),
  location: z.string().min(2, "Location is required."),
  organization: z.string().min(2, "Organization name is required."),
  category: z.string().min(1, "Please select a category."),
  eventImage: z
    .instanceof(FileList)
    .refine((f) => f.length === 1, "Event image is required.")
    .refine((f) => f[0]?.size <= 5 * 1024 * 1024, "Image must be under 5 MB.")
    .refine(
      (f) => ["image/jpeg", "image/png", "image/webp"].includes(f[0]?.type),
      "Only JPG, PNG, or WebP allowed.",
    ),
});

type FormValues = z.infer<typeof formSchema>;
type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

/* ─── tiny section wrapper ─── */
function Section({
  step,
  icon: Icon,
  title,
  children,
}: {
  step: number;
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative">
      {/* connector line */}
      {step < 4 && (
        <span
          className="absolute left-4.75 top-13 bottom-0 w-px bg-linear-to-b from-border to-transparent"
          aria-hidden
        />
      )}
      <div className="flex gap-5">
        {/* step indicator */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 text-primary ring-4 ring-primary/5 transition-all group-focus-within:border-primary group-focus-within:bg-primary group-focus-within:text-primary-foreground group-focus-within:ring-primary/20">
            <Icon className="h-4 w-4" />
          </div>
        </div>

        {/* content */}
        <div className="flex-1 pb-10">
          <div className="mb-5 flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Step {step}
            </span>
            <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            <span className="text-sm font-semibold text-foreground">
              {title}
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── image dropzone ─── */
function ImageDropzone({
  onChange,
  error,
}: {
  onChange: (files: FileList) => void;
  error?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(files: FileList | null) {
    if (!files || files.length === 0) return;
    onChange(files);
    const url = URL.createObjectURL(files[0]);
    setPreview(url);
  }

  function clearImage(e: React.MouseEvent) {
    e.stopPropagation();
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files);
      }}
      className={cn(
        "relative flex min-h-50 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200",
        dragging
          ? "scale-[1.01] border-primary bg-primary/5"
          : error
            ? "border-destructive/50 bg-destructive/5 hover:border-destructive"
            : "border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files)}
      />

      {preview ? (
        <>
          <img
            src={preview}
            alt="Preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity hover:opacity-100 flex items-center justify-center gap-3">
            <span className="text-sm text-white font-medium">Change image</span>
            <button
              type="button"
              onClick={clearImage}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-destructive transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <ImagePlus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Drop your image here, or{" "}
              <span className="text-primary underline underline-offset-2">
                browse
              </span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG or WebP · Max 5 MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── month picker grid ─── */
function MonthPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (month: number) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {MONTHS.map((name, i) => {
        const month = i + 1;
        const active = value === month;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(month)}
            className={cn(
              "rounded-lg border px-2 py-2 text-xs font-medium transition-all duration-150",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-foreground",
            )}
          >
            {name.slice(0, 3)}
          </button>
        );
      })}
    </div>
  );
}

/* ─── category chips ─── */
function CategoryPicker({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (cat: string) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const active = value === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-150",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : error
                  ? "border-destructive/30 bg-destructive/5 text-muted-foreground hover:border-primary/50"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-foreground",
            )}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

/* ─── textarea with auto-grow feel ─── */
function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={4}
      className={cn(
        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className,
      )}
      {...props}
    />
  );
}

/* ─── main component ─── */
const CreateEvent = () => {
  const navigate = useNavigate();

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      year: currentYear as number,
      month: (new Date().getMonth() + 1) as number,
      location: "",
      organization: "",
      category: "",
      eventImage: undefined as unknown as FileList,
    },
  });

  // const eventImageRef = form.register("eventImage");
  const queryEvent = useQueryClient();

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryEvent.invalidateQueries({ queryKey: ["events"] });
      navigate("/events");
    },
  });

  function onSubmit(values: FormValues) {
    const formdata = new FormData();
    formdata.append("title", values.title);
    formdata.append("description", values.description);
    formdata.append("year", String(values.year));
    formdata.append("month", String(values.month));
    formdata.append("location", values.location);
    formdata.append("organization", values.organization);
    formdata.append("category", values.category);
    formdata.append("eventImage", values.eventImage[0]);
    mutation.mutate(formdata);
  }

  const isPending = mutation.isPending;

  return (
    <section className="mx-auto max-w-2xl px-4 pb-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  <BreadcrumbPage className="text-sm font-medium">
                    Create
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center gap-2">
              <Link to="/events">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="gap-2 min-w-27.5"
              >
                {isPending ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                {isPending ? "Creating…" : "Create Event"}
              </Button>
            </div>
          </div>

          {/* ── page header ── */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              New Event
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the details below and publish your event in seconds.
            </p>
          </div>

          {/* ── step 1 · basics ── */}
          <Section step={1} icon={FileText} title="Basic Information">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Event Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. React Summit 2025"
                        className="h-11 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is this event about? Share the highlights…"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between">
                      <FormMessage />
                      <span className="ml-auto text-xs text-muted-foreground">
                        {field.value?.length ?? 0} / 2000
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </Section>

          {/* ── step 2 · date ── */}
          <Section step={2} icon={CalendarDays} title="Date">
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => {
                  const currentYear = new Date().getFullYear();
                  const years = Array.from(
                    { length: 200 },
                    (_, i) => currentYear + 50 - i,
                  );

                  return (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Year
                      </FormLabel>

                      <FormControl>
                        <select
                          value={field.value as number}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="h-11 w-36 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Month
                    </FormLabel>
                    <FormControl>
                      <MonthPicker
                        value={field.value as number}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Section>

          {/* ── step 3 · details ── */}
          <Section step={3} icon={MapPin} title="Location & Organisation">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Location
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="City, Country"
                          className="h-11 pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Organisation
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Company or team name"
                          className="h-11 pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" />
                      Category
                    </FormLabel>
                    <FormControl>
                      <CategoryPicker
                        value={field.value}
                        onChange={field.onChange}
                        error={form.formState.errors.category?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Section>

          {/* ── step 4 · image ── */}
          <Section step={4} icon={ImagePlus} title="Event Image">
            <FormField
              control={form.control}
              name="eventImage"
              render={() => (
                <FormItem>
                  <FormControl>
                    <ImageDropzone
                      onChange={(files) => {
                        const dt = new DataTransfer();
                        Array.from(files).forEach((f) => dt.items.add(f));
                        form.setValue("eventImage", dt.files, {
                          shouldValidate: true,
                        });
                      }}
                      error={
                        form.formState.errors.eventImage?.message as string
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Section>

          {/* ── bottom submit ── */}
          <div className="mt-2 flex items-center justify-between rounded-xl border bg-muted/30 px-5 py-4">
            <p className="text-sm text-muted-foreground">Ready to go live?</p>
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 min-w-32.5"
            >
              {isPending ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isPending ? "Creating…" : "Publish Event"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreateEvent;
