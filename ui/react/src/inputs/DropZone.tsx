import React, { forwardRef, useState, useRef, useCallback, useId, useEffect } from 'react';
import type { ColorVariant } from '../styling/types';
import { cx } from '../styling/cx';
import { sx } from '../styling/stylex-compat';

/** Monotonic counter for deterministic file IDs (no Math.random). */
let _dropFileCounter = 0;

export interface DropZoneFile {
  file: File;
  preview?: string;
  id: string;
}

export interface DropZoneProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onDrop'> {
  accept?: string | string[];
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  onDrop?: (files: DropZoneFile[]) => void;
  onReject?: (rejections: Array<{ file: File; reason: string }>) => void;
  onChange?: (files: DropZoneFile[]) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  color?: ColorVariant;
  variant?: 'default' | 'compact' | 'minimal';
  preview?: boolean;
  clearable?: boolean;
  value?: DropZoneFile[];
  renderPreview?: (file: DropZoneFile, onRemove: () => void) => React.ReactNode;
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
  testId?: string;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const DropZone = forwardRef<HTMLDivElement, DropZoneProps>(function DropZone(
  {
    accept,
    multiple = true,
    maxSize,
    maxFiles,
    disabled = false,
    onDrop,
    onReject,
    onChange,
    label = 'Drop files here or click to browse',
    description,
    icon,
    color = 'primary',
    variant = 'default',
    preview = true,
    clearable = true,
    value: controlledFiles,
    renderPreview,
    xstyle,
    testId,
    className,
    style,
    ...rest
  },
  ref
) {
  const [internalFiles, setInternalFiles] = useState<DropZoneFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  const files = controlledFiles !== undefined ? controlledFiles : internalFiles;

  // Revoke blob URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      files.forEach(f => { if (f.preview) URL.revokeObjectURL(f.preview); });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptStr = Array.isArray(accept) ? accept.join(',') : accept;

  const processFiles = useCallback((rawFiles: FileList | File[]) => {
    const list = Array.from(rawFiles);
    const accepted: DropZoneFile[] = [];
    const rejected: Array<{ file: File; reason: string }> = [];
    setError(null);

    for (const file of list) {
      if (!multiple && accepted.length + files.length >= 1) {
        rejected.push({ file, reason: 'Only one file allowed' });
        continue;
      }
      if (maxFiles !== undefined && accepted.length + files.length >= maxFiles) {
        rejected.push({ file, reason: `Maximum ${maxFiles} files` });
        continue;
      }
      if (maxSize !== undefined && file.size > maxSize) {
        rejected.push({ file, reason: `File too large (max ${formatBytes(maxSize)})` });
        continue;
      }
      if (acceptStr) {
        const types = acceptStr.split(',').map(s => s.trim());
        const ok = types.some(t => {
          if (t.startsWith('.')) return file.name.toLowerCase().endsWith(t.toLowerCase());
          if (t.endsWith('/*')) return file.type.startsWith(t.slice(0, -2));
          return file.type === t;
        });
        if (!ok) { rejected.push({ file, reason: 'File type not accepted' }); continue; }
      }
      const dropFile: DropZoneFile = {
        file,
        id: `${uid}-${Date.now()}-${(++_dropFileCounter).toString(36)}`,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      };
      accepted.push(dropFile);
    }

    if (rejected.length > 0) {
      setError(rejected.map(r => `${r.file.name}: ${r.reason}`).join(', '));
      onReject?.(rejected);
    }

    if (accepted.length > 0) {
      const next = multiple ? [...files, ...accepted] : accepted;
      if (controlledFiles === undefined) setInternalFiles(next);
      onDrop?.(accepted);
      onChange?.(next);
    }
  }, [files, multiple, maxFiles, maxSize, acceptStr, uid, controlledFiles, onDrop, onReject, onChange]);

  const removeFile = useCallback((id: string) => {
    const file = files.find(f => f.id === id);
    if (file?.preview) URL.revokeObjectURL(file.preview);
    const next = files.filter(f => f.id !== id);
    if (controlledFiles === undefined) setInternalFiles(next);
    onChange?.(next);
  }, [files, controlledFiles, onChange]);

  const clearAll = useCallback(() => {
    files.forEach(f => { if (f.preview) URL.revokeObjectURL(f.preview); });
    if (controlledFiles === undefined) setInternalFiles([]);
    onChange?.([]);
  }, [files, controlledFiles, onChange]);

  const accentColor = `var(--ui-color-${color}, var(--ui-color-primary))`;
  const compact = variant === 'compact';
  const minimal = variant === 'minimal';
  const mergedExternalStyles = Array.isArray(xstyle)
    ? xstyle.reduce<Record<string, string | number>>((acc, entry) => (entry ? { ...acc, ...entry } : acc), {})
    : xstyle;
  const rootSx = sx({
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    ...(style as Record<string, string | number> | undefined),
    ...(mergedExternalStyles as Record<string, string | number> | undefined),
  });
  const dropAreaSx = sx({
    display: 'flex',
    flexDirection: compact ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: compact ? '12px' : '8px',
    padding: compact ? '12px 20px' : minimal ? '12px' : '32px 20px',
    border: `2px dashed ${dragging ? accentColor : error ? 'var(--ui-color-error)' : 'var(--ui-color-border, #e2e8f0)'}`,
    borderRadius: 'var(--ui-radius-lg, 12px)',
    background: dragging ? `color-mix(in srgb, ${accentColor} 6%, transparent)` : 'var(--ui-color-surface-variant, #f8fafc)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'border-color var(--ui-transition-fast), background var(--ui-transition-fast)',
    outline: 'none',
    textAlign: 'center',
    opacity: disabled ? 0.5 : 1,
  });
  const iconSx = sx({
    fontSize: compact ? '28px' : '40px',
    lineHeight: 1,
    color: dragging ? accentColor : 'var(--ui-color-text-secondary)',
  });
  const labelSx = sx({
    margin: 0,
    fontWeight: 500,
    color: dragging ? accentColor : 'var(--ui-color-text)',
    fontSize: 'var(--ui-text-sm, 14px)',
  });
  const subcopySx = sx({
    margin: '4px 0 0',
    fontSize: 'var(--ui-text-xs, 12px)',
    color: 'var(--ui-color-text-secondary)',
  });
  const hiddenInputSx = sx({ display: 'none' });
  const errorSx = sx({
    margin: 0,
    fontSize: 'var(--ui-text-xs, 12px)',
    color: 'var(--ui-color-error)',
  });
  const previewListSx = sx({ display: 'flex', flexDirection: 'column', gap: '8px' });
  const previewHeaderSx = sx({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
  const previewCountSx = sx({ fontSize: 'var(--ui-text-sm, 14px)', fontWeight: 500, color: 'var(--ui-color-text)' });
  const clearButtonSx = sx({ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ui-color-text-secondary)', fontSize: 'var(--ui-text-xs, 12px)' });
  const previewItemsSx = sx({ display: 'flex', flexDirection: 'column', gap: '6px' });

  return (
    <div
      ref={ref}
      className={cx('ui-dropzone', className, rootSx.className)}
      data-testid={testId}
      {...rest}
    >
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="File drop zone"
        onClick={() => { if (!disabled) inputRef.current?.click(); }}
        onKeyDown={(e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); inputRef.current?.click(); } }}
        onDragEnter={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false); }}
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled && e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
        }}
        className={cx('ui-dropzone__target', dropAreaSx.className)}
        {...(disabled ? { 'aria-disabled': 'true' } : {})}
      >
        {!minimal && (
          <div className={cx('ui-dropzone__icon', iconSx.className)}>
            {icon ?? '📂'}
          </div>
        )}
        <div>
          <p className={cx('ui-dropzone__label', labelSx.className)}>
            {label}
          </p>
          {description && (
            <p className={cx('ui-dropzone__description', subcopySx.className)}>
              {description}
            </p>
          )}
          {(accept || maxSize || maxFiles) && !description && (
            <p className={cx('ui-dropzone__meta', subcopySx.className)}>
              {[accept && `Accepted: ${Array.isArray(accept) ? accept.join(', ') : accept}`, maxSize && `Max size: ${formatBytes(maxSize)}`, maxFiles && `Max files: ${maxFiles}`].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        tabIndex={-1}
        accept={acceptStr}
        multiple={multiple}
        disabled={disabled}
        aria-label={typeof label === 'string' ? label : 'Choose files to upload'}
        className={hiddenInputSx.className}
        onChange={(e) => { if (e.target.files?.length) { processFiles(e.target.files); e.target.value = ''; } }}
      />

      {error && (
        <p className={cx('ui-dropzone__error', errorSx.className)}>
          {error}
        </p>
      )}

      {preview && files.length > 0 && (
        <div className={cx('ui-dropzone__preview', previewListSx.className)}>
          <div className={cx('ui-dropzone__preview-header', previewHeaderSx.className)}>
            <span className={cx('ui-dropzone__preview-count', previewCountSx.className)}>
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </span>
            {clearable && (
              <button
                type="button"
                onClick={clearAll}
                className={cx('ui-dropzone__clear', clearButtonSx.className)}
              >
                Clear all
              </button>
            )}
          </div>
          <div className={cx('ui-dropzone__preview-items', previewItemsSx.className)}>
            {files.map(f =>
              renderPreview ? (
                <React.Fragment key={f.id}>{renderPreview(f, () => removeFile(f.id))}</React.Fragment>
              ) : (
                <div
                  key={f.id}
                  className={sx({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    background: 'var(--ui-color-surface, #fff)',
                    border: '1px solid var(--ui-color-border)',
                    borderRadius: 'var(--ui-radius-md, 8px)',
                    animation: 'ui-slide-up 0.15s ease',
                  }).className}
                >
                  {f.preview ? (
                    <img src={f.preview} alt={f.file.name} className={sx({ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }).className} />
                  ) : (
                    <div className={sx({ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ui-color-surface-variant)', borderRadius: '4px', fontSize: '18px', flexShrink: 0 }).className}>
                      📄
                    </div>
                  )}
                  <div className={sx({ flex: 1, minWidth: 0 }).className}>
                    <p className={sx({ margin: 0, fontSize: 'var(--ui-text-sm, 14px)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }).className}>
                      {f.file.name}
                    </p>
                    <p className={sx({ margin: 0, fontSize: 'var(--ui-text-xs, 12px)', color: 'var(--ui-color-text-secondary)' }).className}>
                      {formatBytes(f.file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${f.file.name}`}
                    onClick={() => removeFile(f.id)}
                    className={sx({ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ui-color-text-secondary)', fontSize: '18px', padding: '2px', flexShrink: 0, display: 'flex', alignItems: 'center' }).className}
                  >
                    ×
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
});
