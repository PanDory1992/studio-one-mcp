import { join } from 'node:path';
import { homedir } from 'node:os';
import { installDevice } from './src/setup/device.js';

const profile = join(process.env.APPDATA, 'PreSonus', 'Studio One 7');
const mailbox = join(homedir(), '.studio-one-mcp', 'mailbox');
const installed = installDevice({ profile, mailbox, allowEval: true });
console.log(JSON.stringify(installed, null, 2));
