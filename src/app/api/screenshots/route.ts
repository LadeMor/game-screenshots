import type { NextRequest } from "next/server";

const clientId = process.env.CLIENT_ID || "";
const accesToken = process.env.ACCESS_TOKEN || "";

const releasePeriods = {
    "1980s": {
        from: Date.UTC(1980, 0, 1) / 1000,
        to: Date.UTC(1990, 0, 1) / 1000,
    },
    "1990s": {
        from: Date.UTC(1990, 0, 1) / 1000,
        to: Date.UTC(2000, 0, 1) / 1000,
    },
    "2000s": {
        from: Date.UTC(2000, 0, 1) / 1000,
        to: Date.UTC(2010, 0, 1) / 1000,
    },
    "2010s": {
        from: Date.UTC(2010, 0, 1) / 1000,
        to: Date.UTC(2020, 0, 1) / 1000,
    },
    "2020s": {
        from: Date.UTC(2020, 0, 1) / 1000,
        to: Date.UTC(2027, 0, 1) / 1000,
    },
} as const;

export async function GET(request: NextRequest) {
    const periodKey = request.nextUrl.searchParams.get("period");
    const offset = request.nextUrl.searchParams.get("offset");
    const limit = request.nextUrl.searchParams.get("limit");

    const period =
        periodKey && periodKey in releasePeriods
            ? releasePeriods[periodKey as keyof typeof releasePeriods]
            : null;

    const filters = [
        "game.genres = 8",
        "game.player_perspectives = 4",
    ];

    if (period) {
        filters.push(`game.first_release_date >= ${period.from}`);
        filters.push(`game.first_release_date < ${period.to}`);
    }

    if (!clientId || !accesToken) {
        throw new Error("Missing IGDB credentials");
    }

    const response = await fetch("https://api.igdb.com/v4/screenshots", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Client-ID": clientId,
            Authorization: `Bearer ${accesToken}`,
        },
        body: `
            fields alpha_channel,animated,checksum,game,height,image_id,url,width;

           where ${filters.join(" & ")};

            sort id asc;
            limit ${limit};
            offset ${offset};
            `,
    });

    const data = await response.json();

    return Response.json(data);
}