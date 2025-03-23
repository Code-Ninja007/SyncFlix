const { format } = require('date-fns');

class Logger {
  static levels = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
  };

  static formatMessage(level, message, meta = {}) {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `[${timestamp}] ${level}: ${message} ${metaString}`.trim();
  }

  static info(message, meta) {
    console.log(this.formatMessage(this.levels.INFO, message, meta));
  }

  static error(message, meta) {
    console.error(this.formatMessage(this.levels.ERROR, message, meta));
  }

  static warn(message, meta) {
    console.warn(this.formatMessage(this.levels.WARN, message, meta));
  }

  static debug(message, meta) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage(this.levels.DEBUG, message, meta));
    }
  }

  static request(req, extra = {}) {
    this.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      ...extra
    });
  }
}

module.exports = Logger;