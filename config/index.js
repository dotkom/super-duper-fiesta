const _ = require('lodash');
const logger = require('../server/logging');
const osPath = require('path');

const productionDefaults = require('./production');

/**
 * @ToDo: List of vars overridden in each step.
 * @ToDo: Print source of each var (defaults, env-defaults or env vars).
 * @ToDo: Autogenerate ENV_VAR keys from full path (SDF + OBJECT_PATH.replace(., _))
 */

const PROJECT_ROOT = osPath.join(__dirname, '..');

const defaults = {
  database: {
    uri: `sqlite://${PROJECT_ROOT}/db.db`,
    pool: {
      min: 0,
      max: 5,
    },
  },
  openId: {
    provider: 'http://127.0.0.1:8000/openid/',
    clientId: '',
  },
};

const ENV_VARS = {
  database: {
    uri: 'DATABASE_URL',
  },
  openId: {
    provider: 'SDF_OIDC_PROVIDER',
    clientId: 'SDF_OIDC_CLIENT_ID',
  },
};

function nestedObjectKey(path, key) {
  return path ? `${path}.${key}` : key;
}

function updateConfigObject(obj, path = '') {
  // @ToDo: Rewrite to mapReduce maybe
  const configObj = Object.assign({}, obj);

  logger.silly(`Updating config object '${path}'`);

  Object.keys(configObj)
  .forEach((key) => {
    const rootKey = nestedObjectKey(path, key);
    // If the value of this key maps to an object
    // we call this function recursively to update all nested object keys
    if (typeof configObj[key] === 'object') {
      configObj[key] = updateConfigObject(configObj[key], nestedObjectKey(path, key));
    } else {
      // If not, we'll get the values from env and override if they exist.
      const envVar = _.get(ENV_VARS, rootKey);
      if (!envVar) {
        logger.warn(`No environment variable exists to override '${rootKey}'`, { key: rootKey });
      } else if (envVar && process.env[envVar]) {
        const value = process.env[envVar];

        if (value !== obj[key]) {
          logger.debug(`Overriding '${rootKey}' from environment.`, {
            key: rootKey,
            old: obj[key],
            new: value,
          });
          configObj[key] = value;
        }
      }
    }
  });
  return configObj;
}

function getFromEnv(current) {
  logger.info('Updating configuration using environment variables.');
  return updateConfigObject(Object.assign({}, current));
}

logger.info('Building project configuration.');

// Apply default configuration values
let config = Object.assign({}, defaults);
let overrides;

switch (process.env.NODE_ENV) {
  case 'PRODUCTION': {
    overrides = productionDefaults;
    logger.info('Overriding with PRODUCTION vars', overrides);
    break;
  }

  default:
    overrides = {};
}

// Apply environment specific overrides
config = Object.assign({}, config, overrides);

// Apply environment variables
config = Object.assign({}, config, getFromEnv(config));

logger.info('Built project configuration.');

module.exports = config;

