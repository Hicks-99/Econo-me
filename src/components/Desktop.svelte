<script>
    import { fly } from 'svelte/transition';
    import Countdown from '../components/Countdown.svelte';
    import Chart from './Chart.svelte';

    export let question;
    export let event;
    let hover = -1;
    let status = true;
    let flipped = "question";
    let button = 0;
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
        inflation=[8];
        gameOver = false;
        flipped = "question";
    }
</script>



<section class="flex items-center justify-center bg-black p-10 w-full min-h-screen">
    <div class="flex flex-col w-full max-w-7xl">
        <div class="text-white text-center pb-14">
            <h1 class="text-6xl font-semibold mb-10">Nun sind Sie am Zug!</h1>
            <p class="text-2xl mb-4 before:content-[open-quote] before:text-4xl before:font-bold before:pr-2 after:content-[close-quote] after:text-4xl after:font-bold after:pl-2">
                Sie haben die Aufgabe die wirtschaftliche Lage Ihres fiktiven Staates wieder in den Griff zu bekommen. Haben Sie die Inflation im Griff oder stürzen Sie den Staat in den Ruin?
            </p>
            <p class="text-sm before:content-['*'] before:text-xl before:font-bold before:pr-2">
                Das hier zu sehende Szenario ist fiktiv. Jeglicher Bezug auf die reale Welt dient zur Veranschaulichung
            </p>
        </div>
        <div class="flex relative h-[25rem] justify-between w-full">
            <div class="flex-shrink-0 w-[22rem] relative text-lg font-semibold">
                {#if flipped === "question"}
                    <div transition:flip class="h-full w-full absolute rounded-xl bg-yellow-300 p-4">
                        <div class="h-28 text-center">
                            {question[counter].question}
                        </div>
                        {#each question[counter].answer as answer, id}
                            <button on:click={() => {button = id; question[counter].answer[id].game_over ? gameOver = true : flipped = "description"}} on:mouseover={() => hover = id} on:mouseout={() => hover = -1} on:focus on:blur id={id} class="rounded-xl bg-yellow-500 hover:bg-yellow-600 my-1 p-2 h-20 w-full transition-colors duration-500">
                                <p class="text-base">{answer.text}</p>
                            </button>
                        {/each}
                    </div>
                {:else if flipped === "description"}
                    <div style={inflation.slice(-1)[0] >= question[counter].answer[button].interval_start && inflation.slice(-1)[0] <= question[counter].answer[button].interval_end ? "background-color: rgb(34 197 94)" : "background-color: rgb(239 68 68)"} transition:flip class="flex flex-col justify-between h-full w-full absolute rounded-lg text-base text-center p-4">
                        <p class="text-center text-2xl font-semibold">{inflation.slice(-1)[0] >= question[counter].answer[button].interval_start && inflation.slice(-1)[0] <= question[counter].answer[button].interval_end ? "Richtig!" : "Falsch!"}</p>
                        <p class="text-center text-sm">
                            {CheckIfCorrect()}
                        </p>
                        <button on:click={() => {counter++; (Math.round(inflation.slice(-1)[0]) === 2 || Math.floor(Math.random() * 3) === 2) && counter != 11 ? addEvent() : counter === 11 ? gameOver = true : flipped = "question";}} class="rounded-xl bg-yellow-500 hover:bg-yellow-600 h-20 w-full transition-colors duration-500">
                            {counter === 10 ? "Ergebnis" : "Nächste Frage"}
                        </button>
                    </div>
                {:else if flipped === "game over"}
                    <div transition:flip class="flex flex-col justify-between h-full w-full absolute bg-red-500 rounded-lg text-base text-center p-4">
                        <p class="text-center text-2xl font-semibold">Game Over</p>
                        <p>
                            {question[counter].answer[button].solution_false}
                        </p>
                        <button on:click={() => restart()} class="rounded-xl bg-yellow-500 hover:bg-yellow-600 h-20 w-full transition-colors duration-500">
                            Neustarten
                        </button>
                    </div>
                {:else if flipped === "event"}
                    <div transition:flip class="flex flex-col justify-between h-full w-full absolute bg-blue-600 rounded-lg text-base text-center p-4">
                        <p>Event</p>
                        <p class="text-center text-2xl font-semibold">{event[eventCounter].name}</p>
                        <p>
                            {event[eventCounter].description}
                        </p>
                        <p>Die Inflationsrate {event[eventCounter].value >= 0 ? "steigt" : "sinkt"} um {event[eventCounter].value}%</p>
                        <button on:click={() => {flipped = "question"; eventCounter++}} class="rounded-xl bg-yellow-500 hover:bg-yellow-600 h-20 w-full transition-colors duration-500">
                            Zur Kenntnis genommen
                        </button>
                    </div>
                {:else if flipped === "result"}
                    <div style={inflation.slice(-1)[0] <= 6 ? "background-color: rgb(34 197 94)" : "background-color: rgb(239 68 68)"} transition:flip class="flex flex-col justify-between h-full w-full absolute rounded-lg text-base text-center p-4">
                        <p class="text-center text-2xl font-semibold">Ergebnis</p>
                        <p class="text-center text-sm">
                            {
                                inflation.slice(-1)[0] <= 6 ? "Wir möchten uns an dieser Stelle herzlich bei Ihnen bedanken für Ihre harte Arbeit bei der Bekämpfung der Inflation. Ihre unermüdliche Anstrengung hat wesentlich dazu beigetragen, die Wirtschaft stabil zu halten und die Lebensqualität der Menschen zu verbessern. Wir schätzen Ihr Engagement und Ihre Leidenschaft für die Aufgabe, die Sie übernommen haben. Vielen Dank für Ihre Dienste und für Ihr unermüdliches Bestreben, eine bessere Zukunft für uns alle zu schaffen." : "Es tut uns leid, Ihnen mitzuteilen, dass aufgrund Ihrer mangelnden Leistungen bei der Bekämpfung der Inflation, wir uns gezwungen sehen, unsere Zusammenarbeit zu beenden. Obwohl wir Ihre Bemühungen schätzen, haben Sie nicht den erwarteten Fortschritt erzielt und die notwendigen Maßnahmen zur Kontrolle der Inflation umgesetzt. Wir bedauern, dass wir diese Entscheidung treffen müssen, aber wir danken Ihnen trotzdem für Ihre Dienste und wünschen Ihnen alles Gute für die Zukunft."
                            }
                        </p>
                        <button on:click={() => restart()} class="rounded-xl bg-yellow-500 hover:bg-yellow-600 h-20 w-full transition-colors duration-500">
                            Neustarten
                        </button>
                    </div>
                {/if}
            </div>
            <div class="flex absolute justify-center w-full">
                <Countdown bind:inflationValue {inflation}/>
            </div>
            <div class="min-w-0 h-[21rem] mt-16 w-full pl-10">
                <Chart bind:inflation bind:gameOver />
            </div>
            {#if hover >= 0 && status}
                <div class="absolute right-0 w-[22rem] h-full z-10 overflow-hidden">
                    <div transition:fly={{ x: 200, duration: 400 }} on:outrostart={() => status = false} on:outroend={() => setTimeout(() => { status = true }, 100)} class="rounded-xl bg-yellow-300 p-4 w-full h-full text-lg font-semibold">
                        <p class="mb-8 text-center text-2xl font-semibold">Beschreibung</p>
                        <p class="text-center text-base">{question[counter].answer[hover].description}</p>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</section>