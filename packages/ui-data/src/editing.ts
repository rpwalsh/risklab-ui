export type RowId = string | number;

export interface CellChange<T> {
  rowId: RowId;
  field: Extract<keyof T, string>;
  previous: unknown;
  next: unknown;
}

export interface EditTransaction<T> {
  id: string;
  timestamp: number;
  changes: CellChange<T>[];
  label?: string;
}

export class DataEditHistory<T extends Record<string, unknown>> {
  private rows: T[];
  private readonly past: EditTransaction<T>[] = [];
  private readonly future: EditTransaction<T>[] = [];
  private sequence = 0;

  constructor(rows: readonly T[], private readonly getRowId: (row: T) => RowId) {
    this.rows = rows.map((row) => ({ ...row }));
  }

  get canUndo(): boolean { return this.past.length > 0; }
  get canRedo(): boolean { return this.future.length > 0; }
  snapshot(): readonly T[] { return this.rows.map((row) => ({ ...row })); }
  history(): readonly EditTransaction<T>[] { return [...this.past]; }

  update(rowId: RowId, patch: Partial<T>, label?: string): EditTransaction<T> | undefined {
    const row = this.rows.find((candidate) => this.getRowId(candidate) === rowId);
    if (!row) return undefined;
    const changes = Object.entries(patch).flatMap(([field, next]) => {
      const previous = row[field];
      return Object.is(previous, next) ? [] : [{ rowId, field: field as Extract<keyof T, string>, previous, next }];
    });
    if (changes.length === 0) return undefined;
    const transaction = { id: `edit-${++this.sequence}`, timestamp: Date.now(), changes, label };
    this.apply(transaction, 'forward');
    this.past.push(transaction);
    this.future.length = 0;
    return transaction;
  }

  batch(updates: Array<{ rowId: RowId; patch: Partial<T> }>, label?: string): EditTransaction<T> | undefined {
    const changes: CellChange<T>[] = [];
    for (const update of updates) {
      const row = this.rows.find((candidate) => this.getRowId(candidate) === update.rowId);
      if (!row) continue;
      for (const [field, next] of Object.entries(update.patch)) {
        const previous = row[field];
        if (!Object.is(previous, next)) changes.push({ rowId: update.rowId, field: field as Extract<keyof T, string>, previous, next });
      }
    }
    if (changes.length === 0) return undefined;
    const transaction = { id: `edit-${++this.sequence}`, timestamp: Date.now(), changes, label };
    this.apply(transaction, 'forward');
    this.past.push(transaction);
    this.future.length = 0;
    return transaction;
  }

  undo(): EditTransaction<T> | undefined {
    const transaction = this.past.pop();
    if (!transaction) return undefined;
    this.apply(transaction, 'reverse');
    this.future.push(transaction);
    return transaction;
  }

  redo(): EditTransaction<T> | undefined {
    const transaction = this.future.pop();
    if (!transaction) return undefined;
    this.apply(transaction, 'forward');
    this.past.push(transaction);
    return transaction;
  }

  private apply(transaction: EditTransaction<T>, direction: 'forward' | 'reverse'): void {
    const changesByRow = new Map<RowId, CellChange<T>[]>();
    for (const change of transaction.changes) {
      const changes = changesByRow.get(change.rowId) ?? [];
      changes.push(change);
      changesByRow.set(change.rowId, changes);
    }
    this.rows = this.rows.map((row) => {
      const changes = changesByRow.get(this.getRowId(row));
      if (!changes) return row;
      const next = { ...row };
      for (const change of changes) next[change.field] = (direction === 'forward' ? change.next : change.previous) as T[Extract<keyof T, string>];
      return next;
    });
  }
}
