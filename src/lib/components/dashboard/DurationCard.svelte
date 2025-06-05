<script lang="ts">
    import CardWidget from './CardWidget.svelte';
	
    
    // Props with defaults
    export let time: number
    export let title: string
  </script>
  
  <CardWidget>
    <div class="flex items-center gap-2 font-bold text-xl mb-2">
      
    {title} 
    </div>
    
    <div class="mb-4">
      <div class="text-2xl">{time} Days</div>
    </div>
    
  </CardWidget>