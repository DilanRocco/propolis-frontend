<script>
	export let percentage = 36;
  export let radius = 70;

	// Calculate the circle properties

	$: circumference = 2 * Math.PI * radius;
	$: strokeDashoffset = circumference - (percentage / 100) * circumference;
  let x = 30
  let y = 50
  let strokeWidth = radius * .1
</script>

<svg class="h-20">
  <circle cx={x} cy={y} r={radius} stroke="#e6e6e6" stroke-width="{strokeWidth}" fill="none" />

  <circle
    cx="{x}"
    cy="{y}"
    r={radius}
    stroke="#f97367"
    stroke-width="{strokeWidth}"
    fill="none"
    stroke-linecap="round"
    stroke-dasharray={circumference}
    stroke-dashoffset={strokeDashoffset}
    transform="rotate(-90 {x} {y})"
  />

  <text
    x="{x}"
    y="{y}"
    text-anchor="middle"
    dominant-baseline="middle"
    font-size="25"
    font-weight="bold"
  >
    {percentage}%
  </text>
</svg>