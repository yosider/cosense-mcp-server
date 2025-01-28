import type {
  CallToolResult,
  Tool as _Tool,
} from '@modelcontextprotocol/sdk/types.js';

export interface Tool<TContext = unknown, TArgs = unknown> extends _Tool {
  execute(args: TArgs, context: TContext): Promise<CallToolResult>;
}
