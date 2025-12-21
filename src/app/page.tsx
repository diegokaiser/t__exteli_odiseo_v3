'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "./lib/appwrite";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.get();
        router.replace('/dashboard');
      } catch {
        router.replace('/login');
      }
    }
    checkSession();
  }, []);

  return <div className="text-center mt-10">Verificando sesión...</div>
}
