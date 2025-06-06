import { defineStore } from 'pinia';

export const useDataStore = defineStore('data', {
  // State: Это данные. Они будут реактивными.
  state: () => ({
    rawData: [], // Сырые данные, полученные после парсинга CSV/XLSX
    processedData: { // Обработанные данные для KPI, графиков, таблиц
      totalRevenue: '0',
      totalOrders: '0',
      averageCheck: '0',
      totalProfit: '0',
      unitsSold: '0',
      topProducts: [], // Для таблицы "Топ 5 продуктов"
      // Можно добавить сюда данные для графиков:
      revenueByMonth: [],
      salesByCategory: [],
      averageCheckByTime: [],
      customerSegmentCounts: []
    },
  }),

  // Getters: Это вычисляемые свойства. Они будут автоматически обновляться при изменении state.
  getters: {
    // Пример геттера, который просто возвращает общую выручку (пока что из processedData,
    // но в будущем он будет вычислять её из rawData)
    getKpiData: (state) => state.processedData,

    getRawTransactions: (state) => state.rawData.slice(0, 10), // Последние 10 транзакций
    getTop5Products: (state) => state.processedData.topProducts.slice(0, 5), // Топ 5 продуктов
  },

  // Actions: Это методы, которые изменяют состояние или выполняют асинхронные операции.
  actions: {
    // Это действие будет вызываться, когда ты загрузишь файл.
    // Оно принимает сырые данные (например, из PapaParse) и сохраняет их.
    setRawData(data) {
      this.rawData = data;
      // Здесь же, после сохранения сырых данных, мы вызываем метод для их обработки.
      this.processData();
    },

    // Это действие будет обрабатывать сырые данные и вычислять все KPI, данные для графиков и таблиц.
    processData() {

      console.log('>>> processData: Начало выполнения'); 
      if (this.rawData.length === 0) {
        // Если данных нет, сбрасываем все обработанные данные к нулю/пустым массивам
        this.processedData = {
          totalRevenue: '0',
          totalOrders: '0',
          averageCheck: '0',
          totalProfit: '0',
          unitsSold: '0',
          topProducts: [],
          revenueByMonth: [],
          salesByCategory: [],
          averageCheckByTime: [],
          customerSegmentCounts: []
        };

        return;
      }
      

      // --- Расчет KPI ---
      let totalRevenue = 0;
      let totalOrders = 0; // Для простоты, пока считаем каждую строку как отдельный заказ
      let unitsSold = 0;
      let totalProfit = 0; // Добавим для расчета прибыли

      // Используем Map для агрегации данных по продуктам для топ-продуктов
      const productSales = new Map();

      this.rawData.forEach(row => {
        const revenue = parseFloat(row.Revenue);
        const quantity = parseInt(row.Quantity || '1'); // Если нет колонки Quantity, считаем 1
        const profit = parseFloat(row.Profit || row.Revenue * 0.3); // Пример: если нет колонки Profit, считаем 30% от выручки

        if (!isNaN(revenue)) {
          totalRevenue += revenue;
          totalOrders++; // Простое отслеживание заказов
        }
        if (!isNaN(quantity)) {
          unitsSold += quantity;
        }
        if (!isNaN(profit)) {
          totalProfit += profit;
        }

        // Агрегация для топ-продуктов
        const productName = row.Product;
        if (productName) {
          const currentData = productSales.get(productName) || { revenue: 0, units: 0 };
          currentData.revenue += isNaN(revenue) ? 0 : revenue;
          currentData.units += isNaN(quantity) ? 0 : quantity;
          productSales.set(productName, currentData);
        }
      });

      // Расчет среднего чека
      const averageCheck = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0';

      // Форматирование KPI
      this.processedData.totalRevenue = totalRevenue.toFixed(2);
      this.processedData.totalOrders = totalOrders.toString();
      this.processedData.averageCheck = averageCheck;
      this.processedData.unitsSold = unitsSold.toString();
      this.processedData.totalProfit = totalProfit.toFixed(2); // Сохраняем рассчитанную прибыль

      // --- Расчет Топ 5 продуктов ---
      const sortedProducts = Array.from(productSales.entries())
        .map(([name, data]) => ({ name, revenue: data.revenue, units: data.units }))
        .sort((a, b) => b.revenue - a.revenue); // Сортируем по выручке по убыванию

      this.processedData.topProducts = sortedProducts;
      

      // --- Расчет данных для графиков (заглушки) ---
      // В будущем здесь будет реальная логика для построения данных графиков
      this.processedData.revenueByMonth = [
        { month: 'Янв', value: 10000 },
        { month: 'Фев', value: 12000 },
        { month: 'Мар', value: 11000 },
        { month: 'Апр', value: 13000 },
        { month: 'Май', value: 15000 }
    ];
    this.processedData.salesByCategory = [
        { category: 'Электроника', value: 40 },
        { category: 'Аксессуары', value: 25 },
        { category: 'Периферия', value: 20 },
        { category: 'Мобильные устройства', value: 15 }
    ];
    this.processedData.averageCheckByTime = [
        { month: 'Янв', value: 90 },
        { month: 'Фев', value: 95 },
        { month: 'Мар', value: 92 },
        { month: 'Апр', value: 100 },
        { month: 'Май', value: 105 }
    ];
    this.processedData.customerSegmentCounts = [
        { segment: 'Новые', count: 300 },
        { segment: 'Существующие', count: 700 }
    ];

    },

    // Действие для сброса данных, если пользователь решит очистить дашборд
    resetData() {
      this.rawData = [];
      this.processData(); // Сбросит processedData до начальных значений
    }
  },
});