const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');

export class Server {
    /**
     * The server options.
     *
     * @type {Object}
     */
    public options: any = {
        host: '127.0.0.1',
        port: 80,
        protocol: 'http',
        ssl: {
            certPath: '',
            keyPath: '',
            caPath: '',
            passphrase: '',
        },
        headers: {
            //
        },
    };

    /**
     * The http server.
     *
     * @type {any}
     */
    public express: any;

    /**
     * Create a new server instance.
     */
    constructor() {
        //
    }

    /**
     * Initialize the Express server.
     *
     * @return {Promise<any>}
     */
    initialize(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.serverProtocol().then(server => {
                console.log('Server running...', server);
            }, error => reject(error));
        });
    }

    /**
     * Select the http protocol to run on.
     *
     * @return {Promise<any>}
     */
    protected serverProtocol(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.options.protocol === 'https') {
                this.configureSecurity().then(() => {
                    resolve(this.buildServer(true));
                }, error => reject(error));
            } else {
                resolve(this.buildServer(false));
            }
        });
    }

    /**
     * Load SSL 'key' & 'cert' files if https is enabled.
     *
     * @return {Promise<any>}
     */
    protected configureSecurity(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.options.ssl.certPath || !this.options.ssl.keyPath) {
                reject('SSL paths are missing in server config.');
            }

            Object.assign(this.options, {
                cert: fs.readFileSync(this.options.ssl.certPath),
                key: fs.readFileSync(this.options.ssl.keyPath),
                ca: (this.options.ssl.caPath) ? fs.readFileSync(this.options.ssl.caPath) : '',
                passphrase: this.options.ssl.passphrase,
            });

            resolve(this.options);
        });
    }

    /**
     * Create Socket.IO & HTTP(S) servers.
     *
     * @param  {boolean}  secure
     * @return {any}
     */
    protected buildServer(secure: boolean): any {
        this.express = express();

        this.configureHeaders();
        this.configureJsonBody();

        let httpServer = secure
            ? https.createServer(this.options, this.express)
            : http.createServer(this.express);

        httpServer.listen(this.options.port, this.options.host);

        return httpServer;
    }

    /**
     * Configure the headers from the settings.
     *
     * @return {void}
     */
    protected configureHeaders(): void {
        this.express.use((req, res, next) => {
            for (let header in this.options.headers) {
                res.setHeader(header, this.options.headers[header]);
            }

            next();
        });
    }

    /**
     * Configure the JSON body parser.
     *
     * @return {void}
     */
    protected configureJsonBody(): void {
        this.express.use(bodyParser.json({ strict: false }));
    }
}
