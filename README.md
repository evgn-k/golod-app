[![repo](https://s.evgn.ru/badge/repo-golod-app-2ea44f)](https://git.evgn.ru/evgeny/golod-app)
![kind](https://s.evgn.ru/badge/kind-site-0a7ea4)
![compose](https://s.evgn.ru/badge/compose-no-1f6feb)
![agents](https://s.evgn.ru/badge/agents-yes-ff9800)
![license](https://s.evgn.ru/badge/license-MIT-4caf50)
![managed_by](https://s.evgn.ru/badge/managed%20by-Git-4caf50)

# Счетчик голодания

PWA-приложение для отслеживания времени голодовки с круговой диаграммой прогресса и таймером реального времени.

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

Собранные файлы будут в директории `dist/`.

## GitHub Pages

Приложение разворачивается через GitHub Pages из ветки `main`.

## Конфигурация

В файле `src/app.js` заданы временные параметры:

```javascript
const START_TIME = new Date('2026-03-10T22:00:00').getTime();
const END_TIME = new Date('2026-03-31T22:00:00').getTime();
```

Измените их для своих нужд.

## Стек

- **Frontend**: HTML, CSS, JavaScript (ES modules)
- **UI**: Tailwind CSS
- **Визуализация**: Chart.js
- **Сборка**: Vite

## Лицензия

MIT
