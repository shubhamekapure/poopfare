import { NextRequest, NextResponse } from "next/server";

const UA = "PoopFare/1.0 (satire; educational)";

async function fetchJson(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  return res.json();
}

function commonsFileUrl(filename: string) {
  const normalized = filename.replace(/^File:/i, "").trim();
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(normalized.replace(/ /g, "_"))}?width=400`;
}

async function wikiSummaryPhoto(title: string) {
  const encoded = encodeURIComponent(title.replace(/ /g, "_"));
  const data = await fetchJson(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`,
  );
  return (data?.thumbnail?.source as string) ?? null;
}

async function wikiPageImage(title: string) {
  const data = await fetchJson(
    `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title.replace(/ /g, "_"))}&prop=pageimages&format=json&pithumbsize=400&pilicense=any`,
  );
  if (!data?.query?.pages) return null;
  const page = Object.values(data.query.pages)[0] as {
    missing?: unknown;
    thumbnail?: { source?: string };
  };
  if (page?.missing !== undefined) return null;
  return page?.thumbnail?.source ?? null;
}

async function wikiSearchTitles(name: string) {
  const data = await fetchJson(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&srlimit=5&format=json`,
  );
  return ((data?.query?.search as { title: string }[]) ?? []).map((r) => r.title);
}

async function wikidataPhoto(name: string) {
  const search = await fetchJson(
    `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&format=json&limit=3`,
  );
  const ids = ((search?.search as { id: string }[]) ?? []).map((e) => e.id);
  for (const id of ids) {
    const entity = await fetchJson(
      `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`,
    );
    const claims = entity?.entities?.[id]?.claims?.P18;
    const file = claims?.[0]?.mainsnak?.datavalue?.value;
    if (typeof file === "string" && file.length > 0) return commonsFileUrl(file);
  }
  return null;
}

async function resolvePhoto(name: string, wiki?: string | null) {
  const titles = [...new Set([wiki, name].filter(Boolean))] as string[];

  for (const title of titles) {
    const s = await wikiSummaryPhoto(title);
    if (s) return s;
    const p = await wikiPageImage(title);
    if (p) return p;
  }

  for (const hit of await wikiSearchTitles(name)) {
    if (titles.includes(hit)) continue;
    const s = await wikiSummaryPhoto(hit);
    if (s) return s;
    const p = await wikiPageImage(hit);
    if (p) return p;
  }

  return (await wikidataPhoto(name)) ?? (wiki ? await wikidataPhoto(wiki) : null);
}

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  const wiki = req.nextUrl.searchParams.get("wiki");

  if (!name) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }

  const photoUrl = await resolvePhoto(name, wiki);
  if (!photoUrl) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(
    { photoUrl },
    { headers: { "Cache-Control": "public, max-age=86400" } },
  );
}
