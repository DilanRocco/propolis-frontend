<script>
	import {  Mic } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let day = 19;
	let dayOfWeek = 'Tue';
	let month = 'December';
	let year = '2025';

	onMount(() => {
		const now = new Date();
		day = now.getDate();
		dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
		month = now.toLocaleDateString('en-US', { month: 'long' });
		year = now.toLocaleDateString('en-us', { year: 'numeric' });
	});

	let isRecording = false;
	function toggleMic() {
		isRecording = !isRecording;
	}

</script>

<!-- Outer Container -->
<div class="mb-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

	<!-- Left: Date Section -->
	<div class="flex items-center gap-4">
		<div class="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-gray-200">
			<div class="text-4xl font-semibold">{day}</div>
		</div>
		<div>
			<div class="text-xl font-medium text-gray-600">{dayOfWeek},</div>
			<div class="text-2xl font-bold text-gray-800">{month} {year}</div>
		</div>
	</div>

	<!-- Right: Help Prompt -->
	<div class="flex items-center gap-4 md:gap-6">
		<div class="flex flex-col justify-center">
			<div class="text-2xl font-semibold md:text-3xl">Hey, Need help? 👋</div>
			<div class="text-lg text-gray-500 md:text-xl">Just ask me anything!</div>
		</div>

		<!-- Mic Button -->
		<button
			on:click={toggleMic}
			class={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
				isRecording ? 'bg-red-500' : 'bg-gray-300'
			}`}
		>
			<Mic class="h-7 w-7 text-white" />
		</button>
	</div>
</div>
