// Letter-by-letter typewriter that preserves inline HTML (b/em/i for syntax highlight)
const CHAR_DELAY = 38;     // ms per character
const LINE_PAUSE = 220;    // pause between lines
const FINAL_PAUSE = 4200;  // pause after all lines typed before restart

export function initTerminalTypewriter() {
  document.querySelectorAll('.bento-card__terminal').forEach(setupTerminal);
}

function setupTerminal(terminal) {
  const lines = Array.from(terminal.querySelectorAll('.t-line'));
  if (!lines.length) return;

  // Snapshot original HTML; we'll progressively rebuild it
  const snapshots = lines.map(line => line.innerHTML);
  const lengths = lines.map(line => getTextLength(line.innerHTML));

  // Reset
  lines.forEach(line => {
    line.style.minHeight = '1.4em';
    line.innerHTML = '';
  });

  let lineIdx = 0;
  let charCount = 0;

  function tick() {
    if (lineIdx >= lines.length) {
      // Finished all lines — pause then restart
      setTimeout(() => {
        lines.forEach(l => { l.innerHTML = ''; });
        lineIdx = 0;
        charCount = 0;
        tick();
      }, FINAL_PAUSE);
      return;
    }

    const target = lengths[lineIdx];
    if (charCount < target) {
      charCount++;
      lines[lineIdx].innerHTML = sliceHTML(snapshots[lineIdx], charCount);
      setTimeout(tick, CHAR_DELAY + Math.random() * 25);
    } else {
      // Restore full HTML for current line, advance
      lines[lineIdx].innerHTML = snapshots[lineIdx];
      lineIdx++;
      charCount = 0;
      setTimeout(tick, LINE_PAUSE);
    }
  }

  setTimeout(tick, 600);
}

function getTextLength(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent.length;
}

// Returns HTML containing the first N visible characters, preserving tag structure
function sliceHTML(html, n) {
  const source = document.createElement('div');
  source.innerHTML = html;
  const out = document.createElement('div');
  let remaining = n;

  function clone(node, parent) {
    if (remaining <= 0) return;
    if (node.nodeType === 3) { // text
      const text = node.textContent;
      if (text.length <= remaining) {
        parent.appendChild(document.createTextNode(text));
        remaining -= text.length;
      } else {
        parent.appendChild(document.createTextNode(text.slice(0, remaining)));
        remaining = 0;
      }
    } else if (node.nodeType === 1) { // element
      const newEl = node.cloneNode(false); // shallow
      parent.appendChild(newEl);
      for (const child of Array.from(node.childNodes)) {
        if (remaining <= 0) break;
        clone(child, newEl);
      }
    }
  }

  for (const child of Array.from(source.childNodes)) {
    if (remaining <= 0) break;
    clone(child, out);
  }

  return out.innerHTML;
}
