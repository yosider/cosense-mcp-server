# Cosense MCP Server

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
  - For more details, see [scrapboxlab/connect.sid](https://scrapbox.io/scrapboxlab/connect.sid)

### Run from npm registry

#### JSR registry configuration

This package depends on [@cosense/std](https://jsr.io/@cosense/std) and [@cosense/types](https://jsr.io/@cosense/types) which are hosted on JSR. Before using npx, you need to configure the JSR registry globally:

```bash
echo "@jsr:registry=https://npm.jsr.io" >> ~/.npmrc
```

Or if you prefer not to modify global settings, run from source instead (see the section below)

#### Client json configuration

After configuring JSR registry, configure your MCP client:

```json
{
  "mcpServers": {
    "cosense-mcp-server": {
      "command": "npx",
      "args": ["-y", "@yosider/cosense-mcp-server"],
      "env": {
        "COSENSE_PROJECT_NAME": "your_project_name",
        "COSENSE_SID": "your_sid"
      }
    }
  }
}
```

### Run from source

#### Clone and build

```bash
git clone https://github.com/yosider/cosense-mcp-server.git
cd cosense-mcp-server
npm install
npm run build
```

#### Client json configuration

```json
{
  "mcpServers": {
    "cosense-mcp-server": {
      "command": "npx",
      "args": ["-y", "/path/to/cosense-mcp-server"],
      "env": {
        "COSENSE_PROJECT_NAME": "your_project_name",
        "COSENSE_SID": "your_sid"
      }
    }
  }
}
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspect
```

The Inspector will provide a URL to access debugging tools in your browser.

## Acknowledgments

This project is forked from [funwarioisii/cosense-mcp-server](https://github.com/funwarioisii/cosense-mcp-server).
