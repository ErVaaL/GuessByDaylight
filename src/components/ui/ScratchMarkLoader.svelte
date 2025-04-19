<div class="loader">
	<div class="scratch"></div>
	<div class="scratch"></div>
	<div class="scratch"></div>
</div>

<!-- ScratchMarkLoader.svelte -->
<style>
	.loader {
		display: flex;
		gap: 4px;
	}

	.scratch {
		width: 6px;
		height: 40px;
		background-color: #ff0000;
		animation: flicker 0.6s infinite alternate;
		border-radius: 2px;
	}

	.scratch:nth-child(2) {
		animation-delay: 0.1s;
	}
	.scratch:nth-child(3) {
		animation-delay: 0.2s;
	}

	@keyframes flicker {
		from {
			opacity: 1;
			transform: scaleY(1);
		}
		to {
			opacity: 0.4;
			transform: scaleY(0.7) rotate(-2deg);
		}
	}
</style>
