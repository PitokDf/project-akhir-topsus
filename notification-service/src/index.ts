import app from './app';
import { PORT, NODE_ENV } from './config';
import { rabbitMQService } from './service/rabbitmq.service';
import { logger } from './utils/winston.logger';

import { startTransactionWorker } from './workers/transaction.worker';

const startServer = async () => {
    try {
        await rabbitMQService.connect();
        await startTransactionWorker();

        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
        });
    } catch (error) {
        logger.error('Failed to connect to the server or message broker', error);
        process.exit(1);
    }
};

startServer();