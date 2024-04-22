export const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export const daysOfWeek = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

export const shortDaysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export const DateNow = new Date();

export const getDateByTime = (date: number | undefined) => {
  if (date) {
    const time = new Date(date);
    var year = time.getFullYear();
    var month = time.getMonth();
    var day = time.getDate();

    return (day > 9 ? day : "0" + day) + " " + months[month] + " " + year;
  }
  return "";
};
