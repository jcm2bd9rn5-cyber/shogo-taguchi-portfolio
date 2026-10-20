import Image from "next/image";

const works = [
  {
    name: "Strive",
    description: "筋トレを記録し、成長を可視化するアプリ。",
    href: "https://strive-lp-xi.vercel.app/",
    url: "公式サイトを見る",
    image: "/images/strive-ogp.jpg",
  },
  {
    name: "GuruMeet",
    description: "みんなでスワイプして、行きたいお店を決めるサービス。",
    href: "https://lp.gurumeet.net/",
    url: "公式サイトを見る",
    image: null,
  },
] as const;

export function SelectedWorks() {
  return (
    <ol className="portfolio-work-grid" aria-label="制作物一覧">
      {works.map((work, index) => (
        <li className="portfolio-work-card" key={work.name}>
          <a href={work.href} target="_blank" rel="noopener noreferrer" aria-label={`${work.name}の公式サイトを開く`}>
            <div className={`portfolio-work-media ${work.image ? "" : "portfolio-work-placeholder"}`}>
              {work.image ? (
                <Image src={work.image} alt="Striveのアプリ紹介画像" fill sizes="(max-width: 760px) 100vw, 50vw" style={{ objectFit: "cover" }} />
              ) : (
                <span aria-hidden="true">GuruMeet</span>
              )}
            </div>
            <div className="portfolio-work-details">
              <span className="portfolio-work-number">0{index + 1}</span>
              <h3>{work.name} <span aria-hidden="true">↗</span></h3>
              <p>{work.description}</p>
              <span className="portfolio-work-cta">{work.url}</span>
            </div>
          </a>
        </li>
      ))}
    </ol>
  );
}
