import { defineStore } from 'pinia';

export const useDataStore = defineStore('data', {
  state: () => ({
    rawData: [],
    processedData: {
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
    },
  }),

  getters: {
    getKpiData: (state) => state.processedData,
    getRawTransactions: (state) => state.rawData.slice(-10),
    getTop5Products: (state) => state.processedData.topProducts.slice(0, 5),
  },

  actions: {
    setRawData(data) {
      this.rawData = data;
      this.processData();
    },

    processData() {
      if (this.rawData.length === 0) {
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
      let totalOrders = 0;
      let unitsSold = 0;
      let totalProfit = 0;

      const productSales = new Map();
      const monthlyData = new Map(); 
      const salesByCategoryMap = new Map();
      const customerSegmentCountsMap = new Map();

      this.rawData.forEach(row => {
        const revenue = parseFloat(row.Revenue);
        const currentUnitsSold  = parseInt(row.UnitsSold  || '1'); 
        const cost = parseFloat(row.Cost); 

        const profit = (!isNaN(revenue) && !isNaN(cost)) ? (revenue - cost) : 0;

        if (!isNaN(revenue)) {
          totalRevenue += revenue;
          totalOrders++; 
        }
        if (!isNaN(currentUnitsSold)) { 
          unitsSold += currentUnitsSold;
        }
        if (!isNaN(profit)) { 
          totalProfit += profit;
        }

        // Агрегация для топ-продуктов
        const productName = row.Product;
        if (productName) {
          const currentData = productSales.get(productName) || { revenue: 0, units: 0 };
          currentData.revenue += isNaN(revenue) ? 0 : revenue;
          currentData.units += isNaN(currentUnitsSold) ? 0 : currentUnitsSold; 
          productSales.set(productName, currentData);
        }

        //ЛОГИКА ДЛЯ ДИНАМИКИ ВЫРУЧКИ ПО МЕСЯЦАМ И СРЕДНЕГО ЧЕКА (ПЕРВЫЙ ГРАФИК И ТРЕТИЙ ГРАФИК) 
        const date = new Date(row.Date);
        if (!isNaN(date.getTime()) && !isNaN(revenue)) {
            const year = date.getFullYear();
            const month = date.getMonth();
            const monthKey = new Date(year, month, 1).toLocaleString('ru-RU', { month: 'short', year: '2-digit' });
            //console.log(`Создан monthKey: ${monthKey} для даты ${row.Date}`);

            const currentMonthData = monthlyData.get(monthKey) || {totalRevenue: 0, totalOrders: 0}
            currentMonthData.totalRevenue += revenue;
            currentMonthData.totalOrders += 1;
            monthlyData.set(monthKey, currentMonthData);
        }

        //ЛОГИКА ДЛЯ ПРОДАЖ ПО КАТЕГОРИЯМ
        const category = row.Category;
        if(category && !isNaN(revenue)){
          salesByCategoryMap.set(category, (salesByCategoryMap.get(category) || 0 ) + revenue);
        }

        //ЛОГИКА ДЛЯ РАСПРЕДЕЛЕНИЕ КЛИЕНТОВ
        const customerSegment = row.CustomerSegment;
        if(customerSegment){
          customerSegmentCountsMap.set(customerSegment, (customerSegmentCountsMap.get(customerSegment) || 0) + 1);
        }
      });



      // Расчет среднего чека (KPI)
      const averageCheck = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0';

      // Форматирование KPI
      this.processedData.totalRevenue = totalRevenue.toFixed(2);
      this.processedData.totalOrders = totalOrders.toString();
      this.processedData.averageCheck = averageCheck;
      this.processedData.unitsSold = unitsSold.toString();
      this.processedData.totalProfit = totalProfit.toFixed(2);

      // --- Расчет Топ 5 продуктов ---
      const sortedProducts = Array.from(productSales.entries())
        .map(([name, data]) => ({ name, revenue: data.revenue, units: data.units }))
        .sort((a, b) => b.revenue - a.revenue);

      this.processedData.topProducts = sortedProducts;
      
      // ФОРМИРОВАНИЕ ДАННЫХ ДЛЯ ГРАФИКА ДИНАМИКА ВЫРУЧКИ
      const sortedMonths = Array.from(monthlyData.keys()).sort((a, b) => {
        const parseMonthYear = (s) => {
            const [monthStr, yearStr] = s.split(' ');
            const year = parseInt(`20${yearStr}`); 

            // Используем map для более надежного сопоставления названий месяцев
            const monthMap = {
                'янв': 0, 'фев': 1, 'мар': 2, 'апр': 3, 'май': 4, 'июнь': 5, 'июль': 6, 'авг': 7, 'сен': 8, 'окт': 9, 'ноя': 10, 'дек': 11,
                'мая': 4, 
                'янв.': 0, 'февр.': 1, 'март': 2, 'апр.': 3, 'июня': 5, 'июля': 6, 'авг.': 7, 'сент.': 8, 'окт.': 9, 'нояб.': 10, 'дек.': 11
            };

            let monthIndex = monthMap[monthStr.toLowerCase()];

            if (monthIndex === undefined) {
                console.warn(`Не удалось распознать месяц: "${monthStr}" из строки "${s}".`);
                return new Date(NaN);
            }
            return new Date(year, monthIndex);
        };
        return parseMonthYear(a) - parseMonthYear(b);
      });

      this.processedData.revenueByMonth = sortedMonths.map(monthName => ({
        month: monthName,
        value: parseFloat(monthlyData.get(monthName).totalRevenue.toFixed(2)) 
      }));

      // ФОРМИРОВАНИЕ ДАННЫХ ДЛЯ ГРАФИКА СРЕДНИЙ ЧЕК
      this.processedData.averageCheckByTime = sortedMonths.map(monthName => {
        const data = monthlyData.get(monthName);
        const avgCheck = data.totalOrders > 0 ? (data.totalRevenue / data.totalOrders) : 0;
        return {
          time: monthName, 
          value: parseFloat(avgCheck.toFixed(2))
        };
      });

      // ФОРМИРОВАНИЕ ДАННЫХ ДЛЯ ПРОДАЖ ПО КАТЕГОРИЯМ
      this.processedData.salesByCategory = Array.from(salesByCategoryMap.entries()).map(([categoryName, totalCategoryRevenue]) => ({
            category: categoryName,
            value: parseFloat(totalCategoryRevenue.toFixed(2))
        }))


      //ФОРМИРОВАНИЕ ДАННЫХ ДЛЯ ГРАФИКА "РАСПРЕДЕЛЕНИЕ КЛИЕНТОВ
      
      this.processedData.customerSegmentCounts = Array.from(customerSegmentCountsMap.entries()).map(([segmentName, count]) => ({
            segment: segmentName,
            count: count
        }))
      
    },

    resetData() {
      this.rawData = [];
      this.processData();
    }
  },
});