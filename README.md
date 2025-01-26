# Cosense MCP Server
[![smithery badge](https://smithery.ai/badge/@yosider/cosense-mcp-server)](https://smithery.ai/server/@yosider/cosense-mcp-server)

MCP server for [Cosense](https://cosen.se)  
Forked from [funwarioisii/cosense-mcp-server](https://github.com/funwarioisii/cosense-mcp-server)

## Features

- Get Page

## Installation

### Installing via Smithery

To install Cosense for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@yosider/cosense-mcp-server):

```bash
npx -y @smithery/cli install @yosider/cosense-mcp-server --client claude
```

### Manual Installation
```bash
git clone https://github.com/funwarioisii/cosense-mcp-server.git
cd cosense-mcp-server
npm run install
npm run build
```

To use with Claude Desktop, add the server config:
- MacOS: `~/Library/Application\ Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "cosense-mcp-server": {
      "command": "npx",
      "args": ["/path/to/cosense-mcp-server"],
      "env": {
        "COSENSE_PROJECT_NAME": "your_project_name",
        "COSENSE_SID": "your_sid"
      }
    }
  }
}
```

`COSENSE_SID` is optional.
If you want to use this server towards a private project, you need to set `COSENSE_SID`.

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspect
```

The Inspector will provide a URL to access debugging tools in your browser.
