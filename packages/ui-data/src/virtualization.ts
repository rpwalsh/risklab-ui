export interface VirtualWindow {
  start: number;
  end: number;
  offsetTop: number;
  totalSize: number;
}

/** Fenwick-tree size index with logarithmic updates and offset lookup. */
export class VariableSizeIndex {
  private sizes: Float64Array;
  private tree: Float64Array;

  constructor(length: number, estimatedSize: number | ((index: number) => number)) {
    if (!Number.isInteger(length) || length < 0) throw new RangeError('length must be a non-negative integer');
    this.sizes = new Float64Array(length);
    this.tree = new Float64Array(length + 1);
    for (let index = 0; index < length; index += 1) {
      this.setSize(index, typeof estimatedSize === 'function' ? estimatedSize(index) : estimatedSize);
    }
  }

  get length(): number { return this.sizes.length; }
  get totalSize(): number { return this.prefix(this.length); }

  getSize(index: number): number {
    this.assertIndex(index);
    return this.sizes[index]!;
  }

  setSize(index: number, size: number): void {
    this.assertIndex(index);
    if (!Number.isFinite(size) || size < 0) throw new RangeError('size must be a non-negative finite number');
    const delta = size - this.sizes[index]!;
    this.sizes[index] = size;
    for (let cursor = index + 1; cursor < this.tree.length; cursor += cursor & -cursor) {
      this.tree[cursor] += delta;
    }
  }

  offsetAt(index: number): number {
    if (!Number.isInteger(index) || index < 0 || index > this.length) throw new RangeError('index out of range');
    return this.prefix(index);
  }

  indexAt(offset: number): number {
    if (this.length === 0) return -1;
    const target = Math.max(0, Math.min(offset, Math.max(0, this.totalSize - Number.EPSILON)));
    let index = 0;
    let accumulated = 0;
    let bit = 1;
    while ((bit << 1) <= this.length) bit <<= 1;
    for (; bit !== 0; bit >>= 1) {
      const next = index + bit;
      if (next <= this.length && accumulated + this.tree[next]! <= target) {
        index = next;
        accumulated += this.tree[next]!;
      }
    }
    return Math.min(index, this.length - 1);
  }

  window(scrollOffset: number, viewportSize: number, overscan = 2): VirtualWindow {
    if (this.length === 0) return { start: 0, end: 0, offsetTop: 0, totalSize: 0 };
    const first = this.indexAt(scrollOffset);
    const last = this.indexAt(scrollOffset + Math.max(0, viewportSize));
    const start = Math.max(0, first - Math.max(0, Math.floor(overscan)));
    const end = Math.min(this.length, last + Math.max(0, Math.floor(overscan)) + 1);
    return { start, end, offsetTop: this.offsetAt(start), totalSize: this.totalSize };
  }

  private prefix(count: number): number {
    let total = 0;
    for (let cursor = count; cursor > 0; cursor -= cursor & -cursor) total += this.tree[cursor]!;
    return total;
  }

  private assertIndex(index: number): void {
    if (!Number.isInteger(index) || index < 0 || index >= this.length) throw new RangeError('index out of range');
  }
}
