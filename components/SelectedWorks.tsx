const works = [
  {
    name: "Strive",
    description: "筋トレを記録し、成長を可視化するアプリ。",
    href: "https://strive-lp-xi.vercel.app/",
    url: "strive-lp-xi.vercel.app",
  },
  {
    name: "GuruMeet",
    description: "みんなでスワイプして、行きたい店を決めるサービス。",
    href: "https://lp.gurumeet.net/",
    url: "lp.gurumeet.net",
  },
] as const;

export function SelectedWorks() {
  return (
    <div className="work-index" data-reveal>
      <div className="work-index-heading" aria-hidden="true">
        <span>SELECTED WORKS</span>
        <span>2025—2026</span>
      </div>
      <ol className="work-list" aria-label="制作物一覧">
        {works.map((work, index) => (
          <li className="work-item" key={work.name} data-reveal style={{ "--reveal-delay": `${index * 100}ms` } as React.CSSProperties}>
            <a className="work-link" href={work.href} target="_blank" rel="noreferrer" data-magnetic>
              <span className="work-number">0{index + 1}</span>
              <span className="work-name">{work.name}</span>
              <span className="work-description">{work.description}</span>
              <span className="work-url">{work.url}</span>
              <span className="work-arrow" aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
