<script lang="ts">
	import ProgressCircle from '../ui/ProgressCircle.svelte';
	import CardWidget from './CardWidget.svelte';
	export let percentage = 36;

	// Calculate the circle properties
	
	// Responsive handling
	let containerWidth: number;
	$: isLargeScreen = containerWidth > 500;
	$: isMediumScreen = containerWidth > 380 && containerWidth <= 500;
	$: radius = isLargeScreen ? 70 : isMediumScreen ? 60 : 50;
</script>

<div bind:clientWidth={containerWidth}>
	<CardWidget info="Formula: coming soon">
		<span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">Tenant Turnover Rate</span>
		<div class="mb-6 flex items-center justify-center">
			<ProgressCircle {percentage} {radius} color="var(--color-propolis-teal)" label="Tenant Turnover Rate" />
		</div>
	</CardWidget>
</div>
