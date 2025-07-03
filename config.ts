export interface Config {
  cosenseSid?: string;
  projectName: string;
}

export function getConfig(): Config {
  // DenoではDeno.envを使う
  const cosenseSid = Deno.env.get("COSENSE_SID");
  const projectName = Deno.env.get("COSENSE_PROJECT_NAME");

  if (!projectName) {
    throw new Error("COSENSE_PROJECT_NAME is not set");
  }

  return {
    cosenseSid,
    projectName,
  };
}
