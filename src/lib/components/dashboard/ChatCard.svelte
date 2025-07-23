<script lang="ts">
    import { Send, Sparkles, } from 'lucide-svelte';
    
    // Types
    interface Message {
        type: 'user' | 'ai';
        content: string;
        timestamp: Date;
        id: string;
    }
    
    // Props
    export let marginBottom: boolean = true;
    
    let chatInput: string = '';
    let messages: Message[] = [];
    let isTyping: boolean = false;
    let showWelcome: boolean = true;
    
    function handleSendMessage(): void {
        if (!chatInput.trim()) return;
        
        showWelcome = false;
        
        // Add user message
        const userMessage: Message = {
            type: 'user',
            content: chatInput,
            timestamp: new Date(),
            id: Date.now().toString()
        };
        
        messages = [...messages, userMessage];
    }
    
    function handleKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    }
    
    function formatMessageContent(content: string): string {
        // Convert markdown-style formatting to HTML
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
            .replace(/^\• /gm, '<span class="text-coral-500 font-bold">•</span> ')
            .replace(/^(#{1,3})\s+(.*$)/gm, '<h3 class="font-bold text-gray-900 mb-2">$2</h3>')
            .replace(/\n/g, '<br>');
    }
</script>

<div class="bg-gray-50 p-6 rounded-xl {marginBottom ? 'mb-6' : ''}">
    <!-- Enhanced Input Area -->
    <div class="relative">
        <div class="absolute inset-0 rounded-xl blur-xl opacity-50" style="background: linear-gradient(to right, rgba(0, 150, 136, 0.2), rgba(255, 214, 0, 0.2), rgba(0, 150, 136, 0.1))"></div>
        <div class="relative bg-white rounded-xl border-2 border-gray-200 focus-within-propolis transition-all duration-300 shadow-lg">
            <textarea
                bind:value={chatInput}
                on:keypress={handleKeyPress}
                placeholder="Ask about performance metrics, market analysis, maintenance schedules..."
                class="w-full px-6 py-6 pr-16 border-0 rounded-xl resize-none focus:ring-0 focus:outline-none transition-all duration-200 text-base placeholder-gray-400 bg-transparent"
                rows="4"
            ></textarea>
            <button
                on:click={handleSendMessage}
                disabled={!chatInput.trim() || isTyping}
                class="absolute right-4 top-4 p-3 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-lg ai-send-button"
            >
                <Send class="w-4 h-4" />
            </button>
        </div>
        <div class="text-center mt-3">
            <p class="text-xs text-gray-500">
                💡 <strong>Pro tip:</strong> Ask specific questions for detailed insights • Try "Show me Q4 cash flow" or "Which properties need attention?"
            </p>
        </div>
    </div>
</div>

<style>
    .focus-within-propolis:focus-within {
        border-color: var(--color-propolis-teal);
    }
    
    .ai-send-button {
        background: linear-gradient(135deg, var(--color-propolis-teal), var(--color-propolis-yellow));
    }
    
    .ai-send-button:hover:not(:disabled) {
        background: linear-gradient(135deg, #007d6c, #e6c200);
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
     
    /* Custom scrollbar */
    *::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    
    *::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 3px;
    }
    
    *::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #f97316, #ea580c);
        border-radius: 3px;
    }
    
    *::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #ea580c, #dc2626);
    }
</style>