<script lang="ts">
	import ProtectedRoute from '$lib/protectedRoute.svelte';
	import { Send, Users, Building, Calendar, MessageSquare, Settings } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let selectedTarget = 'all'; // 'long-term', 'short-term', 'all'
	let messageSubject = '';
	let messageContent = '';
	let isSending = false;
	let lastSentMessage: boolean = false;

	// Mock stats for demonstration
	let stats = {
		longTermProperties: 24,
		shortTermProperties: 18,
		totalProperties: 42,
		lastMessageSent: '2 hours ago'
	};

	function handleTargetChange(target: string) {
		selectedTarget = target;
	}

	async function sendMessage() {
		if (!messageSubject.trim() || !messageContent.trim()) {
			alert('Please fill in both subject and message content');
			return;
		}

		isSending = true;

		// Simulate API call
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Reset form
			messageSubject = '';
			messageContent = '';

			alert(`Example message sent successfully! (Not actually sent)`);
		} catch (error) {
			alert('Failed to send message. Please try again.');
		} finally {
			isSending = false;
		}
	}

	function getRecipientCount() {
		switch (selectedTarget) {
			case 'long-term':
				return stats.longTermProperties;
			case 'short-term':
				return stats.shortTermProperties;
			case 'all':
				return stats.totalProperties;
			default:
				return 0;
		}
	}

	function getTargetLabel() {
		switch (selectedTarget) {
			case 'long-term':
				return 'long-term rental';
			case 'short-term':
				return 'short-term rental';
			case 'all':
				return 'all rental';
			default:
				return '';
		}
	}

	function getBadgeColor(target: string) {
		switch (target) {
			case 'long-term':
				return 'bg-blue-100 text-blue-800';
			case 'short-term':
				return 'bg-green-100 text-green-800';
			case 'all':
				return 'bg-purple-100 text-purple-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	onMount(() => {
		// Initialize any required data
	});
</script>

<svelte:head>
	<title>Messages | Property Management</title>
</svelte:head>

<ProtectedRoute>
	<!-- Header Section -->
	<div class="messages-container">
		<div class="header-section">


			<!-- Quick Stats -->
			<div class="stats-row">
				<div class="stat-card">
					<Building class="h-5 w-5 text-blue-600" />
					<div>
						<div class="stat-value">{stats.longTermProperties}</div>
						<div class="stat-label">Long-term</div>
					</div>
				</div>
				<div class="stat-card">
					<Calendar class="h-5 w-5 text-green-600" />
					<div>
						<div class="stat-value">{stats.shortTermProperties}</div>
						<div class="stat-label">Short-term</div>
					</div>
				</div>
				<div class="stat-card">
					<Users class="h-5 w-5 text-purple-600" />
					<div>
						<div class="stat-value">{stats.totalProperties}</div>
						<div class="stat-label">Total Properties</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Content -->
		<div class="content-section">
			<!-- Target Selection -->
			<div class="section-card">
				<div class="section-header">
					<Settings class="h-5 w-5" />
					<h2>Message Target</h2>
				</div>

				<div class="target-options">
					<button
						class="target-option {selectedTarget === 'long-term' ? 'active' : ''}"
						on:click={() => handleTargetChange('long-term')}
					>
						<div class="target-icon bg-blue-100">
							<Building class="h-6 w-6 text-blue-600" />
						</div>
						<div class="target-content">
							<div class="target-title">Long-term Rentals</div>
							<div class="target-subtitle">
								{stats.longTermProperties} properties • Traditional leases
							</div>
						</div>
						<div class="target-badge {getBadgeColor('long-term')}">Doorloop</div>
					</button>

					<button
						class="target-option {selectedTarget === 'short-term' ? 'active' : ''}"
						on:click={() => handleTargetChange('short-term')}
					>
						<div class="target-icon bg-green-100">
							<Calendar class="h-6 w-6 text-green-600" />
						</div>
						<div class="target-content">
							<div class="target-title">Short-term Rentals</div>
							<div class="target-subtitle">
								{stats.shortTermProperties} properties • Airbnb & short stays
							</div>
						</div>
						<div class="target-badge {getBadgeColor('short-term')}">Guesty</div>
					</button>

					<button
						class="target-option {selectedTarget === 'all' ? 'active' : ''}"
						on:click={() => handleTargetChange('all')}
					>
						<div class="target-icon bg-purple-100">
							<Users class="h-6 w-6 text-purple-600" />
						</div>
						<div class="target-content">
							<div class="target-title">All Rentals</div>
							<div class="target-subtitle">
								{stats.totalProperties} properties • Complete portfolio
							</div>
						</div>
						<div class="target-badge {getBadgeColor('all')}">Combined</div>
					</button>
				</div>
			</div>

			<!-- Message Composition -->
			<div class="section-card">
				<div class="section-header">
					<Send class="h-5 w-5" />
					<h2>Compose Message</h2>
					<div class="recipient-count">
						To: {getRecipientCount()}
						{getTargetLabel()} properties
					</div>
				</div>

				<div class="message-form">
					<div class="form-group">
						<label for="subject">Subject</label>
						<input
							id="subject"
							type="text"
							bind:value={messageSubject}
							placeholder="Enter message subject..."
							class="form-input"
							disabled={isSending}
						/>
					</div>

					<div class="form-group">
						<label for="content">Message Content</label>
						<textarea
							id="content"
							bind:value={messageContent}
							placeholder="Enter your message content here..."
							rows="8"
							class="form-textarea"
							disabled={isSending}
						></textarea>
					</div>

					<div class="form-actions">
						<button
							class="send-button"
							on:click={sendMessage}
							disabled={isSending || !messageSubject.trim() || !messageContent.trim()}
						>
							{#if isSending}
								<div class="loading-spinner"></div>
								Sending...
							{:else}
								<Send class="h-4 w-4" />
								Send Message
							{/if}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div></ProtectedRoute
>

<style>
	.messages-container {
		padding: 0rem;
		max-width: 1400px;
		margin: 0 auto;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	}

	.header-section {
		margin-bottom: 2rem;
	}

	.stats-row {
		display: flex;
		gap: 1rem;
		margin-top: 1.5rem;
		flex-wrap: wrap;
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.75rem;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1f2937;
	}

	.stat-label {
		font-size: 0.875rem;
		color: #6b7280;
		font-weight: 500;
	}

	.content-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.section-card {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
		color: #374151;
	}

	.section-header h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0;
	}

	.recipient-count {
		margin-left: auto;
		padding: 0.25rem 0.75rem;
		background: #f3f4f6;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		color: #6b7280;
		font-weight: 500;
	}

	.target-options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.target-option {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		border: 2px solid #e5e7eb;
		border-radius: 0.75rem;
		background: white;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
		width: 100%;
	}

	.target-option:hover {
		border-color: #d1d5db;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.target-option.active {
		border-color: #3b82f6;
		background: #f8fafc;
		box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
	}

	.target-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 0.75rem;
		flex-shrink: 0;
	}

	.target-content {
		flex: 1;
	}

	.target-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 0.25rem;
	}

	.target-subtitle {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.target-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.message-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
	}

	.form-input,
	.form-textarea {
		padding: 0.75rem 1rem;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 1rem;
		color: #1f2937;
		transition: all 0.2s ease;
		background: white;
	}

	.form-input:focus,
	.form-textarea:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.form-input:disabled,
	.form-textarea:disabled {
		background: #f9fafb;
		color: #9ca3af;
		cursor: not-allowed;
	}

	.form-textarea {
		resize: vertical;
		min-height: 8rem;
		font-family: inherit;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
	}

	.send-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 2rem;
		background: linear-gradient(135deg, #3b82f6, #1d4ed8);
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.send-button:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
	}

	.send-button:disabled {
		background: #9ca3af;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.loading-spinner {
		width: 1rem;
		height: 1rem;
		border: 2px solid transparent;
		border-top: 2px solid currentColor;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.last-message {
		padding: 1.5rem;
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
	}

	.message-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.message-target {
		padding: 0.25rem 0.75rem;
		border-radius: 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.message-timestamp,
	.message-count {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.message-subject {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.message-content {
		color: #4b5563;
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.messages-container {
			padding: 1rem;
		}

		.stats-row {
			flex-direction: column;
		}

		.target-option {
			flex-direction: column;
			text-align: center;
			gap: 1rem;
		}

		.target-content {
			text-align: center;
		}

		.message-meta {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
	}
</style>
