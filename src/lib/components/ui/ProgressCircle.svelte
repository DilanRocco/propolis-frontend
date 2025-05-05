<!-- ProgressCircle.svelte -->
<script>
  export let radius;
  export let percentage;
  export let color;
  export let label;
  
  // Calculate the circle properties
  $: circumference = 2 * Math.PI * radius;
  $: strokeDashoffset = circumference - (percentage / 100) * circumference;
  $: strokeWidth = radius * 0.15;
  
  // Animation spring for the progress
  import { spring } from 'svelte/motion';
  
  const displayedPercentage = spring(0);
  
  // Update the spring when the percentage changes
  $: {
    displayedPercentage.set(percentage);
  }
</script>

<div class="progress-circle">
  <div class="circle-wrapper">
    <svg height={radius * 2 + 20} width={radius * 2 + 20}>
      <!-- Background circle -->
      <circle
        stroke="#f1f5f9"
        cx={radius + 10}
        cy={radius + 10}
        r={radius}
        fill="transparent"
        stroke-width={strokeWidth}
      />
      
      <!-- Progress circle with animation -->
      <circle
        stroke={color}
        cx={radius + 10}
        cy={radius + 10}
        r={radius}
        fill="transparent"
        stroke-width={strokeWidth}
        stroke-dasharray={circumference}
        stroke-dashoffset={circumference - ($displayedPercentage / 100) * circumference}
        stroke-linecap="round"
        transform={`rotate(-90 ${radius + 10} ${radius + 10})`}
      />
      
      <!-- Percentage text -->
      <text
        class="percentage-text"
        x={radius + 10}
        y={radius + 10}
        fill="#1e293b"
        font-size={radius * 0.35}
        font-weight="600"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {Math.round($displayedPercentage)}%
      </text>
    </svg>
    
    <!-- Subtle glow effect behind the circle -->
    <div class="glow" style="--color: {color}; --size: {radius * 2}px;"></div>
  </div>
  
  <div class="label">{label}</div>
</div>

<style>
  /* Progress circle styles */
  .progress-circle {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .circle-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .glow {
    position: absolute;
    border-radius: 50%;
    background-color: var(--color);
    width: var(--size);
    height: var(--size);
    opacity: 0.1;
    filter: blur(10px);
    animation: pulse 2s infinite ease-in-out;
    left: 10px;
    top: 10px;
  }
  
  .label {
    margin-top: 0.5rem;
    font-weight: 600;
    color: #475569;
    text-align: center;
  }
  
  .percentage-text {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  /* Animation */
  @keyframes pulse {
    0% {
      opacity: 0.1;
      transform: scale(1);
    }
    50% {
      opacity: 0.15;
      transform: scale(1.05);
    }
    100% {
      opacity: 0.1;
      transform: scale(1);
    }
  }
</style>