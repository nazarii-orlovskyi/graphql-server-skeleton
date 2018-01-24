import devConfig from './dev.config';
import { merge } from 'lodash';

const debugConfig: typeof devConfig = merge(
    devConfig,
    {        
        server: {
            port: 8091
        }
    } as typeof devConfig
);
export default debugConfig;
