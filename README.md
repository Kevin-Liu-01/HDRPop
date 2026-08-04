# HDR Pop — the extra-bright marketing trick

A browser-based campaign tool that assigns a Rec.2020/PQ ICC profile to ordinary JPEG pixels, creating unusually bright logos and highlights on compatible HDR/EDR displays.

**Live:** [hdr.kevinliu.studio](https://hdr.kevinliu.studio/)

## Run locally

```sh
npm install
npm run dev
```

Open the app directly on a MacBook Pro XDR screen to see the effect. Screenshots commonly tone-map the HDR and SDR previews until they look alike.

## Features

- Drag/drop and file picker
- Paste images from the clipboard
- Import public image URLs through a guarded proxy
- HEIC/HEIF conversion
- Local JPEG rendering and ICC injection
- Overlaid HDR/SDR comparison scrubber
- Live LinkedIn-style context mockup
- Platform-format guidance and responsible-use notes
- PQ-tagged HDR display mark
- Code-generated Open Graph preview

## Credits

The marketing and platform notes are informed by Tom Nick's article [Why some images look brighter than your screen](https://tn1ck.com/blog/abuse-hdr-images-for-marketing). The LinkedIn-style preview is original UI informed by the profile structure of [Netly](https://github.com/tifa2UP/Netly), an MIT-licensed open-source LinkedIn clone. Visual system cues were studied from [Prototemplate](https://prototemplate.vercel.app/).
