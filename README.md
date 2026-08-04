# HDR Pop

[![HDR Pop — Why LinkedIn Logos Look Brighter Than the Rest of The Page](https://hdr-pop.vercel.app/opengraph-image)](https://hdr-pop.vercel.app/)

Turn ordinary images into PQ-tagged HDR JPEGs, compare SDR and HDR live, and learn why some logos can look brighter than the page around them.

[Open HDR Pop](https://hdr-pop.vercel.app/) · [Canonical URL](https://hdr.kevinliu.studio/) · [Read the field note](https://hdr-pop.vercel.app/#story)

> Open the live page on a Mac, iPhone, or iPad with an XDR display. Screenshots usually tone-map the effect back into ordinary SDR.

## What it does

- Accepts drag-and-drop, clipboard paste, public image URLs, and a file picker
- Converts JPEG, PNG, WebP, GIF, HEIC, and HEIF images
- Creates a LinkedIn-style Rec.2020/PQ JPEG locally in the browser
- Compares the SDR and HDR versions with a draggable overlay
- Shows the result inside a full LinkedIn-style profile mockup
- Explains LinkedIn PQ, Instagram Ultra HDR, and screenshot tone mapping
- Downloads the converted JPEG without storing the uploaded image

## How it works

HDR Pop renders the source into an ordinary JPEG, then embeds a Rec.2020/PQ ICC profile. A compatible browser and HDR display can interpret the tagged image with luminance above ordinary page white, creating the apparent “pop.” The original visual content is not regenerated, and the exact result depends on the browser, platform pipeline, display, and brightness settings.

## Run locally

```sh
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Development

```sh
npm run lint
npm test -- --run
npm run build
```

## Credits

The marketing and platform notes are informed by Tom Nick's article [Why some images look brighter than your screen](https://tn1ck.com/blog/abuse-hdr-images-for-marketing). The LinkedIn-style preview is original UI informed by the profile structure of [Netly](https://github.com/tifa2UP/Netly), an MIT-licensed open-source LinkedIn clone. Visual system cues were studied from [Prototemplate](https://prototemplate.vercel.app/). The Instagram mark comes from [theSVG](https://thesvg.org/icon/instagram).

Built by [Kevin Liu](https://kevinliu.studio/).
