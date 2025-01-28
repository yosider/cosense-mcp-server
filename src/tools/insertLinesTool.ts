import { patch } from '@cosense/std/websocket';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { unwrapErr } from 'option-t/plain_result';
import type { Tool } from './types.js';

export interface InsertLinesContext {
  projectName: string;
  cosenseOptions: { sid?: string };
}

interface InsertLinesArgs {
  pageTitle: string;
  targetLineText: string;
  text: string;
}

export const insertLinesTool: Tool<InsertLinesContext, InsertLinesArgs> = {
  name: 'insert_lines',
  description:
    'Insert lines after the specified target line in a Cosense page. If the target line is not found, append to the end of the page.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      pageTitle: {
        type: 'string',
        description: 'Title of the page to modify',
      },
      targetLineText: {
        type: 'string',
        description:
          'Text of the line after which to insert new content. If not found, content will be appended to the end.',
      },
      text: {
        type: 'string',
        description:
          'Text to insert. If you want to insert multiple lines, use \\n for line breaks.',
      },
    },
    required: ['pageTitle', 'targetLineText', 'text'],
  },
  async execute(
    { pageTitle, targetLineText, text }: InsertLinesArgs,
    { projectName, cosenseOptions }: InsertLinesContext
  ): Promise<CallToolResult> {
    const result = await patch(
      projectName,
      pageTitle,
      (lines) => {
        // find the index of the target line
        let index = lines.findIndex((line) => line.text === targetLineText);
        // if not found, append to the end
        index = index < 0 ? lines.length : index;
        // insert the text
        const linesText = lines.map((line) => line.text);
        return [
          ...linesText.slice(0, index + 1),
          ...text.split('\n'),
          ...linesText.slice(index + 1),
        ];
      },
      cosenseOptions
    );

    if (result.ok) {
      return {
        content: [
          {
            type: 'text',
            text: `Successfully inserted lines.`,
          },
        ],
      };
    } else {
      throw unwrapErr(result);
    }
  },
};
