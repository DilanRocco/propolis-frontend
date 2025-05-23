<script lang="ts">
	import type { ComponentType } from 'svelte';
	
	export let icon: ComponentType | null = null;
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let color: 'gray' | 'coral' | 'white' | 'black' = 'gray';
	export let bgColor: 'transparent' | 'white' | 'coral' | 'gray' = 'transparent';
	export let iconColor: string = '';
	export let rounded: 'full' | 'lg' | 'md' | 'sm' = 'full';
	export let shadow: boolean = false;
	export let border: boolean = false;
	
	// Computed classes remain the same
	$: sizeClass = {
		sm: 'p-1',
		md: 'p-2',
		lg: 'p-3'
	}[size] || 'p-2';
	
	$: iconSizeClass = {
		sm: 'w-4 h-4',
		md: 'w-5 h-5',
		lg: 'w-6 h-6'
	}[size] || 'w-5 h-5';
	
	$: bgColorClass = bgColor === 'transparent'
		? ''
		: `bg-${bgColor === 'coral' ? 'coral-500' : bgColor === 'gray' ? 'gray-100' : bgColor}`;
	
	$: computedIconColor = iconColor ||
		{
			gray: 'text-gray-600',
			coral: 'text-coral-500',
			white: 'text-white',
			black: 'text-gray-800'
		}[color] ||
		'text-gray-600';
	
	$: roundedClass = `rounded-${rounded}`;
	$: shadowClass = shadow ? 'shadow-sm' : '';
	$: borderClass = border ? 'border border-gray-200' : '';
</script>

<button
	class="{sizeClass} {bgColorClass} {roundedClass} {shadowClass} {borderClass} flex items-center justify-center"
	on:click
>
	{#if icon}
		<svelte:component this={icon} class="{iconSizeClass} {computedIconColor}" />
	{/if}
	<slot></slot>
</button>