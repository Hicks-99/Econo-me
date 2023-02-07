<script>	
	import { afterUpdate } from 'svelte';
	import { tweened } from 'svelte/motion';

	export let inflation;
    export let inflationValue;
    const numbersWithZero = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reverse();
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].reverse();
    let sign, countdownFirstDigit, countdownLastDigit, decimal;
    let type = "";
    let timer;

    let secondH = tweened(-9 * 60, { duration: 300 });
	let secondL = tweened(-1 * 60, { duration: 300 });
    let signH = tweened(0, { duration: 300 });
    let decimalH = tweened(-9 * 60, { duration: 300 });
    let zero = tweened(1 * 20, { duration: 300 });
    let box = tweened(180, { duration: 300 });
    let value = tweened(0, { duration: 300 });
	
    $: if(inflationValue) startAnimation();
    $: sign = inflation.slice(-1)[0] >= 0 ? 1 : 0;
    $: countdownFirstDigit = Math.abs(Math.floor((Math.abs(inflation.slice(-1)[0]) / 10) % 10));
    $: countdownLastDigit = Math.floor((Math.abs(inflation.slice(-1)[0]) / 1) % 10);
    $: decimal = (Math.abs(inflation.slice(-1)[0]) % 1).toFixed(1)*10 === 10 ? 0 : (Math.abs(inflation.slice(-1)[0]) % 1).toFixed(1)*10;

    afterUpdate(() => {
        setTimeout(() => {
            secondH.set((-9 + countdownFirstDigit) * 60);
            secondL.set((-9 + countdownLastDigit) * 60);	
            signH.set((-1 + sign) * 60);
            decimalH.set((-9 + decimal) * 60);
            zero.set((countdownFirstDigit === 0 ? 1 : 0) * 20);
            box.set((countdownFirstDigit === 0 ? 180 : 220));
        }, 600)
	});

    function startAnimation(){
        type = ""
        clearTimeout(timer)
        value.set(inflationValue, { duration: 0 })
        type = "points";
        timer = setTimeout(() => {
            inflationValue = 0;
            type = "";
        }, 1000)
        setTimeout(() => {
            value.set(0)
        }, 400)
    };
</script>


<div style="width: {$box}px; font-family: 'ui-monospace', monospace" class="flex justify-center h-[4.25rem] overflow-hidden text-white bg-gray-800 rounded-lg p-1 px-2">
    <ul style="transform: translateX({$zero}px);" class="text-center mr-2">
        <li style="transform: translateY({$signH}px);">
            <span class="text-6xl">+</span>
        </li>
        <li style="transform: translateY({$signH}px);">
            <span class="text-6xl">-</span>
        </li>
    </ul>
    <div style="transform: translateX(-{$zero}px);" class="flex">
        <ul class="text-center">
            {#each numbers as num}
                <li class="num" style="transform: translateY({$secondH}px);">
                    <span class="text-6xl">{num}</span>
                </li>
            {/each}
        </ul>
        <ul class="text-center">
            {#each numbersWithZero as num}
                <li style="transform: translateY({$secondL}px);">
                    <span class="text-6xl">{num}</span>
                </li>
            {/each}
        </ul>
        <p class="text-6xl -mx-2">.</p>
        <ul class="text-center">
            {#each numbersWithZero as num}
                <li style="transform: translateY({$decimalH}px);">
                    <span class="text-6xl">{num}</span>
                </li>
            {/each}
        </ul>
        <span class="text-6xl pl-2">%</span>
    </div>
</div>
<p class="absolute text-5xl text-white {type} font-mono opacity-0">{inflationValue >= 0 ? "+" + $value.toFixed(1) : $value.toFixed(1)}%</p>


<style>
    .points{
        animation: getPoints 1s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }

    @keyframes getPoints {
        0% {
            transform: translateY(80px);
        }
        20% {
            opacity: 100;
        }
        40% {
            transform: translateY(80px);
        }
        100% {
            transform: translateY(10px) scale(0%); 
        }
    }
</style>