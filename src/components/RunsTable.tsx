import { ArrowDown, ArrowUp, ChevronRight, Clock3, GitBranch } from 'lucide-react';
import type { Run, SortKey } from '../types';
import { formatDate, formatDuration } from '../utils/runs';
import { StatusBadge } from './StatusBadge';

type Props = {
  runs: Run[];
  selectedId: string | null;
  onSelect: (run: Run) => void;
  sort: SortKey;
  descending: boolean;
  onSort: (key: SortKey) => void;
};

export function RunsTable({ runs, selectedId, onSelect, sort, descending, onSort }: Props) {
  function renderSortIcon(key: SortKey) {
    if (sort !== key) return null;
    return descending ? <ArrowDown size={13} /> : <ArrowUp size={13} />;
  }

  return (
    <div className="tableScroller">
      <table className="runsTable">
        <thead>
          <tr>
            <th className="runNameCol">RUN</th>
            <th>REPOSITORY</th>
            <th>BRANCH</th>
            <th>STATUS</th>
            <th>
              <button className="sortButton" onClick={() => onSort('createdAt')}>
                CREATED {renderSortIcon('createdAt')}
              </button>
            </th>
            <th>
              <button className="sortButton" onClick={() => onSort('durationSeconds')}>
                DURATION {renderSortIcon('durationSeconds')}
              </button>
            </th>
            <th aria-label="Open details" />
          </tr>
        </thead>
        <tbody>
          {runs.map(run => (
            <tr
              key={run.id}
              className={selectedId === run.id ? 'selectedRow' : ''}
              tabIndex={0}
              aria-label={`Open details for ${run.name}`}
              onClick={() => onSelect(run)}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(run);
                }
              }}
            >
              <td>
                <div className="runTitle">{run.name}</div>
                <small className="runIdentifier">{run.id}</small>
              </td>
              <td><span className="repoCell">{run.repository}</span></td>
              <td><span className="branchCell"><GitBranch size={14} />{run.branch}</span></td>
              <td><StatusBadge status={run.status} /></td>
              <td className="dateCell">{formatDate(run.createdAt)}</td>
              <td className="durationCell"><Clock3 size={14} />{formatDuration(run.durationSeconds)}</td>
              <td className="chevronCell"><ChevronRight size={17} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
