#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testMCPServer() {
  console.log('🧪 Testing UI Solution Architect MCP Server...\n');

  try {
    // Create transport to the MCP server
    const transport = new StdioClientTransport({
      command: 'node',
      args: [join(__dirname, 'index.js')]
    });

    // Create MCP client
    const client = new Client({
      name: 'test-client',
      version: '1.0.0'
    }, {
      capabilities: {}
    });

    // Connect to the server
    await client.connect(transport);
    console.log('✅ Connected to MCP server\n');

    // Test 1: List tools
    console.log('🔧 Testing tool listing...');
    const tools = await client.listTools();
    console.log(`Found ${tools.tools.length} tools:`);
    tools.tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log('');

    // Test 2: List resources
    console.log('📚 Testing resource listing...');
    const resources = await client.listResources();
    console.log(`Found ${resources.resources.length} resources:`);
    resources.resources.forEach(resource => {
      console.log(`  - ${resource.name}: ${resource.description}`);
      console.log(`    URI: ${resource.uri}`);
      console.log(`    MIME Type: ${resource.mimeType}`);
    });
    console.log('');

    // Test 3: Test ui_tsd_generator tool
    console.log('📝 Testing ui_tsd_generator tool...');
    const tsdResult = await client.callTool({
      name: 'ui_tsd_generator'
    });
    console.log(`✅ Tool returned ${tsdResult.content.length} content items`);
    console.log(`First 200 chars: ${tsdResult.content[0].text.substring(0, 200)}...\n`);

    // Test 4: Test get_document_template tool
    console.log('📋 Testing get_document_template tool...');
    const templateResult = await client.callTool({
      name: 'get_document_template'
    });
    console.log(`✅ Tool returned ${templateResult.content.length} content items`);
    console.log(`First 200 chars: ${templateResult.content[0].text.substring(0, 200)}...\n`);

    // Test 5: Test resource reading
    console.log('📖 Testing resource reading...');
    const resourceResult = await client.readResource({
      uri: 'mcp://ui-solution-architect-mcp/ui_solution_document_template.md'
    });
    console.log(`✅ Resource read successfully`);
    console.log(`Content length: ${resourceResult.contents[0].text.length} characters`);
    console.log(`MIME Type: ${resourceResult.contents[0].mimeType}`);
    console.log(`First 200 chars: ${resourceResult.contents[0].text.substring(0, 200)}...\n`);

    console.log('🎉 All tests passed! MCP server is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testMCPServer();
