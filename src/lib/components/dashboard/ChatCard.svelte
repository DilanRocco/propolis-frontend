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
        
     
        // Simulate AI response with more realistic delay
  
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
    <!-- Animated Header -->
    <div class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-coral-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl"></div>
        <div class="relative flex items-center gap-4 p-6 mb-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
            <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-br from-coral-400 to-coral-600 rounded-2xl animate-pulse"></div>
                <div class="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl shadow-lg">
                    <Sparkles class="w-7 h-7 text-white animate-bounce" />
                </div>
            </div>
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Property Intelligence
                    </h3>
                    <div class="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span class="text-xs font-medium text-green-700">Live</span>
                    </div>
                </div>
                <p class="text-sm text-gray-600">AI-powered insights for your real estate empire</p>
            </div>
        </div>
    </div>
    


    
    <!-- Enhanced Input Area -->
    <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-coral-500/20 via-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-50"></div>
        <div class="relative bg-white rounded-xl border-2 border-gray-200 focus-within:border-coral-500 transition-all duration-300 shadow-lg">
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
                class="absolute right-4 top-4 p-3 rounded-lg bg-gradient-to-br from-coral-500 to-coral-600 text-white hover:from-coral-600 hover:to-coral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
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