<script>
  import CardWidget from "./CardWidget.svelte";
	export let percentage = 36;

	// Calculate the circle properties
	$: radius = 70;
	$: circumference = 2 * Math.PI * radius;
	$: strokeDashoffset = circumference - (percentage / 100) * circumference;
  let x = 100
  let y = 100
</script>

<CardWidget marginBottom={true}>
	<div class="mx-auto max-w-xs rounded-lg">
		<div class="mb-6 flex items-center justify-center">
			<div class="relative h-52 w-52">
				<svg class="h-full w-full" viewBox="0 0 200 200">
					<circle cx={x} cy={y} r={radius} stroke="#e6e6e6" stroke-width="12" fill="none" />

					<circle
						cx="{x}"
						cy="{y}"
						r={radius}
						stroke="#f97367"
						stroke-width="12"
						fill="none"
						stroke-linecap="round"
						stroke-dasharray={circumference}
						stroke-dashoffset={strokeDashoffset}
						transform="rotate(-90 100 100)"
					/>

					<text
						x="{x}"
						y="{y}"
						text-anchor="middle"
						dominant-baseline="middle"
						font-size="32"
						font-weight="bold"
					>
						{percentage}%
					</text>
				</svg>
        <div class="text-center  font-bold">Tentant Turnover Rate</div>
			</div>
		</div>
	</div>
</CardWidget>
