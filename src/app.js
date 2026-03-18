import { motivationQuotes } from './motivation.js';

const START_TIME = new Date(2026, 2, 10, 22, 0, 0).getTime();
const END_TIME = new Date(2026, 2, 31, 22, 0, 0).getTime();
const TOTAL_DURATION = Math.max(END_TIME - START_TIME, 1);
const LOCALE = 'ru-RU';

const DATE_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

const NOW_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

const refs = {
  currentTime: document.getElementById('currentTime'),
  fastingStatus: document.getElementById('fastingStatus'),
  rangeLabel: document.getElementById('rangeLabel'),
  progressRing: document.getElementById('progressRing'),
  progressPercent: document.getElementById('progressPercent'),
  progressLabel: document.getElementById('progressLabel'),
  progressTitle: document.getElementById('progressTitle'),
  progressSummary: document.getElementById('progressSummary'),
  countdownTitle: document.getElementById('countdownTitle'),
  durationLabel: document.getElementById('durationLabel'),
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
  startTimeLabel: document.getElementById('startTimeLabel'),
  endTimeLabel: document.getElementById('endTimeLabel'),
  elapsedValue: document.getElementById('elapsedValue'),
  remainingValue: document.getElementById('remainingValue'),
  quoteText: document.getElementById('quoteText'),
  quoteAuthor: document.getElementById('quoteAuthor'),
  nextQuoteButton: document.getElementById('nextQuoteButton')
};

let currentQuoteIndex = -1;

function formatClockParts(ms) {
  const safeMs = Math.max(ms, 0);
  const days = Math.floor(safeMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((safeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((safeMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((safeMs % (1000 * 60)) / 1000);

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0')
  };
}

function formatDurationLabel(ms) {
  if (ms <= 0) {
    return '0 мин';
  }

  const totalMinutes = Math.floor(ms / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  const parts = [];

  if (days > 0) {
    parts.push(`${days} д`);
  }
  if (hours > 0) {
    parts.push(`${hours} ч`);
  }
  if (minutes > 0 && days === 0) {
    parts.push(`${minutes} мин`);
  }

  return parts.slice(0, 2).join(' ');
}

function getState(now) {
  if (now < START_TIME) {
    return {
      phase: 'upcoming',
      label: 'До старта',
      status: 'Подготовка',
      progress: 0,
      timeLeft: START_TIME - now,
      elapsed: 0,
      remaining: TOTAL_DURATION
    };
  }

  if (now >= END_TIME) {
    return {
      phase: 'completed',
      label: 'Голодовка завершена',
      status: 'Финиш',
      progress: 100,
      timeLeft: 0,
      elapsed: TOTAL_DURATION,
      remaining: 0
    };
  }

  const elapsed = now - START_TIME;
  const remaining = END_TIME - now;

  return {
    phase: 'active',
    label: 'До завершения',
    status: 'В процессе',
    progress: (elapsed / TOTAL_DURATION) * 100,
    timeLeft: remaining,
    elapsed,
    remaining
  };
}

function updateProgress(state) {
  const progressValue = Math.round(state.progress);

  refs.progressRing.style.setProperty('--progress', `${state.progress.toFixed(2)}%`);
  refs.progressPercent.textContent = `${progressValue}%`;
  refs.progressLabel.textContent = state.phase === 'completed' ? 'завершено' : 'пройдено';
  refs.progressTitle.textContent =
    state.phase === 'upcoming' ? 'Подготовка к старту' : 'Путь до завершения';

  if (state.phase === 'upcoming') {
    refs.progressSummary.textContent =
      'Отсчет уже запущен: сейчас экран ждёт стартового момента и держит весь план периода перед глазами.';
    return;
  }

  if (state.phase === 'completed') {
    refs.progressSummary.textContent =
      'Цель достигнута. Кольцо закрыто полностью, таймер остановлен на финальной точке.';
    return;
  }

  refs.progressSummary.textContent =
    `Пройдено ${progressValue}% пути. Внутри периода уже прошло ${formatDurationLabel(state.elapsed)}.`;
}

function updateCountdown(state, now) {
  const parts = formatClockParts(state.timeLeft);

  refs.days.textContent = parts.days;
  refs.hours.textContent = parts.hours;
  refs.minutes.textContent = parts.minutes;
  refs.seconds.textContent = parts.seconds;

  refs.currentTime.textContent = `Сейчас: ${NOW_FORMATTER.format(now)}`;
  refs.countdownTitle.textContent = state.label;
  refs.fastingStatus.textContent = state.status;
  refs.fastingStatus.dataset.phase = state.phase;
  refs.elapsedValue.textContent = formatDurationLabel(state.elapsed);
  refs.remainingValue.textContent =
    state.phase === 'upcoming'
      ? formatDurationLabel(START_TIME - now)
      : formatDurationLabel(state.remaining);
}

function updateStaticLabels() {
  refs.rangeLabel.textContent = `${DATE_FORMATTER.format(START_TIME)} - ${DATE_FORMATTER.format(END_TIME)}`;
  refs.startTimeLabel.textContent = DATE_FORMATTER.format(START_TIME);
  refs.endTimeLabel.textContent = DATE_FORMATTER.format(END_TIME);
  refs.durationLabel.textContent = `Длительность периода: ${formatDurationLabel(TOTAL_DURATION)}`;
}

function updateUI() {
  const now = Date.now();
  const state = getState(now);

  updateProgress(state);
  updateCountdown(state, now);
}

function showRandomQuote() {
  if (motivationQuotes.length === 0) {
    refs.quoteText.textContent = 'Добавьте мотивационные фразы в src/motivation.js.';
    refs.quoteAuthor.textContent = '—';
    return;
  }

  let nextIndex = Math.floor(Math.random() * motivationQuotes.length);

  if (motivationQuotes.length > 1) {
    while (nextIndex === currentQuoteIndex) {
      nextIndex = Math.floor(Math.random() * motivationQuotes.length);
    }
  }

  currentQuoteIndex = nextIndex;

  const quote = motivationQuotes[currentQuoteIndex];
  refs.quoteText.textContent = quote.text;
  refs.quoteAuthor.textContent = quote.author ? `— ${quote.author}` : '—';
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const serviceWorkerUrl = new URL('./service-worker.js', window.location.href);
    await navigator.serviceWorker.register(serviceWorkerUrl);
  } catch (error) {
    console.error('Не удалось зарегистрировать service worker:', error);
  }
}

function init() {
  updateStaticLabels();
  updateUI();
  showRandomQuote();
  registerServiceWorker();

  refs.nextQuoteButton.addEventListener('click', showRandomQuote);

  window.setInterval(updateUI, 1000);
  window.setInterval(showRandomQuote, 60000);
}

document.addEventListener('DOMContentLoaded', init);
