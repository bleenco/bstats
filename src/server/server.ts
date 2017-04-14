import * as express from 'express';
import * as cors from 'cors';
import * as logger from './logger';
import { ensureDirectory } from './fs';
import { getConfig, getRootDir, writeInitConfig } from './utils';

export function start(): void {
  ensureDirectory(getRootDir())
    .then(() => writeInitConfig())
    .then(() => getConfig())
    .then(config => {
      let app: express.Application = express();

      app.use(cors());
      app.listen(config.port, () => logger.info(`server running on port ${config.port}`));
    });
}
