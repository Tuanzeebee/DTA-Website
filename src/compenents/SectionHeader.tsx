import React from "react";
import { ScrollReveal } from "./ScrollReveal";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <ScrollReveal className="max-w-3xl mb-10 md:mb-14">
      {eyebrow && (
        <div className="text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.25em] font-bold text-accent uppercase mb-3 md:mb-4 leading-relaxed">
          {eyebrow}
        </div>
      )}
      <h2 className="display text-2xl sm:text-3xl md:text-5xl font-black leading-[1.35] py-1 overflow-visible">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 md:mt-5 text-sm md:text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}

/**
 * Verifiable credentials shown beside the mission statement.
 *
 * Sources: regulatory bodies as listed in the footer, the non-profit clause in
 * Article 10 of the charter, and the live member directory. The directory
 * counts are derived rather than hard-coded so they cannot drift out of date.
 */
