// The admin console renders two inputs whose aria-label starts with
// "Ask me anything". The first one carries the cycling prompt examples; the
// second is the real search box. Hiding the first stops the animation.
//
// Class names in this console are obfuscated and change without notice, so the
// aria-label is the anchor.

(() => {
  const SELECTOR = 'input[aria-label^="Ask me anything"]';
  const MARK = 'data-gadmin-quiet';

  const sweep = () => {
    const inputs = document.querySelectorAll(SELECTOR);

    // Never hide the only match. Early in a render, or if Google drops the
    // decoy, the single input present is the real search box.
    if (inputs.length < 2) {
      if (inputs.length === 1) inputs[0].removeAttribute(MARK);
      return;
    }

    inputs.forEach((input, i) => {
      if (i === 0) input.setAttribute(MARK, 'hidden');
      else input.removeAttribute(MARK);
    });
  };

  // The inputs do not exist at document_start, and the console re-renders them
  // on navigation, so keep watching.
  new MutationObserver(sweep).observe(document, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['aria-label']
  });

  sweep();
  document.addEventListener('DOMContentLoaded', sweep, { once: true });
})();
