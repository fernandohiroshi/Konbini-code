import type { Metadata } from "next";
import "../globals.css";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsApp from "@/components/whatsapp";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import type { AbstractIntlMessages } from "next-intl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://konbinicode.com";

  const description =
    "Konbini Code - Desenvolvimento de Software sob medida para seu negócio. Criação de sites, sistemas, landing pages, integrações e automações.";

  const keywords = [
    "desenvolvimento de software",
    "agência digital",
    "criação de sites",
    "criação de aplicativos",
    "landing page",
    "sistemas web",
    "sistemas personalizados",
    "automação de processos",
    "integração de sistemas",
    "consultoria em tecnologia",
    "produtividade empresarial",
    "transformação digital",
    "soluções digitais",
    "web design",
    "UX/UI design",
    "Next.js",
    "React",
    "TypeScript",
    "frontend",
    "backend",
    "API",
    "SEO",
    "otimização de sites",
    "performance web",
    "startup tecnologia",
    "empresa de tecnologia",
    "software sob medida",
    "desenvolvimento ágil",
    "inovação digital",
    "automação comercial",
    "plataforma digital",
    "consultoria TI",
    "site institucional",
    "e-commerce",
    "app mobile",
    "soluções para empresas",
    "empresa de software",
    "programador freelance",
    "agência web",
    "desenvolvimento web em São Paulo",
    "desenvolvimento web Brasil",
    "Konbini Code",
  ];

  const ogLocaleMap: Record<string, string> = {
    pt: "pt_BR",
    en: "en_US",
    es: "es_ES",
    ja: "ja_JP",
  };

  const languages: Record<string, string> = {
    en: `${baseUrl}/en`,
    pt: `${baseUrl}/pt`,
    es: `${baseUrl}/es`,
    ja: `${baseUrl}/ja`,
    "x-default": baseUrl,
  };

  return {
    metadataBase: new URL(baseUrl),
    applicationName: "Konbini Code",
    category: "technology",
    authors: [{ name: "Konbini Code", url: baseUrl }],
    publisher: "Konbini Code",
    referrer: "origin-when-cross-origin",
    title: {
      default: "Konbini Code",
      template: "%s | Konbini Code",
    },
    description,
    keywords,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages,
    },
    openGraph: {
      title: "Konbini Code",
      description,
      url: `${baseUrl}/${locale}`,
      siteName: "Konbini Code",
      images: [
        {
          url: "/readme/desktop.png",
          width: 1200,
          height: 630,
          alt: "Konbini Code - Desenvolvimento de Software",
          type: "image/png",
        },
      ],
      locale: ogLocaleMap[locale] ?? "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Konbini Code",
      description,
      images: ["/readme/desktop.png"],
      creator: "@konbinicode",
      site: "@konbinicode",
    },
    icons: {
      icon: "/favicon.png",
      apple: "/favicon.png",
    },
    manifest: "/manifest.webmanifest",
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  } satisfies Metadata;
}

export function generateViewport() {
  return {
    viewport: "width=device-width, initial-scale=1, maximum-scale=5",
    themeColor: "#18181b",
  };
}

const montserrat = Montserrat({ subsets: ["latin"] });

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let messages: AbstractIntlMessages;

  try {
    messages = await getMessages();
  } catch {
    return notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning className="!scroll-smooth">
      <body className={`antialiased ${montserrat.className}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Footer />
            <WhatsApp />
          </ThemeProvider>
          <Toaster position="top-right" duration={2000} richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
