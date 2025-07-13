import midtransClient from 'midtrans-client';
import { config } from './index';

// Create Snap API instance
export const core = new midtransClient.CoreApi({
    isProduction: config.NODE_ENV === 'production',
    serverKey: config.MIDTRANS_SERVER_KEY,
    clientKey: config.MIDTRANS_CLIENT_KEY,
});