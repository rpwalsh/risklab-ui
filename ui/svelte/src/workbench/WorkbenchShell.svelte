<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    createWorkbenchThemeVars,
    resolveWorkbenchTheme,
    type WorkbenchThemeTokens,
    type WorkbenchTone,
  } from './theme.js';

  let {
    nav,
    topbar,
    inspector,
    statusBar,
    tone = 'dark' as WorkbenchTone,
    theme = {},
    children,
  }: {
    nav?: Snippet;
    topbar?: Snippet;
    inspector?: Snippet;
    statusBar?: Snippet;
    tone?: WorkbenchTone;
    theme?: Partial<WorkbenchThemeTokens>;
    children?: Snippet;
  } = $props();

  let themeVars = $derived(
    Object.entries(createWorkbenchThemeVars(resolveWorkbenchTheme(tone, theme)))
      .map(([key, value]) => `${key}:${value}`)
      .join(';')
  );
</script>

<div
  data-rl-workbench=""
  class="rlwb-shell"
  class:rlwb-shell--has-nav={!!nav}
  class:rlwb-shell--has-inspector={!!inspector}
  style={themeVars}
>
  {#if nav}
    <aside class="rlwb-shell__nav">
      {@render nav()}
    </aside>
  {/if}

  <div class="rlwb-shell__frame">
    {#if topbar}
      <header class="rlwb-shell__topbar">
        {@render topbar()}
      </header>
    {/if}

    <div class="rlwb-shell__body">
      <main class="rlwb-shell__workspace">
        {@render children?.()}
      </main>

      {#if inspector}
        <aside class="rlwb-shell__inspector">
          {@render inspector()}
        </aside>
      {/if}
    </div>

    {#if statusBar}
      <footer class="rlwb-shell__status">
        {@render statusBar()}
      </footer>
    {/if}
  </div>
</div>
