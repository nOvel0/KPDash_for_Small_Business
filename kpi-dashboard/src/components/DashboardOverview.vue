<template>
  <div>

    <header>
      <div class="logo-div">
        <img src="@/assets/img/Logo_Dash2.jpg" alt="Logo" class="logo-dash">

        <h1>Dashboard</h1>
      </div>
      
      <button class="button-question">?</button>
    </header>

    <div class="widgets-container">
      <div class="kpi-section">
        <div class="data-card">
          <h3>Общая выручка</h3>
          <p>{{ totalRevenue }}</p>
        </div>

        <div class="data-card">
          <h3>Количество заказов</h3>
          <p>{{ totalOrders }}</p>
        </div>

        <div class="data-card">
          <h3>Средний чек</h3>
          <p>{{ averageCheck }}</p>
        </div>
      </div>

      <div class="graphs-section">
          <div class="data-card"> <h3>График (1)</h3>
            <img src="@/assets/img/graph1.jpg" alt="graph1" class="responsive-image">
          </div>

          <div class="data-card">
            <h3>График (2)</h3>
            <img src="@/assets/img/graph.jpg" alt="graph" class="responsive-image">
          </div>
        </div>
      </div>

  </div>
</template>

<script>
export default {
  name: 'DashboardOverview', 
  data () {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      averageCheck: 0
    };
  }
};
</script>

<style>


body {
  margin: 0;
  font-family: Arial, sans-serif; /* Пример шрифта, выбери свой */
  background-color: #f0f2f5; /* Очень светлый серый фон для всей страницы, как на картинке */
}

/* Стилизация верхнего header'а */
header {
  display: flex; /* Для выравнивания элементов в строку */
  justify-content: space-between; /* Распределить элементы по краям: лого и кнопка */
  align-items: center; /* Выравнивание по центру по вертикали */
  padding: 15px 20px;
  background-color: #2b3e4f; /* Темно-серый/синеватый фон для верхней панели */
  color: white; /* Белый текст */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Небольшая тень для объема */
}

.logo-div {
  display: flex;
  align-items: center; /* Выравнивание по центру внутри div */
  gap: 15px; /* Отступ между лого и H1 */
}

.logo-dash {
  height: 40px; /* Размер логотипа */
  /* width: auto; Удаляем width: 10%; чтобы изображение не было слишком маленьким */
  border-radius: 10px;
}

header h1 {
  margin: 0; /* Убрать отступы по умолчанию */
  font-size: 24px;
  color: #fff; /* Белый цвет для названия "Dashboard" */
}

.button-question {
  background-color: #5d758c; /* Цвет кнопки, как на картинке */
  color: white;
  border: none;
  border-radius: 50%; /* Круглая кнопка */
  width: 30px;
  height: 30px;
  font-size: 18px;
  cursor: pointer;
  display: flex; /* Для центрирования "?" */
  justify-content: center;
  align-items: center;
}

/* Основной контейнер для всех виджетов */
.widgets-container {
  padding: 20px;
  display: grid; /* Используем Grid для основного макета */
  /* Определяем области сетки, если захотим явно позиционировать элементы */
  /* grid-template-areas:
    "kpis"
    "graphs"; */
  gap: 20px; /* Отступы между основными секциями (KPI и графиками) */
}

/* Контейнер для KPI */
.kpi-section {
  /* grid-area: kpis; */ /* Если используешь grid-template-areas */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* 3 колонки, адаптивные */
  gap: 20px; /* Отступы между KPI карточками */
}

/* Контейнер для графиков */
.graphs-section {
  /* grid-area: graphs; */ /* Если используешь grid-template-areas */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); /* 2 колонки, адаптивные. minmax 400px для графиков, так как они шире */
  gap: 20px; /* Отступы между графиками */
}

/* Стили для каждой "карточки" с данными и графиками */
.data-card {
  background-color: white; /* Белый фон карточки */
  border-radius: 8px; /* Скругленные углы */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Легкая тень */
  padding: 20px;
  text-align: center; /* Центрирование содержимого, если нужно */
}

.data-card h3 {
  margin-top: 0;
  color: #555; /* Темно-серый цвет для заголовков */
  font-size: 16px;
  margin-bottom: 15px; /* Отступ под заголовком */
}

.data-card p {
  font-size: 28px;
  font-weight: bold;
  color: #333; /* Почти черный для чисел */
  margin-bottom: 0;
}

/* Стиль для изображений графиков, чтобы они заполняли свои карточки */
.responsive-image {
  max-width: 100%; /* Гарантируем, что изображение не вылезет за пределы родителя */
  height: auto; /* Сохраняем пропорции изображения */
  display: block; /* Убираем лишний отступ снизу, который иногда создают inline-элементы */
  margin: 0 auto; /* Центрируем изображение, если оно меньше 100% */
}

/* Добавь стили для остальных виджетов (Cost Per Click, Ad Impressions, Total Pageviews, Total Visits), если они появятся */
/* Просто добавь их в соответствующий grid-контейнер и они автоматически выстроятся */

</style>