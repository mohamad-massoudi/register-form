import type { Metadata } from "next";
import "./globals.css";
import LocalFont from "next/font/local";
import { Toaster } from "sonner";
import { Provider } from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/auth-option";


const vazir = LocalFont({
  src: [
    {
      path: "./fonts/Vazir-Regular-FD.woff2",
    },
  ],
});


export const metadata: Metadata = {
  title: "شهدای صنعت نفت",
  description: "پیشتازان رشد و توسعه صنعت نفت",
  icons: {
    icon: "/default-logo.jpg",
    
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazir.className} h-full antialiased`}
    >
      <body>
        <Provider session={session}>
          {children}
          <Toaster />
        </Provider>
      </body>

    </html>
  );
}
