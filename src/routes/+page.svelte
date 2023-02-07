<script>
	import { onMount } from 'svelte';
    import Desktop from '../components/Desktop.svelte';
    import Mobile from '../components/Mobile.svelte';
    import * as questions from '../questions.json'
    import * as events from '../events.json';

    let width;
    let question;
    let event;
    let loaded = false;

    $: if(!question) shuffleQuestions();
    $: if(!event) shuffleEvents();

    function shuffleQuestions(){
        question = shuffle(questions.default);
        for (let i = 0; i < question.length; i++) {
            question[i].answer = shuffle(question[i].answer);
        }
    }

    function shuffleEvents(){
        event = shuffle(events.default);
    }

    function shuffle(a) {
        let j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    onMount(() => {
        loaded = true;
    });
</script>


<svelte:window bind:innerWidth={width} />
{#if !loaded}
    <h1 class="grid h-screen w-full place-items-center text-white text-5xl font-bold loading">Loading</h1>
{:else}
    {#if !window.matchMedia('(hover: none), (pointer: coarse)').matches && width >= 1000}
        <Desktop bind:question bind:event />
    {:else}
        <Mobile bind:question bind:event />
    {/if}
{/if}


<style>
.loading {
    animation: fadeIn 2s;
}
.loading:after {
    position: absolute;
    margin-left: 12.5rem;
    content: '.';
    animation: dots 2s steps(5, end) infinite;}

@keyframes dots {
    0%, 20% {
        color: rgba(0,0,0,0);
        text-shadow:
        .25em 0 0 rgba(0,0,0,0),
        .5em 0 0 rgba(0,0,0,0);}
    40% {
        color: white;
        text-shadow:
        .25em 0 0 rgba(0,0,0,0),
        .5em 0 0 rgba(0,0,0,0);}
    60% {
        text-shadow:
        .25em 0 0 white,
        .5em 0 0 rgba(0,0,0,0);}
    80%, 100% {
        text-shadow:
        .25em 0 0 white,
        .5em 0 0 white;}}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 100;
    }
}
</style>