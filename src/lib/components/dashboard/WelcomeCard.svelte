<script>
	import { ArrowRight, Calendar, Mic } from 'lucide-svelte';
	import { onMount } from 'svelte';

	// Date state
	let day = 19;
	let dayOfWeek = 'Tue';
	let month = 'December';
	let year = '2025';
	onMount(() => {
		// You could update the date dynamically on mount
		const now = new Date();
		day = now.getDate();
		dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
		month = now.toLocaleDateString('en-US', { month: 'long' });
		year = now.toLocaleDateString('en-us', { year: 'numeric' });
	});

	let isRecording = false;

	function toggleMic() {
		isRecording = !isRecording;
		console.log('Mic clicked:', isRecording);
	}

	function showTasks() {
		// Handle showing tasks
		console.log('Show tasks clicked');
	}
</script>

<div class="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
	<!-- Left: Date Section -->
	<div class="flex items-center gap-6">
		<div
			class="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-gray-200"
		>
			<div class="text-5xl font-medium">{day}</div>
		</div>
		<div>
			<div class="text-2xl font-medium">{dayOfWeek},</div>
			<div class="text-3xl font-bold">{month} {year}</div>
		</div>
	</div>

	<!-- Right: Textarea + Microphone -->
	<div class="flex items-center gap-6">
		<div>
			<div class="text-3xl font-bold md:text-4xl">Hey, Need help? 👋</div>
      <div>
			<textarea
				class="w-full rounded-md text-3xl text-gray-600 h-10"
				rows="2"
				placeholder="Just ask me anything!"
			></textarea>
      </div>
		</div>

		<button
			on:click={toggleMic}
			class={`mt-4 flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 md:mt-0 md:ml-2 ${
				isRecording ? 'bg-red-500' : 'bg-gray-300'
			}`}
		>
			<Mic class="h-8 w-8 text-white" />
		</button>
	</div>
</div>
