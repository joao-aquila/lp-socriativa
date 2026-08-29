"use client";

import { useState } from "react";
import { Star } from "./Star";
import { Reveal } from "./Reveal";
import { faq } from "@/lib/faq";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-title" className="container-lp py-10 md:py-14">
      <Reveal>
        <h2 id="faq-title" className="headline text-center text-4xl sm:text-5xl">
          faq
        </h2>
      </Reveal>

      <div className="mx-auto mt-10 max-w-3xl">
        {faq.map((item, index) => {
          const expanded = open === index;

          return (
            <Reveal key={item.question} delay={index * 70}>
              <div className="border-b border-paper/15">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : index)}
                    aria-expanded={expanded}
                    aria-controls={`faq-panel-${index}`}
                    className="flex w-full items-center gap-4 py-6 text-left text-xl font-bold transition hover:text-white md:text-2xl"
                  >
                    <Star
                      className={`size-5 shrink-0 transition-transform duration-500 ${
                        expanded ? "rotate-[135deg] text-paper" : "text-paper/50"
                      }`}
                    />
                    <span className="flex-1">{item.question}</span>
                  </button>
                </h3>

                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-label={item.question}
                  inert={!expanded}
                  className="grid transition-[grid-template-rows] duration-400 ease-out"
                  style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pl-9 text-lg text-paper/75">{item.answer}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
