/**
 * Custom log levels configuration for Winston logger
 */
export const myCustomLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  },
  colors: {
    fatal: 'magenta',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    trace: 'white',
  },
};

export type CustomLevels = typeof myCustomLevels['levels'];
