import baseConfig from './base.config';
import localConfig from './local.config';
import { merge } from 'lodash';

const config: typeof baseConfig = merge(
    baseConfig,
    require('./' + (process.env.ENV || 'dev') + '.config').default,
    localConfig,
);

export default config;
