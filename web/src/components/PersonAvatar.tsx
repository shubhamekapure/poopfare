"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Person } from "@/lib/types";

interface PersonAvatarProps {
  person: Person;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: { box: "h-12 w-12", px: 96 },
  md: { box: "h-20 w-20", px: 160 },
  lg: { box: "h-28 w-28", px: 224 },
  xl: { box: "h-32 w-32 sm:h-40 sm:w-40", px: 320 },
};

async function fetchPhotoFromApi(person: Person): Promise<string | null> {
  const params = new URLSearchParams({ name: person.name });
  if (person.wiki) params.set("wiki", person.wiki);
  const res = await fetch(`/api/person-photo?${params}`);
  if (!res.ok) return null;
  const data = (await res.json()) as { photoUrl?: string };
  return data.photoUrl ?? null;
}

export function PersonAvatar({ person, size = "md", className = "" }: PersonAvatarProps) {
  const s = sizes[size];
  const [src, setSrc] = useState<string | null>(person.photoUrl);
  const [loading, setLoading] = useState(!person.photoUrl);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (person.photoUrl) {
        setSrc(person.photoUrl);
        setLoading(false);
        return;
      }
      setLoading(true);
      const url = await fetchPhotoFromApi(person);
      if (!cancelled && url) setSrc(url);
      if (!cancelled) setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [person.id, person.photoUrl, person.name, person.wiki]);

  const handleError = async () => {
    if (src === person.photoUrl) {
      const fallback = await fetchPhotoFromApi(person);
      if (fallback && fallback !== src) setSrc(fallback);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-full bg-stone-200 shadow-md ring-2 ring-white ${s.box} ${className}`}
    >
      {loading && (
        <div className="absolute inset-0 animate-pulse bg-stone-300" aria-hidden />
      )}
      {src ? (
        <Image
          src={src}
          alt={person.name}
          width={s.px}
          height={s.px}
          className="h-full w-full object-cover object-top"
          unoptimized
          onError={handleError}
        />
      ) : (
        !loading && (
          <div className="flex h-full w-full items-center justify-center bg-stone-300 text-[10px] text-stone-500">
            …
          </div>
        )
      )}
    </div>
  );
}
