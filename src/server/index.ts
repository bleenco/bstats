#!/usr/bin/env node

import { start as startServer } from './server';
export { network } from './network';
export { cpu } from './cpu';

startServer();
