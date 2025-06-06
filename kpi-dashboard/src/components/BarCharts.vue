<script setup>
import { Bar } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement, 
    CategoryScale,
    LinearScale
} from 'chart.js';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement, 
    CategoryScale,
    LinearScale
);


const { chartData, chartOptions } = defineProps({
    chartData: {
        type: Object,
        required: true
    },
    chartOptions: {
        type: Object,
        default: () => ({ responsive: true, maintainAspectRatio: false })
    }
});

</script>

<template>
    <div class="chart-container">
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>

<style scoped>
.chart-container {
  height: 400px; 
  width: 100%; 

}
</style>