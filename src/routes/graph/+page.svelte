<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart } from 'svelte-echarts';
  import { init, use } from 'echarts/core';
  import { BarChart } from 'echarts/charts';
  import { GridComponent, TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
  import { CanvasRenderer } from 'echarts/renderers';

  import { propertyStore, type ListingData } from '$lib/stores/propertyStore';
  import type { PropertyState } from '$lib/stores/propertyStore';

  use([BarChart, GridComponent, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

  let listingNames: string[] = [];
  let listingData: Record<string, ListingData[]> = {};
  let loading = false;
  let error: string | null = null;

  // Now an array of selected names
  let selectedNames: string[] = [];
  let selectedBucket: 'week' | 'month' | 'year' = 'month';

  let options: any = {
    title: { text: 'Reservations Comparison' },
    tooltip: { trigger: 'axis' },
    legend: { data: [] },
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value' },
    series: []
  };

  const unsub = propertyStore.subscribe((s: PropertyState) => {
    listingNames = s.listingNames;
    listingData = s.listingData;
    loading = s.loading;
    error = s.error;
  });

  onMount(() => {
    propertyStore.loadListingNames(fetch);
    return unsub;
  });

  async function onSelectProperties(e: Event) {
    const select = e.target as HTMLSelectElement;
    // Gather all selected options
    selectedNames = Array.from(select.selectedOptions).map(o => o.value);
    // Fetch fresh data for each newly selected
    await Promise.all(selectedNames.map(name => propertyStore.getDataFor(name, fetch)));
    rebuildChart();
  }

  function onSelectBucket(e: Event) {
    selectedBucket = (e.target as HTMLSelectElement).value as any;
    rebuildChart();
  }

// utility to floor a date to bucket start
function floorToBucket(dt: Date): Date {
    const d = new Date(dt);
    if (selectedBucket === 'week') {
      // move to Monday of this week
      const day = (d.getDay() + 6) % 7;
      d.setDate(d.getDate() - day);
      d.setHours(0,0,0,0);
    } else if (selectedBucket === 'month') {
      d.setDate(1);
      d.setHours(0,0,0,0);
    } else {
      d.setMonth(0,1);
      d.setHours(0,0,0,0);
    }
    return d;
  }

  // advance date by one bucket
  function advanceBucket(dt: Date): Date {
    const d = new Date(dt);
    if (selectedBucket === 'week') {
      d.setDate(d.getDate() + 7);
    } else if (selectedBucket === 'month') {
      d.setMonth(d.getMonth() + 1);
    } else {
      d.setFullYear(d.getFullYear() + 1);
    }
    return d;
  }

  // label formatter for each bucket
  function formatBucket(dt: Date): string {
    if (selectedBucket === 'week') {
      // ISO week number by using Thursday trick
      const th = new Date(dt);
      th.setDate(dt.getDate() + 3);
      const week1 = new Date(th.getFullYear(), 0, 4);
      const weekNo = Math.ceil((((th.getTime() - week1.getTime()) / 86400000) + 1) / 7);
      return `${th.getFullYear()}-W${weekNo}`;
    } else if (selectedBucket === 'month') {
      return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2,'0')}`;
    } else {
      return dt.getFullYear().toString();
    }
  }

  function rebuildChart() {
    if (!selectedNames.length) {
      options = { ...options, xAxis: { ...options.xAxis, data: [] }, series: [], legend: { data: [] } };
      return;
    }

    // collect all raw data, tag by property
    interface Tagged { name: string; rec: ListingData }
    const all: Tagged[] = [];
    for (const name of selectedNames) {
      const arr = listingData[name] ?? [];
      for (const rec of arr) all.push({ name, rec });
    }
    if (!all.length) {
      options = { ...options, xAxis: { ...options.xAxis, data: [] }, series: [], legend: { data: [] } };
      return;
    }

    // find global date range
    all.sort((a, b) => new Date(a.rec.guesty_created_at).getTime() - new Date(b.rec.guesty_created_at).getTime());
    const start = floorToBucket(new Date(all[0].rec.guesty_created_at));
    const end = new Date(all[all.length - 1].rec.guesty_created_at);

    // build full categories
    const cats: string[] = [];
    let cur = start;
    while (cur.getTime() <= end.getTime()) {
      cats.push(formatBucket(cur));
      cur = advanceBucket(cur);
    }

    // per-listing sums map
    const sums: Record<string, Map<string, number>> = {};
    for (const name of selectedNames) sums[name] = new Map();
    all.forEach(({ name, rec }) => {
      const dt = new Date(rec.guesty_created_at);
      const floored = floorToBucket(dt);
      const lbl = formatBucket(floored);
      const m = sums[name];
      m.set(lbl, (m.get(lbl) || 0) + rec.total_paid);
    });

    // build series for each property
    const series = selectedNames.map(name => ({
      name,
      type: 'bar',
      data: cats.map(c => +(sums[name].get(c) || 0).toFixed(2))
    }));

    options = {
      title: { text: `Comparison — ${selectedBucket}` },
      tooltip: { trigger: 'axis' },
      legend: { data: selectedNames },
      xAxis: { type: 'category', data: cats },
      yAxis: { type: 'value' },
      series
    };
  }
</script>

<div class="controls">
  <label>
    Properties (hold ⌘/Ctrl to multi-select):
    <select multiple size="5" on:change={onSelectProperties}>
      {#each listingNames as name}
        <option value={name}>{name}</option>
      {/each}
    </select>
  </label>

  <label>
    Bucket:
    <select on:change={onSelectBucket} bind:value={selectedBucket}>
      <option value="week">Weekly</option>
      <option value="month">Monthly</option>
      <option value="year">Yearly</option>
    </select>
  </label>
</div>

{#if loading}
  <p>Loading data…</p>
{:else if error}
  <p class="error">{error}</p>
{:else}
  <div class="chart-container">
    <Chart {init} {options} style="width: 100%; height: 400px;" />
  </div>
{/if}

<style>
  .controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  select {
    margin-left: 0.5rem;
  }
  .chart-container {
    width: 100%;
    height: 400px;
  }
  .error {
    color: red;
  }
</style>
