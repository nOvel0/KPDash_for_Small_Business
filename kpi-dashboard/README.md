# kpi-dashboard

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


Определение структуры файла для загрузки (пример CSV)

sales_data.csv

Фрагмент кода
  
```

Date,Product,Category,Revenue,Orders,UnitsSold,Cost,CustomerSegment

2024-01-01,Laptop,Electronics,1200,1,1,800,New

2024-01-01,Mouse,Accessories,25,1,1,10,Existing

2024-01-02,Keyboard,Electronics,75,1,1,30,New

2024-01-02,Monitor,Electronics,300,1,1,150,Existing

2024-01-03,Headphones,Accessories,50,1,1,20,New

2024-01-03,Laptop,Electronics,1200,1,1,800,Existing

2024-01-04,Webcam,Accessories,40,1,1,15,New

```
  

Объяснение колонок:

*     Date: Дата транзакции (например, YYYY-MM-DD). Это критично для временных графиков.

*    Product: Название проданного продукта.

*    Category: Категория продукта (например, "Electronics", "Accessories", "Services").

*    Revenue: Доход от этой транзакции/позиции.

*    Orders: Количество заказов (для каждой строки это может быть 1, если одна строка = один заказ, или больше, если агрегированные данные). Для твоих текущих KPI "Количество заказов" это будет суммироваться.

*    UnitsSold: Количество проданных единиц продукта в данной транзакции.

*    Cost: Себестоимость проданного товара (для расчета прибыли).

*    CustomerSegment: Сегмент клиента (например, "New", "Existing", "Wholesale").