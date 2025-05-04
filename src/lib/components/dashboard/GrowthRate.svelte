<script>
    import CardWidget from './CardWidget.svelte';
    import ProgressCircle from '../ui/ProgressCircle.svelte';
    
    // Props with defaults
    export let percentage = 36;
  </script>
  
  <CardWidget>
    <div class="flex items-center justify-center mb-6">
      <div class="relative w-32 h-32">
        <ProgressCircle 
          {percentage} 
          size={32} 
          strokeWidth={8} 
          bgColor="gray-200" 
          progressColor="coral-500" 
        />
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div class="text-2xl font-bold">{percentage}%</div>
          <div class="text-xs text-coral-500">Growth rate</div>
        </div>
      </div>
    </div>
  </CardWidget>