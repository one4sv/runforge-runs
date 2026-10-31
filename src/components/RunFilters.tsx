import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { StatusFilter } from '../types';
import { filters, statusLabels } from '../utils/runs';

type Props = {
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  search: string;
  onSearchChange: (value: string) => void;
  counts: Record<StatusFilter, number>;
  showCounts?: boolean;
};

export function RunFilters({ status, onStatusChange, search, onSearchChange, counts, showCounts = true }: Props) {
  return (
    <div className="filterArea">
      <div className="filterTabs" role="group" aria-label="Filter by status">
        {filters.map(filter => (
          <button
            key={filter}
            className={`filterTab ${status === filter ? 'filterTab--active' : ''}`}
            aria-pressed={status === filter}
            onClick={() => onStatusChange(filter)}
          >
            {filter === 'all' ? 'All runs' : statusLabels[filter]}
            {showCounts && <> <span>{counts[filter]}</span></>}
          </button>
        ))}
      </div>

      <div className="searchWrap">
        <Search size={17} aria-hidden="true" />
        <input
          value={search}
          onChange={event => onSearchChange(event.target.value)}
          placeholder="Search runs or repositories..."
          aria-label="Search runs"
        />
        {search ? (
          <button title="Clear search" aria-label="Clear search" onClick={() => onSearchChange('')}>
            <X size={16} />
          </button>
        ) : (
          <kbd>⌘ K</kbd>
        )}
      </div>
      <span className="filterIcon" title="Combined search and status filtering">
        <SlidersHorizontal size={17} />
      </span>
    </div>
  );
}
