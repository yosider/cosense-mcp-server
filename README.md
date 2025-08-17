# Cosense MCP Server

A MCP server for [Cosense](https://cosen.se).

## Tools

The following tools are available for interacting with Cosense pages:

- `get_page`: Retrieves a page with the specified title
- `list_pages`: Lists available pages in the resources
- `search_pages`: Searches for pages containing the specified query string
- `insert_lines`: Inserts text after a specified line in a page

## Configuration

### Using `pnpm`/`yarn` (Recommended)

#### Usage with VS Code

For quick installation, use one of these one-click buttons.

[![Install with pnpm in VS Code](https://img.shields.io/badge/VS_Code-pnpm-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:mcp/install?%7B%22name%22%3A%22cosense-mcp-server%22%2C%22command%22%3A%22pnpm%22%2C%22args%22%3A%5B%22-s%22%2C%22dlx%22%2C%22%40yosider%2Fcosense-mcp-server%22%5D%2C%22env%22%3A%7B%22COSENSE_PROJECT_NAME%22%3A%22your_project_name%22%2C%22COSENSE_SID%22%3A%22your_sid%22%7D%7D) [![Install with pnpm in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-pnpm-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode-insiders:mcp/install?%7B%22name%22%3A%22cosense-mcp-server%22%2C%22command%22%3A%22pnpm%22%2C%22args%22%3A%5B%22-s%22%2C%22dlx%22%2C%22%40yosider%2Fcosense-mcp-server%22%5D%2C%22env%22%3A%7B%22COSENSE_PROJECT_NAME%22%3A%22your_project_name%22%2C%22COSENSE_SID%22%3A%22your_sid%22%7D%7D)

[![Install with yarn in VS Code](https://img.shields.io/badge/VS_Code-yarn-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:mcp/install?%7B%22name%22%3A%22cosense-mcp-server%22%2C%22command%22%3A%22yarn%22%2C%22args%22%3A%5B%22dlx%22%2C%22-q%22%2C%22%40yosider%2Fcosense-mcp-server%22%5D%2C%22env%22%3A%7B%22COSENSE_PROJECT_NAME%22%3A%22your_project_name%22%2C%22COSENSE_SID%22%3A%22your_sid%22%7D%7D) [![Install with yarn in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-yarn-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode-insiders:mcp/install?%7B%22name%22%3A%22cosense-mcp-server%22%2C%22command%22%3A%22yarn%22%2C%22args%22%3A%5B%22dlx%22%2C%22-q%22%2C%22%40yosider%2Fcosense-mcp-server%22%5D%2C%22env%22%3A%7B%22COSENSE_PROJECT_NAME%22%3A%22your_project_name%22%2C%22COSENSE_SID%22%3A%22your_sid%22%7D%7D)

For manual installation, refer to [the next section](#usage-with-claude-desktop).

#### Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`.

### `yarn`

```json
{
  "mcpServers": {
    "cosense-mcp-server": {
      "command": "yarn",
      "args": ["dlx", "-q", "@yosider/cosense-mcp-server"],
      "env": {
        "COSENSE_PROJECT_NAME": "your_project_name",
        "COSENSE_SID": "your_sid"
      }
    }
  }
}
```

### `pnpm`

```json
{
  "mcpServers": {
    "cosense-mcp-server": {
      "command": "pnpm",
      "args": ["-s", "dlx", "@yosider/cosense-mcp-server"],
      "env": {
        "COSENSE_PROJECT_NAME": "your_project_name",
        "COSENSE_SID": "your_sid"
      }
    }
  }
}
```

### Required environment variables

Set the following environment variables for the MCP server to work:

- `COSENSE_PROJECT_NAME` — your Cosense project name.
- `COSENSE_SID` — session cookie used for authentication. Required for writing pages and reading private pages. Treat this like a secret. See https://scrapbox.io/scrapboxlab/connect.sid for more details.
- `NODE_ENV` (optional) — `development` or `production`. Controls logging verbosity (use `development` when debugging).

### Using `npx`

This package depends on JSR-hosted packages. While `pnpm`/`yarn` can handle JSR packages directly, `npm` requires adding the JSR registry to `~/.npmrc`.

#### 1. Add JSR registry to `~/.npmrc`

##### Linux/macOS:

```bash
echo "@jsr:registry=https://npm.jsr.io" >> ~/.npmrc
```

##### Windows (PowerShell):

```powershell
echo "@jsr:registry=https://npm.jsr.io" >> $env:USERPROFILE\\.npmrc
```

#### 2. Add MCP server configuration

(In case of `claude_desktop_config.json`)

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

### Run from source (optional)

If you prefer to run the server from a local copy of this repository, build it first:

```bash
git clone https://github.com/yosider/cosense-mcp-server.git
cd cosense-mcp-server
npm install
npm run build
```

Then point your MCP client at the local package:

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

### Notes

- Use `NODE_ENV=development` in your MCP client `env` for verbose logs when debugging.
- Do not store `COSENSE_SID` in public places or committed files.

## Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspect
```

The Inspector will provide a URL to access debugging tools in your browser.

If you use VS Code, you can easily run the mcp server via [`.vscode/mcp.json`](.vscode/mcp.json).

## Acknowledgments

This project is forked from [funwarioisii/cosense-mcp-server](https://github.com/funwarioisii/cosense-mcp-server).
