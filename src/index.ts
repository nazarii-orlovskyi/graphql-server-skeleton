import config from './config';
import createApp from './app';

createApp().then((app) => {
    app.listen(config.server.port, () => {
        console.log(`Server listen on http://localhost:${config.server.port}`);
    });
});
