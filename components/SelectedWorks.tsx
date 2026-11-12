const works = [
  {
    name: "Strive",
    description: "筋トレの記録から成長の可視化まで。自ら企画・開発し、iOS / Androidで公開。",
    href: "https://strive-lp-xi.vercel.app/",
    url: "OFFICIAL SITE",
    tags: ["Flutter", "Firebase", "iOS / Android"],
    award: null,
    compact: false,
  },
  {
    name: "GuruMeet",
    description: "みんなでスワイプして行きたい店を決める、チーム開発のサービス。",
    href: "https://lp.gurumeet.net/",
    url: "OFFICIAL SITE",
    tags: ["Flutter", "FastAPI", "チーム開発"],
    award: "サポーターズ賞 受賞",
    compact: false,
  },
  {
    name: "Construction Drawing Intelligence",
    description: "建設図面を自然言語で検索し、AI回答の根拠を原本まで追跡できるGrounded RAGシステム。",
    href: "https://github.com/jcm2bd9rn5-cyber/construction-drawing-intelligence",
    url: "GITHUB",
    tags: ["FastAPI", "pgvector", "Grounded RAG"],
    award: null,
    compact: true,
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
          <li className={"work-item" + (work.award ? " work-item--award" : "")} key={work.name} data-reveal style={{ "--reveal-delay": `${index * 100}ms` } as React.CSSProperties}>
            <a className="work-link" href={work.href} target="_blank" rel="noopener noreferrer" data-magnetic aria-label={`${work.name} を開く（新しいタブ）`}>
              <span className="work-number">0{index + 1}</span>
              <span className={`work-name${work.compact ? " work-name--compact" : ""}`}>{work.name}</span>
              <span className="work-details">
                {work.award && (
                  <span className="work-award" aria-label={"技育CAMP 2026 " + work.award}>
                    <span className="work-award-icon" aria-hidden="true">★</span>
                    <span className="work-award-copy"><small>技育CAMP 2026</small><strong>{work.award}</strong></span>
                  </span>
                )}
                <span className="work-description">{work.description}</span>
                <span className="work-tags" aria-label="技術と実績">
                  {work.tags.map((tag) => <span className="work-tag" key={tag}>{tag}</span>)}
                </span>
              </span>
              <span className="work-url">{work.url}</span>
              <span className="work-arrow" aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
