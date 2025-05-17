<script>
	import ProtectedRoute from '$lib/protectedRoute.svelte';

	export let data;
</script>

<ProtectedRoute>
	<h1>Messages</h1>
	<p>This is the messages page.</p>
</ProtectedRoute>
