# Admin Console Quiet

Chrome extension that hides the animated prompt examples in the Google
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

The order is the other way around on your build. In `quiet.js`, change the tag
condition from `i === 0` to `i === inputs.length - 1`.
