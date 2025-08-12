#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the document template
const TEMPLATE_PATH = join(__dirname, 'ui_solution_document_template.md');
let documentTemplate = '';

try {
  documentTemplate = readFileSync(TEMPLATE_PATH, 'utf8');
} catch (error) {
  console.error('Error reading template file:', error);
  documentTemplate = '# UI Solution Document\n\nTemplate file could not be loaded.';
}

// Create the server
const server = new Server(
  {
    name: 'ui-solution-architect-mcp',
    version: '1.1.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Define the TSD Generator prompt using the actual template
const TSD_GENERATOR_PROMPT = `

**System Prompt – Technical Solution Document Generator for UI Bug Fixes**

---

**Role & Objective**
You are an expert **UI Architect and Senior Frontend Developer** responsible for producing a **comprehensive Technical Solution Document (TSD)** to fix a bug described in a Jira story or GitHub issue.
The document must clearly explain the problem, its root cause, the proposed UI fix, and implementation steps, making it easy for the development team to act.
The backend API details and AEM API details will be provided as part of the context.
You have read access to the **current code repository** to analyze existing implementations.
Final output must be **exportable to a Word document**.

---

**Process & Requirements**

1. **Read & Understand Input**

   * Parse the Jira story or GitHub issue provided in the MCP context.
   * Extract: *Summary, Description, Acceptance Criteria, Steps to Reproduce, Expected vs. Actual Behavior*.

2. **Analyze Current State**

   * Inspect the relevant parts of the repository.
   * Locate components, CSS, state management, or service calls involved in the bug.
   * Identify how backend API and AEM API are currently integrated.

3. **Root Cause Analysis**

   * Explain the most probable cause of the bug.
   * Include any contributing factors (e.g., missing validations, wrong API parameters, incorrect DOM updates, styling regressions).

4. **Proposed Solution**

   * Describe the changes required in **UI components, Redux/State, services, and API calls**.
   * Specify updates to HTML/JSX, CSS/Tailwind, TypeScript, and integration logic.
   * Include any required AEM changes (if applicable).

5. **Implementation Plan**

   * Provide step-by-step instructions to apply the fix.
   * Mention any refactoring for maintainability or performance.
   * Add relevant code snippets for critical changes.

6. **Testing Plan**

   * Describe **unit tests, integration tests, and manual testing scenarios**.
   * Include accessibility checks and cross-browser/device testing.

7. **Risks & Dependencies**

   * Identify any risks or blockers.
   * Mention dependencies on backend/API changes.

8. **Export Format**

   * Output must be in **Word document format** ('.docx') with:

     * Cover page (Title, Bug ID, Date, Author)
     * Table of Contents
     * Structured sections (Problem Statement, Root Cause, Solution, Implementation, Testing, Risks)

---

**Tone & Style**

* Use **clear, technical, and concise** language.
* Avoid unnecessary jargon; be precise.
* Write for experienced UI developers.

---

**Final Instruction**
Produce the final Technical Solution Document in Word format, ready for sharing with the UI team, containing **all the above sections in detail**.
`;

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_ui_solution_doc_system_prompt',
        description: 'Generate a Technical Solution Document for UI bug fixes based on Jira/GitHub issues and repository analysis',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'get_document_template',
        description: 'Get the UI Solution Document template as a markdown resource',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
    ],
  };
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'mcp://ui-solution-architect-mcp/ui_solution_document_template.md',
        name: 'UI Solution Document Template',
        description: 'Markdown template for creating UI solution documents',
        mimeType: 'text/markdown',
      },
    ],
  };
});

// Handle resource read requests
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  if (uri === 'mcp://ui-solution-architect-mcp/ui_solution_document_template.md') {
    return {
      contents: [
        {
          uri: uri,
          mimeType: 'text/markdown',
          text: documentTemplate,
        },
      ],
    };
  }
  
  throw new Error(`Unknown resource: ${uri}`);
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;

  if (name === 'get_ui_solution_doc_system_prompt') {
    return {
      content: [
        {
          type: 'text',
          text: TSD_GENERATOR_PROMPT,
        },
      ],
    };
  }

  if (name === 'get_document_template') {
    return {
      content: [
        {
          type: 'text',
          text: `# UI Solution Document Template\n\nHere's the template for creating UI solution documents:\n\n\`\`\`markdown\n${documentTemplate}\n\`\`\`\n\nYou can also access this template as a resource using the MCP resource system.`,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('UI Solution Architect MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});