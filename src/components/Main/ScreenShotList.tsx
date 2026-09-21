"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Screenshot } from "@/app/api/screenshots/types";
import { Button } from "@/components/ui/button";

const releasePeriods = [
    { label: "1980–1989", value: "1980s" },
    { label: "1990–1999", value: "1990s" },
    { label: "2000–2009", value: "2000s" },
    { label: "2010–2019", value: "2010s" },
    { label: "2020–2026", value: "2020s" },
] as const;

const paginationPages = [1, 2, 3, 4, 5];

type ReleasePeriod =
    | (typeof releasePeriods)[number]["value"]
    | "";

const PAGE_SIZE = 24;

export default function ScreenShotList() {

    const [screenshots, setScreenshots] = useState<Screenshot[]>();
    const [releasePeriod, setReleasePeriod] = useState<ReleasePeriod>("");
    const [currentPage, setCurrentPage] = useState(1);

    const offset = (currentPage - 1) * PAGE_SIZE;

    useEffect(() => {

        async function loadScreenshots() {

            const params = new URLSearchParams();

            if (releasePeriod) {
                params.set("period", releasePeriod);
            }

            params.set("limit", PAGE_SIZE.toString());
            params.set("offset", offset.toString());

            const response = await fetch(
                `/api/screenshots?${params.toString()}`,
            );

            if (!response.ok) {
                throw new Error("Failed to load screenshots");
            }

            const data = await response.json();
            setScreenshots(data);
        }

        loadScreenshots();
    }, [releasePeriod, currentPage])

    function getScreenshotUrl(imageId: string) {
        return `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${imageId}.jpg`;
    }

    return (
        <section id="screenshots" className="w-full scroll-mt-20">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <h1 className="text-2xl font-semibold">Screenshots</h1>

                <label className="flex items-center gap-2 text-sm font-medium">
                    <span>Release period</span>
                    <select
                        value={releasePeriod}
                        onChange={(event) => {
                            setReleasePeriod(event.target.value as ReleasePeriod);
                            setCurrentPage(1);
                        }}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none transition-shadow focus:border-ring focus:ring-2 focus:ring-ring/50"
                    >
                        <option value="">All years</option>
                        {releasePeriods.map((period) => (
                            <option key={period.value} value={period.value}>
                                {period.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {
                screenshots ?
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {screenshots.map((screenshot) => (
                            <li
                                key={screenshot.id}
                                className="group relative aspect-video overflow-hidden bg-muted"
                            >
                                <Image
                                    src={getScreenshotUrl(screenshot.image_id)}
                                    alt={`Screenshot ${screenshot.id}`}
                                    fill
                                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </li>
                        ))}
                    </ul>
                    :
                    <h1>No screenshots</h1>
            }

            <nav
                aria-label="Screenshot pagination"
                className="mt-8 flex flex-wrap items-center justify-center gap-2"
            >
                <Button
                    type="button"
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                >
                    Previous
                </Button>

                <div className="flex items-center gap-1">
                    {paginationPages.map((page) => (
                        <Button
                            key={page}
                            type="button"
                            size="icon"
                            variant={currentPage === page ? "default" : "outline"}
                            aria-label={`Go to page ${page}`}
                            aria-current={currentPage === page ? "page" : undefined}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </Button>
                    ))}
                </div>

                <Button
                    type="button"
                    variant="outline"
                    disabled={currentPage === paginationPages.length}
                    onClick={() =>
                        setCurrentPage((page) =>
                            Math.min(paginationPages.length, page + 1),
                        )
                    }
                >
                    Next
                </Button>
            </nav>
        </section>
    );
}
