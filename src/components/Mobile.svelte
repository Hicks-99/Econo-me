<script>
	import { tweened } from 'svelte/motion';
    import Countdown from '../components/Countdown.svelte';
    import Chart from './Chart.svelte';

    export let question;
    export let event;
    let flipped = "question";
    let button = -1;
    let counter = 0;
    let eventCounter = 0;
    let inflation = [8];
    let inflationValue;
    let gameOver = false;

    $: if(gameOver) inflation.length !== 12 ? flipped = "game over" : flipped = "result";

    function flip(node, {
		delay = 0,
		duration = 500
	}) {
		return {
			delay,
			duration,
			css: (t, u) => `
				transform: rotateY(${1 - (u * 180)}deg);
				opacity: ${1 - u};
			`
		};
	}
    
    function CheckIfCorrect() {
        if(inflation.slice(-1)[0] >= question[counter].answer[button].interval_start && inflation.slice(-1)[0] <= question[counter].answer[button].interval_end){
            inflationValue = question[counter].answer[button].value_correct;
            inflation = [...inflation, inflation.slice(-1)[0] + question[counter].answer[button].value_correct];
            return question[counter].answer[button].solution_correct;
        } else {
            inflationValue = question[counter].answer[button].value_false;
            inflation = [...inflation, inflation.slice(-1)[0] + question[counter].answer[button].value_false];
            return question[counter].answer[button].solution_false;
        }
    }

    function addEvent() {
        flipped = "event";
        inflationValue = event[eventCounter].value;
        inflation[inflation.length-1] += event[eventCounter].value;
    }

    function restart(){
        question = undefined;
        event = undefined;
        counter = 0;
        eventCounter = 0;
        button = -1;
        inflation=[8];
        gameOver = false;
        flipped = "question";
    }
</script>



<section class="flex justify-center bg-black p-4">
    <div class="flex flex-col w-full max-w-4xl">
        <div class="text-white text-center pb-8">
            <h1 class="text-6xl font-semibold mb-10">Nun sind Sie am Zug!</h1>
            <p class="text-2xl mb-4 before:content-[open-quote] before:text-4xl before:font-bold before:pr-2 after:content-[close-quote] after:text-4xl after:font-bold after:pl-2">
                Sie haben die Aufgabe die wirtschaftliche Lage Ihres Staates wieder in den Griff zu bekommen. Haben Sie die Inflation im Griff oder stürzen Sie den Staat in den Ruin?
            </p>
            <p class="text-sm before:content-['*'] before:text-xl before:font-bold before:pr-2">
                Das hier zu sehende Szenario ist fiktiv. Jeglicher Bezug auf die reale Welt dient zur Veranschaulichung
            </p>
        </div>
        <div class="flex justify-center w-full z-10">
            <Countdown bind:inflationValue {inflation}/>
        </div>
        <div class="min-w-0 h-[21rem] w-full mt-8">
            <Chart bind:inflation bind:gameOver />
        </div>
        <div class="flex flex-col relative justify-between w-full mt-8">
            <div class="relative text-lg font-semibold">
                {#if flipped === "question"}
                    <div transition:flip class="flex flex-col justify-between absolute rounded-xl w-full bg-yellow-300 p-4 space-y-6">
                        <div class="text-center">
                            {question[counter].question}
                        </div>
                        <div class="space-y-2">
                            {#each question[counter].answer as answer, id}
                                <button style={button === id ? "border-width: 3px; border-color: blue; background-color: rgb(202 138 4)" : ""} on:click={() => button === id ? button = -1 : button = id} id={id} class="flex flex-col justify-center items-center rounded-xl bg-yellow-500 min-h-[4rem] p-2 w-full">
                                    <p>{answer.text}</p>
                                    <p class="text-base bg-yellow-500 rounded-lg p-2 transition-[max-height] ease-linear duration-500 w-full overflow-hidden max-h-0 {button === id ? " max-h-96": "invisible -m-2"}">{answer.description}</p>
                                </button>
                            {/each}
                            <button style={button < 0 ? "background-color: rgb(22 101 52)" : "background-color: rgb(34 197 94)"} disabled={button < 0} on:click={() => question[counter].answer[button].game_over ? gameOver = true : flipped = "description"} class="rounded-xl h-16 w-full transition-colors duration-500">Bestätigen</button>
                        </div>
                    </div>
                {:else if flipped === "description"}
                    <div style={inflation.slice(-1)[0] >= question[counter].answer[button].interval_start && inflation.slice(-1)[0] <= question[counter].answer[button].interval_end ? "background-color: rgb(34 197 94)" : "background-color: rgb(239 68 68)"} transition:flip class="flex flex-col justify-between absolute rounded-xl p-4 w-full space-y-6">
                        <p class="text-center text-2xl font-semibold">{inflation.slice(-1)[0] >= question[counter].answer[button].interval_start && inflation.slice(-1)[0] <= question[counter].answer[button].interval_end ? "Richtig!" : "Falsch!"}</p>
                        <p class="text-center text-sm">
                            {CheckIfCorrect()}
                        </p>
                        <button on:click={() => {button = -1; counter++; (Math.round(inflation.slice(-1)[0]) === 2 || Math.floor(Math.random() * 3) === 2) && counter != 11 ? addEvent() : counter === 11 ? gameOver = true : flipped = "question";}} class="rounded-xl bg-yellow-500 h-16 w-full">
                            {counter === 10 ? "Ergebnis" : "Nächste Frage"}
                        </button>
                    </div>
                {:else if flipped === "game over"}
                    <div transition:flip class="flex flex-col justify-between text-center absolute rounded-xl bg-red-500 p-4 space-y-6">
                        <p class="text-center text-2xl font-semibold">Game Over</p>
                        <p>
                            {question[counter].answer[button].solution_false}
                        </p>
                        <button on:click={() => restart()} class="rounded-xl bg-yellow-500 h-16 w-fulf">
                            Neustarten
                        </button>
                    </div>
                {:else if flipped === "event"}
                    <div transition:flip class="flex flex-col justify-between items-center rounded-xl absolute text-center w-full bg-blue-600 p-4 space-y-6">
                        <p>Event</p>
                        <p class="text-2xl font-semibold">{event[eventCounter].name}</p>
                        <p>
                            {event[eventCounter].description}
                        </p>
                        <p>Die Inflationsrate {event[eventCounter].value >= 0 ? "steigt" : "sinkt"} um {event[eventCounter].value}%</p>
                        <button on:click={() => {flipped = "question"; eventCounter++}} class="rounded-xl bg-yellow-500 h-16 w-full">
                            Zur Kenntnis genommen
                        </button>
                    </div>
                {:else if flipped === "result"}
                    <div style={inflation.slice(-1)[0] <= 6 ? "background-color: rgb(34 197 94)" : "background-color: rgb(239 68 68)"} transition:flip class="flex flex-col justify-between absolute w-full rounded-xl p-4 space-y-6">
                        <p class="text-center text-2xl font-semibold">Ergebnis</p>
                        <p class="text-center text-sm">
                            {
                                inflation.slice(-1)[0] <= 6 ? "Wir möchten uns an dieser Stelle herzlich bei Ihnen bedanken für Ihre harte Arbeit bei der Bekämpfung der Inflation. Ihre unermüdliche Anstrengung hat wesentlich dazu beigetragen, die Wirtschaft stabil zu halten und die Lebensqualität der Menschen zu verbessern. Wir schätzen Ihr Engagement und Ihre Leidenschaft für die Aufgabe, die Sie übernommen haben. Vielen Dank für Ihre Dienste und für Ihr unermüdliches Bestreben, eine bessere Zukunft für uns alle zu schaffen." : "Es tut uns leid, Ihnen mitzuteilen, dass aufgrund Ihrer mangelnden Leistungen bei der Bekämpfung der Inflation, wir uns gezwungen sehen, unsere Zusammenarbeit zu beenden. Obwohl wir Ihre Bemühungen schätzen, haben Sie nicht den erwarteten Fortschritt erzielt und die notwendigen Maßnahmen zur Kontrolle der Inflation umgesetzt. Wir bedauern, dass wir diese Entscheidung treffen müssen, aber wir danken Ihnen trotzdem für Ihre Dienste und wünschen Ihnen alles Gute für die Zukunft."
                            }
                        </p>
                        <button on:click={() => restart()} class="rounded-xl bg-yellow-500 h-16 w-full">
                            Neustarten
                        </button>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</section>