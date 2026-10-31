import type { Run, SortKey, StatusFilter } from '../types';

export const statusLabels = {
  queued: 'Queued',
  running: 'Running',
  succeeded: 'Succeeded',
  failed: 'Failed',
} as const;

export const filters: StatusFilter[] = ['all', 'queued', 'running', 'succeeded', 'failed'];

export function selectRuns(
  runs: Run[],
  query: string,
  status: StatusFilter,
  sort: SortKey,
  descending: boolean,
): Run[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return runs
    .filter(run => {
      const matchesStatus = status === 'all' || run.status === status;
      const matchesSearch = !normalizedQuery
        || run.name.toLocaleLowerCase().includes(normalizedQuery)
        || run.repository.toLocaleLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesSearch;
    })
    .sort((first, second) => {
      const firstValue = sort === 'createdAt'
        ? new Date(first.createdAt).getTime()
        : first.durationSeconds ?? -1;
      const secondValue = sort === 'createdAt'
        ? new Date(second.createdAt).getTime()
        : second.durationSeconds ?? -1;

      return (firstValue - secondValue) * (descending ? -1 : 1);
    });
}

export function formatDuration(seconds?: number) {
  if (seconds === undefined) return '—';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value));
}

export function parseFilter(value: string | null): StatusFilter {
  return filters.includes(value as StatusFilter) ? value as StatusFilter : 'all';
}
