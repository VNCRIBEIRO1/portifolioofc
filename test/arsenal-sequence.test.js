import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getArsenalCardOrigin,
  hideArsenalContent,
  revealArsenalContent,
} from '../src/animations/arsenal-sequence.js';

test('keeps Arsenal cards assigned to their directional offscreen origins', () => {
  const viewport = { width: 1200, height: 800 };

  assert.deepEqual(
    [0, 1, 2, 3, 4].map(index => getArsenalCardOrigin(index, viewport)),
    [
      { x: -1200, y: 0 },
      { x: 0, y: -800 },
      { x: -1200, y: 0 },
      { x: 0, y: 800 },
      { x: 0, y: 800 },
    ],
  );
});

test('decodes Arsenal title before card fly-in starts', async () => {
  const calls = [];
  const title = {
    _matrixReveal: {
      decode: async () => {
        calls.push('title');
      },
    },
  };
  const cards = Array.from({ length: 2 }, (_, index) => ({
    querySelectorAll: selector => (
      selector === '.matrix-reveal'
        ? [{
            _matrixReveal: {
              decode: () => {
                calls.push(`card-${index}`);
                return Promise.resolve();
              },
            },
          }]
        : []
    ),
  }));
  const section = {
    querySelector: selector => (selector === '.section-title.matrix-reveal' ? title : null),
    querySelectorAll: selector => (selector === '.bento-card' ? cards : []),
  };
  const fakeGsap = {
    delayedCall(_delay, callback) {
      callback();
    },
    to(targets, vars) {
      assert.equal(targets.length, 2);
      calls.push('cards');
      vars.onStart?.();
      vars.onComplete?.();
    },
  };

  await revealArsenalContent(section, fakeGsap, {
    afterTitleDelay: 0,
    cardTextDelay: 0,
    duration: 0,
  });

  assert.equal(calls[0], 'title');
  assert.ok(calls.indexOf('cards') > calls.indexOf('title'));
});

test('plays Arsenal exit back as card text erase, reverse card fly-out, then header erase', async () => {
  const calls = [];
  const cardText = {
    _matrixReveal: {
      erase: () => {
        calls.push('card-text-erase');
        return Promise.resolve();
      },
      reset: () => calls.push('card-text-reset'),
    },
  };
  const headerText = {
    _matrixReveal: {
      erase: () => {
        calls.push('header-erase');
        return Promise.resolve();
      },
      reset: () => calls.push('header-reset'),
    },
  };
  const grid = {
    querySelectorAll: selector => (selector === '.matrix-reveal' ? [cardText] : []),
  };
  const header = {
    querySelectorAll: selector => (selector === '.matrix-reveal' ? [headerText] : []),
  };
  const cards = [{}, {}];
  const section = {
    querySelector: selector => {
      if (selector === '.bento__grid') return grid;
      if (selector === '.section-header') return header;
      return null;
    },
    querySelectorAll: selector => {
      if (selector === '.bento-card') return cards;
      if (selector === '.matrix-reveal') return [headerText, cardText];
      return [];
    },
  };
  const fakeGsap = {
    to(_target, vars) {
      calls.push('card-out');
      vars.onComplete?.();
    },
  };

  await hideArsenalContent(section, fakeGsap);

  assert.ok(calls.indexOf('card-text-erase') < calls.indexOf('card-out'));
  assert.ok(calls.lastIndexOf('card-out') < calls.indexOf('header-erase'));
});
