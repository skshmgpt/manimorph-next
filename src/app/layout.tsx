import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Instrument_Serif } from "next/font/google";

const InstrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Manimorph",
  description: "Text to Manim visualizations",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${InstrumentSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
