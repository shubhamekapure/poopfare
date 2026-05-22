"use client";

import { useState } from "react";

interface ShareButtonsProps {
  text: string;
  url?: string;
}

export function ShareButtons({ text, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const fullText = url ? `${text}\n${url}` : text;

  const copy = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ text, url });
    } else {
      await copy();
    }
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`;

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={copy}
          className="rounded-full bg-amber-800 py-2.5 text-sm font-semibold text-white hover:bg-amber-900"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          type="button"
          onClick={nativeShare}
          className="rounded-full border-2 border-stone-900 py-2.5 text-sm font-semibold text-stone-900 hover:bg-stone-100"
        >
          Share
        </button>
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border-2 border-stone-300 py-2.5 text-center text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          Post on X
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border-2 border-stone-300 py-2.5 text-center text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
