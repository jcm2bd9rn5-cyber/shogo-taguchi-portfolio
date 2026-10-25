import { KoiCanvas } from "@/components/KoiCanvas";
import { MotionSystem } from "@/components/MotionSystem";
import { SelectedWorks } from "@/components/SelectedWorks";
import { TechStack } from "@/components/TechStack";

export default function Home() {
  return (
    <>
      <MotionSystem />
      <div className="page-wipe" aria-hidden="true">
        <div className="intro-grid" />
        <div className="intro-signature">
          <span>SHOGO TAGUCHI</span>
          <span>PORTFOLIO / TOKYO</span>
        </div>
        <div className="intro-status">
          <span>INITIALIZING KOI SYSTEM</span>
          <span>01—04</span>
        </div>
        <div className="intro-scan" />
      </div>
      <KoiCanvas className="ambient-koi" />
      <a className="skip-link" href="#works">制作物へ移動</a>
      <main>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-vignette" aria-hidden="true" />

          <header className="site-header">
            <a className="wordmark" href="#top" aria-label="ページ上部へ" data-magnetic>SHOGO TAGUCHI</a>
            <nav aria-label="メインナビゲーション">
              <a className="u373-link" href="#works">制作物</a>
              <a className="u373-link nav-secondary" href="#stack">技術</a>
              <a className="u373-link" href="https://github.com/jcm2bd9rn5-cyber" target="_blank" rel="noreferrer">GitHub ↗</a>
            </nav>
          </header>

          <div className="hero-copy hero-profile-layout">
            <div className="hero-identity">
              <p className="hero-kicker"><span>PORTFOLIO / 2026</span></p>
              <div className="hero-title-mask">
                <h1 id="hero-title">田口 <span>将伍</span></h1>
              </div>
              <a className="hero-link u373-link" href="#works" data-magnetic>制作物を見る <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-profile-copy">
              <p className="hero-profile-lead">東京電機大学 情報システム工学科に在籍する学生エンジニアです。</p>
              <p>身近な課題を起点に、企画・設計・実装・公開・改善まで取り組んでいます。</p>
              <dl className="hero-facts">
                <div><dt>ROLE</dt><dd>Student Developer</dd></div>
                <div><dt>BASE</dt><dd>Tokyo</dd></div>
                <div><dt>FOCUS</dt><dd>Mobile Product</dd></div>
                <div><dt>GRADUATION</dt><dd>2028</dd></div>
              </dl>
            </div>
          </div>

          <div className="hero-spec" aria-hidden="true">
            <span className="hero-live">LIVE</span>
            <span>KOI SYSTEM</span>
            <span>20 NODE</span>
            <span>60 HZ</span>
          </div>
          <div className="hero-coordinates" aria-hidden="true">
            <span>35.6762° N</span>
            <span>139.6503° E</span>
          </div>
        </section>

        <section className="works" id="works" aria-labelledby="works-title">
          <div className="works-intro" data-reveal>
            <span>01</span>
            <h2 id="works-title">制作物</h2>
            <p>Selected projects / 2025—2026</p>
          </div>
          <SelectedWorks />
        </section>

        <section className="stack" id="stack" aria-labelledby="stack-title">
          <div className="section-frame">
            <div className="section-label" data-reveal>
              <span>02</span>
              <span>TOOLKIT</span>
            </div>
            <div className="stack-heading" data-reveal>
              <h2 id="stack-title">技術スタック</h2>
              <p>実際の制作で使っている技術。</p>
            </div>
            <TechStack />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-meta">
          <span>田口 将伍</span>
          <a className="u373-link" href="https://github.com/jcm2bd9rn5-cyber" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a className="footer-top u373-link" href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
    </>
  );
}
