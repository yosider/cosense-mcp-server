export interface Config {
  cosenseSid?: string;
  projectName: string;
}

export function getConfig(): Config {
  const cosenseSid = process.env.COSENSE_SID;
  const projectName = process.env.COSENSE_PROJECT_NAME;

  if (!projectName) {
    throw new Error('COSENSE_PROJECT_NAME is not set');
  }

  return {
    cosenseSid,
    projectName,
  };
}
