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
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";

const AVATAR_COLORS: { bg: string; text: string }[] = [
  { bg: "#B5D4F4", text: "#0C447C" },
  { bg: "#C0DD97", text: "#3B6D11" },
  { bg: "#F4C0D1", text: "#72243E" },
  { bg: "#FAC775", text: "#633806" },
  { bg: "#9FE1CB", text: "#085041" },
  { bg: "#CECBF6", text: "#3C3489" },
  { bg: "#F5C4B3", text: "#712B13" },
  { bg: "#D3D1C7", text: "#444441" },
];

const CLIENTS = [
  {
    id: 1,
    name: "Aria Linden",
    email: "aria@lindenco.io",
    genre: "Fiction",
    author: "James Okafor",
    createdAt: "12 Jan 2025",
  },
  {
    id: 2,
    name: "Marcelo Reis",
    email: "m.reis@reisbooks.com",
    genre: "Non-fiction",
    author: "Priya Nair",
    createdAt: "28 Feb 2025",
  },
  {
    id: 3,
    name: "Sasha Park",
    email: "sasha@parklit.com",
    genre: "Thriller",
    author: "Daniel Mohr",
    createdAt: "3 Mar 2025",
  },
  {
    id: 4,
    name: "Theo Whitmore",
    email: "theo@whitmore.org",
    genre: "Fantasy",
    author: "Aiko Tanaka",
    createdAt: "15 Mar 2025",
  },
  {
    id: 5,
    name: "Nina Johansson",
    email: "nina@jbooks.se",
    genre: "Romance",
    author: "Samuel Eze",
    createdAt: "1 Apr 2025",
  },
  {
    id: 6,
    name: "Clara Liu",
    email: "c.liu@claralit.com",
    genre: "Sci-Fi",
    author: "Romy Becker",
    createdAt: "10 Apr 2025",
  },
  {
    id: 7,
    name: "David Moran",
    email: "david@moranread.ie",
    genre: "History",
    author: "Fatou Diallo",
    createdAt: "22 Apr 2025",
  },
  {
    id: 8,
    name: "Elena Vasquez",
    email: "elena@vasqlibros.es",
    genre: "Biography",
    author: "Tom Larssen",
    createdAt: "5 May 2025",
  },
  {
    id: 9,
    name: "Omar Farouk",
    email: "omar@farouklit.eg",
    genre: "Fiction",
    author: "Lena Hoffman",
    createdAt: "9 May 2025",
  },
  {
    id: 10,
    name: "Yuki Tanabe",
    email: "yuki@tanabepress.jp",
    genre: "Manga",
    author: "Chris Banda",
    createdAt: "14 May 2025",
  },
  {
    id: 11,
    name: "Sofia Esposito",
    email: "sofia@espositoed.it",
    genre: "Romance",
    author: "Nadia Osei",
    createdAt: "20 May 2025",
  },
  {
    id: 12,
    name: "Liam Brennan",
    email: "liam@brennanbooks.ie",
    genre: "Thriller",
    author: "Kenji Mori",
    createdAt: "25 May 2025",
  },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const getAvatarColor = (name: string) =>
  AVATAR_COLORS[
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
      AVATAR_COLORS.length
  ];

const PER_PAGE = 10;

const ClientPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return CLIENTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.genre.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q),
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Clients</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <CardTitle>Clients</CardTitle>
              <CardDescription className="mt-1">
                Manage your clients and their details
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search clients…"
                value={search}
                onChange={handleSearch}
                className="w-52 h-8 text-sm"
              />
              <Button size="sm" className="h-8 gap-1">
                <Plus className="h-3.5 w-3.5" />
                Add client
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 pl-6" />
                <TableHead>Client</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="w-10 pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    {search
                      ? `No clients matching "${search}"`
                      : "No clients found."}
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((client, _i:number) => {
                  const color = getAvatarColor(client.name);
                  const initials = getInitials(client.name);
                  return (
                    <TableRow key={client.id}>
                      <TableCell className="pl-6">
                        <div
                          className="w-9 h-9 rounded-md flex items-center justify-center text-xs font-medium shrink-0"
                          style={{ background: color.bg, color: color.text }}
                        >
                          {initials}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-sm leading-none">
                          {client.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {client.email}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {client.genre}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {client.author}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                        {client.createdAt}
                      </TableCell>
                      <TableCell className="pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t px-6 py-3">
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            <strong>
              {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}–
              {Math.min(page * PER_PAGE, filtered.length)}
            </strong>{" "}
            of <strong>{filtered.length}</strong> client
            {filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1)
                  acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="text-xs text-muted-foreground px-1"
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "outline"}
                    size="icon"
                    className="h-7 w-7 text-xs"
                    onClick={() => setPage(p as number)}
                  >
                    {p}
                  </Button>
                ),
              )}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default ClientPage;
