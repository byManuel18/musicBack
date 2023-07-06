import { createServer, Server } from 'http';
import { Server as ServerIO } from 'socket.io';
import bodyParser from 'body-parser';

import cors from 'cors';
import express, { Express } from 'express';
import fileUpload from 'express-fileupload';
import { inicializeDB } from '../database/db';
import { RouterCreator } from '../routers';
import { socketsController } from '../controller';

const PORT_SERVER = process.env.PORT_SERVE!;

export class ServerApp {

    app: Express;
    port: string;
    server: Server<any, any>;
    io: ServerIO;

    constructor() {

        this.app = express();
        this.port = PORT_SERVER;
        this.middlewares();
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);
        this.sockets();
        this.routes();

        this.connectDB().then(_ => {

            this.listen();

        }).catch(err => {
            console.log(err);
        })

    }

    async connectDB() {
        await inicializeDB();
    }

    middlewares() {

        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({
            extended: true,
        }));
        this.app.use(bodyParser.json());
        // this.app.use(express.static('public')); 
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        const mainRouter = new RouterCreator(this.io);
        this.app.use('/api', mainRouter.getRouter());
    }

    sockets() {
        this.io.on('connection', (socket) => socketsController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        })
    }

}