<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    as = 'div',
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
    display,
    bg,
    radius,
    children,
  }: {
    as?: string;
    p?: string;
    px?: string;
    py?: string;
    pt?: string;
    pr?: string;
    pb?: string;
    pl?: string;
    m?: string;
    mx?: string;
    my?: string;
    mt?: string;
    mr?: string;
    mb?: string;
    ml?: string;
    display?: string;
    bg?: string;
    radius?: string;
    children?: Snippet;
  } = $props();

  let styles = $derived(
    [
      p && `padding:${p}`,
      px && `padding-left:${px};padding-right:${px}`,
      py && `padding-top:${py};padding-bottom:${py}`,
      pt && `padding-top:${pt}`,
      pr && `padding-right:${pr}`,
      pb && `padding-bottom:${pb}`,
      pl && `padding-left:${pl}`,
      m && `margin:${m}`,
      mx && `margin-left:${mx};margin-right:${mx}`,
      my && `margin-top:${my};margin-bottom:${my}`,
      mt && `margin-top:${mt}`,
      mr && `margin-right:${mr}`,
      mb && `margin-bottom:${mb}`,
      ml && `margin-left:${ml}`,
      display && `display:${display}`,
      bg && `background:${bg}`,
      radius && `border-radius:${radius}`,
    ]
      .filter(Boolean)
      .join(';')
  );
</script>

<svelte:element this={as} class="ui-box" style={styles || undefined}>
  {@render children?.()}
</svelte:element>

<style>
  .ui-box {
    box-sizing: border-box;
    font-family: var(--ui-font-family, inherit);
    color: var(--ui-color-text, inherit);
  }
</style>
