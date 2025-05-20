<template>
  <div class="dashboard-page">
    <header class="dashboard-header">
      <h1>DASHBOARD NAME</h1>
      <div class="header-actions">
        <button class="action-button">Filters</button>
        <button class="action-button">Add Widget</button>
        <button class="action-button">Share</button>
        <button class="action-button">Export</button>
      </div>
    </header>

    <div class="dashboard-grid">
      <KPICard title="Общая выручка" :value="formattedTotalRevenue" />

      <KPICard title="Количество заказов" :value="totalOrders" />

      <KPICard title="Средний чек" :value="formattedAverageCheck" />
      
      <div class="placeholder-widget">
        <h3>Chart Placeholder</h3>
        <p>Chart will be rendered here</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useDataStore } from '../stores/dataStore';
import KPICard from '../components/widgets/KPICard.vue';

export default defineComponent({
  name: 'DashboardOverview',
  components: {
    KPICard,
  },
  setup() {
    const dataStore = useDataStore();

    // Создаем реактивные переменные для хранения KPI
    const totalRevenue = ref(0);
    const totalOrders = ref(0);
    const averageCheck = ref(0); // Имя переменной с маленькой буквы

    onMounted(() => {
      dataStore.loadData([
        { orderId: 'ORD001', productId: 'P001', price: 100, quantity: 1, date: '2023-01-01' },
        { orderId: 'ORD001', productId: 'P002', price: 50, quantity: 2, date: '2023-01-01' },
        { orderId: 'ORD002', productId: 'P003', price: 200, quantity: 1, date: '2023-01-02' },
        { orderId: 'ORD003', productId: 'P004', price: 150, quantity: 1, date: '2023-01-03' },
        { orderId: 'ORD003', productId: 'P005', price: 75, quantity: 2, date: '2023-01-03' },
        { orderId: 'ORD004', productId: 'P006', price: 300, quantity: 1, date: '2023-01-04' },
      ]);

      totalRevenue.value = dataStore.uploadedData.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      const uniqueOrderIds = new Set(dataStore.uploadedData.map(item => item.orderId));
      totalOrders.value = uniqueOrderIds.size;

      if (totalOrders.value > 0) {
        averageCheck.value = totalRevenue.value / totalOrders.value;
      } else {
        averageCheck.value = 0;
      }
    });

    const formattedTotalRevenue = computed(() => {
      return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(totalRevenue.value);
    });

    const formattedAverageCheck = computed(() => {
      return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(averageCheck.value);
    });
   
    return {
      totalOrders,
      formattedTotalRevenue, 
      formattedAverageCheck,
    };
  },
});
</script>


<style scoped>
/* Базовые стили для всей страницы дашборда */
.dashboard-page {
  background-color: #f0f2f5; /* Светло-серый фон, как на шаблоне */
  min-height: 100vh; /* Минимальная высота на весь экран */
  padding: 20px; /* Отступы по краям страницы */
  font-family: Arial, sans-serif; /* Пример шрифта */
  color: #333;
}

/* Стили для верхней панели заголовка */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  margin-bottom: 30px; /* Отступ от заголовка до сетки виджетов */
}

.dashboard-header h1 {
  font-size: 2em;
  color: #333;
  margin: 0;
}

.header-actions .action-button {
  background-color: #42b983; /* Цвет Vue.js, можно изменить */
  color: white;
  border: none;
  padding: 8px 15px;
  margin-left: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s ease;
}

.header-actions .action-button:hover {
  background-color: #368a68;
}

/* Стили для сетки виджетов (используем CSS Grid) */
.dashboard-grid {
  display: grid;
  /* Автоматически подстраиваем количество колонок, чтобы виджеты были минимум 300px шириной */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px; /* Расстояние между ячейками сетки */
}

/* Стили для временных заглушек виджетов */
.placeholder-widget {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
  text-align: center;
  min-height: 180px; /* Минимальная высота для виджета */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #777;
}

.placeholder-widget h3 {
  margin-bottom: 10px;
  color: #555;
}
</style>