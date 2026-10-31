import { mockRuns } from '../data/runs';
import type { Run } from '../types';
const delay = (milliseconds: number) => new Promise<void>(resolve => setTimeout(resolve, milliseconds));
export async function fetchRuns(options: {
    fail?: boolean;
} = {}): Promise<Run[]> {
    await delay(650);
    if (options.fail)
        throw new Error('Unable to reach the mock service.');
    return mockRuns.map(run => ({ ...run, logs: [...run.logs] }));
}

