import { homedir } from 'os';
import { resolve, join } from 'path';
import { readFile, writeFile, exists, writeJsonFile } from './fs';
import * as fs from './fs';
import * as fse from 'fs-extra';
import * as crypto from 'crypto';
import * as logger from './logger';

export interface IConfig {
  port: number,
  ssl: boolean;
  sslKey: string;
  sslCert: string;
  wsPort: number;
}

export function getRootDir(): string {
  return join(homedir(), '.bstats');
}

export function getConfigPath(): string {
  return join(getRootDir(), 'config.json');
}

export function getConfig(): IConfig {
  return fse.readJsonSync(getConfigPath());
}

export function getFilePath(relativePath: string): string {
  return join(getRootDir(), relativePath);
}

export function writeInitConfig(): Promise<null> {
  return fs.exists(getConfigPath())
    .then(exists => {
      if (exists) {
        return Promise.resolve();
      } else {
        let data: IConfig = {
          port: 7200,
          ssl: false,
          sslKey: null,
          sslCert: null,
          wsPort: 7210
        };

        logger.info(`initialized config file at ${getConfigPath()}`);
        return writeJsonFile(getConfigPath(), data);
      }
    });
}

export function getHumanSize(bytes: number, decimals: number = 2): string {
  if (!bytes) {
    return '0 Bytes';
  }

  const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const k = 1000;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
