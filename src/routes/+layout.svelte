<script>
	import '../app.css';
</script>

<div
	class="min-h-screen bg-black font-sans text-white"
	style="background-image: url('/images/dbd-background.webp'); background-size: cover; background-position: center;"
>
	<main class="grow"><slot /></main>
	<footer
		class="fixed right-0 bottom-0 left-0 border-t border-gray-800 bg-black px-4 py-6 text-center text-xs text-gray-400 opacity-70"
	>
		<p>
			This is an unofficial fan-made game inspired by <strong>Dead by Daylight</strong>.<br />
			All characters, icons, perks, and associated media belong to
			<strong>Behaviour Interactive Inc.</strong>.<br />
			No affiliation or endorsement is implied.
		</p>
	</footer>
</div>
