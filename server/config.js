import path from 'path';

var config = {
    sessionSecret: 'TODO read secrets from separate file',
    port: 5000,
    root: path.normalize(path.join(__dirname, '/../..'))
};

export default config;
