import morgan from 'morgan';

morgan.token('timestamp', () => {
  return new Date().toISOString();
});

const logFormat = ':timestamp :method :url :status :res[content-length] - :response-time ms';

export const morganLogger = morgan(logFormat, {
  skip: () => process.env.NODE_ENV === 'test',
});

class Logger {
  private log(level: string, message: string, meta?: any) {
    if (process.env.NODE_ENV === 'test') return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(meta && { meta }),
    };

    console.log(JSON.stringify(logEntry));
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }

  error(message: string, meta?: any) {
    this.log('error', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }

  debug(message: string, meta?: any) {
    this.log('debug', message, meta);
  }
}

export const logger = new Logger();
