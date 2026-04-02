<script lang="ts">
  import type { SizeVariant } from '../core/types.js';

  let {
    src = '',
    alt = '',
    size = 'md' as SizeVariant,
    variant = 'circular' as 'circular' | 'rounded' | 'square',
    initials = '',
  }: {
    src?: string;
    alt?: string;
    size?: SizeVariant;
    variant?: 'circular' | 'rounded' | 'square';
    initials?: string;
  } = $props();

  let imgError = $state(false);
  let showImage = $derived(!!src && !imgError);
</script>

<span
  class="ui-avatar ui-avatar--{variant}"
  data-size={size}
  data-color="primary"
  data-show-image={showImage || undefined}
>
  {#if showImage}
    <img
      class="ui-avatar__img"
      src={src}
      alt={alt}
      onerror={() => { imgError = true; }}
    />
  {:else if initials}
    {initials}
  {:else}
    <svg width="60%" height="60%" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  {/if}
</span>

<style>
  .ui-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
    width: var(--ui-avatar-size, 40px);
    height: var(--ui-avatar-size, 40px);
    font-family: var(--ui-font-family, inherit);
    font-weight: 600;
    line-height: 1;
    user-select: none;
    box-sizing: border-box;
    background-color: var(--ui-color-primary);
    color: #fff;
  }
  .ui-avatar[data-show-image] { background-color: transparent; }
  .ui-avatar--circular { border-radius: 50%; }
  .ui-avatar--rounded  { border-radius: var(--ui-radius-md, 0.5rem); }
  .ui-avatar--square   { border-radius: 0; }
  .ui-avatar__img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* Size */
  .ui-avatar[data-size="xs"] { --ui-avatar-size: 24px; font-size: 10px; }
  .ui-avatar[data-size="sm"] { --ui-avatar-size: 32px; font-size: 13px; }
  .ui-avatar[data-size="md"] { --ui-avatar-size: 40px; font-size: 16px; }
  .ui-avatar[data-size="lg"] { --ui-avatar-size: 48px; font-size: 19px; }
  .ui-avatar[data-size="xl"] { --ui-avatar-size: 64px; font-size: 26px; }
</style>
