"use client";
import React, { useEffect } from "react";
import { SessionProvider, signOut } from "next-auth/react";
import { Session } from "next-auth";

export function Provider({
  children,
  session,
  
}: Readonly<{
  children: React.ReactNode;
  session: Session | null;

}>) {


  useEffect(() => {
    if (session?.error == "RefreshTokenError") {
      signOut({ callbackUrl: "/" });
    }
  }, [session]);



  return (
    <SessionProvider session={session}>

        {children}

    </SessionProvider>
  );
}
