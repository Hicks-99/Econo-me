<script>
    import Chart from 'chart.js/auto';
    import { onMount } from 'svelte';

    export let inflation;
    export let gameOver;
    let canvas, chart;
    let delayed;
    let germanInflation;

    $: if(chart) gameOver ? chart.config.data.datasets[1] = germanInflation : chart.config.data.datasets = chart.config.data.datasets.filter(d => d !== germanInflation);
    $: if(chart) chart.config.data.datasets[0].data = inflation;
    $: if(chart) chart.update();

    onMount(()=> {
        const ctx = canvas.getContext('2d');

        //Gradient Fill
        let green = ctx.createLinearGradient(0, 0, 0, 300);
        green.addColorStop(0, "#22c55ecc");
        green.addColorStop(1, "#22c55e00");
        let red = ctx.createLinearGradient(0, 0, 0, 300);
        red.addColorStop(0, "#ff0000cc");
        red.addColorStop(1, "#ff000000");

        germanInflation =  {
                label: "Inflationsrate in Deutschland 2022",
                data: [5.3, 4.9, 5.1, 7.3, 7.4, 7.9, 7.6, 7.5, 7.9, 10, 10.4, 10, 8.6],
                fill: true,
                backgroundColor: red,
                borderColor: "#f00",
                pointBackgroundColor: "#f00",
                tension: 0.4
            }

        const data = {
            labels: ['Januar', 'Feburar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            datasets: [{
                label: "Ihre Inflationsrate",
                data: inflation,
                fill: true,
                backgroundColor: green,
                borderColor: "#22c55e",
                pointBackgroundColor: "#22c55e",
                tension: 0.4,
            }]
        };
        
        const config = {
            type: "line",
            data: data,
            options: {
                radius: 5,
                hitRadius: 30,
                hoverRadius: 10,
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    onComplete: () => {
                        delayed = true;
                    },
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === "data" && context.mode === "default" && !delayed) {
                            delay = context.dataIndex * 100 + context.datasetIndex * 100;
                        }
                        return delay;
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: "#fff"
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: "#fff",
                            callback: function(value){
                                return value + "%";
                            }
                        },
                        grid: {
                            color: (context) => {
                                const zeroLine = context.tick.value;
                                const gridColor = zeroLine === 0 ? '#fff' : '';
                                return gridColor;
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        align: "end",
                        labels: {
                            color: "#fff",
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        };
        chart = new Chart(ctx, config);
    });
</script>


<canvas bind:this={canvas} />