const logger = (message: any, prefix?: string) => {
  console.log(`CODEX ${prefix?.toUpperCase()}`, message);
};

export default logger;
