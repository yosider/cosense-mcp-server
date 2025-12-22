[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/yosider-cosense-mcp-server-badge.png)](https://mseep.ai/app/yosider-cosense-mcp-server)

# Cosense MCP Server

A MCP server for [Cosense](https://cosen.se).

## Tools

The following tools are available for interacting with Cosense pages:

- `get_page`: Retrieves a page with the specified title
- `list_pages`: Lists available pages in the resources
- `search_pages`: Searches for pages containing the specified query string
- `insert_lines`: Inserts text after a specified line in a page

## Installation

### Prerequisites

Set the following environment variables:

- `COSENSE_PROJECT_NAME` — your Cosense project name.
- `COSENSE_SID` — session cookie used for authentication. Required for writing pages and reading private pages. Treat this like a secret. See https://scrapbox.io/scrapboxlab/connect.sid for more details.

### For VS Code Users

Use one of these one-click installation buttons:

[![Install with pnpm in VS Code](https://img.shields.io/badge/VS_Code-pnpm-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:mcp/install?%7B%22name%22%3A%22cosense-mcp-server%22%2C%22command%22%3A%22pnpm%22%2C%22args%22%3A%5B%22-s%22%2C%22dlx%22%2C%22%40yosider%2Fcosense-mcp-server%22%5D%2C%22env%22%3A%7B%22COSENSE_PROJECT_NAME%22%3A%22your_project_name%22%2C%22COSENSE_SID%22%3A%22your_sid%22%7D%7D) [![Install with pnpm in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-pnpm-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode-insiders:mcp/install?%7B%22name%22%3A%22cosense-mcp-server%22%2C%22command%22%3A%22pnpm%22%2C%22args%22%3A%5B%22-s%22%2C%22dlx%22%2C%22%40yosider%2Fcosense-mcp-server%22%5D%2C%22env%22%3A%7B%22COSENSE_PROJECT_NAME%22%3A%22your_project_name%22%2C%22COSENSE_SID%22%3A%22your_sid%22%7D%7D)

[![Install with yarn in VS Code](https://img.shields.io/badge/VS_Code-yarn-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:mcp/install?%7B%22name%22%3A%22cosense-mcp-server%22%2C%22command%22%3A%22yarn%22%2C%22args%22%3A%5B%22dlx%22%2C%22-q%22%2C%22%40yosider%2Fcosense-mcp-server%22%5D%2C%22env%22%3A%7B%22COSENSE_PROJECT_NAME%22%3A%22your_project_name%22%2C%22COSENSE_SID%22%3A%22your_sid%22%7D%7D) [![Install with yarn in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-yarn-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode-insiders:mcp/install?%7B%22name%22%3A%22cosense-mcp-server%22%2C%22command%22%3A%22yarn%22%2C%22args%22%3A%5B%22dlx%22%2C%22-q%22%2C%22%40yosider%2Fcosense-mcp-server%22%5D%2C%22env%22%3A%7B%22COSENSE_PROJECT_NAME%22%3A%22your_project_name%22%2C%22COSENSE_SID%22%3A%22your_sid%22%7D%7D)

> **Note**: After clicking the button, replace `your_project_name` and `your_sid` with your actual values in the configuration. For manual setup, you can also edit [`.vscode/mcp.json`](.vscode/mcp.json) directly.

### For Claude Desktop Users

Add one of the following configurations to your `claude_desktop_config.json`:

#### Using pnpm

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

#### Using yarn

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

#### Using npx

This package depends on JSR-hosted packages. `npx` requires adding the JSR registry to `~/.npmrc` first.

**Step 1: Add JSR registry to `~/.npmrc`**

Linux/macOS:

```bash
echo "@jsr:registry=https://npm.jsr.io" >> ~/.npmrc
```

Windows (PowerShell):

```powershell
echo "@jsr:registry=https://npm.jsr.io" >> $env:USERPROFILE\\.npmrc
```

**Step 2: Add configuration**

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

## Development

### Running from Source

If you prefer to run the server from a local copy of this repository, build it first:

```bash
git clone https://github.com/yosider/cosense-mcp-server.git
cd cosense-mcp-server
pnpm install
pnpm run build
```

Then configure your MCP client to use the local build:

```json
{
  "mcpServers": {
    "cosense-mcp-server": {
      "command": "node",
      "args": ["/path/to/cosense-mcp-server/build/index.js"],
      "env": {
        "COSENSE_PROJECT_NAME": "your_project_name",
        "COSENSE_SID": "your_sid"
      }
    }
  }
}
```

## Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
pnpm run inspect
```

The Inspector will provide a URL to access debugging tools in your browser.

## Acknowledgments

This project is forked from [funwarioisii/cosense-mcp-server](https://github.com/funwarioisii/cosense-mcp-server).
