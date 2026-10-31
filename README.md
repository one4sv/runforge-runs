# Runforge — Runs Dashboard

[Русский](#русский) · [English](#english)

**Live demo / Демо:** https://runforge-runs-psi.vercel.app/

---

## Русский

### О проекте

Тестовое задание Junior Frontend Developer для Runforge. Дашборд для просмотра запусков AI-агентов, поиска, фильтрации и изучения подробностей выполнения.

**Стек:** React 18, TypeScript, Vite, CSS, Vitest, React Testing Library, Lucide React.

Приложение работает с локальным асинхронным mock-сервисом на Promise. Настоящий backend, API-ключи и интеграция с AI-агентами не требуются.

### Возможности

- Адаптивный интерфейс с боковой навигацией, статистикой, таблицей из шести основных колонок и панелью подробностей справа (420 px).
- Поддержка экранов от 360 px: горизонтальная прокрутка таблицы и полноэкранная панель подробностей на мобильных устройствах.
- Поиск по названию запуска или репозиторию вместе с фильтрами All, Queued, Running, Succeeded, Failed.
- Сортировка по дате создания и длительности с изменением направления.
- Сохранение поиска и выбранного статуса в URL.
- Просмотр репозитория, ветки, статуса, даты, длительности, логов и результата запуска; копирование логов.
- Состояния загрузки (skeleton), пустой выдачи и ошибки с кнопкой повтора. Для проверки предусмотрена кнопка **Simulate error**.
- 10 тестовых запусков со всеми четырьмя статусами; необязательные поля могут отсутствовать.
- Управление с клавиатуры: **Ctrl/Cmd + K** — поиск, **Enter/Пробел** — подробности выбранной строки, **Escape** — закрыть панель.

### Локальный запуск

Требуются Node.js 20+ и npm.

```bash
npm install
npm run dev
```

Открой адрес, указанный Vite в терминале (обычно http://localhost:5173).

### Сборка и тестирование

```bash
npm run build
npm run preview
npm test
```

Автотесты на Vitest проверяют фильтрацию по статусу, совместную работу поиска и фильтра, а также открытие и закрытие подробностей.

**Ручная проверка:** выбери каждый статус; поищи название запуска и репозиторий; проверь пустую выдачу; открой и закрой панель подробностей; нажми **Simulate error**, затем **Retry**; проверь сортировку, сохранение параметров при обновлении страницы и отображение на ширине 360 px.

### Структура проекта

| Путь | Назначение |
| --- | --- |
| `src/App.tsx` | Состояние приложения и интеграция компонентов |
| `src/types.ts` | Типы запусков и статусов |
| `src/data/runs.ts` | Mock-данные |
| `src/services/runs.ts` | Асинхронный mock-сервис |
| `src/utils/runs.ts` | Поиск, фильтрация, сортировка и форматирование |
| `src/components/` | Таблица, фильтры, боковая панель, статусы и подробности |
| `src/styles.css` | Стили и адаптивность |
| `src/__tests__/runs.test.tsx` | Автоматизированные тесты |
| `AI_LOG.md` | Отчёт об использовании ИИ |

### Ограничения

Страницы других пунктов меню и создание нового запуска не реализованы: тестовое задание охватывает только страницу Runs. Временные метки отображаются в локальном часовом поясе пользователя.

---

## English

### About

Junior Frontend Developer take-home assignment for Runforge. A dashboard for exploring AI-agent runs, filtering executions, and inspecting run details.

**Stack:** React 18, TypeScript, Vite, CSS, Vitest, React Testing Library, Lucide React.

The application uses a local asynchronous Promise-based mock service. No real backend, API keys, or AI-agent infrastructure are needed.

### Features

- Responsive dashboard with sidebar, summary statistics, a six-column data table, and a 420 px details drawer.
- Layout usable from 360 px: horizontal table scrolling and a full-screen details view on mobile.
- Search by run name or repository, combined with All, Queued, Running, Succeeded, and Failed filters.
- Sort by creation date or duration in either direction.
- Search and status filter persisted in URL query parameters.
- Run details with repository, branch, status, creation date, duration, logs, and optional result; copy logs to clipboard.
- Loading skeleton, empty-results state, and error state with retry. Use **Simulate error** to test failures.
- 10 example runs across all four statuses, including missing optional fields.
- Keyboard support: **Ctrl/Cmd + K** to focus search, **Enter/Space** to open row details, **Escape** to close.

### Getting started

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

### Build and tests

```bash
npm run build
npm run preview
npm test
```

Vitest tests cover status filtering, combined search and filtering, and opening/closing run details.

**Manual checks:** try each status filter; search by run name and repository; verify the empty state; open and close the details drawer; use **Simulate error** and **Retry**; verify sorting, query parameters after reload, and the layout at 360 px.

### Project structure

| Path | Purpose |
| --- | --- |
| `src/App.tsx` | Application state and component integration |
| `src/types.ts` | Run and status types |
| `src/data/runs.ts` | Mock dataset |
| `src/services/runs.ts` | Asynchronous mock service |
| `src/utils/runs.ts` | Search, filtering, sorting, and formatting |
| `src/components/` | Table, filters, sidebar, status badges, and details |
| `src/styles.css` | Styling and responsive layout |
| `src/__tests__/runs.test.tsx` | Automated tests |
| `AI_LOG.md` | AI usage disclosure |

### Scope

Other sidebar destinations and the New Run action are outside the assignment scope. Dates are displayed in the viewer's local timezone.
