import * as chalk from 'chalk';

export function info(msg: string): void {
  let time: string = `[${chalk.blue(getDateTime())}]`;
  let method: string = `[${chalk.yellow('INFO')}] [${chalk.yellow('--')}]`;
  console.log(`${time} ${method} ${msg}`);
}

function getDateTime(): string {
  return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}
