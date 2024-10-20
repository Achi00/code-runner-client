"use client";
import { DependenciesResponse, Dependency } from "@/utils/types/Files";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Download, Package } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface DependenciesProps {
  dependencies: Dependency;
  userId: string;
}

interface selectedPackage {
  name: string;
  version: string;
}

const Dependencies = ({ dependencies, userId }: DependenciesProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState<selectedPackage[]>(
    []
  );

  const handleSelectPackage = (packageName: string, packageVersion: string) => {
    setSelectedPackages((prevPackages) => [
      ...prevPackages,
      { name: packageName, version: packageVersion },
    ]);
    console.log(selectedPackages);
    setQuery("");
    setSuggestions([]);
    // handleSubmit(npm_package);
  };

  useEffect(() => {
    console.log("Updated selected packages:", selectedPackages);
  }, [selectedPackages]);

  const handleSubmit = async (userId: string) => {
    if (!userId) {
      throw new Error("User ID is required");
    }
    userId = String(userId);
    // extract names from selected packages
    const packageNames = selectedPackages.map((pkg) => pkg.name);
    try {
      setLoading(true);
      // generate package json
      console.log("generating package json");
      const packageJson = await fetch(
        "http://localhost:8000/v1/install/create-package",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, packages: packageNames }),
        }
      );
      if (!packageJson.ok) {
        throw new Error("Failed to create package");
      }
      console.log(packageJson);
      console.log("generatated, installing packages");
      if (packageJson) {
        const data = await fetch("http://localhost:8000/v1/install/install", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        console.log(data);
      }
      console.log("all done");
      setSelectedPackages([]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setQuery(value);

    if (value.length > 2) {
      // Start searching after 3 characters
      try {
        const response = await fetch(
          `https://registry.npmjs.org/-/v1/search?text=${value}&size=5`
        );
        const data = await response.json();
        setSuggestions(data.objects.map((pkg: any) => pkg.package));
      } catch (error) {
        console.error("Error fetching package suggestions:", error);
      }
    } else {
      setSuggestions([]); // Clear suggestions if input is too short
    }
  };

  const data = dependencies?.dependencies;
  return (
    <div className="w-full h-[70vh] flex flex-col">
      <div className="container mx-auto p-4 max-w-2xl flex flex-col h-full">
        <div className="mt-auto flex flex-col gap-4">
          {data && data.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Version</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((dep, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium">{dep.name}</TableCell>
                    <TableCell>{dep.version}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="grid w-full max-w-sm items-center gap-5 pb-5">
            <div>
              <Input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for npm packages..."
                className="border p-2 rounded"
              />

              {suggestions.length > 0 && (
                <ul className="mt-2 border p-2 rounded bg-[#181818]">
                  {suggestions.map((pkg: any, index: number) => (
                    <li
                      key={index}
                      className="p-2 h-auto overflow-auto border-gray-400 cursor-pointer"
                    >
                      <button
                        className="transition duration-300 ease-in-out hover:bg-[#D0FB51] hover:text-black rounded-md px-1"
                        onClick={() =>
                          handleSelectPackage(pkg.name, pkg.version)
                        }
                      >
                        <strong>{pkg.name}</strong> - {pkg.version}
                        <p>{pkg.description}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button
              disabled={selectedPackages.length == 0 || loading}
              onClick={() => handleSubmit(userId)}
              type="submit"
              className=" hover:bg-gray-800 border font-semibold py-2 px-4 rounded"
            >
              {loading
                ? "Installing..."
                : selectedPackages.length > 0
                ? "Install"
                : "Select Package"}
            </Button>
            {selectedPackages.length > 0 && (
              <div className="flex items-center gap-2 py-2 border-b justify-center">
                <Download className="text-[#D0FB51]" />
                <h2 className="text-xl font-semibold">Pending Install</h2>
              </div>
            )}
            <ul>
              {selectedPackages.length > 0 &&
                selectedPackages.map(
                  (item: { name: string; version: string }, index: number) => (
                    <li key={index} className="pt-3">
                      <div className="flex gap-3 items-center">
                        <Package className="h-10 w-10 p-1 bg-[#D0FB51] rounded-full text-black" />
                        <div className="flex flex-col">
                          <p className="font-bold text-xl">{item.name}</p>
                          <span className="text-md text-gray-300">
                            version: {item.version}
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dependencies;
