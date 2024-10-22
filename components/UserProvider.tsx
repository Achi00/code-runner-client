"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { TUser } from "@/utils/types/auth";

type UserContextType = {
  user: TUser | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: TUser | null;
}) {
  const [user, setUser] = useState<TUser | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);
  const router = useRouter();
  const [changes, setChanges] = useState(0);

  let pathname = usePathname();

  useEffect(() => {
    // Fetch user data if no initial user
    if (!initialUser) {
      fetchUser();
    }

    // Listen for route changes and refetch user data on route change
    const handleRouteChange = () => {
      fetchUser(); // Re-fetch user data when route changes
    };

    handleRouteChange();
  }, [initialUser, pathname]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/userdata");
      const data = await res.json();
      setUser(data.userData);
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
