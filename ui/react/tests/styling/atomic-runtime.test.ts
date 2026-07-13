import { beforeEach, describe, expect, it } from 'vitest';
import {
  getSXStyleSheetText,
  resetSXStyleSheet,
  sx,
  xstyle,
} from '../../src/styling/atomic-runtime';

describe('atomic styling runtime', () => {
  beforeEach(() => resetSXStyleSheet());

  it('uses px only for numeric length properties', () => {
    sx({ width: 12, marginTop: -4, opacity: 0.5, lineHeight: 1.4, zIndex: 3, transitionDuration: 180, rotate: 15 });
    const css = getSXStyleSheetText();
    expect(css).toContain('width:12px');
    expect(css).toContain('margin-top:-4px');
    expect(css).toContain('opacity:0.5');
    expect(css).toContain('line-height:1.4');
    expect(css).toContain('z-index:3');
    expect(css).toContain('transition-duration:180ms');
    expect(css).toContain('rotate:15deg');
  });

  it('rejects unsafe properties, conditions, selectors, values, and non-finite numbers', () => {
    expect(() => sx({ 'color;display': 'none' })).toThrow(TypeError);
    expect(() => sx({ '@import url(example.invalid)': { color: 'red' } })).toThrow(TypeError);
    expect(() => sx({ 'body{}': { color: 'red' } })).toThrow(TypeError);
    expect(() => sx({ color: 'red;display:none' })).toThrow(TypeError);
    expect(() => sx({ width: Number.POSITIVE_INFINITY })).toThrow(TypeError);
  });

  it('collects deterministic nested and conditional rules for SSR', () => {
    const result = sx({
      color: 'white',
      '&:hover': { opacity: 0.8 },
      '@media (min-width: 800px)': { width: 320 },
    });
    const css = getSXStyleSheetText();
    expect(result.className.split(' ')).toHaveLength(3);
    expect(css).toContain(':hover{opacity:0.8}');
    expect(css).toContain('@media (min-width: 800px)');
    expect(css).toContain('width:320px');
  });

  it('deep merges conditions with last-value precedence', () => {
    expect(xstyle(
      { color: 'white', '&:hover': { opacity: 0.5, color: 'red' } },
      { '&:hover': { opacity: 1 } },
    )).toEqual({ color: 'white', '&:hover': { opacity: 1, color: 'red' } });
  });
});
