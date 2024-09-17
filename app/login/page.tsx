// components/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github } from "lucide-react";

interface LoginValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (
    values: LoginValues,
    { setSubmitting }: FormikHelpers<LoginValues>
  ) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        router.push("/dashboard"); // Redirect to dashboard on successful login
      } else {
        const data = await response.json();
        console.log(data);
        setError(data.error || "An error occurred during login");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Sign in to CodeRunner</h1>
          <p className="text-gray-400">
            Login or register to start building your projects today.
          </p>
        </div>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  as={Input}
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Field
                  as={Input}
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-2 px-4 rounded"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </Form>
          )}
        </Formik>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-gray-400">
              Or continue with
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <Button className="w-full bg-[#d0fb51] hover:bg-[#c5ef4c] text-black font-semibold py-2 px-4 rounded">
            <Github className="mr-2 h-5 w-5" />
            Sign in with GitHub
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full text-white bg-zinc-800 hover:bg-zinc-700"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Sign in with Google
            </Button>
            <Button
              variant="outline"
              className="w-full text-white bg-zinc-800 hover:bg-zinc-700"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm.5-13c2.483 0 4.5 2.017 4.5 4.5S14.983 16 12.5 16 8 13.983 8 11.5 10.017 7 12.5 7zm0 1c-1.93 0-3.5 1.57-3.5 3.5S10.57 15 12.5 15 16 13.43 16 11.5 14.43 8 12.5 8z"
                />
              </svg>
              Sign in with Apple
            </Button>
          </div>
        </div>
        <div className="text-center">
          <a href="#" className="text-sm text-gray-400 hover:text-white">
            Sign in with SSO
          </a>
        </div>
        <div className="text-center text-xs text-gray-500">
          By continuing, you agree to CodeRunner
          <br />
          <a href="#" className="hover:text-white">
            Terms of Service
          </a>
          ,{" "}
          <a href="#" className="hover:text-white">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
