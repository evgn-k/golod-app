---
include_toc: true
gitea: none
---

[![repo](https://s.evgn.ru/badge/repo-golod-app-2ea44f)](https://git.evgn.ru/evgeny/golod-app)
![kind](https://s.evgn.ru/badge/kind-site-0a7ea4)
![compose](https://s.evgn.ru/badge/compose-no-1f6feb)
![agents](https://s.evgn.ru/badge/agents-yes-ff9800)
![license](https://s.evgn.ru/badge/license-MIT-4caf50)
![managed_by](https://s.evgn.ru/badge/managed%20by-Git-4caf50)

# Счетчик голодания

PWA-приложение для отслеживания времени голодовки с живым обратным отсчетом, кольцом прогресса и мотивационными фразами.

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

## Публикация

- `index.html` и статические файлы используют относительные пути, поэтому приложение корректно работает в подпапке GitHub Pages.
- `vite.config.js` использует `base: "./"`, чтобы сборка не генерировала сломанные абсолютные ссылки вида `/assets/...`.
- PWA-файлы лежат и в корне, и в `public/`, чтобы сайт оставался рабочим как при прямой публикации статических файлов, так и после `vite build`.

## Конфигурация

В файле `src/app.js` заданы временные параметры:

```javascript
const START_TIME = new Date(2026, 2, 10, 22, 0, 0).getTime();
const END_TIME = new Date(2026, 2, 31, 22, 0, 0).getTime();
```

Они создаются в локальном времени браузера.

## Стек

- **Frontend**: HTML, CSS, JavaScript (ES modules)
- **UI**: нативный CSS с адаптивной сеткой и conic-gradient
- **PWA**: manifest + service worker
- **Сборка**: Vite

## Трудности при разработке и деплое

### 1. Ручной деплой из-за ограничений GitHub Actions
GitHub Actions отключены для этого репозитория из-за настроек биллинга. Автоматический деплой через GitHub Pages недоступен, поэтому используется ручная публикация в ветку `gh-pages`.

**Решение:**
```bash
npm run build
# Копируем dist/* в gh-pages вручную
git push origin "master:gh-pages" --force
```

### 2. Агрессивное кэширование GitHub CDN
GitHub Pages CDN кэширует файлы очень агрессивно — пользователи могут видеть старые версии приложения даже после деплоя новой версии.

**Решение:**
- Использовать `Ctrl+Shift+R` (или `Cmd+Shift+R` на Mac) для принудительной перезагрузки
- В DevTools (F12) включить галку "Disable cache" на вкладке Network
- Открывать сайт в режиме инкогнито
- Обновлять Service Worker (увеличивать `CACHE_NAME` при каждом деплое)

### 3. Проблема с областью видимости переменной `refs`
Изначально код использовал `let refs = {}` в глобальной области, а затем переопределял объект внутри `initRefs()`. Из-за замыкания функции `updateCountdown()` и другие видели пустой объект `refs`, что приводило к `TypeError: Cannot set properties of null`.

**Решение:** Использовать `const refs = {}` и мутировать объект по ссылке:
```javascript
const refs = {}; // вместо let

function initRefs() {
  refs.days = document.getElementById('days'); // мутируем, а не пересоздаём
  // ...
}
```

### 4. Несоответствие путей к JS/CSS после сборки
После `npm run build` Vite создаёт новые файлы с хэшами (например, `index-D0U5_FUh.js`). Корневой `index.html` продолжал ссылаться на старый файл, которого уже не существовало.

**Решение:** После каждой сборки копировать обновлённый `index.html` из `dist/` в корень проекта:
```bash
npm run build
cp dist/index.html index.html
```

### 5. Дублирование хэшей в именах файлов
При сборке возникали файлы с дублированными хэшами в именах: `favicon-CaMMpFW5-CaMMpFW5-CaMMpFW5.svg`. Это связано с особенностями конфигурации Vite и встроенных ассетов.

**Решение:** Пока некритично — файлы работают корректно. Для исправления требуется аудит конфигурации `vite.config.js`.

### 6. Service Worker и кэширование статики
При обновлении приложения старый Service Worker продолжал отдавать закэшированные файлы из `CacheStorage`.

**Решение:** 
- Увеличивать версию кэша (`CACHE_NAME`) при каждом деплое
- Использовать `skipWaiting()` и `clients.claim()` для мгновенной активации нового SW

### 7. Отладка null-ссылок на DOM-элементы
Были ошибки `TypeError: Cannot set properties of null (setting 'textContent')` из-за отсутствия проверок перед обращением к DOM-элементам.

**Решение:** Добавлены явные проверки в `updateCountdown()` и `updateStaticLabels()`:
```javascript
const requiredRefs = ['days', 'hours', 'minutes', 'seconds', /* ... */];
const missingRefs = requiredRefs.filter(key => !refs[key]);
if (missingRefs.length > 0) {
  console.error('[DEBUG] Missing refs:', missingRefs);
  return;
}
```

## Лицензия

MIT
