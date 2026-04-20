import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no Events
          </h3>
          <p className="text-sm text-muted-foreground">
            You can start selling as soon as you add your first event. Click the
            button below to get started.
          </p>
          <Link to={"/events/create"}>
            <Button className="mt-4">Add Events</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HomePage;
