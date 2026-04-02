<script lang="ts">
  let {
    orientation = 'horizontal' as 'horizontal' | 'vertical',
    color,
    thickness = '1px',
  }: {
    orientation?: 'horizontal' | 'vertical';
    color?: string;
    thickness?: string;
  } = $props();
</script>

<div
  class="ui-divider ui-divider--{orientation}"
  style:border-color={color || undefined}
  style:--divider-thickness={thickness}
  role="separator"
  aria-orientation={orientation}
></div>

<style>
  .ui-divider {
    flex-shrink: 0;
    border-color: var(--ui-color-border, #e2e8f0);
    border-style: solid;
    border-width: 0;
  }
  .ui-divider--horizontal {
    width: 100%;
    border-bottom-width: var(--divider-thickness, 1px);
  }
  .ui-divider--vertical {
    align-self: stretch;
    height: auto;
    border-right-width: var(--divider-thickness, 1px);
  }
</style>
