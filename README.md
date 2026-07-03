# Birthday Card — Visual Energy Redesign

This branch (redesign/visual-energy) implements an enhanced "Visual Energy" redesign for the birthday card: floating hearts that respond to scroll, parallax depth, smooth page transitions, lively hover states, and improved typography and accessibility.

How to preview locally

1. Clone the repo and checkout the branch:

   git clone https://github.com/f90821017-arch/birthday-card.git
   cd birthday-card
   git checkout redesign/visual-energy

2. Serve locally (recommended so audio loads reliably):

   python -m http.server 8000

   Then open http://localhost:8000/index.html in a browser.

What changed

- index.html: refactored to load assets/styles.css and assets/script.js, added hearts layer and accessibility improvements.
- assets/styles.css: new stylesheet (Playfair Display + Inter, palette, animations, responsive rules).
- assets/script.js: heart animations, scroll-parallax, navigation fixes, audio handling and preference persistence.

Audio

- The page currently references a royalty-free piano track hosted on the Free Music Archive ("One Love" by Keys of Moon, CC BY 4.0). The audio is slowed slightly in playbackRate for a romantic feeling.
- If you want the audio file bundled into the repo (assets/audio/one-love-slow.mp3) with pitch-preserving time-stretch applied, provide the file or grant permission and I will preprocess and add it.

Attribution

Music: "One Love" by Keys of Moon — licensed under CC BY 4.0. Source: https://freemusicarchive.org/

Accessibility notes

- Animations respect prefers-reduced-motion.
- Page changes move focus to the active heading and a hidden aria-live region announces page changes for screen readers.
- Keyboard navigation: ArrowLeft/ArrowRight/PageUp/PageDown/Space keys supported for navigation.

Next steps and options

- Bundle a pitch-preserved slowed MP3 into assets/audio/ and update the <audio> source.
- Add a small visible play/pause/seek UI and volume slider.
- Tweak heart count, colors, and animation curves to taste.

If you want me to proceed with bundling the processed audio file into the repo and/or add a PR with the changes, tell me and I'll continue.