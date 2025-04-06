import { parentPort, workerData } from 'worker_threads';
import * as kamino from '../utils-transform/kamino';
import * as raydium from '../utils-transform/raydium';
import * as common from '../utils-transform/common';

async function runWorker() {
  interface WorkerData {
    userScript: string;
    pdaParser: string;
  }

  const { userScript, pdaParser: pdaParserStr } = workerData as WorkerData;

  const pdaParser = JSON.parse(pdaParserStr) as any;

  try {
    const utils = {
      kamino,
      raydium,
      common,
    };

    const executeFunction = new Function(
      'pdaParser',
      'utils',
      `${userScript}; return execute(pdaParser);`,
    );

    const result = executeFunction(pdaParser, utils);

    parentPort?.postMessage(result);
  } catch (error) {
    parentPort?.postMessage({ error: (error as Error).message });
  }
}

runWorker().catch((error) => {
  console.error('Worker failed to start:', error);
});
