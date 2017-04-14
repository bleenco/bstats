import * as express from 'express';
import * as cors from 'cors';
import * as logger from './logger';
import { resolve } from 'path';
import { ensureDirectory } from './fs';
import { getConfig, getRootDir, writeInitConfig } from './utils';

export function start(): void {
  ensureDirectory(getRootDir())
    .then(() => writeInitConfig())
    .then(() => getConfig())
    .then(config => {
      let app: express.Application = express();

      app.use(cors());
      app.use('/css', express.static(resolve(__dirname, '../app/css'), { index: false }));
      app.use('/js', express.static(resolve(__dirname, '../app/js'), { index: false }));
      app.use('/images', express.static(resolve(__dirname, '../app/images'), { index: false }));
      app.use('/css/fonts', express.static(resolve(__dirname, '../app/fonts'), { index: false }));
      app.all('/*', index);

      app.listen(config.port, () => logger.info(`server running on port ${config.port}`));
    });
}

function index(req: express.Request, res: express.Response): void {
  return res.status(200).sendFile(resolve(__dirname, '../app/index.html'));
}
