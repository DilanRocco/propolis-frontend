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

  let selectedName = '';
  let selectedBucket: 'week' | 'month' | 'year' = 'month';

  let options: any = {
    title: { text: 'Reservations' },
    tooltip: {},
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [] }]
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

  async function onSelectProperty(e: Event) {
    const name = (e.target as HTMLSelectElement).value;
    selectedName = name;

    try {
      // Fetch fresh data for this property
      const freshData = await propertyStore.getDataFor(name, fetch);
      rebuildChart(freshData);
    } catch {
      // Fallback to whatever is already in the store
      rebuildChart();
    }
  }

  function onSelectBucket(e: Event) {
    selectedBucket = (e.target as HTMLSelectElement).value as any;
    rebuildChart();
  }

  function groupBy<T, K>(arr: T[], keyFn: (x: T) => K): Map<K, T[]> {
    return arr.reduce((map, item) => {
      const key = keyFn(item);
      const grp = map.get(key) ?? [];
      grp.push(item);
      map.set(key, grp);
      return map;
    }, new Map<K, T[]>());
  }

  function rebuildChart(rawOverride?: ListingData[]) {
    if (!selectedName) {
      options = {
        ...options,
        xAxis: { ...options.xAxis, data: [] },
        series: [{ type: 'bar', data: [] }]
      };
      return;
    }

    const raw: ListingData[] = rawOverride ?? listingData[selectedName] ?? [];

    if (!raw.length) {
      options = {
        ...options,
        xAxis: { ...options.xAxis, data: [] },
        series: [{ type: 'bar', data: [] }]
      };
      return;
    }

    let keyFn: (d: ListingData) => string;
    if (selectedBucket === 'week') {
      keyFn = d => {
        const dt = new Date(d.guesty_created_at);
        const day = (dt.getDay() + 6) % 7;
        const thursday = new Date(dt);
        thursday.setDate(dt.getDate() - day + 3);
        const week1 = new Date(thursday.getFullYear(), 0, 4);
        const weekNo = Math.ceil(
          (((thursday.getTime() - week1.getTime()) / 86400000) + 1) / 7
        );
        return `${thursday.getFullYear()}-W${weekNo}`;
      };
    } else if (selectedBucket === 'year') {
      keyFn = d => new Date(d.guesty_created_at).getFullYear().toString();
    } else {
      keyFn = d => {
        const dt = new Date(d.guesty_created_at);
        return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
      };
    }

    const grouped = groupBy(raw, keyFn);
    const categories = Array.from(grouped.keys()).sort();
    console.log(categories)
    const data = categories.map(cat =>
      grouped.get(cat)!.reduce((sum, rec) => sum + rec.total_paid, 0)
    );
    console.log(grouped)
    console.log("Processed data:", { categories, data });


    options = {
      ...options,
      title: { text: `${selectedName} — ${selectedBucket}` },
      xAxis: { type: 'category', data: categories },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data }]
    };
  }
</script>

<div class="controls">
  <label>
    Property:
    <select on:change={onSelectProperty} bind:value={selectedName}>
      <option value="" disabled selected>Select a property</option>
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
