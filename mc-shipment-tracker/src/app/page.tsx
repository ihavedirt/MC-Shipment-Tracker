/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button, Card } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Button variant="contained" onClick={() => router.push("/login")}>
        Login / Sign Up
      </Button>
    </div>
  );
}