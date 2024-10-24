"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Github,
  LogIn,
  MailCheck,
  MailCheckIcon,
  Terminal,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  rePassword: string;
}

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();

  const handleSubmit = async (
    values: RegisterValues,
    { setSubmitting }: FormikHelpers<RegisterValues>
  ) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("user registered seccesfully");
        setIsRegistered(true);
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

  const validate = (values: RegisterValues) => {
    const errors: Partial<RegisterValues> = {};

    if (!values.name) {
      errors.name = "Name is required";
    }

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is invalid";
    }

    if (!values.password) {
      errors.password = "Password is required";
    }

    if (!values.rePassword) {
      errors.rePassword = "Please re-enter the password";
    } else if (values.password !== values.rePassword) {
      errors.rePassword = "Passwords do not match";
    }

    return errors;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Register to CodeRunner</h1>
          <p className="text-gray-400">
            register to start building your projects today.
          </p>
        </div>
        {isRegistered && (
          // D0FB51
          <Alert className="shadow-lg max-w-md mx-auto text-gray-300 ">
            <div className="flex items-start space-x-4">
              <div className="bg-[#D0FB51] text-black p-2 rounded-full">
                <MailCheckIcon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <AlertTitle className="text-xl font-bold mb-1">
                  Email Registered
                </AlertTitle>
                <AlertDescription className=" mb-3">
                  Please check your inbox and verify your email address to
                  complete the registration process.
                </AlertDescription>
                <Button
                  asChild
                  className="bg-[#D0FB51]  text-black hover:text-white font-bold"
                >
                  <Link href="/login">Log In</Link>
                </Button>
              </div>
            </div>
          </Alert>
        )}
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            rePassword: "",
          }}
          validate={validate} // Attach the validation function here
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  as={Input}
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Field
                  as={Input}
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
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
                  autoComplete="new-password"
                  className="w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Field
                  as={Input}
                  type="password"
                  name="rePassword" // Fix the name here
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  className="w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
                />
                <ErrorMessage
                  name="rePassword" // Fix the name here
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
                {isSubmitting ? "Signing up..." : "Sign up"}
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
              Already have an account?
            </span>
          </div>
        </div>
        <div className="text-center">
          <Button className="w-full bg-[#d0fb51] hover:bg-[#c5ef4c] text-black font-semibold py-2 px-4 rounded">
            <a href="/login" className="flex items-center gap-2 text-black">
              <LogIn />
              Log In
            </a>
          </Button>
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
