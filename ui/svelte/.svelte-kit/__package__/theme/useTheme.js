import { getContext } from 'svelte';
export function getThemeContext() {
    return getContext('ui-theme');
}
