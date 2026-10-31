import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, ArrowRight, CheckCircle2, Clock3, PlayCircle, Plus,
  RefreshCcw, RotateCcw, SearchX, TriangleAlert, Wifi,
} from 'lucide-react';
import { RunDetails } from './components/RunDetails';
import { RunFilters } from './components/RunFilters';
import { RunsTable } from './components/RunsTable';
import { Sidebar } from './components/Sidebar';
import { fetchRuns } from './services/runs';
import type { Run, SortKey, StatusFilter } from './types';
import { parseFilter, selectRuns } from './utils/runs';

function getInitialFilters() {
  const params = new URLSearchParams(window.location.search);

  return {
    status: parseFilter(params.get('status')),
    search: params.get('search') ?? '',
  };
}

export function App() {
  const [initialFilters] = useState(getInitialFilters);
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<StatusFilter>(initialFilters.status);
  const [search, setSearch] = useState(initialFilters.search);
  const [sort, setSort] = useState<SortKey>('createdAt');
  const [descending, setDescending] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [failNext, setFailNext] = useState(false);
  const [detailsClosing, setDetailsClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function loadRuns(simulateFailure = false) {
    setLoading(true);
    setError('');

    try {
      const data = await fetchRuns({ fail: simulateFailure });
      setRuns(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRuns();
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);

    if (status === 'all') url.searchParams.delete('status');
    else url.searchParams.set('status', status);

    if (search) url.searchParams.set('search', search);
    else url.searchParams.delete('search');

    window.history.replaceState(null, '', url);
  }, [status, search]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        document.querySelector<HTMLInputElement>('.searchWrap input')?.focus();
      }

      if (event.key === 'Escape') closeDetails();
    }

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // Facet counters follow the text search, but not the selected status.
  // This keeps other statuses discoverable while searching.
  const searchMatches = useMemo(
    () => selectRuns(runs, search, 'all', sort, descending),
    [runs, search, sort, descending],
  );

  const counts = useMemo(() => ({
    all: searchMatches.length,
    queued: searchMatches.filter(run => run.status === 'queued').length,
    running: searchMatches.filter(run => run.status === 'running').length,
    succeeded: searchMatches.filter(run => run.status === 'succeeded').length,
    failed: searchMatches.filter(run => run.status === 'failed').length,
  }), [searchMatches]);

  const visibleRuns = useMemo(
    () => selectRuns(runs, search, status, sort, descending),
    [runs, search, status, sort, descending],
  );

  const selectedRun = runs.find(run => run.id === selectedId) ?? null;
  const isServiceUnavailable = Boolean(error);
  const showStatValue = !loading && !isServiceUnavailable;
  const statCaption = isServiceUnavailable ? 'Data unavailable' : null;

  function openDetails(run: Run) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDetailsClosing(false);
    setSelectedId(run.id);
  }

  function closeDetails() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDetailsClosing(true);
    closeTimer.current = setTimeout(() => {
      setSelectedId(null);
      setDetailsClosing(false);
      closeTimer.current = null;
    }, 240);
  }

  function changeSort(next: SortKey) {
    if (sort === next) {
      setDescending(current => !current);
    } else {
      setSort(next);
      setDescending(true);
    }
  }

  function resetFilters() {
    setStatus('all');
    setSearch('');
  }

  function simulateError() {
    const shouldFail = !failNext;
    setFailNext(shouldFail);
    void loadRuns(shouldFail);
  }

  function retry() {
    setFailNext(false);
    void loadRuns();
  }

  function renderRuns() {
    if (loading) {
      return (
        <div className="loadingTable" role="status" aria-label="Loading runs">
          {Array.from({ length: 7 }, (_, index) => (
            <div className="skeletonRow" key={index}>
              <span /><span /><span /><span />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="messageState">
          <span className="messageIcon messageIcon--error"><TriangleAlert size={24} /></span>
          <h3>Couldn’t load runs</h3>
          <p>{error} Please try again.</p>
          <button onClick={retry}><RotateCcw size={16} /> Retry</button>
        </div>
      );
    }

    if (visibleRuns.length === 0) {
      return (
        <div className="messageState">
          <span className="messageIcon"><SearchX size={27} /></span>
          <h3>No matching runs</h3>
          <p>Try another search term or clear your active filters.</p>
          <button onClick={resetFilters}><RotateCcw size={16} /> Clear filters</button>
        </div>
      );
    }

    return (
      <RunsTable
        runs={visibleRuns}
        selectedId={selectedId}
        onSelect={openDetails}
        sort={sort}
        descending={descending}
        onSort={changeSort}
      />
    );
  }

  return (
    <div className="appShell">
      <Sidebar />

      <main className="main">
        <div className="topBar">
          <div className="breadcrumbs">Workspace <span>/</span> <b>Runs</b></div>
          <div className="topRight">
            <span className="systemStatus"><span className={`liveDot ${isServiceUnavailable ? 'liveDot--error' : ''}`} /> {isServiceUnavailable ? 'Mock service unavailable' : 'Mock service ready'}</span>
            <div className="topAvatar">JD</div>
          </div>
        </div>

        <div className="mainContent">
          <div className="pageHeading">
            <div>
              <div className="eyebrow">
                <Activity size={14} /> AGENT EXECUTIONS <span className="eyebrowLine" />
              </div>
              <h1>Runs<span className="headingPeriod">.</span></h1>
              <p>Monitor, explore, and inspect your AI agent executions.</p>
            </div>
            <div className="headingActions">
              <span className={`envBadge ${isServiceUnavailable ? 'envBadge--error' : ''}`}><Wifi size={14} /> {isServiceUnavailable ? 'MOCK SERVICE ERROR' : 'MOCK ENVIRONMENT'}</span>
              <button className="refreshButton" disabled={loading} onClick={() => void loadRuns()}>
                <RefreshCcw size={16} className={loading ? 'spin' : ''} /> Refresh
              </button>
            </div>
          </div>

          <div className="statsGrid">
            <div className="statCard">
              <div className="statLabel">TOTAL RUNS <span className="statIcon"><Activity size={17} /></span></div>
              <strong>{showStatValue ? String(runs.length).padStart(2, '0') : '—'}</strong>
              <span className="statFooter"><span className="neutralMark"><ArrowRight size={12} /></span> {statCaption ?? 'Across all repositories'}</span>
            </div>
            <div className="statCard">
              <div className="statLabel">RUNNING NOW <span className="statIcon blue"><PlayCircle size={17} /></span></div>
              <strong>{showStatValue ? String(counts.running).padStart(2, '0') : '—'}</strong>
              <span className="statFooter"><span className="blueMark" /> {statCaption ?? 'Agents in progress'}</span>
            </div>
            <div className="statCard">
              <div className="statLabel">SUCCEEDED <span className="statIcon green"><CheckCircle2 size={17} /></span></div>
              <strong>{showStatValue ? String(counts.succeeded).padStart(2, '0') : '—'}</strong>
              <span className="statFooter"><span className="greenMark" /> {statCaption ?? 'Completed successfully'}</span>
            </div>
            <div className="statCard">
              <div className="statLabel">IN QUEUE <span className="statIcon yellow"><Clock3 size={17} /></span></div>
              <strong>{showStatValue ? String(counts.queued).padStart(2, '0') : '—'}</strong>
              <span className="statFooter"><span className="yellowMark" /> {statCaption ?? 'Awaiting execution'}</span>
            </div>
          </div>

          <section className="runsSection" aria-label="Recent runs">
            <div className="sectionHeader">
              <div>
                <h2>Recent runs <span className="headerCount">{loading ? '…' : isServiceUnavailable ? '—' : visibleRuns.length}</span></h2>
                <p>A detailed view of your agent activity</p>
              </div>
              <button
                className="mockErrorButton"
                title="Demonstrate the error and retry states"
                aria-label="Simulate mock service error"
                onClick={simulateError}
              >
                <TriangleAlert size={14} /> {failNext ? 'Restore service' : 'Simulate error'}
              </button>
            </div>

            <RunFilters
              status={status}
              onStatusChange={setStatus}
              search={search}
              onSearchChange={setSearch}
              counts={counts}
              showCounts={!isServiceUnavailable}
            />

            {renderRuns()}

            <div className="tableFooter">
              <span>{isServiceUnavailable ? 'Runs unavailable' : <>Showing <b>{loading ? 0 : visibleRuns.length}</b> of <b>{runs.length}</b> runs</>}</span>
              <span role="status"><span className={`liveDot ${isServiceUnavailable ? 'liveDot--error' : ''}`} /> {isServiceUnavailable ? 'Mock service unavailable' : 'Data from local mock service'}</span>
            </div>
          </section>

          <div className="belowTable">
            <div><Plus size={14} /> Built for the way you ship.</div>
            <span>RUNFORGE / EXECUTION MONITOR <ArrowRight size={13} /></span>
          </div>
        </div>
      </main>

      {selectedRun && (
        <>
          <button
            className={`mobileBackdrop ${detailsClosing ? 'mobileBackdrop--closing' : ''}`}
            aria-label="Close run details"
            onClick={closeDetails}
          />
          <RunDetails
            key={selectedRun.id}
            run={selectedRun}
            closing={detailsClosing}
            onClose={closeDetails}
          />
        </>
      )}
    </div>
  );
}
