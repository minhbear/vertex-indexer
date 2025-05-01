import {
  LOG_FILE_PATH,
  LOGGING_CONSOLE_LEVEL,
  LOGGING_FILE_LEVEL,
} from '../app.environment';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';

const pinoHttp = {
  useLevelLabels: true,
  genReqId: (req, res) => {
    if (req.id) return req.id;
    let id = req.get('X-Request-Id');
    if (id) return id;
    id = randomUUID();
    res.header('X-Request-Id', id);
    return id;
  },
  level: LOGGING_CONSOLE_LEVEL,
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level: LOGGING_CONSOLE_LEVEL,
        options: {
          singleLine: true,
        },
      },
      {
        target: 'pino/file',
        level: LOGGING_FILE_LEVEL,
        options: {
          destination: LOG_FILE_PATH,
          mkdir: true,
          sync: false,
        },
      },
    ],
  },
};

export const loggerModule = LoggerModule.forRoot({
  pinoHttp: pinoHttp,
});
