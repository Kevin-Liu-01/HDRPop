/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { ArrowRight, Camera, CircleCheck } from "lucide-react";

type DiagramKey = "linkedin" | "instagram" | "capture";

const diagrams: Record<DiagramKey, {
  label: string;
  logo?: string;
  steps: Array<{ action: string; title: string; note: string }>;
  takeaway: string;
}> = {
  linkedin: {
    label: "LinkedIn",
    logo: "/linkedin-in-logo.svg",
    steps: [
      { action: "Start", title: "SDR JPEG", note: "An ordinary image" },
      { action: "Tag", title: "Rec.2100 PQ", note: "Attach the HDR profile" },
      { action: "Result", title: "PQ JPEG", note: "HDR Pop’s download" },
    ],
    takeaway: "Use the PQ JPEG from HDR Pop. This route is the most likely to survive a custom LinkedIn image upload.",
  },
  instagram: {
    label: "Instagram",
    logo: "/instagram-logo-thesvg.svg",
    steps: [
      { action: "Start", title: "SDR image", note: "The visible fallback" },
      { action: "Add", title: "Gain map", note: "Brightness instructions" },
      { action: "Result", title: "Ultra HDR", note: "A gain-map JPEG" },
    ],
    takeaway: "Instagram expects Ultra HDR rather than HDR Pop’s PQ file. Editing the post in Instagram can strip the gain map.",
  },
  capture: {
    label: "Screenshot",
    steps: [
      { action: "Display", title: "HDR page", note: "Extra light on screen" },
      { action: "Compress", title: "Tone map", note: "Fit into SDR range" },
      { action: "Result", title: "SDR capture", note: "The pop disappears" },
    ],
    takeaway: "A screenshot compresses the highlight back toward ordinary white. Open the live page on an XDR display to see it.",
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
          HDR is not one universal file format. Pick a destination to see what it needs: HDR Pop creates the
          LinkedIn-style PQ JPEG, Instagram expects Ultra HDR, and screenshots usually flatten both into SDR.
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
              <span className="diagram-tab-icon" aria-hidden="true">
                {diagrams[key].logo
                  ? <img src={diagrams[key].logo} alt="" />
                  : <Camera size={19} strokeWidth={1.8} />}
              </span>
              {diagrams[key].label}
            </button>
          ))}
        </div>

        <div className="pipeline" aria-live="polite">
          {active.steps.map((step, index) => (
            <div className="pipeline-fragment" key={step.title}>
              <div className="pipeline-step">
                <span className="pipeline-index">{step.action}</span>
                <strong>{step.title}</strong>
                <small>{step.note}</small>
              </div>
              {index < active.steps.length - 1 && (
                <span className="pipeline-arrow" aria-hidden="true"><ArrowRight size={20} /></span>
              )}
            </div>
          ))}
        </div>
        <p className="diagram-takeaway">
          <CircleCheck size={17} aria-hidden="true" />
          <span><strong>{active.label}:</strong> {active.takeaway}</span>
        </p>
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
