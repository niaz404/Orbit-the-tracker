import { NextResponse } from "next/server";

// Cache for submission lists (10 minutes TTL)
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

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

    const cacheKey = `subs_${cleanHandle.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data);
    }

    // Codeforces API user.status: fetch up to 10000 submissions
    const cfUrl = `https://codeforces.com/api/user.status?handle=${encodeURIComponent(
      cleanHandle
    )}&from=1&count=10000`;

    const response = await fetch(cfUrl, {
      headers: {
        "User-Agent": "CodeTrack/1.0",
      },
      next: { revalidate: 600 },
    });

    let data;
    try {
      data = await response.json();
    } catch {
      return NextResponse.json(
        { error: "Unable to parse Codeforces submissions response." },
        { status: 502 }
      );
    }

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: data.comment || `Could not fetch submissions for "${cleanHandle}".` },
        { status: 404 }
      );
    }

    const submissions = data.result || [];

    // 1. Filter only successfully solved problems (verdict === "OK")
    const acceptedSubmissions = submissions.filter((sub) => sub.verdict === "OK" && sub.problem);

    // 2. Sort chronologically from OLDEST to NEWEST (creationTimeSeconds ASC)
    acceptedSubmissions.sort(
      (a, b) => a.creationTimeSeconds - b.creationTimeSeconds
    );

    // 3. Deduplicate problems while preserving the first occurrence order
    const seenProblems = new Set();
    const chronologicalProblems = [];

    for (const sub of acceptedSubmissions) {
      const problem = sub.problem;
      const contestId = problem.contestId;
      const index = problem.index || "A";
      const name = problem.name || "Untitled Problem";

      // Formulate unique problem key
      const problemKey = contestId
        ? `${contestId}-${index}`
        : `${name.toLowerCase().replace(/\s+/g, "-")}-${index}`;

      if (!seenProblems.has(problemKey)) {
        seenProblems.add(problemKey);

        // Construct clean Codeforces URL
        const problemUrl = contestId
          ? contestId > 100000
            ? `https://codeforces.com/gym/${contestId}/problem/${index}`
            : `https://codeforces.com/contest/${contestId}/problem/${index}`
          : `https://codeforces.com/problemset/problem/${encodeURIComponent(name)}`;

        // CRITICAL: Absolutely NO SPOILERS (no tags, no ratings, no algorithms, no difficulty)
        chronologicalProblems.push({
          id: problemKey,
          name: name,
          url: problemUrl,
          solvedAt: sub.creationTimeSeconds,
        });
      }
    }

    const payload = {
      handle: cleanHandle,
      totalSolved: chronologicalProblems.length,
      problems: chronologicalProblems,
    };

    cache.set(cacheKey, { timestamp: Date.now(), data: payload });

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Codeforces Submissions API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve problem history. Please try again." },
      { status: 500 }
    );
  }
}
