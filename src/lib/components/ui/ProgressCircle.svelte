<script>
    // Props
    export let percentage = 0;
    export let size = 32; // in rem
    export let strokeWidth = 8; // in pixels
    export let bgColor = "gray-200";
    export let progressColor = "coral-500";
    
    // Calculated values
    $: radius = (size * 16 - strokeWidth) / 2; // Convert rem to pixels (1rem = 16px)
    $: circumference = 2 * Math.PI * radius;
    $: dashOffset = circumference * (1 - percentage / 100);
    $: center = size * 8; // Half of size in pixels
  </script>
  
  <svg 
    class="w-{size} h-{size}" 
    viewBox="0 0 {size * 16} {size * 16}"
  >
    <!-- Background circle -->
    <circle 
      cx={center} 
      cy={center} 
      r={radius} 
      stroke-width={strokeWidth} 
      class="stroke-{bgColor} fill-transparent"
    />
    
    <!-- Progress circle -->
    <circle 
      cx={center} 
      cy={center} 
      r={radius} 
      stroke-width={strokeWidth} 
      class="stroke-{progressColor} fill-transparent" 
      stroke-dasharray={circumference} 
      stroke-dashoffset={dashOffset} 
      transform="rotate(-90 {center} {center})"
      stroke-linecap="round"
    />
  </svg>