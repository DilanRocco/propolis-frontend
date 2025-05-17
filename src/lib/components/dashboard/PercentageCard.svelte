<script lang="ts">
	import ProgressCircle from '../ui/ProgressCircle.svelte';
	import CardWidget from './CardWidget.svelte';
	export let percentage = 36;

	// Calculate the circle properties
	
	$: circumference = 2 * Math.PI * radius;
	$: strokeDashoffset = circumference - (percentage / 100) * circumference;
	let x = 100;
	let y = 100;
	// Responsive handling
	let containerWidth: number;
	$: isLargeScreen = containerWidth > 500;
	$: isMediumScreen = containerWidth > 380 && containerWidth <= 500;
	$: radius = isLargeScreen ? 70 : isMediumScreen ? 60 : 50;
</script>

<div bind:clientWidth={containerWidth}>
	<CardWidget marginBottom={true}>
		
		<div class="mx-auto max-w-xs rounded-lg">
			<div class="mb-6 flex items-center justify-center">

					<ProgressCircle {percentage} {radius} color="#f97367" label="Tentant Turnover Rate" />
				

			</div>
		</div>
		</CardWidget
	>
</div>
