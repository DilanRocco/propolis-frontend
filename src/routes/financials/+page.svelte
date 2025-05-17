<script>
	import ProtectedRoute from '$lib/protectedRoute.svelte';

	export let data;
</script>

<ProtectedRoute>
	<h1>Financials</h1>
	<p>This is the Financials page.</p>
</ProtectedRoute>
