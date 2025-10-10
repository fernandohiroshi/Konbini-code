import Link from "next/link";
import { Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <div className="min-h-screen flex flex-col  bg-background">
      <div className="h-[calc(100vh-16rem)] flex items-center justify-center">
        <main className="w-full flex flex-col items-center justify-center px-4 py-8">
          <Skull className="w-32 h-32 mb-4 animate-pulse text-red-600" />
          <h2 className="text-2xl font-semibold mb-2">{t("title")}</h2>
          <p className="mb-8 text-center max-w-md">{t("description")}</p>
          <Link href="/">
            <Button size="lg" className="cursor-pointer">
              {t("backToHome")}
            </Button>
          </Link>
        </main>
      </div>
    </div>
  );
}
