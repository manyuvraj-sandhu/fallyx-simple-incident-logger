export const logError = (error: any) => {
    console.error(`[${new Date().toISOString()}]`, error);
  };
  
  export const logInfo = (message: string) => {
    console.info(`[${new Date().toISOString()}]`, message);
  };
  