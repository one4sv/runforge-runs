import type { RunStatus } from '../types';
import { statusLabels } from '../utils/runs';

type Props = {
  status: RunStatus;
};

export function StatusBadge({ status }: Props) {
  return (
    <span className={`status status--${status}`}>
      <span aria-hidden="true" className="statusDot" />
      {statusLabels[status]}
    </span>
  );
}
