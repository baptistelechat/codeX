const logger = ({
  message,
  extraTitle,
}: {
  message: any;
  extraTitle?: string;
}) => {
  return console.log(`CODEX ${extraTitle}`, message);
};

export default logger;
