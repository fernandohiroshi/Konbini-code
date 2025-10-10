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

  const localized = {
    pt: {
      title: "Agência Digital em Foz do Iguaçu | Konbini Code",
      description:
        "Agência digital em Foz do Iguaçu especializada em sites, landing pages, identidade visual e social media. Atendemos também Puerto Iguazú (AR) e Ciudad del Este (PY).",
      keywords: [
        "agência digital Foz do Iguaçu",
        "criação de sites Foz do Iguaçu",
        "landing page Foz do Iguaçu",
        "identidade visual Foz do Iguaçu",
        "social media Foz do Iguaçu",
        "desenvolvimento de sites fronteira",
        "agência web Tríplice Fronteira",
        "sites Puerto Iguazú",
        "sites Ciudad del Este",
        "SEO local Foz do Iguaçu",
        "Konbini Code",
      ],
    },
    es: {
      title: "Agencia Digital en Foz de Iguazú | Konbini Code",
      description:
        "Agencia digital en Foz de Iguazú para sitios web, landing pages, identidad visual y redes sociales. También atendemos Puerto Iguazú (AR) y Ciudad del Este (PY).",
      keywords: [
        "agencia digital Foz de Iguazú",
        "creación de sitios Foz de Iguazú",
        "landing page Foz de Iguazú",
        "identidad visual Foz de Iguazú",
        "redes sociales Foz de Iguazú",
        "agencia web Triple Frontera",
        "sitios Puerto Iguazú",
        "sitios Ciudad del Este",
        "SEO local Foz de Iguazú",
        "Konbini Code",
      ],
    },
    en: {
      title: "Digital Agency in Foz do Iguaçu | Konbini Code",
      description:
        "Digital agency in Foz do Iguaçu for websites, landing pages, brand identity and social media. We also serve Puerto Iguazú (AR) and Ciudad del Este (PY).",
      keywords: [
        "digital agency Foz do Iguaçu",
        "website development Foz do Iguaçu",
        "landing pages Foz do Iguaçu",
        "brand identity Foz do Iguaçu",
        "social media Foz do Iguaçu",
        "web agency tri-border",
        "websites Puerto Iguazú",
        "websites Ciudad del Este",
        "local SEO Foz do Iguaçu",
        "Konbini Code",
      ],
    },
    ja: {
      title: "フォス・ド・イグアスのデジタル制作 | Konbini Code",
      description:
        "フォス・ド・イグアスを拠点に、Webサイト、LP、ブランドデザイン、SNS運用を提供。プエルト・イグアス（AR）、シウダ・デル・エステ（PY）にも対応。",
      keywords: [
        "デジタルエージェンシー フォス・ド・イグアス",
        "Web制作 フォス・ド・イグアス",
        "ランディングページ フォス・ド・イグアス",
        "ブランディング フォス・ド・イグアス",
        "SNS運用 フォス・ド・イグアス",
        "Konbini Code",
      ],
    },
  };

  const meta = localized[locale as keyof typeof localized] ?? localized.pt;

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
      default: meta.title,
      template: "%s | Konbini Code",
    },
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
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
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      ],
      shortcut: [{ url: "/favicon.ico" }],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
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

  const baseUrl = "https://konbinicode.com";
  const metaLocalMap: Record<string, { title: string; description: string }> = {
    pt: {
      title: "Agência Digital em Foz do Iguaçu | Konbini Code",
      description:
        "Agência digital em Foz do Iguaçu especializada em sites, landing pages, identidade visual e social media. Atendemos também Puerto Iguazú (AR) e Ciudad del Este (PY).",
    },
    es: {
      title: "Agencia Digital en Foz de Iguazú | Konbini Code",
      description:
        "Agencia digital en Foz de Iguazú para sitios web, landing pages, identidad visual y redes sociales. También atendemos Puerto Iguazú (AR) y Ciudad del Este (PY).",
    },
    en: {
      title: "Digital Agency in Foz do Iguaçu | Konbini Code",
      description:
        "Digital agency in Foz do Iguaçu for websites, landing pages, brand identity and social media. We also serve Puerto Iguazú (AR) and Ciudad del Este (PY).",
    },
    ja: {
      title: "フォス・ド・イグアスのデジタル制作 | Konbini Code",
      description:
        "フォス・ド・イグアスを拠点に、Webサイト、LP、ブランドデザイン、SNS運用を提供。プエルト・イグアス（AR）、シウダ・デル・エステ（PY）にも対応。",
    },
  };
  const metaLocal = metaLocalMap[locale] ?? metaLocalMap.pt;
  const jsonLdOrg = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}#organization`,
    name: "Konbini Code",
    url: baseUrl,
    image: `${baseUrl}/branding.webp`,
    description: metaLocal.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Foz do Iguaçu",
      addressRegion: "PR",
      addressCountry: "BR",
    },
    areaServed: [
      "Foz do Iguaçu - PR, BR",
      "Puerto Iguazú - Misiones, AR",
      "Ciudad del Este - Alto Paraná, PY",
    ],
    telephone: "+55 45 98831-1915",
    sameAs: [
      "https://www.linkedin.com/company/konbini-code",
      "https://www.instagram.com/konbini_code/",
      "https://www.facebook.com/profile.php?id=61579275967882",
    ],
  });
  const jsonLdBreadcrumb = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/${locale}`,
      },
    ],
  });

  return (
    <html lang={locale} suppressHydrationWarning className="!scroll-smooth">
      <body className={`antialiased ${montserrat.className}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLdOrg }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLdBreadcrumb }}
          />
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
