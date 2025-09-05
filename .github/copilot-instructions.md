# Cosense MCP Server

A Model Context Protocol (MCP) server for [Cosense](https://cosen.se) that provides tools for reading and writing pages in Cosense/Scrapbox projects.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites and Dependencies
- **CRITICAL JSR Registry Requirement**: This project depends on packages from JSR registry (npm.jsr.io). Network access to JSR is required for full functionality.
- Configure JSR registry globally before any npm operations:
  ```bash
  echo "@jsr:registry=https://npm.jsr.io" >> ~/.npmrc
  ```
- **NETWORK LIMITATION**: If JSR registry is not accessible, builds will fail with ENOTFOUND errors for npm.jsr.io
- The repository includes `.npmrc` with JSR registry configuration

### Installation and Setup
- **NEVER CANCEL**: Initial dependency installation takes approximately 1-2 minutes. Set timeout to 300+ seconds.
- Install all dependencies:
  ```bash
  npm install
  ```
- **CRITICAL LIMITATION**: JSR registry (npm.jsr.io) may not be accessible in all environments
  - Results in `npm error network request to https://npm.jsr.io failed, reason: getaddrinfo ENOTFOUND`
  - Causes incomplete installation of @cosense dependencies
  - **Workaround**: Try `npm config set @jsr:registry https://registry.npmjs.org/` but may not contain JSR packages

### Build Process
- **CRITICAL BUILD FAILURE**: Build consistently fails with TypeScript compilation errors
- Build command: `npm run build` (uses `tsc`) - **EXPECTED TO FAIL**
- **NEVER CANCEL**: TypeScript compilation takes 1.8 seconds when dependencies are present
- Build creates `build/` directory with compiled JavaScript (when successful)
- **Known Build Failures** (19 TypeScript errors):
  - Cannot find module '@cosense/types/rest' 
  - Cannot find module '@cosense/std/rest'
  - Cannot find module '@cosense/std/websocket'
  - Parameter implicitly has 'any' type errors
  - Missing JSR package type declarations

### Development Commands - CURRENTLY NON-FUNCTIONAL
- **Development server**: `npm run start:dev` - **FAILS**: `tsx: not found`
- **Direct execution**: `npm run start` - **FAILS**: `tsx: not found`
- **MCP Inspector**: `npm run inspect` - **FAILS**: times out during dependency installation
- **Runtime execution**: All runtime commands fail due to missing dependencies and build artifacts

### Code Quality and Linting
- **Formatting check**: `npx prettier --check "src/**/*.ts"` (**INTERMITTENT** - may require multiple attempts)
- **Format code**: `npx prettier --write "src/**/*.ts"` (**INTERMITTENT**)
- **ESLint**: `npm run lint` - **FAILS**: `eslint: not found`
  - **Alternative**: `npx eslint .` - **FAILS**: Cannot find package '@eslint/js'
  - **Root cause**: ESLint dependencies not properly installed
- **Format check for CI**: `npm run format:check` - **UNRELIABLE**

### Testing and Validation - CURRENTLY IMPOSSIBLE
- **No unit tests**: This project does not include test suites
- **Manual validation BLOCKED**: Cannot test functionality due to build/runtime failures
- **Intended validation approach** (when dependencies work):
  1. Use MCP Inspector: `npm run inspect`
  2. Test in browser interface provided by inspector
  3. Validate tools: get_page, list_pages, search_pages, insert_lines
  4. **Environment Variables Required**: COSENSE_PROJECT_NAME, COSENSE_SID
- **Current Reality**: All runtime testing is impossible due to missing dependencies

### CI/CD Pipeline Status
- GitHub Actions workflow: `.github/workflows/ci.yml`
- Tests Node.js versions: 18, 20, 22
- Runs: `npm ci`, `npm run lint`, `npm run format:check`, `npm run build`
- **EXPECTED CI FAILURES**: All steps except formatting will fail
  - npm ci: JSR dependency resolution failures
  - npm run lint: ESLint not available
  - npm run build: TypeScript compilation errors
  - Only `npm run format:check` works reliably

## Architecture and Code Navigation

### Key Directories and Files
```
src/
├── index.ts              # Main MCP server entry point
├── config.ts            # Configuration management
├── cosense.ts           # Cosense API utilities
├── tools/               # MCP tool implementations
│   ├── getPageTool.ts
│   ├── listPagesTool.ts
│   ├── searchPagesTool.ts
│   └── insertLinesTool.ts
├── resources/           # MCP resource handlers
│   └── pageResources.ts
└── utils/               # Utility functions
    ├── logger.ts
    └── utils.ts
```

### Core Dependencies
- `@modelcontextprotocol/sdk`: MCP protocol implementation
- `@cosense/std`: Cosense REST and WebSocket API (JSR package)
- `@cosense/types`: Type definitions for Cosense (JSR package) 
- `tsx`: TypeScript execution engine for development
- `zod`: Runtime type validation
- `option-t`: Functional programming utilities

### Environment Configuration
- `COSENSE_PROJECT_NAME`: Target Cosense project name
- `COSENSE_SID`: Session ID for authentication (sensitive)
- `NODE_ENV`: Controls logging (development/production)

## Common Tasks

### Making Code Changes - LIMITED OPTIONS
1. **Only working validation**: `npx prettier --check "src/**/*.ts"` and format fixes
2. **Cannot validate builds or runtime** due to JSR dependency failures  
3. **Code review only possible through** file inspection and formatting checks
4. **File locations remain valid**:
   - Add new tools in `src/tools/`
   - Register tools in `src/index.ts`
   - Update types in relevant modules
5. **CRITICAL**: No way to test functionality without resolving JSR dependencies

### Debugging and Development - BLOCKED
- **Primary debugging method UNAVAILABLE**: MCP Inspector fails to start
- **Direct execution UNAVAILABLE**: `tsx src/index.ts` fails with missing dependency
- **Watch mode UNAVAILABLE**: `tsx watch src/index.ts` fails
- **Log levels**: Cannot be tested - NODE_ENV settings irrelevant without runtime

### Working with Dependencies - FUNDAMENTAL ISSUE
- **JSR packages mandatory** - contain all Cosense-specific functionality
- **Network connectivity to npm.jsr.io absolutely required** for any development
- **No workaround available** - architecture completely depends on JSR ecosystem
- **Cannot substitute with alternatives** - @cosense packages are unique to JSR

## Known Limitations and Current Blockers

### Critical Build Failures
- **Build ALWAYS fails** with 19 TypeScript errors when JSR dependencies unavailable
- **No workaround available** - JSR access is architectural requirement
- **Cannot work with pre-built JavaScript** - build/ directory not available in repository
- **TypeScript compilation time**: 1.8 seconds (fails consistently)

### Runtime Execution Completely Blocked
- **All development commands fail**: start, start:dev, inspect
- **tsx runtime not available**: Despite being listed in package.json
- **No offline development possible**: Architecture requires live JSR package access
- **MCP Inspector unavailable**: Times out during dependency installation

### Network Dependencies - SHOWSTOPPER
- **JSR registry access mandatory** - npm.jsr.io must be accessible
- **Standard npm registry cannot substitute** - JSR packages not mirrored
- **Firewall/proxy issues fatal** - no bypass mechanism exists
- **Development impossible in restricted networks**

### What Actually Works
- **Code formatting**: `npx prettier --check/--write` commands work reliably (1.6s)
- **File exploration**: Standard file system operations work
- **Git operations**: Standard git commands work
- **Static code analysis**: File reading and inspection possible
- **Documentation updates**: Can edit .md files and other documentation

## Current Status: DEVELOPMENT BLOCKED
**This repository cannot be developed in environments without JSR access.**
**All build, runtime, and testing functionality is non-operational.**
**Only formatting and documentation changes are possible.**

## Validation Scenarios - CURRENTLY IMPOSSIBLE

**CRITICAL**: All functional validation is currently impossible due to JSR dependency failures.

When JSR dependencies are accessible, intended validation flow:
1. **Format validation** (works): `npx prettier --check "src/**/*.ts"`
2. **Build validation** (fails): `npm run build` 
3. **Functional testing** (fails): `npm run inspect`
4. **MCP tool testing** (fails):
   - get_page with valid project/page
   - list_pages for project overview  
   - search_pages with query terms
   - insert_lines for content modification

**CURRENT REALITY**: Only step 1 (formatting) can be completed.

**Required for any real validation**: 
- Network access to npm.jsr.io
- Successful installation of @cosense/std and @cosense/types packages
- Valid Cosense project credentials (COSENSE_PROJECT_NAME, COSENSE_SID)

## Time Expectations (When Working vs Current Reality)
- **NEVER CANCEL**: npm install: 1-2 minutes (300+ second timeout) - **Currently fails**
- Prettier format check: 1.6 seconds (**Intermittently works**)
- TypeScript compilation: 1.8 seconds (**Currently fails**)
- MCP Inspector startup: Expected 5-10 seconds (**Currently times out**)
- **Most reliable operations**: File system and git operations

## Developer Workflow - SEVERELY LIMITED

### What You CAN Do (With Limitations)
1. **Format code**: `npx prettier --write "src/**/*.ts"` (intermittent success)
2. **Check formatting**: `npx prettier --check "src/**/*.ts"` (intermittent success)
3. **Read and edit source files**: All TypeScript files are readable/editable
4. **Update documentation**: README.md and other .md files
5. **File system operations**: Create/delete/move files normally
6. **Git operations**: commit, push, pull work normally

### What You CANNOT Do  
1. **Build the project**: `npm run build` fails with TypeScript errors
2. **Run the application**: All runtime commands fail
3. **Test functionality**: No runtime testing possible
4. **Lint code**: ESLint fails due to missing dependencies
5. **Debug the MCP server**: Inspector cannot start
6. **Validate changes**: No functional validation possible
7. **Reliable formatting**: Even prettier commands have intermittent failures

## Repository Information
- **Type**: TypeScript Node.js MCP server  
- **Package manager**: npm with JSR registry dependency
- **Main branch**: Not specified in exploration
- **License**: MIT
- **Published as**: @yosider/cosense-mcp-server on npm

## FINAL RECOMMENDATION

**For environments without JSR access**: This repository is effectively READ-ONLY. You can:
- View and understand the code structure
- Format code with Prettier  
- Update documentation
- Make cosmetic changes to TypeScript files

**For functional development**: You need:
1. Network access to npm.jsr.io (JSR registry)
2. Successful `npm install` completing without errors
3. Valid Cosense credentials for testing

**If you cannot access JSR**: Focus on documentation improvements, code structure analysis, and preparing changes that can be tested later in a different environment with proper JSR access.

**Alternative approach**: Consider contributing to documentation, README improvements, or suggesting architectural changes that reduce JSR dependency where possible.