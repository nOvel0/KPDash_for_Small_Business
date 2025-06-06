<template>
  <div class="app-wrapper">

    <header>
      <div class="logo-div">
        <img src="@/assets/img/Logo_Dash2.jpg" alt="Logo" class="logo-dash">
        <h1>Dashboard</h1>
      </div>
      <button class="button-question">?</button>
    </header>

    <div class="file-upload-section">
        <h3>Загрузите данные для дашборда:</h3>
        <input type="file" @change="handleFileUpload" accept=".csv"> <p v-if="loading">Загрузка данных...</p>
        <p v-if="error" class="error-message">{{ error }}</p>
        <p v-if="!dataStore.rawData.length && !loading && !error" class="table-description">
            Загрузите файл CSV (Excel XLSX поддержка пока не реализована) для отображения данных.
        </p>
    </div>

    <div class="dashboard-title-bar">
      ОСНОВНАЯ АНАЛИТИКА
    </div>

    <div class="widgets-container">
      <div class="kpi-section">
        <div class="data-card">
          <h3>Общая выручка</h3>
          <p>{{ dataStore.processedData.totalRevenue }}</p>
        </div>

        <div class="data-card">
          <h3>Количество заказов</h3>
          <p>{{ dataStore.processedData.totalOrders }}</p>
        </div>

        <div class="data-card">
          <h3>Средний чек</h3>
          <p>{{ dataStore.processedData.averageCheck }}</p>
        </div>

        <div class="data-card">
          <h3>Общая прибыль</h3>
          <p>{{ dataStore.processedData.totalProfit }}</p>
        </div>

        <div class="data-card">
          <h3>Количество проданных единиц</h3>
          <p>{{ dataStore.processedData.unitsSold }}</p>
        </div>
      </div>

      <div class="graphs-section">
          <div class="data-card">
            <h3>Динамика выручки</h3>
            <p class="graph-description" v-if="!dataStore.processedData.revenueByMonth?.length">Загрузите данные для отображения графика.</p>
            <img v-else src="@/assets/img/graph1.jpg" alt="Динамика выручки" class="responsive-image">
            </div>

          <div class="data-card">
            <h3>Продажи по категориям</h3>
            <p class="graph-description" v-if="!dataStore.processedData.salesByCategory?.length">Загрузите данные для отображения графика.</p>
            <img v-else src="@/assets/img/graph.jpg" alt="Продажи по категориям" class="responsive-image">
            </div>

          <div class="data-card">
            <h3>Средний чек по времени</h3>
            <p class="graph-description" v-if="!dataStore.processedData.averageCheckByTime?.length">Загрузите данные для отображения графика.</p>
            <img v-else src="@/assets/img/graph3.jpg" alt="Средний чек по времени" class="responsive-image">
            </div>

          <div class="data-card">
            <h3>Распределение клиентов</h3>
            <p class="graph-description" v-if="!dataStore.processedData.customerSegmentCounts?.length">Загрузите данные для отображения графика.</p>
            <img v-else src="@/assets/img/graph4.jpg" alt="Распределение клиентов" class="responsive-image">
            </div>
      </div>

      <div class="tables-section">
        <div class="data-card full-width">
          <h3>Последние транзакции</h3>
          <p class="table-description" v-if="!dataStore.rawData.length">Загрузите данные, чтобы увидеть последние транзакции.</p>
          <div v-else class="transaction-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Продукт</th>
                  <th>Категория</th>
                  <th>Выручка</th>
                  <th>Сегмент клиента</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in dataStore.getRawTransactions" :key="index">
                  <td>{{ row.Date }}</td>
                  <td>{{ row.Product }}</td>
                  <td>{{ row.Category }}</td>
                  <td>{{ parseFloat(row.Revenue).toFixed(2) }}</td>
                  <td>{{ row.CustomerSegment }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="data-card full-width">
            <h3>Топ 5 продуктов по выручке</h3>
            <p class="table-description" v-if="!dataStore.processedData.topProducts?.length">Загрузите данные, чтобы увидеть топ продуктов.</p>
            <div v-else class="top-products-table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Продукт</th>
                            <th>Выручка</th>
                            <th>Продано единиц</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(product, index) in dataStore.getTop5Products" :key="index">
                            <td>{{ product.name }}</td>
                            <td>{{ parseFloat(product.revenue).toFixed(2) }}</td>
                            <td>{{ product.units }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useDataStore } from '@/stores/dataStores.js'; // < ИМПОРТИРУЙ PINIA STORE
import { ref } from 'vue'; // ref нужен для реактивных переменных (loading, error)
import Papa from 'papaparse'; // Нужен для парсинга CSV

export default {
  name: 'DashboardOverview',
  // Используем Composition API (setup) для интеграции с Pinia Store и управления состоянием
  setup() {
    const dataStore = useDataStore(); //ИНИЦИАЛИЗИРУЕМ PINIA STORE
    const loading = ref(false); // Состояние загрузки файла
    const error = ref(null);    // Сообщение об ошибке при загрузке

    // Метод для обработки загрузки файла
    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) {
        dataStore.resetData(); // Если файл не выбран или отменен, сбросить данные
        return;
      }

      loading.value = true; // Устанавливаем состояние загрузки
      error.value = null;   // Сбрасываем предыдущие ошибки

      // Проверка типа файла
      if (!file.name.endsWith('.csv')) {
        error.value = 'Пожалуйста, загрузите файл формата CSV.';
        loading.value = false;
        dataStore.resetData(); // Сбросить данные, если файл некорректный
        return;
      }

      try {
        const text = await file.text(); // Читаем содержимое файла как текст
        Papa.parse(text, {
          header: true,         // Первая строка файла - заголовки колонок
          skipEmptyLines: true, // Пропускать пустые строки
          dynamicTyping: true,  // Попытаться автоматически определить типы данных (числа, булевы)
          complete: (results) => {
            if (results.errors.length) {
              console.error("PapaParse errors:", results.errors);
              error.value = "Ошибка при парсинге CSV: " + results.errors[0].message;
              dataStore.resetData();
            } else {
              // Передаем распарсенные данные в Pinia Store
              dataStore.setRawData(results.data);
            }
            loading.value = false; // Загрузка завершена
          },
          error: (err) => { // Обработка ошибок парсинга
            error.value = 'Ошибка при чтении файла: ' + err.message;
            loading.value = false;
            dataStore.resetData();
          }
        });
      } catch (e) {
        error.value = 'Непредвиденная ошибка при обработке файла: ' + e.message;
        console.error(e);
        loading.value = false;
        dataStore.resetData();
      }
    };

    // Чтобы дашборд был пустым при первом запуске (до загрузки файла),
    // или если ты хочешь сбросить его вручную при монтировании:
    dataStore.resetData(); // Можешь раскомментировать, если хочешь чтобы он был пуст при старте

    // Возвращаем все, что должно быть доступно в шаблоне
    return {
      dataStore,        // Весь Pinia Store
      handleFileUpload, // Метод для загрузки файла
      loading,          // Состояние загрузки
      error             // Сообщение об ошибке
    };
  }
};
</script>

<style>
/* ВНИМАНИЕ: Стили, которые я добавил ранее для `.file-upload-section` и `.dashboard-title-bar`,
   теперь должны быть здесь, в этом `<style>` блоке. 
   Если у тебя уже есть эти стили в другом файле CSS, просто убедись, что они применены.
*/

html, body {
  height: 100%;
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f0f2f5;
  overflow-x: hidden; /* Предотвращаем горизонтальный скролл */
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Заполняем всю высоту viewport */
}

/* Header */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #2b3e4f;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.logo-div {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-dash {
  height: 40px;
  border-radius: 10px;
}

header h1 {
  margin: 0;
  font-size: 24px;
  color: #fff;
}

.button-question {
  background-color: #5d758c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

/* File Upload Section - Стили для секции загрузки файла */
.file-upload-section {
    padding: 15px 20px;
    background-color: #e0e5e8;
    border-bottom: 1px solid #ccc;
    text-align: center;
    color: #333;
    flex-shrink: 0;
}
.file-upload-section input[type="file"] {
    margin-top: 10px;
    padding: 8px 12px;
    border: 1px solid #a0a0a0;
    border-radius: 5px;
    background-color: #fff;
    cursor: pointer;
}
.file-upload-section input[type="file"]:hover {
    background-color: #f0f0f0;
}
.file-upload-section .error-message {
    color: red;
    font-weight: bold;
    margin-top: 10px;
}
.file-upload-section h3 {
    margin-top: 0;
    margin-bottom: 5px;
}
.file-upload-section p {
    margin-top: 5px;
    margin-bottom: 0;
    font-size: 14px;
    color: #555;
}


/* Dashboard Title Bar - Стили для полоски с названием дашборда */
.dashboard-title-bar {
  background-color: #3f5466;
  padding: 15px 20px;
  color: #c0c8d1;
  font-size: 18px;
  text-transform: uppercase;
  font-weight: bold;
  flex-shrink: 0;
}

/* Widgets Container (Main Grid Layout) */
.widgets-container {
  padding: 20px;
  display: grid;
  gap: 20px;
  flex-grow: 1; /* Этот блок будет занимать всё доступное пространство */
}

/* KPI Section */
.kpi-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* 5 KPI, адаптивные */
  gap: 20px;
}

/* Graphs Section */
.graphs-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); /* 4 графика, адаптивные */
  gap: 20px;
}

/* Tables Section */
.tables-section {
  display: grid;
  grid-template-columns: 1fr; /* Таблицы занимают всю ширину */
  gap: 20px;
}

/* Data Card (General Style for all widgets) */
.data-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.data-card.full-width {
    grid-column: 1 / -1;
    text-align: left;
    align-items: stretch;
}


.data-card h3 {
  margin-top: 0;
  color: #555;
  font-size: 18px;
  margin-bottom: 10px;
}

/* KPI numbers/text */
.data-card p {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 0;
  line-height: 1.2;
}

/* Descriptions for graphs and tables */
.data-card .graph-description,
.data-card .table-description {
    font-size: 14px;
    font-weight: normal;
    color: #777;
    margin-top: 5px;
    margin-bottom: 10px;
    text-align: center;
    width: 100%;
}

/* Responsive Image Placeholders for Graphs */
.responsive-image {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
  min-height: 150px;
  object-fit: contain;
  border: 1px dashed #ccc;
}

/* Table Specific Styles */
.transaction-table-wrapper, .top-products-table-wrapper {
    max-height: 400px;
    overflow-y: auto;
    width: 100%;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 0;
    font-size: 14px;
    table-layout: fixed;
}
table th, table td {
    border: 1px solid #eee;
    padding: 10px;
    text-align: left;
    word-break: break-word;
}
table th {
    background-color: #f8f8f8;
    font-weight: bold;
    color: #444;
    position: sticky;
    top: 0;
    z-index: 1;
}
table tr:nth-child(even) {
    background-color: #f9f9f9;
}
table tr:hover {
    background-color: #f1f1f1;
}

</style>