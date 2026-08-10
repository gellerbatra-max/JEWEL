import Image from "next/image";
import { FacetMark } from "@/components/FacetMark";

export default function OurStoryPage() {
  return (
    <div>
      <section className="relative h-[46vh] min-h-[320px]">
        <Image
          src="/images/story-asworn.jpg"
          alt="Taygerian jewellery, worn"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/25" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <FacetMark size={30} className="text-rose mb-5" />
          <p className="text-[11px] tracking-[0.2em] uppercase text-porcelain/90 mb-3">Our Story</p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight text-balance text-porcelain">
            An Island, Not a Footnote
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="space-y-6 text-lg text-stone leading-relaxed">
          <p>
            Every heritage jewellery house sells lineage, a signature motif, and control over the
            object&rsquo;s origin story. Cartier, Bulgari, Tiffany, and Van Cleef &amp; Arpels buy
            colored stones on the open market — none can make a geographic-origin claim as credible
            as a house that owns the relationship with Ratnapura miners and in-house cutters.
          </p>
          <p>
            Ceylon-origin sapphires already carry a real market premium when backed by a lab origin
            report. Right now, dealers and auction houses capture that premium. We capture it
            directly, and build the whole identity around it — every signature piece ships with a
            lab origin report and a house-issued provenance mark.
          </p>
          <p>
            The cutter and setter are credited by name or atelier — unlike stones bought anonymously
            on the open market. Modern craft, old material: contemporary design in gold, silver, and
            platinum, not costume-heritage pastiche.
          </p>
        </div>
        <p className="text-[12px] text-stone mt-14 border-t border-line pt-6 text-center">
          Placeholder copy for the working prototype.
        </p>
      </div>
    </div>
  );
}
