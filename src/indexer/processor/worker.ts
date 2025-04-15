import { parentPort, workerData } from 'worker_threads';
import * as kamino from '../utils-transform/kamino';
import * as raydium from '../utils-transform/raydium';
import * as common from '../utils-transform/common';
import { IUserScriptContext } from '../interfaces/user-script-context.interface';

async function runWorker() {
  interface WorkerData {
    userScript: string;
    context: IUserScriptContext;
  }

  const { userScript, context: contextData } = workerData as WorkerData;

  const context: IUserScriptContext = {
    pdaBuffer: Buffer.from(contextData.pdaBuffer),
    pdaParser: contextData.pdaParser ? JSON.parse(contextData.pdaParser) : null,
  };

  try {
    const utils = {
      kamino,
      raydium,
      common,
    };

    const executeFunction = new Function(
      'context',
      'utils',
      `${userScript}; return execute(context);`,
    );

    const result = executeFunction(context, utils);

    parentPort?.postMessage(result);
  } catch (error) {
    console.log('🚀 ~ runWorker ~ error:', error);
    parentPort?.postMessage({ error: (error as Error).message });
  }
}

runWorker().catch((error) => {
  console.error('Worker failed to start:', error);
});
