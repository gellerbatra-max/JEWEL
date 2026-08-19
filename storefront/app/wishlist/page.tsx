"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/components/WishlistProvider";
import { WishlistButton } from "@/components/WishlistButton";
import { formatPrice } from "@/lib/products";
import { waLink } from "@/lib/site";

export default function WishlistPage() {
  const { items, ready } = useWishlist();

  const enquiry =
    items.length > 0
      ? waLink(
          `Hi Taygerian, I'd like to enquire about these saved pieces:\n${items
            .map((i) => `• ${i.title}`)
            .join("\n")}`
        )
      : waLink("Hi Taygerian, I'd like to enquire about a piece.");

  return (
    <div className="mx-auto max-w-[1300px] px-6 py-16">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="mb-4 text-[11px] tracking-[0.2em] uppercase text-gold">Saved</p>
        <h1 className="font-display text-4xl text-ink sm:text-5xl">Your Pieces</h1>
        <p className="mt-4 text-lg leading-relaxed text-stone">
          The pieces you&apos;ve saved to return to. When you&apos;re ready, enquire about any of
          them — there&apos;s no obligation.
        </p>
      </div>

      {!ready ? null : items.length === 0 ? (
        <div className="text-center">
          <p className="text-ink">You haven&apos;t saved any pieces yet.</p>
          <p className="mt-2 text-[15px] text-stone">
            Tap the heart on any piece to keep it here.
          </p>
          <Link
            href="/jewellery"
            className="mt-6 inline-block bg-ink px-7 py-3 text-[12px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold"
          >
            Browse the collection
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div key={item.handle} className="group relative">
                <WishlistButton item={item} className="absolute right-2 top-2 z-10" />
                <Link href={`/products/${item.handle}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-cloud">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    ) : null}
                  </div>
                  <div className="pt-3 text-center">
                    <p className="font-display text-[17px] text-ink transition-colors group-hover:text-gold">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-stone">
                      {item.metal}
                      {item.stone && item.stone !== "—" ? ` · ${item.stone}` : ""}
                    </p>
                    <p className="mt-1.5 text-[13px] tabular-nums text-ink">
                      {item.oneOfAKind ? "Price on Request" : formatPrice(item.price, item.currency)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <a
              href={enquiry}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-ink px-8 py-3 text-[12px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold"
            >
              Enquire about these pieces
            </a>
          </div>
        </>
      )}
    </div>
  );
}
