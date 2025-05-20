<template>
  <div class="kpi-card">
    <div class="kpi-icon-container">
      <span class="kpi-icon">&#x1F4C8;</span> </div>
    <div class="kpi-content">
      <p class="kpi-title">{{ title }}</p> <h2 class="kpi-value">{{ value }}</h2> </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'KPICard', // Имя компонента
  props: { // Определяем пропсы, которые этот компонент будет принимать
    title: {
      type: String, // Ожидаем строку
      required: true // Этот пропс обязателен
    },
    value: {
      type: [String, Number], // Ожидаем строку или число
      required: true // Этот пропс обязателен
    }
    // description: { // Опциональный пропс
    //   type: String,
    //   default: ''
    // }
  }
});
</script>

<style scoped>
/* Стили для всей KPI-карточки */
.kpi-card {
  background-color: #ffffff; /* Белый фон */
  border-radius: 8px; /* Скругленные углы */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Мягкая тень */
  padding: 20px 25px; /* Внутренние отступы */
  display: flex; /* Используем flexbox для выравнивания содержимого */
  align-items: center; /* Выравнивание по центру по вертикали */
  gap: 15px; /* Расстояние между иконкой и текстом */
  min-height: 120px; /* Минимальная высота карточки */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer; /* Указываем, что карточка интерактивна */
}

.kpi-card:hover {
  transform: translateY(-3px); /* Немного приподнимаем при наведении */
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12); /* Усиливаем тень */
}

/* Стили для контейнера иконки */
.kpi-icon-container {
  flex-shrink: 0; /* Чтобы иконка не сжималась */
  width: 50px;
  height: 50px;
  background-color: #e6f7ff; /* Светло-голубой фон для иконки */
  border-radius: 50%; /* Круглая форма */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em; /* Размер иконки */
  color: #1890ff; /* Цвет иконки */
}

/* Стили для текстового содержимого KPI */
.kpi-content {
  flex-grow: 1; /* Позволяет содержимому занимать все доступное пространство */
}

.kpi-title {
  margin: 0;
  font-size: 0.9em;
  color: #666;
  text-transform: uppercase; /* Заголовок в верхнем регистре */
  letter-spacing: 0.5px;
}

.kpi-value {
  margin: 5px 0 0;
  font-size: 1.8em;
  font-weight: bold;
  color: #333;
}

.kpi-description {
  margin: 5px 0 0;
  font-size: 0.8em;
  color: #888;
}
</style>