import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  LoggingLevel,
  LoggingLevelSchema,
  LoggingMessageNotification,
  ResultSchema,
} from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

export const sendLoggingMessage = async (
  server: Server,
  params: LoggingMessageNotification['params']
) => {
  if (getPriority(params.level) > getPriority(logLevel)) return;
  return await server.sendLoggingMessage(params);
};

export const registerSetLoggingLevel = (server: Server) => {
  // cf. https://github.com/modelcontextprotocol/typescript-sdk/issues/871#issuecomment-3186357685
  try {
    // https://github.com/modelcontextprotocol/typescript-sdk/issues/871
    const method = SetLevelRequestSchema.shape.method.value;
    // Throws if the method already has a handler
    server.assertCanSetRequestHandler(method);
    server.setRequestHandler(SetLevelRequestSchema, (request) => {
      logLevel = request.params.level;
      return { success: true };
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    /* empty */
  }
};

let logLevel: LoggingLevel = 'debug';

const getPriority = (level: LoggingLevel) => {
  switch (level) {
    case 'debug':
      return 7;
    case 'info':
      return 6;
    case 'notice':
      return 5;
    case 'warning':
      return 4;
    case 'error':
      return 3;
    case 'critical':
      return 2;
    case 'alert':
      return 1;
    case 'emergency':
      return 0;
  }
};

/** A request from the client to the server, to enable or adjust logging.
 *
 * @see https://modelcontextprotocol.io/specification/2025-06-18/schema#setlevelrequest
 */
const SetLevelRequestSchema = ResultSchema.extend({
  method: z.literal('logging/setLevel'),
  params: z.object({ level: LoggingLevelSchema }),
});
