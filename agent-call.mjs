// Direct MCP client for this Codex task. This is not UI automation.
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';

const [name = 'live_status', raw = '{}'] = process.argv.slice(2);
let args;
try {
  args = JSON.parse(raw);
} catch (error) {
  console.error(`Invalid JSON arguments: ${error.message}`);
  process.exit(2);
}
const client = new Client({ name: 'codex-studio-one', version: '1.0.0' });
const serverPath = fileURLToPath(new URL('./src/server.js', import.meta.url));
try {
  await client.connect(new StdioClientTransport({
    command: process.execPath,
    args: [serverPath],
    env: { ...process.env, STUDIO_ONE_MCP_MIDI_PORT: 'Codex Studio One Control', STUDIO_ONE_MCP_BRIDGE_TCP: '47688' },
  }));
  if (name === '--list') {
    const list = await client.listTools();
    console.log(JSON.stringify(list.tools.map((tool) => tool.name), null, 2));
  } else {
    const result = await client.callTool({ name, arguments: args });
    for (const item of result.content ?? []) if (item.type === 'text') console.log(item.text);
    if (result.isError) process.exitCode = 1;
  }
} finally {
  await client.close();
}
