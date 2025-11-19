import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const imageUrl = [
  "https://images.lectuslab.online/welcome.png",
  "https://images.lectuslab.online/hbar.png",
  "https://images.lectuslab.online/hwise.png",
];

export const Route = createFileRoute("/(dashboard)/")({
  component: App,
});

function App() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!carouselApi) return;

    const id = setInterval(() => {
      try {
        carouselApi.scrollNext();
      } catch {
        // ignore
      }
    }, 4000);

    return () => clearInterval(id);
  }, [carouselApi]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_bottom,rgba(37,99,235,0.45),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-linear-to-b from-slate-900 via-slate-950 to-slate-950 opacity-70" />
      <Header />

      <main className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 pb-20 pt-10 md:pt-16">
        <section className="flex max-w-3xl flex-col items-center text-center space-y-6">
          <Badge className="border-blue-300/60 bg-blue-500/10 text-blue-100">
            Save with Hederawise, the only wealth management app you truly need.
          </Badge>

          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Build wealth, the smart way.
            </h1>
            <p className="max-w-2xl text-balance text-base leading-relaxed text-slate-200/90 md:text-lg">
              Hederawise is a Hedera-powered savings and wealth management app.
              Create automated saving plans, stash extra HBAR, and watch your
              HWISE balance grow — all in a simple, friendly interface that
              actually feels good to use.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/40 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <a
                href={import.meta.env.VITE_PUBLIC_DOWNLOAD_URL}
                target="_blank"
                rel="noreferrer"
              >
                Download the app
              </a>
            </Button>
          </div>

          <div className="grid gap-4 text-sm text-slate-100/90 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="font-medium text-white">Savings plans</p>
              <p className="text-xs text-slate-300">
                Set up recurring plans backed by the Hederawise API so your HBAR
                is always working for you.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-white">Stash for later</p>
              <p className="text-xs text-slate-300">
                Move idle balance into a dedicated stash and keep track of every
                in and out in one place.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-white">HBAR &amp; $HWISE</p>
              <p className="text-xs text-slate-300">
                See your HBAR, HWISE token balance, and fiat equivalent at a
                glance, just like in the mobile app.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full max-w-md">
          <Card className="relative border-blue-500/40 bg-slate-900/80 shadow-2xl shadow-blue-900/60 ring-1 ring-blue-500/50 backdrop-blur-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium text-slate-50">
                Hederawise on mobile
              </CardTitle>
              <CardDescription className="text-slate-300">
                A focused view of your savings, stash, and tokens on Hedera.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mx-auto aspect-9/19 max-w-[260px] rounded-[2.5rem] border border-slate-200 bg-slate-900/90 p-2 shadow-lg">
                <div className="absolute left-1/2 top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-slate-700" />
                <div className="absolute left-6 top-2 h-2 w-2 rounded-full bg-slate-700" />

                <div className="relative h-full w-full overflow-hidden rounded-4xl bg-slate-950">
                  <div className="pointer-events-none absolute inset-x-4 top-4 z-10 h-10 rounded-full bg-linear-to-b from-blue-500/30 to-transparent blur-xl" />
                  <Carousel
                    className="relative z-20 h-full w-full"
                    opts={{ loop: true }}
                    setApi={setCarouselApi}
                  >
                    <CarouselContent>
                      {imageUrl.map((src) => (
                        <CarouselItem key={src} className="h-full">
                          <img
                            src={src}
                            alt="Hederawise mobile screenshot"
                            className="h-full w-full object-cover"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
