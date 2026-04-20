import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const CreateEvent = () => {
  const navigate = useNavigate();

  const form = useForm<FormValues, unknown, FormValues>({
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

  const eventImageRef = form.register("eventImage");
  const queryEvent = useQueryClient();

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryEvent.invalidateQueries({ queryKey: ["events"] });
      console.log("Event created successfully");
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

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Link to="/">Home</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link to="/events">Events</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Create</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-4">
              <Link to="/events">
                <Button variant={"outline"}>
                  <span className="ml-2">Cancel</span>
                </Button>
              </Link>
              <Button type="submit">
                <span className="ml-2">Submit</span>
              </Button>
            </div>
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Create a Event</CardTitle>
              <CardDescription>
                Fill out the form below to create a new event.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input type="text" className="w-full" {...field} />
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input type="text" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input type="number" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <FormControl>
                        <Input type="number" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input type="text" className="w-full" {...field} />
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
                      <FormLabel>Organization</FormLabel>
                      <FormControl>
                        <Input type="text" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input type="text" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventImage"
                  render={() => (
                    <FormItem>
                      <FormLabel>Event Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          className="w-full"
                          {...eventImageRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </section>
  );
};

export default CreateEvent;
