<script lang="ts">
    import CardWidget from './CardWidget.svelte';
	
    
    // Props with defaults
    export let time: number
    export let title: string
  </script>
  
  <CardWidget info="Formula: coming soon">
    <span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">{title}</span>
    <div class="mb-4">
      <div class="text-2xl text-[color:var(--color-propolis-teal)]">{time} Days</div>
    </div>
  </CardWidget>