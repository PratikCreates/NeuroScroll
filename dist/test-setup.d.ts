/**
 * Jest test setup for Chrome extension testing
 */
declare const mockChrome: {
    storage: {
        local: {
            get: jest.Mock<any, any, any>;
            set: jest.Mock<any, any, any>;
            clear: jest.Mock<any, any, any>;
        };
    };
    runtime: {
        sendMessage: jest.Mock<any, any, any>;
        onMessage: {
            addListener: jest.Mock<any, any, any>;
        };
        onInstalled: {
            addListener: jest.Mock<any, any, any>;
        };
        onStartup: {
            addListener: jest.Mock<any, any, any>;
        };
        lastError: null;
    };
};
