# Cosense MCP Server

[![JSR](https://jsr.io/badges/@takker/cosense-mcp-server)](https://jsr.io/@takker/cosense-mcp-server)
[![test](https://github.com/takker99/cosense-mcp-server/workflows/check/badge.svg)](https://github.com/takker99/cosense-mcp-server/actions?query=workflow%3Acheck)

A MCP server for [Cosense](https://cosen.se).

## Tools

The following tools are available for interacting with Cosense pages:

- `get_page`: Retrieves a page with the specified title
- `list_pages`: Lists available pages in the resources
- `search_pages`: Searches for pages containing the specified query string
- `insert_lines`: Inserts text after a specified line in a page

## MCP Client Configuration

The following environment variables are required:

- `COSENSE_PROJECT_NAME`: Project name
- `COSENSE_SID`: Session ID for authentication
  - Required for writing to pages and reading private pages
  - Handle with care as it contains sensitive information
  - For more details, see
    [scrapboxlab/connect.sid](https://scrapbox.io/scrapboxlab/connect.sid)

### Usage

This package is published on [JSR](https://jsr.io/@takker/cosense-mcp-server).
You can use it directly via Deno.

### Run as MCP server

You can run this server directly with Deno:

```bash
deno run --allow-env --allow-net --allow-read --allow-write jsr:@takker/cosense-mcp-server
```

Set the required environment variables (`COSENSE_PROJECT_NAME`, `COSENSE_SID`)
before running.

### MCP client configuration example

```json
{
  "mcpServers": {
    "cosense-mcp-server": {
      "command": "deno",
      "args": [
        "run",
        "--allow-env",
        "--allow-net",
        "--allow-read",
        "--allow-write",
        "jsr:@takker/cosense-mcp-server"
      ],
      "env": {
        "COSENSE_PROJECT_NAME": "your_project_name",
        "COSENSE_SID": "your_sid"
      }
    }
  }
}
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We
recommend using the
[MCP Inspector](https://github.com/modelcontextprotocol/inspector) for debugging
and inspection.

You can run the inspector with:

```bash
deno task inspect
```

The Inspector will provide a URL to access debugging tools in your browser.

## Acknowledgments

This project is originally forked from
[yosider/cosense-mcp-server](https://github.com/yosider/cosense-mcp-server).
