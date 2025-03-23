import type {
  CallToolResult,
  Tool as _Tool,
} from '@modelcontextprotocol/sdk/types.js';

export interface ToolContext {
  projectName: string;
  cosenseOptions: { sid?: string };
}

export interface Tool<TArgs> extends _Tool {
  execute(args: TArgs, context: ToolContext): Promise<CallToolResult>;
}
