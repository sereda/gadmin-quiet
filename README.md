# Admin Console Quiet

Chrome extension that stops the animated prompt examples in the Google
Workspace admin console search bar.

## Install

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and pick this directory.
4. Reload any open `admin.google.com` tab.

Reload the extension from `chrome://extensions` after any edit here.

## How it works

The console renders two inputs whose aria-label starts with `Ask me anything`.
The first carries the cycling prompt examples, the second is the real search
box. `quiet.js` tags the first one and `quiet.css` hides it with `display:none`.

Class names in this console are obfuscated and change without notice, so the
aria-label is the anchor.

Two things keep it from misfiring:

- It never hides the only match. Early in a render, or if Google drops the
  decoy input, the single input present is the real search box.
- It re-checks on DOM changes, because the inputs do not exist at
  `document_start` and the console re-renders them on navigation.

## If the search box itself disappears

Then the order is the other way around on your build. In `quiet.js`, change the
tag condition from `i === 0` to `i === inputs.length - 1`.

## If the animation is still there

Run `probe.js` to see what is actually changing:

1. Open the admin console, open DevTools, go to **Console**.
2. Paste the contents of `probe.js` and press Return.
3. Wait 10 seconds and copy the printed JSON.

It lists the elements that changed most, with a selector path, sample text, and
an HTML snippet.

## Status

Written 2026-09-12.

- **0.1.0** — detected the animation by behavior instead of by selector. Did
  not work, and overrode the `placeholder` property only, leaving
  `setAttribute` open.
- **0.2.0** — targeted the aria-label and locked the placeholder both ways.
  Superseded before it was tried.
- **0.3.0** — hides the first of the two matching inputs. One script, one rule,
  no placeholder interception. Confirmed working on the live console.
