<script lang="ts">
	export let perk: { name: string; icon: string };
	export let obscureLevel: number = 0;
	const perkBg = '/images/perk-bg.png';

	let initialTilt = 0;

	const STORAGE_KEY = 'survivor_perk_random_tilt';

	if (typeof localStorage !== 'undefined') {
		const storedTilt = localStorage.getItem(STORAGE_KEY);
		if (storedTilt) {
			initialTilt = parseFloat(storedTilt);
		} else {
			initialTilt = Math.floor(Math.random() * 360) - 180;
			localStorage.setItem(STORAGE_KEY, initialTilt.toString());
		}
	}

	$: blurAmount = Math.max(5 - obscureLevel, 0);
	$: tiltAngle = initialTilt * (Math.max(0, 5 - obscureLevel) / 5);
</script>

<div class="relative h-36 w-36">
	<img src={perkBg} alt="" class="h-full w-full" />
	<img
		src={perk.icon}
		alt=""
		class="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2"
		style="filter: blur({blurAmount}px); transform: rotate({tiltAngle}deg); transition: all 0.3s ease;"
	/>
</div>
