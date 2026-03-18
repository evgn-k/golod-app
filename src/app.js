import { Chart } from 'chart.js';
import { motivationQuotes } from './motivation.js';

Chart.register(Chart.ArcElement, Chart.Tooltip, Chart.Legend);

const START_TIME = new Date('2026-03-10T22:00:00').getTime();
const END_TIME = new Date('2026-03-31T22:00:00').getTime();
const TOTAL_DURATION = END_TIME - START_TIME;

function initChart() {
  const ctx = document.getElementById('fastingChart').getContext('2d');
  const gradientCompleted = ctx.createLinearGradient(0, 0, 300, 300);
  gradientCompleted.addColorStop(0, '#f59e0b');
  gradientCompleted.addColorStop(1, '#fcd34d');
  
  const gradientRemaining = ctx.createLinearGradient(0, 0, 300, 300);
  gradientRemaining.addColorStop(0, '#3b82f6');
  gradientRemaining.addColorStop(1, '#60a5fa');
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Пройдено', 'Осталось'],
      datasets: [{
        data: [0, 100],
        backgroundColor: [gradientCompleted, gradientRemaining],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });
}

function formatTime(ms) {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  
  return {
    days: days.toString().padStart(2, '0'),
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0')
  };
}

function updateTimer() {
  const now = Date.now();
  const elapsed = now - START_TIME;
  const remaining = END_TIME - now;
  const progress = Math.min(100, Math.max(0, (elapsed / TOTAL_DURATION) * 100));
  
  const chart = Chart.getChart('fastingChart');
  if (chart) {
    chart.data.datasets[0].data = [progress, 100 - progress];
    chart.update('none');
  }
  
  document.getElementById('progressPercent').textContent = Math.round(progress) + '%';
  
  if (remaining > 0) {
    const time = formatTime(remaining);
    document.getElementById('days').textContent = time.days;
    document.getElementById('hours').textContent = time.hours;
    document.getElementById('minutes').textContent = time.minutes;
    document.getElementById('seconds').textContent = time.seconds;
    
    document.getElementById('currentTime').textContent = 
      'Текущее время: ' + new Date(now).toLocaleString('ru-RU');
  } else {
    if (chart) {
      chart.data.datasets[0].data = [100, 0];
      chart.update('none');
    }
    document.getElementById('progressPercent').textContent = '100%';
    document.getElementById('currentTime').textContent = 'Голодовка завершена!';
  }
}

function showRandomQuote() {
  const quote = motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
  document.getElementById('quoteText').textContent = quote.text;
  if (quote.author) {
    document.getElementById('quoteAuthor').textContent = '— ' + quote.author;
  }
}

function init() {
  initChart();
  updateTimer();
  showRandomQuote();
  setInterval(updateTimer, 1000);
  setInterval(showRandomQuote, 60000);
}

document.addEventListener('DOMContentLoaded', init);
