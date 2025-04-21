<script lang="ts">
	export let perk: { name: string; icon: string };
	const perkBg = '/images/perk-bg.png';
</script>

<div class="relative h-36 w-36">
	<img src={perkBg} alt="" class="h-full w-full" />
	<img
		src={perk.icon}
		alt=""
		class="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2"
	/>
</div>
