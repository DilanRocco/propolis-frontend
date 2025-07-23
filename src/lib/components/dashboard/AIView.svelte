<script lang="ts">
    import { X, Sparkles } from 'lucide-svelte';
    import { fade, slide } from 'svelte/transition';
    
    export let isOpen = false;
    
    function closeView() {
        isOpen = false;
    }
</script>

{#if isOpen}
    <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        transition:fade={{ duration: 200 }}
        on:click={closeView}
        on:keydown={(e) => e.key === 'Escape' && closeView()}
        role="button"
        tabindex="0"
    >
        <div 
            class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
            transition:slide={{ duration: 300 }}
            on:click|stopPropagation
            on:keydown|stopPropagation
            role="dialog"
            aria-modal="true"
            tabindex="0"
        >
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <div class="absolute inset-0 rounded-xl animate-pulse" style="background: linear-gradient(135deg, var(--color-propolis-teal), var(--color-propolis-yellow))"></div>
                        <div class="relative flex items-center justify-center w-12 h-12 rounded-xl shadow-lg" style="background: linear-gradient(135deg, var(--color-propolis-teal), var(--color-propolis-yellow))">
                            <Sparkles class="w-6 h-6 text-white animate-bounce" />
                        </div>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Property Intelligence</h2>
                        <p class="text-sm text-gray-600">AI-powered insights for your real estate empire</p>
                    </div>
                </div>
                <button 
                    on:click={closeView}
                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X class="w-6 h-6 text-gray-500" />
                </button>
            </div>

            <!-- Content -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Quick Actions -->
                    <div class="bg-gray-50 rounded-xl p-6">
                        <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
                        <div class="space-y-3">
                            <button class="w-full text-left p-4 bg-white rounded-lg border border-gray-200 hover-border-propolis transition-colors">
                                <div class="font-medium text-gray-900">Analyze Property Performance</div>
                                <div class="text-sm text-gray-600">Get insights on occupancy rates and revenue</div>
                            </button>
                            <button class="w-full text-left p-4 bg-white rounded-lg border border-gray-200 hover-border-propolis transition-colors">
                                <div class="font-medium text-gray-900">Market Analysis</div>
                                <div class="text-sm text-gray-600">Compare your properties with market trends</div>
                            </button>
                            <button class="w-full text-left p-4 bg-white rounded-lg border border-gray-200 hover-border-propolis transition-colors">
                                <div class="font-medium text-gray-900">Maintenance Schedule</div>
                                <div class="text-sm text-gray-600">View upcoming maintenance tasks</div>
                            </button>
                        </div>
                    </div>

                    <!-- Recent Insights -->
                    <div class="bg-gray-50 rounded-xl p-6">
                        <h3 class="text-lg font-semibold mb-4">Recent Insights</h3>
                        <div class="space-y-4">
                            <div class="bg-white rounded-lg p-4 border border-gray-200">
                                <div class="flex items-center gap-2 mb-2">
                                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span class="text-sm font-medium text-gray-600">Occupancy Rate</span>
                                </div>
                                <p class="text-gray-900">Your properties are showing a 15% increase in occupancy compared to last month.</p>
                            </div>
                            <div class="bg-white rounded-lg p-4 border border-gray-200">
                                <div class="flex items-center gap-2 mb-2">
                                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span class="text-sm font-medium text-gray-600">Revenue Forecast</span>
                                </div>
                                <p class="text-gray-900">Projected revenue for Q2 is expected to exceed Q1 by 8%.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Chat Section -->
                <div class="mt-6">
                    <div class="bg-white rounded-xl border-2 border-gray-200 focus-within-propolis transition-all duration-300">
                        <textarea
                            placeholder="Ask about performance metrics, market analysis, maintenance schedules..."
                            class="w-full px-6 py-4 border-0 rounded-xl resize-none focus:ring-0 focus:outline-none transition-all duration-200 text-base placeholder-gray-400"
                            rows="3"
                        ></textarea>
                        <div class="px-6 pb-4">
                            <button class="w-full py-2 text-white rounded-lg ai-send-button transition-all duration-200 shadow-lg hover:shadow-xl">
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .focus-within-propolis:focus-within {
        border-color: var(--color-propolis-teal);
    }
    
    .hover-border-propolis:hover {
        border-color: var(--color-propolis-teal);
    }
    
    .ai-send-button {
        background: linear-gradient(135deg, var(--color-propolis-teal), var(--color-propolis-yellow));
    }
    
    .ai-send-button:hover {
        background: linear-gradient(135deg, #007d6c, #e6c200);
    }
</style> 