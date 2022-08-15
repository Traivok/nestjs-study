import { rm }                   from 'fs/promises';
import { join }                 from 'path';
import { getConnectionManager } from 'typeorm';

global.beforeEach(async () => {
    try {
        await rm(join(__dirname, '..', 'test.sqlite'));
    } catch (e) {}

});

global.afterEach(async () => {
    const connectionManager = getConnectionManager();

    const connectionClosePromises: Promise<any>[] = [];
    connectionManager.connections?.forEach((connection) => {
        if (connection.isConnected) connectionClosePromises.push(connection.close());
    });

    Promise.all(connectionClosePromises)
        .then();
});