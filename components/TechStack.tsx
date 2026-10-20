import type { SimpleIcon } from "simple-icons";
import {
  siApple,
  siDart,
  siFirebase,
  siFlutter,
  siGithub,
  siJavascript,
  siNextdotjs,
  siReact,
  siRevenuecat,
  siSwift,
  siTypescript,
  siVercel,
} from "simple-icons";

type Technology = {
  name: string;
  icon: SimpleIcon;
};

const groups: ReadonlyArray<{ label: string; items: ReadonlyArray<Technology> }> = [
  {
    label: "LANGUAGE",
    items: [
      { name: "Dart", icon: siDart },
      { name: "Swift", icon: siSwift },
      { name: "TypeScript", icon: siTypescript },
      { name: "JavaScript", icon: siJavascript },
    ],
  },
  {
    label: "LIBRARY / FRAMEWORK",
    items: [
      { name: "Flutter", icon: siFlutter },
      { name: "SwiftUI", icon: siApple },
      { name: "React", icon: siReact },
      { name: "Next.js", icon: siNextdotjs },
    ],
  },
  {
    label: "OTHER",
    items: [
      { name: "Firebase", icon: siFirebase },
      { name: "RevenueCat", icon: siRevenuecat },
      { name: "GitHub", icon: siGithub },
      { name: "Vercel", icon: siVercel },
    ],
  },
] as const;

function BrandIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label={`${icon.title} icon`}>
      <path d={icon.path} />
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
          aria-labelledby={`tech-group-${groupIndex}`}
          data-reveal
        >
          <div className="tech-group-heading">
            <span>0{groupIndex + 1}</span>
            <h3 id={`tech-group-${groupIndex}`}>{group.label}</h3>
          </div>
          <ul className="tech-grid">
            {group.items.map((technology, itemIndex) => (
              <li
                key={technology.name}
                data-reveal
                style={{ "--reveal-delay": `${itemIndex * 70}ms` } as React.CSSProperties}
              >
                <BrandIcon icon={technology.icon} />
                <span>{technology.name}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
