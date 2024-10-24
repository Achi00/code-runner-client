import Link from "next/link";
import {
  ArrowRight,
  Cloud,
  Code,
  Lock,
  Package,
  Play,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getUserData } from "@/lib/auth";
import { redirect } from "next/navigation";
import Logo from "../utils/images/logo.png";
import Image from "next/image";

export default async function HomePage() {
  const userData = await getUserData();
  if (userData) {
    // Redirect to login page
    redirect("/sandbox");
  }
  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        <section className="py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">Code, Create, and Deploy</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Write HTML, CSS, and JavaScript in a powerful online IDE. Install
            npm packages, run your code, and deploy with ease.
          </p>
          <Button className="bg-[#D0FB51] text-black hover:bg-[#b8e046] text-lg px-8 py-6">
            <Link href="/sandbox" className="flex items-center">
              Start Coding Now <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </section>

        <section id="features" className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Code className="w-10 h-10 text-[#D0FB51]" />}
                title="Online IDE"
                description="Write and edit HTML, CSS, and JavaScript in our powerful online editor."
              />
              <FeatureCard
                icon={<Package className="w-10 h-10 text-[#D0FB51]" />}
                title="npm Integration"
                description="Install and use npm packages directly in your projects."
              />
              <FeatureCard
                icon={<Play className="w-10 h-10 text-[#D0FB51]" />}
                title="Instant Preview"
                description="See your changes in real-time with our live preview feature."
              />
              <FeatureCard
                icon={<Terminal className="w-10 h-10 text-[#D0FB51]" />}
                title="Console & Terminal"
                description="Access console logs and use a built-in terminal for advanced operations."
              />
            </div>
          </div>
        </section>

        <section id="safety" className="py-20 bg-[#E3FF73] text-black">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">
              Secure and Isolated Environment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              <SafetyFeature
                icon={<Shield className="w-12 h-12 " />}
                title="Isolated Sandbox"
                description="Your code runs in a secure, isolated Docker environment."
              />
              <SafetyFeature
                icon={<Lock className="w-12 h-12 " />}
                title="Data Protection"
                description="Your projects and personal information are encrypted and protected."
              />
              <SafetyFeature
                icon={<Zap className="w-12 h-12 " />}
                title="Resource Management"
                description="Fair allocation of computing resources for all users."
              />
              <SafetyFeature
                icon={<Cloud className="w-12 h-12 " />}
                title="Automatic Backups"
                description="Your work is continuously saved and backed up in the cloud."
              />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to start coding?</h2>
            <p className="text-xl mb-8">
              Join thousands of developers who are already using CodeCraft to
              build amazing projects.
            </p>
            <Button className="bg-[#D0FB51] text-black hover:bg-[#b8e046] text-lg px-8 py-6">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-black p-6 rounded-lg border border-gray-800">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function SafetyFeature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 text-center">{description}</p>
    </div>
  );
}
