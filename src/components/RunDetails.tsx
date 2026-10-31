import { useState } from 'react';
import { Check, Clock3, Copy, ExternalLink, GitBranch, GitFork, Hash, Terminal, X } from 'lucide-react';
import type { Run } from '../types';
import { formatDate, formatDuration } from '../utils/runs';
import { StatusBadge } from './StatusBadge';

type Props = {
  run: Run;
  onClose: () => void;
  closing: boolean;
};

export function RunDetails({ run, onClose, closing }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyLogs() {
    try {
      await navigator.clipboard.writeText(run.logs.join('\n'));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <aside className={`detailsPanel ${closing ? 'detailsPanel--closing' : ''}`} aria-label="Run details">
      <header className="detailTop">
        <div>
          <div className="detailsEyebrow">RUN DETAILS</div>
          <h2>Execution details</h2>
        </div>
        <button className="iconButton" aria-label="Close details" onClick={onClose}>
          <X size={20} />
        </button>
      </header>

      <div className="detailScroll">
        <div className="detailHero">
          <div className="detailRunIcon"><Terminal size={22} /></div>
          <h3>{run.name}</h3>
          <div className="detailBadges">
            <StatusBadge status={run.status} />
            <span className="detailId">#{run.id}</span>
          </div>
        </div>

        <div className="detailSection">
          <h4>OVERVIEW</h4>
          <div className="metaGrid">
            <div><span>Repository</span><b><GitFork size={15} />{run.repository}</b></div>
            <div><span>Branch</span><b><GitBranch size={15} />{run.branch}</b></div>
            <div><span>Created at</span><b>{formatDate(run.createdAt)}</b></div>
            <div><span>Duration</span><b><Clock3 size={15} />{formatDuration(run.durationSeconds)}</b></div>
          </div>
        </div>

        <div className="detailSection">
          <div className="sectionTitle">
            <h4>EXECUTION LOGS</h4>
            <button className="copyButton" onClick={copyLogs}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy logs'}
            </button>
          </div>
          <div className="logBlock" role="log" aria-label="Execution logs">
            {run.logs.map((line, index) => (
              <div
                key={`${index}-${line}`}
                className={/failed|error|aborted|exited/i.test(line) ? 'logError' : ''}
              >
                <span className="logLineNumber">{String(index + 1).padStart(2, '0')}</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="detailSection">
          <h4>RESULT</h4>
          {run.result ? (
            <div className={`resultBox ${run.status === 'failed' ? 'resultBox--error' : ''}`}>
              <span>{run.status === 'failed' ? <Hash size={17} /> : <Check size={17} />}</span>
              <p>{run.result}</p>
            </div>
          ) : (
            <p className="mutedResult">
              {run.status === 'queued'
                ? 'This run is waiting to begin.'
                : run.status === 'running'
                  ? 'The result will appear after execution finishes.'
                  : 'No result was provided.'}
            </p>
          )}
        </div>
      </div>

      <footer className="detailFooter">
        <span><span className="liveDot" /> Mock environment</span>
        <span>Runforge <ExternalLink size={13} /></span>
      </footer>
    </aside>
  );
}
