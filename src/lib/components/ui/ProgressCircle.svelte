
<script>
  export let percentage = 36;
  export let radius = 70;
  
  // Calculate the circle properties
  $: circumference = 2 * Math.PI * radius;
  $: strokeDashoffset = circumference - (percentage / 100) * circumference;
  $: strokeWidth = radius * 0.17;
</script>

<div class="flex items-center justify-center">
  <svg height={(radius + 10) * 2} width={(radius + 10) * 2}>
    <circle
      stroke="#EEEEEE"
      cx={radius + 10}
      cy={radius + 10}
      r={radius}
      fill="transparent"
      stroke-width={strokeWidth}
    />
    <circle
      stroke="#f97367"
      cx={radius + 10}
      cy={radius + 10}
      r={radius}
      fill="transparent"
      stroke-width={strokeWidth}
      stroke-dasharray={circumference}
      stroke-dashoffset={strokeDashoffset}
      stroke-linecap="round"
      transform={`rotate(-90 ${radius + 10} ${radius + 10})`}
    />
    <text
      class="text-2xl"
      x={radius + 10}
      y={radius + 10}
      fill="#374151"
      font-size={radius * 0.3}
      font-weight="600"
      text-anchor="middle"
      dominant-baseline="middle"
    >
      {percentage}%
    </text>
  </svg>
</div>