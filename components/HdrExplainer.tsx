/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

type DiagramKey = "linkedin" | "instagram" | "capture";

const diagrams: Record<DiagramKey, {
  label: string;
  logo: string;
  steps: Array<{ title: string; note: string }>;
  takeaway: string;
}> = {
  linkedin: {
    label: "LinkedIn",
    logo: "in",
    steps: [
      { title: "SDR JPEG", note: "Ordinary pixels" },
      { title: "Rec.2100 PQ", note: "HDR color profile" },
      { title: "HDR JPEG", note: "This tool’s output" },
    ],
    takeaway: "This is the route Tom Nick found most likely to survive custom image uploads such as LinkedIn company logos.",
  },
  instagram: {
    label: "Instagram",
    logo: "◎",
    steps: [
      { title: "SDR JPEG", note: "Fallback image" },
      { title: "Gain map", note: "Where to add light" },
      { title: "Ultra HDR", note: "Different format" },
    ],
    takeaway: "Instagram feed posts generally use Ultra HDR instead. Editing the image inside Instagram can remove the effect.",
  },
  capture: {
    label: "Screenshot",
    logo: "⌘",
    steps: [
      { title: "HDR page", note: "Extra display light" },
      { title: "Tone map", note: "Compress luminance" },
      { title: "SDR capture", note: "The trick disappears" },
    ],
    takeaway: "A screenshot usually compresses the HDR highlight back into ordinary SDR white, which is why the live page matters.",
  },
};

export function HdrExplainer() {
  const [activeKey, setActiveKey] = useState<DiagramKey>("linkedin");
  const [headroom, setHeadroom] = useState(68);
  const active = diagrams[activeKey];

  return (
    <>
      <section className="read-section diagram-section">
        <h2>LinkedIn and Instagram take different files</h2>
        <p>
          This diagram is here because “HDR image” does not mean one universal file. LinkedIn and Instagram
          use different delivery paths, and any platform can strip or tone-map the HDR metadata. An SDR display
          has no extra brightness to reveal either—so yes, this trick does not work everywhere. Choose a
          destination below to see what it expects; HDR Pop creates the LinkedIn-style PQ-profile version.
        </p>

        <div className="diagram-tabs" role="tablist" aria-label="Choose a platform diagram">
          {(Object.keys(diagrams) as DiagramKey[]).map((key) => (
            <button
              key={key}
              className={activeKey === key ? "active" : ""}
              onClick={() => setActiveKey(key)}
              role="tab"
              aria-selected={activeKey === key}
            >
              <span>{diagrams[key].logo}</span>
              {diagrams[key].label}
            </button>
          ))}
        </div>

        <div className="pipeline" aria-live="polite">
          {active.steps.map((step, index) => (
            <div className="pipeline-fragment" key={step.title}>
              <div className="pipeline-step">
                <span className="pipeline-index">0{index + 1}</span>
                <strong>{step.title}</strong>
                <small>{step.note}</small>
              </div>
              {index < active.steps.length - 1 && <b aria-hidden="true">+</b>}
            </div>
          ))}
        </div>
        <p className="diagram-takeaway"><strong>{active.label}:</strong> {active.takeaway}</p>
      </section>

      <section className="read-section headroom-section">
        <div>
          <h2>How the extra headroom feels</h2>
          <p>
            These are two real files: an ordinary JPEG and the same Ghost image tagged with a Rec.2020/PQ
            profile. Move the slider to blend between them. On a compatible HDR display, the 100% end can
            produce light beyond page white; on SDR they may look the same.
          </p>
          <label htmlFor="headroom-range">
            HDR blend
            <output>{headroom}%</output>
          </label>
          <input
            id="headroom-range"
            type="range"
            min="0"
            max="100"
            value={headroom}
            onInput={(event) => setHeadroom(Number(event.currentTarget.value))}
            onChange={(event) => setHeadroom(Number(event.target.value))}
          />
        </div>

        <div className="headroom-demo" aria-label="Live SDR and HDR Ghost logo comparison against normal page white">
          <div className="mini-browser-bar"><i /><i /><i /><span>ordinary-feed.example</span></div>
          <div className="mini-feed">
            <div className="mini-copy"><i /><i /><i /></div>
            <div className="headroom-mark" aria-label={`${headroom}% HDR Ghost logo`}>
              <img className="sdr-asset" src="/ghost-logo-sdr.jpg" alt="" draggable={false} />
              <img
                className="hdr-asset headroom-hdr"
                src="/ghost-logo-hdr.jpg"
                alt=""
                draggable={false}
                style={{ opacity: headroom / 100 }}
              />
            </div>
            <div className="mini-copy"><i /><i /></div>
          </div>
          <span>PAGE WHITE</span>
        </div>
      </section>
    </>
  );
}
