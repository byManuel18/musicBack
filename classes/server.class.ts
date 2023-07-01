import { createServer, Server } from 'https';
import cors from 'cors';
import express, { Express } from 'express';
import fileUpload from 'express-fileupload';
import { inicializeDB } from '../database/db';
import { GeneralRoutes } from '../routers';

const PORT_SERVER = process.env.PORT_SERVE!;

export class ServerApp {

    app: Express;
    port: string;
    server: Server<any, any>;
    io: Server;

    constructor() {

        this.app = express();
        this.port = PORT_SERVER;
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.connectDB().then(_ => {

            this.middlewares();
            this.routes();
            this.sockets();
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
        this.app.use(express.json());
        // this.app.use(express.static('public')); 
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        // this.app.use(GeneralRoutes.User,UserRouter);
    }

    sockets() {
        // this.io.on('connection',(socket)=>socketsController(socket,this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        })
    }

}