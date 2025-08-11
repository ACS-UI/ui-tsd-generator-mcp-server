
# UI Technical Solution Document Generator MCP Server

A Model Context Protocol (MCP) server that generates comprehensive Technical Solution Documents (TSD) for UI bug fixes based on Jira/GitHub issues and repository analysis.

## What it does

This MCP server provides a tool that returns a detailed system prompt for generating Technical Solution Documents to address UI bugs. The prompt guides AI assistants to analyze the problem, root cause, solution, implementation steps, and testing plan, with output structured for export to Word format.

## Features

- **Bug Analysis**: Parses Jira/GitHub issues and repository context
- **Root Cause Identification**: Explains the most probable cause and contributing factors
- **Solution Proposal**: Details required UI, state, service, and API changes
- **Implementation Plan**: Step-by-step instructions and code snippets
- **Testing Plan**: Unit, integration, accessibility, and cross-browser testing
- **Risks & Dependencies**: Identifies blockers and dependencies
- **Word Export**: Output is structured for easy export to `.docx` format

## Installation

### Global Installation
```bash
npm install -g ui-tsd-generator-mcp-server
```

### Local Installation
```bash
npm install ui-tsd-generator-mcp-server
```

## Usage

### With Claude Desktop

Add this to your Claude Desktop configuration file:

**On macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**On Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ui-tsd-generator": {
      "command": "npx",
      "args": ["ui-tsd-generator-mcp-server"]
    }
  }
}
```

### With MCP Client

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: 'npx',
  args: ['ui-tsd-generator-mcp-server']
});

const client = new Client({
  name: 'my-client',
  version: '1.0.0'
}, {
  capabilities: {}
});

await client.connect(transport);

// Use the tool
const result = await client.callTool({
  name: 'ui_tsd_generator'
});

console.log(result.content[0].text);
```

## Available Tools

### `ui_tsd_generator`
- **Description:** Generate a Technical Solution Document for UI bug fixes based on Jira/GitHub issues and repository analysis
- **Parameters:** None
- **Returns:** A comprehensive system prompt for generating a UI Technical Solution Document

## Output Format

The prompt guides the generation of a Word document (`.docx`) with:
- Cover page (Title, Bug ID, Date, Author)
- Table of Contents
- Structured sections: Problem Statement, Root Cause, Solution, Implementation, Testing, Risks

## Development

### Clone and Setup
```bash
git clone https://github.com/ACS-UI/ui-tsd-generator-mcp-server.git
cd ui-tsd-generator-mcp-server
npm install
```

### Run Locally
```bash
npm start
```

### Test with MCP Inspector
```bash
npx @modelcontextprotocol/inspector npx ui-tsd-generator-mcp-server
```

## Requirements

- Node.js >= 18.0.0
- @modelcontextprotocol/sdk ^0.4.0

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

If you encounter any issues, please file them on the [GitHub repository](https://github.com/ACS-UI/ui-tsd-generator-mcp-server/issues).