"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Github,
  Loader2,
  LogIn,
  MailCheck,
  MailCheckIcon,
  Send,
  Terminal,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

interface RegisterValues {
  email: string;
}

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (
    values: RegisterValues,
    { setSubmitting }: FormikHelpers<RegisterValues>
  ) => {
    try {
      setEmailSent(false);
      const response = await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setEmailSent(true);
      } else {
        const data = await response.json();
        setError("An error occurred during login");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setSubmitting(false);
    }
  };

  const validate = (values: RegisterValues) => {
    const errors: Partial<RegisterValues> = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is invalid";
    }

    return errors;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Reset your password</h1>
          <p className="text-gray-400">
            Enter your email and get password recovery link
          </p>
        </div>
        {emailSent && (
          // D0FB51
          <Alert className="shadow-lg max-w-md mx-auto text-gray-300 ">
            <div className="flex items-start space-x-4">
              <div className="bg-[#D0FB51] text-black p-2 rounded-full">
                <MailCheckIcon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <AlertTitle className="text-xl font-bold mb-1">
                  Please Check Your Email
                </AlertTitle>
                <AlertDescription className=" mb-3">
                  Please visit your email and follow url to reset your account
                  password
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}
        <Formik
          initialValues={{
            email: "",
          }}
          validate={validate}
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

              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full border border-gray-500 font-semibold py-2 px-4 rounded"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <p className="text-lg">Sending validation url...</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    <p className="text-lg">Send</p>
                  </div>
                )}
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
            <Link href="/login" className="flex items-center gap-2 text-black">
              <LogIn />
              Log In
            </Link>
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
