<script lang="ts">
  import CardWidget from './CardWidget.svelte';
    // Props with defaults
    export let moneyMetric: number
    export let title: string
</script>

<CardWidget info="Formula: coming soon">
  <span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">{title}</span>
  <div class="mb-4">
    <div class="text-2xl font-bold"><span class="text-[color:var(--color-propolis-yellow)]">$</span> {moneyMetric.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
  </div>
</CardWidget>