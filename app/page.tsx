/* eslint-disable @next/next/no-img-element */
import { ExternalLink } from "lucide-react";
import { HdrExplainer } from "@/components/HdrExplainer";
import { HdrStudio } from "@/components/HdrStudio";

export default function Home() {
  return (
    <main className="article-page">
      <header className="simple-nav">
        <a className="brand" href="#top" aria-label="HDR Pop home">
          <img className="brand-logo hdr-asset" src="/hdr-pop-logo-hdr.jpg" alt="" />
          <span>hdr/pop</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#make">demo</a>
          <a href="#story">read</a>
          <a href="https://tn1ck.com/blog/abuse-hdr-images-for-marketing" target="_blank" rel="noreferrer">source ↗</a>
        </nav>
      </header>

      <section className="post-header" id="top">
        <h1>
          Why a{" "}
          <a
            className="title-linkedin-logo"
            href="https://www.linkedin.com/in/jackyhuang13/"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Jacky Huang’s LinkedIn profile"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0h.01Z" />
            </svg>
          </a>{" "}
          LinkedIn logo looked brighter than the rest of my screen:{" "}
          <img
            className="title-ghost-logo hdr-asset"
            src="/ghost-logo-hdr.jpg"
            alt="the uberbright Ghost logo"
            draggable={false}
          />
        </h1>
        <p className="post-lede">
          I was looking at <a className="inline-person" href="https://www.linkedin.com/in/jackyhuang13/" target="_blank" rel="noreferrer">
            <img src="/jacky-huang-pfp.png" alt="" />
            <span>Jacky Huang’s profile</span>
          </a> when
          the white Ghost logo seemed to make everything around it look dimmer. A screenshot looked completely normal.
          This is the small experiment that followed.
        </p>
        <p className="post-byline">August 2026 · 4 minute read</p>
      </section>

      <div className="rail-spacer" aria-hidden="true" />
      <HdrStudio />
      <div className="rail-spacer" aria-hidden="true" />

      <article className="readthrough" id="story">
        <section className="read-section">
          <h2>What I noticed</h2>
          <p>
            The logo was not merely a cleaner white. On my MacBook display it appeared to produce more light
            than LinkedIn’s own white cards. When the logo entered the viewport, the surrounding page seemed
            to recede. When it left, the page looked normal again.
          </p>
          <p>
            Here is what was actually happening. The JPEG’s visible RGB values had not been redrawn; its embedded
            color profile told the browser to interpret them as Rec.2020 with a PQ transfer curve. Under PQ, values
            near white describe HDR light levels rather than ordinary SDR white. Once the browser handed that image
            to macOS, the logo and the surrounding page were no longer being rendered in the same brightness range.
          </p>
          <p>
            Apple calls the gap between SDR white and the display’s brightest available white <a href="https://developer.apple.com/documentation/uikit/uiscreen/currentedrheadroom" target="_blank" rel="noreferrer">EDR headroom</a>.
            LinkedIn’s interface remained at SDR reference white while the Ghost logo could be mapped above it.
            There was no dark overlay on the website: macOS could reserve part of the display’s range for the HDR
            highlight, and my eyes judged the unchanged page white against a much brighter neighbor, making the page
            appear to recede.
          </p>
          <p>
            The screenshot took a different path. Saving or viewing it as an ordinary SDR image tone-mapped the mixed
            scene into a smaller range, compressing the Ghost’s “super-white” back toward normal white. The trick only
            survives when the site preserves the profile, the browser <a href="https://webkit.org/blog/16993/news-from-wwdc25-web-technology-coming-this-fall-in-safari-26-beta/" target="_blank" rel="noreferrer">renders HDR still images</a>, the display reports
            usable headroom, and the operating system allows it.
          </p>
        </section>

        <HdrExplainer />

        <section className="read-section practical-note">
          <h2>Why this works as marketing</h2>
          <p>
            It creates visual priority before the message is read. That makes a simple logo unusually effective,
            but I would keep it to one small highlight. Essential information should remain readable in SDR, and
            the real file needs to be tested on the real platform because sites can strip the metadata at any time.
          </p>
        </section>

        <section className="source-section">
          <h2>People and references</h2>
          <div className="source-list">
            <a href="https://www.linkedin.com/in/jackyhuang13/" target="_blank" rel="noreferrer">
              <img className="source-avatar" src="/jacky-huang-pfp.png" alt="" />
              <span><strong>Jacky Huang</strong><small>The Ghost logo on his LinkedIn profile started this investigation.</small></span>
              <ExternalLink size={17} />
            </a>
            <a href="https://tn1ck.com/blog/abuse-hdr-images-for-marketing" target="_blank" rel="noreferrer">
              <span className="source-logo source-tn">TN</span>
              <span><strong>Tom Nick</strong><small>Wrote the field report and documented the platform differences.</small></span>
              <ExternalLink size={17} />
            </a>
            <a href="https://github.com/shigedangao/lymui" target="_blank" rel="noreferrer">
              <span className="source-logo source-code">&lt;/&gt;</span>
              <span><strong>lymui</strong><small>Open-source reference for mapping images into HDR color space.</small></span>
              <ExternalLink size={17} />
            </a>
            <a href="https://github.com/tifa2UP/Netly" target="_blank" rel="noreferrer">
              <span className="source-logo source-netly">N</span>
              <span><strong>Netly</strong><small>MIT-licensed structural reference for the LinkedIn-style mockup.</small></span>
              <ExternalLink size={17} />
            </a>
          </div>
        </section>
      </article>

      <footer className="simple-footer">
        <strong>hdr/pop</strong>
        <span>Local-first · experimental · screenshots may lie</span>
      </footer>
    </main>
  );
}
