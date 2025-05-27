<script>
	import { Mic } from 'lucide-svelte';
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

<!-- Date Header Section with Inline Filters -->
<div class="mb-8 flex flex-wrap items-center gap-6">
	<!-- Date Section -->
	<div class="flex items-center gap-4">
		<div class="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-gray-200">
			<div class="text-4xl font-semibold">{day}</div>
		</div>
		<div>
			<div class="text-xl font-medium text-gray-600">{dayOfWeek},</div>
			<div class="text-2xl font-bold text-gray-800">{month} {year}</div>
		</div>
	</div>

	<!-- Date Range Filter -->
	<div class="flex flex-col gap-2">
		<div class="text-sm font-medium text-slate-700">Date Range</div>
		<div class="flex gap-2">
			<input
				type="date"
				class="focus:ring-coral-500 rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-700 transition-all focus:border-transparent focus:ring-2"
			/>
			<input
				type="date"
				class="focus:ring-coral-500 rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-700 transition-all focus:border-transparent focus:ring-2"
			/>
		</div>
	</div>

	<!-- Property Type Filter -->
	<div class="flex flex-col gap-2">
		<div class="text-sm font-medium text-slate-700">Property Type</div>
		<select class="focus:ring-coral-500 rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-700 transition-all focus:border-transparent focus:ring-2">
			<option value="">All Types</option>
			<option value="apartment">Apartment</option>
			<option value="house">House</option>
			<option value="condo">Condo</option>
			<option value="townhouse">Townhouse</option>
		</select>
	</div>

	<!-- Bedrooms Filter -->
	<div class="flex flex-col gap-2">
		<div class="text-sm font-medium text-slate-700">Bedrooms</div>
		<select class="focus:ring-coral-500 rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-700 transition-all focus:border-transparent focus:ring-2">
			<option value="">Any</option>
			<option value="1">1 bedroom</option>
			<option value="2">2 bedrooms</option>
			<option value="3">3 bedrooms</option>
			<option value="4">4+ bedrooms</option>
		</select>
	</div>
</div>

