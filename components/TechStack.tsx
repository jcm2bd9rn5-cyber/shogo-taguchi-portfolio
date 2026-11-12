import type { SimpleIcon } from "simple-icons";
import { siRevenuecat } from "simple-icons";

type Technology =
  | { name: string; asset: string; brand?: never }
  | { name: string; brand: SimpleIcon; asset?: never };

const groups: ReadonlyArray<{ label: string; items: ReadonlyArray<Technology> }> = [
  {
    label: "LANGUAGES",
    items: [
      { name: "Dart", asset: "Dart-Dark.svg" },
      { name: "Swift", asset: "Swift.svg" },
      { name: "TypeScript", asset: "TypeScript.svg" },
      { name: "Python", asset: "Python-Dark.svg" },
      { name: "Java", asset: "Java-Dark.svg" },
      { name: "JavaScript", asset: "JavaScript.svg" },
    ],
  },
  {
    label: "FRAMEWORKS",
    items: [
      { name: "Flutter", asset: "Flutter-Dark.svg" },
      { name: "SwiftUI", asset: "Swift.svg" },
      { name: "React", asset: "React-Dark.svg" },
      { name: "Next.js", asset: "NextJS-Dark.svg" },
      { name: "FastAPI", asset: "FastAPI.svg" },
    ],
  },
  {
    label: "TOOLS / PLATFORM",
    items: [
      { name: "Firebase", asset: "Firebase-Dark.svg" },
      { name: "PostgreSQL", asset: "PostgreSQL-Dark.svg" },
      { name: "Docker", asset: "Docker.svg" },
      { name: "RevenueCat", brand: siRevenuecat },
      { name: "GitHub", asset: "Github-Dark.svg" },
      { name: "Vercel", asset: "Vercel-Dark.svg" },
    ],
  },
];

function SkillIcon({ technology }: { technology: Technology }) {
  if (typeof technology.asset === "string") {
    return (
      <img
        src={"/skill-icons/" + technology.asset}
        alt=""
        width={48}
        height={48}
        loading="lazy"
        decoding="async"
        aria-hidden="true"
      />
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" role="presentation">
      <path d={technology.brand.path} fill={"#" + technology.brand.hex} />
    </svg>
  );
}

export function TechStack() {
  return (
    <div className="tech-groups">
      {groups.map((group, groupIndex) => (
        <section
          className="tech-group"
          key={group.label}
          aria-labelledby={"tech-group-" + groupIndex}
          data-reveal
        >
          <div className="tech-group-heading">
            <span>0{groupIndex + 1}</span>
            <h3 id={"tech-group-" + groupIndex}>{group.label}</h3>
          </div>
          <ul className="tech-grid">
            {group.items.map((technology, itemIndex) => (
              <li
                key={technology.name}
                data-reveal
                style={{ "--reveal-delay": itemIndex * 55 + "ms" } as React.CSSProperties}
              >
                <span className="tech-icon-wrap"><SkillIcon technology={technology} /></span>
                <span className="tech-name">{technology.name}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
