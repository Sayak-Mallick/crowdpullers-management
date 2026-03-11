import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/api/auth.endpoints";
import { LoaderCircle } from "lucide-react";
import useTokenStore from "@/store";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const setToken = useTokenStore((state) => state.setToken);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      console.log("Login successful");
      setToken(response.data.accessToken);
      navigate("/");
    },
  });

  const handleLogin = async () => {
    // e.preventDefault(); // prevents page refresh
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (!email || !password) {
      // TODO: show error message via snackbars
      return;
    }
    mutation.mutate({ email, password });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          {mutation.isError && (
            <p className="text-sm text-red-500 mt-1">
              {mutation.error.message || "Something went wrong"}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  ref={emailRef}
                  placeholder="email"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  ref={passwordRef}
                  placeholder="password"
                  required
                />
              </Field>
              <Field>
                <Button
                  type="button"
                  className="w-full flex items-center gap-1"
                  onClick={handleLogin}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending && (
                    <LoaderCircle className="animate-spin" />
                  )}
                  <span>Login</span>
                </Button>
                {/*<Button variant="outline" type="button">
                  Login with Google
                </Button>*/}
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link to="/auth/register">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
