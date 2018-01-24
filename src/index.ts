import { GraphQlApplication } from './app';

const app = GraphQlApplication.createApp();

app.init().then(() => app.listen());
