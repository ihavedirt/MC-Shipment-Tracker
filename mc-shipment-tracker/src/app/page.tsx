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
      <Card style={{ width: '70%', padding: "20px", marginTop: "20px" }}>
        <h2>Welcome to the Package Tracker App</h2>
        <p>
          This app allows you to track your packages from various carriers in
          one place. Sign up or log in to get started!
        </p>
      </Card>
    </div>
  );
}