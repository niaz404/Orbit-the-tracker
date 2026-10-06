import { NextResponse } from "next/server";

// In-memory cache to reduce redundant Codeforces API calls (5 minutes TTL)
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function GET(request, { params }) {
  try {
    const { handle } = await params;

    if (!handle || typeof handle !== "string") {
      return NextResponse.json(
        { error: "A valid Codeforces handle is required." },
        { status: 400 }
      );
    }

    const cleanHandle = handle.trim();
    if (!/^[a-zA-Z0-9_.-]{1,35}$/.test(cleanHandle)) {
      return NextResponse.json(
        { error: "Invalid Codeforces handle format." },
        { status: 400 }
      );
    }

    const cacheKey = `user_${cleanHandle.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data);
    }

    const cfUrl = `https://codeforces.com/api/user.info?handles=${encodeURIComponent(
      cleanHandle
    )}`;

    const response = await fetch(cfUrl, {
      headers: {
        "User-Agent": "CodeTrack/1.0",
      },
      next: { revalidate: 300 },
    });

    let data;
    try {
      data = await response.json();
    } catch {
      return NextResponse.json(
        { error: "Unable to parse Codeforces API response." },
        { status: 502 }
      );
    }

    if (data.status !== "OK" || !data.result || data.result.length === 0) {
      const comment = (data.comment || "").toLowerCase();
      if (comment.includes("not found")) {
        return NextResponse.json(
          { error: `Codeforces user "${cleanHandle}" was not found.` },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: data.comment || `Codeforces user "${cleanHandle}" was not found.` },
        { status: 404 }
      );
    }

    const user = data.result[0];

    const profile = {
      handle: user.handle,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      avatar: user.avatar || user.titlePhoto || "",
      titlePhoto: user.titlePhoto || "",
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || "unranked",
      maxRank: user.maxRank || "unranked",
      organization: user.organization || "",
      country: user.country || "",
      city: user.city || "",
      registrationTimeSeconds: user.registrationTimeSeconds || 0,
      profileUrl: `https://codeforces.com/profile/${user.handle}`,
    };

    cache.set(cacheKey, { timestamp: Date.now(), data: profile });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Codeforces User API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user from Codeforces. Please check your connection." },
      { status: 500 }
    );
  }
}
