
# UI Solution Architect MCP Server

An MCP (Model Context Protocol) server that provides UI Solution Document templates and generates Technical Solution Documents for UI bug fixes from Jira/GitHub issues and repository analysis.

## Features

### Tools
- **`ui_tsd_generator`**: Generates comprehensive Technical Solution Documents for UI bug fixes
- **`get_document_template`**: Retrieves the UI Solution Document template as markdown

### Resources
- **`ui_solution_document_template.md`**: Markdown template for creating UI solution documents

## Installation

```bash
npm install
```

## Usage

### Start the MCP server

```bash
npm start
```

### MCP Configuration

Add this to your MCP client configuration:

```json
{
  "mcpServers": {
    "ui-solution-architect": {
      "command": "node",
      "args": ["/path/to/ui-solution-architect-mcp/index.js"],
      "env": {}
    }
  }
}
```

## API

### Tools

#### ui_tsd_generator
Generates a comprehensive Technical Solution Document for UI bug fixes.

**Input Schema:**
```json
{}
```

**Output:** System prompt with instructions for generating TSDs.

#### get_document_template
Retrieves the UI Solution Document template.

**Input Schema:**
```json
{}
```

**Output:** Markdown template content.

### Resources

#### ui_solution_document_template.md
- **URI:** `mcp://ui-solution-architect-mcp/ui_solution_document_template.md`
- **MIME Type:** `text/markdown`
- **Description:** Markdown template for creating UI solution documents

## Template Structure

The UI Solution Document template includes:

1. **Summary** - Project details and impact assessment
2. **Background/Problem Statement** - Issue description and current behavior
3. **Technical Analysis** - UI, backend, and AEM layer analysis
4. **Proposed Solution** - Step-by-step approach with architecture flow
5. **Architecture & Sequence Flow** - Diagrams and flow descriptions
6. **Impact Analysis** - Affected modules and environments
7. **Testing Strategy** - Unit, integration, and UAT testing plans
8. **Rollout & Deployment Plan** - Feature flags and deployment order
9. **Risks & Mitigation** - Risk identification and mitigation strategies
10. **References** - Jira tickets, API docs, and related links

## Development

### Prerequisites
- Node.js >= 18.0.0
- npm

### Dependencies
- `@modelcontextprotocol/sdk`: MCP SDK for server implementation

### File Structure
```
ui-solution-architect-mcp/
├── index.js                           # Main MCP server implementation
├── package.json                       # Project configuration
├── README.md                          # This file
└── ui_solution_document_template.md   # Document template
```

## License

MIT