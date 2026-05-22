export default function LegalPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-black text-stone-900">Legal Poop</h1>
      <p className="mt-2 text-amber-800 font-semibold">
        Purely satirical. No real poop is harmed in the making of this product.
      </p>

      <div className="prose prose-stone mt-8 space-y-6 text-stone-700">
        <section>
          <h2 className="text-xl font-bold text-stone-900">Satire Notice</h2>
          <p>
            PoopFare is a work of parody. All person descriptions, &ldquo;charges,&rdquo;
            and rankings are fictional satire about public figures, presented for
            comedic commentary. Nothing on this site constitutes factual accusation,
            endorsement of harassment, or call to real-world action.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900">Public Figures Only</h2>
          <p>
            Our editorial policy covers public figures only. We do not include private
            individuals, minors, or anyone whose inclusion could constitute targeted
            harassment. Edge cases are reviewed by humans who take satire seriously
            (and poop more seriously than they should).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900">Virtual Poop</h2>
          <p>
            Virtual poop has no monetary value. It cannot be bought, sold, traded,
            or redeemed. Any resemblance to real charitable giving is intentional
            parody and legally distinct from actual philanthropy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900">Trademark</h2>
          <p>
            &ldquo;PoopFare&rdquo; is a distinct satirical brand. Any similarity to
            other fare-themed empathy products is coincidental, comedic, and
            probably deserved.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900">Contact</h2>
          <p>
            For takedown requests or editorial concerns:{" "}
            <a href="mailto:legal@poopfare.com" className="text-amber-800 underline">
              legal@poopfare.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
