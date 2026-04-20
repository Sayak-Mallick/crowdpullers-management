import { Badge } from "@/components/ui/badge";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CirclePlus, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

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

const events: IEvents[] = [
  {
    _id: "1",
    title: "Event 1",
    description: "Description 1",
    year: 2022,
    month: 1,
    location: "Location 1",
    organization: "Organization 1",
    category: "Category 1",
    eventImage:
      "https://images.unsplash.com/photo-1506744038136-49a8b38d2b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z",
  },
  {
    _id: "2",
    title: "Event 2",
    description: "Description 2",
    year: 2022,
    month: 2,
    location: "Location 2",
    organization: "Organization 2",
    category: "Category 2",
    eventImage:
      "https://images.unsplash.com/photo-1506744038136-49a8b38d2b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    createdAt: "2022-02-01T00:00:00.000Z",
    updatedAt: "2022-02-01T00:00:00.000Z",
  },
  {
    _id: "3",
    title: "Event 3",
    description: "Description 3",
    year: 2022,
    month: 3,
    location: "Location 3",
    organization: "Organization 3",
    category: "Category 3",
    eventImage:
      "https://images.unsplash.com/photo-1506744038136-49a8b38d2b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    createdAt: "2022-03-01T00:00:00.000Z",
    updatedAt: "2022-03-01T00:00:00.000Z",
  },
];

const formatDate = (date: string) => {
  if (!date) return "";
  return new Date(date).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

const EventsPage = () => {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Events</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Link to={"/events/create"}>
          <Button>
            <CirclePlus size={20} className="h-4 w-4" />
            <span>Add New Event</span>
          </Button>
        </Link>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>
            Manage your events and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-25 sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Updated at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events?.map((event: IEvents) => {
                return (
                  <TableRow key={event?._id}>
                    <TableCell className="hidden sm:table-cell">
                      <img
                        alt={event.title}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={event?.eventImage}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{event?._id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{event?.title}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(event?.createdAt)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(event?.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{events?.length || 0}</strong> of{" "}
            <strong>{events?.length || 0}</strong> events
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default EventsPage;
