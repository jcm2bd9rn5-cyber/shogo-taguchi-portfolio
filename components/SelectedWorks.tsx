const works = [
  {
    name: "Strive",
    category: "01 / INDEPENDENT PRODUCT",
    description: "筋トレの記録から成長の可視化まで。自ら企画・開発し、App Storeで公開。",
    href: "https://strive-lp-xi.vercel.app/",
    url: "OFFICIAL SITE",
    tags: ["Flutter", "Firebase", "App Store公開"],
  },
  {
    name: "GuruMeet",
    category: "02 / TEAM PROJECT",
    description: "みんなでスワイプして行きたい店を決める、チーム開発のサービス。",
    href: "https://lp.gurumeet.net/",
    url: "OFFICIAL SITE",
    tags: ["Flutter", "FastAPI", "ハッカソン受賞"],
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
          <li className="work-item" data-work={work.name} key={work.name} data-reveal style={{ "--reveal-delay": `${index * 100}ms` } as React.CSSProperties}>
            <a className="work-link" href={work.href} target="_blank" rel="noopener noreferrer" data-magnetic aria-label={`${work.name} の公式サイトを開く（新しいタブ）`}>
              <span className="work-number">0{index + 1}</span>
              <span className="work-name-wrap"><span className="work-category">{work.category}</span><span className="work-name">{work.name}</span></span>
              <span className="work-details">
                <span className="work-description">{work.description}</span>
                <span className="work-tags" aria-label="技術と実績">
                  {work.tags.map((tag) => <span className="work-tag" key={tag}>{tag}</span>)}
                </span>
              </span>
              <span className="work-url">{work.url}</span>
              <span className="work-action" aria-hidden="true"><span>EXPLORE</span><span className="work-arrow">↗</span></span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
