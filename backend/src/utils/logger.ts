import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'bot-admin' },
    transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.json()
      ),
    }),
  ],
});

export default logger;