const UA = "PoopFare/1.0 (satire; educational; +https://poopfare.com)";

export async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "application/json" },
      });
      if (res.status === 429) {
        await sleep(1000 * (i + 1));
        continue;
      }
      if (!res.ok) return null;
      return await res.json();
    } catch {
      await sleep(500);
    }
  }
  return null;
}

function commonsFileUrl(filename) {
  const normalized = filename.replace(/^File:/i, "").trim();
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(normalized.replace(/ /g, "_"))}?width=400`;
}

export async function wikiSummaryPhoto(title) {
  const encoded = encodeURIComponent(title.replace(/ /g, "_"));
  const data = await fetchJson(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`,
  );
  return data?.thumbnail?.source ?? null;
}

export async function wikiPageImage(title) {
  const data = await fetchJson(
    `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title.replace(/ /g, "_"))}&prop=pageimages&format=json&pithumbsize=400&pilicense=any`,
  );
  if (!data?.query?.pages) return null;
  const page = Object.values(data.query.pages)[0];
  if (page?.missing !== undefined) return null;
  return page?.thumbnail?.source ?? null;
}

export async function wikiSearchTitles(name, limit = 5) {
  const data = await fetchJson(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&srlimit=${limit}&format=json`,
  );
  return (data?.query?.search ?? []).map((r) => r.title);
}

export async function wikidataPhoto(name) {
  const search = await fetchJson(
    `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&format=json&limit=3`,
  );
  const ids = (search?.search ?? []).map((e) => e.id).filter(Boolean);
  for (const id of ids) {
    const entity = await fetchJson(
      `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`,
    );
    const claims = entity?.entities?.[id]?.claims?.P18;
    const file = claims?.[0]?.mainsnak?.datavalue?.value;
    if (typeof file === "string" && file.length > 0) {
      return commonsFileUrl(file);
    }
  }
  return null;
}

function isLikelyLogo(url) {
  if (!url) return true;
  const u = url.toLowerCase();
  return u.includes("logo") || u.endsWith(".svg") || u.includes("/svg/");
}

/** Try every reasonable source until we get a real portrait photo URL. */
export async function fetchPersonPhoto(name, wikiTitle) {
  const titles = [...new Set([wikiTitle, name].filter(Boolean))];

  for (const title of titles) {
    const summary = await wikiSummaryPhoto(title);
    if (summary && !isLikelyLogo(summary)) return summary;
    await sleep(150);

    const pageImg = await wikiPageImage(title);
    if (pageImg && !isLikelyLogo(pageImg)) return pageImg;
    await sleep(150);
  }

  const searchHits = await wikiSearchTitles(name);
  for (const hit of searchHits) {
    if (titles.includes(hit)) continue;
    const summary = await wikiSummaryPhoto(hit);
    if (summary && !isLikelyLogo(summary)) return summary;
    const pageImg = await wikiPageImage(hit);
    if (pageImg && !isLikelyLogo(pageImg)) return pageImg;
    await sleep(150);
  }

  const wd = await wikidataPhoto(name);
  if (wd && !isLikelyLogo(wd)) return wd;

  if (wikiTitle && wikiTitle !== name) {
    const wd2 = await wikidataPhoto(wikiTitle);
    if (wd2 && !isLikelyLogo(wd2)) return wd2;
  }

  return null;
}
