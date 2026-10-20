import { KoiCanvas } from "@/components/KoiCanvas";
import { SelectedWorks } from "@/components/SelectedWorks";

export default function Home() {
  return (
    <>
      <KoiCanvas className="ambient-koi" />
      <a className="skip-link" href="#works">制作物へ移動</a>
      <main>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-vignette" aria-hidden="true" />
          <header className="site-header">
            <a className="wordmark" href="#top" aria-label="ページ上部へ">SHOGO</a>
            <nav aria-label="メインナビゲーション">
              <a className="u373-link" href="#works">制作物</a>
              <a className="u373-link" href="https://github.com/jcm2bd9rn5-cyber" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            </nav>
          </header>
          <div className="hero-copy portfolio-hero-copy">
            <p className="portfolio-eyebrow">PORTFOLIO</p>
            <h1 id="hero-title">田口 将伍</h1>
            <p className="portfolio-intro">個人開発をしています。</p>
            <a className="hero-link u373-link" href="#works">制作物を見る <span aria-hidden="true">↓</span></a>
          </div>
        </section>
        <section className="works portfolio-works" id="works" aria-labelledby="works-title">
          <div className="works-intro"><span>01</span><h2 id="works-title">制作物</h2></div>
          <SelectedWorks />
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-meta">
          <span>田口 将伍</span>
          <a className="u373-link" href="https://github.com/jcm2bd9rn5-cyber" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <span>© 2026</span>
        </div>
      </footer>
    </>
  );
}
