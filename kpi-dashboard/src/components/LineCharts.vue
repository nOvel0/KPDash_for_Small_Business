<script setup>
import { Line } from 'vue-chartjs';
import{
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from 'chart.js';


ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
);

const { chartData, chartOptions } = defineProps({
    chartData: {
        type: Object,
        required: true
    },
    chartOptions: { // Это будут настройки графика
        type: Object,
        default: () => ({ responsive: true, maintainAspectRatio: false })
    }
});

</script>


<template>

<div class="chart-container">
    <Line :data="chartData" :options="chartOptions" />

</div>    
</template>


<style scoped>
.chart-container {
  /* Задай фиксированную высоту */
  height: 400px; /* Или любую другую высоту, которая тебе нужна */
  width: 100%; /* Или фиксированную ширину */

  /* Или максимальную высоту, чтобы он не выходил за ее пределы */
  /* max-height: 500px; */
}
</style>