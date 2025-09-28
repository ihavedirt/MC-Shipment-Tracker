/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      Welcome to TrackEZ
      <Button variant="contained" onClick={() => router.push("/login")}>
        Login / Sign Up
      </Button>
    </div>
  );
}