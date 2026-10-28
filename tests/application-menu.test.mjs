import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { test } from 'node:test';

const source = await readFile(new URL('../script.js', import.meta.url), 'utf8');
const slugs = ['wall-thickness', 'corrosion-mapping', 'weld-inspection', 'cp-survey', 'visual-condition-survey'];

function element(properties = {}) {
  const classes = new Set();
  return {
    attributes: {}, handlers: {}, children: [], dataset: {},
    classList: { contains: (name) => classes.has(name), remove: (name) => classes.delete(name),
      toggle(name, on) { if (on) classes.add(name); else classes.delete(name); } },
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, handler) { (this.handlers[name] ||= []).push(handler); },
    appendChild(child) { this.children.push(child); },
    querySelector() { return null; },
    ...properties,
  };
}

function setup(hash = '') {
  const cards = slugs.map((slug) => element({ dataset: { method: slug } }));
  const track = element({ children: cards, style: {} });
  const viewport = element({ scrollLeft: 700 });
  const slider = element({ querySelector: (selector) => selector === '.method-track' ? track : viewport });
  const section = element({ scrollIntoView() {} });
  const dots = element();
  const links = slugs.map((slug) => element({ href: `https://example.com/applications#${slug}` }));
  const location = { origin: 'https://example.com', pathname: '/applications', hash, href: `https://example.com/applications${hash}` };
  const window = { addEventListener() {}, matchMedia: () => ({ matches: false }) };
  const document = {
    querySelector(selector) {
      return { '.method-slider': slider, '.app-methods': section }[selector] || null;
    },
    querySelectorAll(selector) {
      if (selector === '.visual-dots, .method-dots') return [dots];
      if (selector === '.nav-menu a, .nav-cta' || selector === '.nav-menu a[href*="#"]') return links;
      return [];
    },
    createElement: () => element(),
  };
  vm.runInNewContext(source, {
    document, window, location, URL,
    history: { pushState(_state, _title, newHash) { location.hash = newHash; } },
  });
  return { cards, track, viewport, dots, links, location };
}

test('each application menu choice selects exactly its matching card', () => {
  const state = setup();
  for (const index of [1, 2, 3, 4, 0, 2]) {
    state.viewport.scrollLeft = 700;
    let prevented = false;
    const event = { button: 0, preventDefault() { prevented = true; } };
    state.links[index].handlers.click.forEach((handler) => handler(event));
    assert.equal(prevented, true, 'native fragment scrolling must be prevented');
    assert.equal(state.location.hash, `#${slugs[index]}`);
    assert.equal(state.viewport.scrollLeft, 0);
    assert.equal(state.track.style.transform, `translateX(-${index * 100}%)`);
    assert.deepEqual(state.cards.filter((card) => !card.inert).map((card) => card.dataset.method), [slugs[index]]);
    assert.equal(state.dots.children[index].attributes['aria-selected'], 'true');
  }
});

test('a direct link to each application initializes the matching card', () => {
  for (const [index, slug] of slugs.entries()) {
    const state = setup(`#${slug}`);
    assert.equal(state.track.style.transform, `translateX(-${index * 100}%)`);
    assert.equal(state.viewport.scrollLeft, 0);
    assert.equal(state.cards[index].inert, false);
  }
});

test('modified menu clicks retain normal new-tab behavior', () => {
  const state = setup();
  const event = { button: 0, ctrlKey: true, preventDefault() { assert.fail('must keep browser navigation'); } };
  state.links[2].handlers.click.forEach((handler) => handler(event));
  assert.equal(state.location.hash, '');
});
