"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
*
* Original author: Faisal Sami
* mail: faisalsami78@gmail.com
* https://github.com/faisalsami/odoo-xmlrpc
*
* Fork contributor: Mateusz Sawastian
* mail: m.sawastian@gmail.com
* https://github.com/msawastian/odoo-xmlrpc
*
*/
const url_1 = __importDefault(require("url"));
const xmlrpc_1 = __importDefault(require("xmlrpc"));
class Odoo {
    constructor(config) {
        this.config = config;
        this.urlParts = url_1.default.parse(this.config.url);
        this.host = this.urlParts.hostname;
        this.port = this.config.port || (this.urlParts.port ? parseInt(this.urlParts.port, 10) : 80);
        this.db = this.config.db;
        this.username = this.config.username;
        this.password = this.config.password;
        this.secure = this.urlParts.protocol === 'https:' ? true : false;
        this.uid = 0;
    }
    async connect() {
        let client;
        const methodParams = [
            this.db,
            this.username,
            this.password,
            {}
        ];
        const clientOptions = {
            host: this.host,
            port: this.port,
            path: '/xmlrpc/2/common'
        };
        if (this.secure) {
            client = xmlrpc_1.default.createSecureClient(clientOptions);
        }
        else {
            client = xmlrpc_1.default.createClient(clientOptions);
        }
        return new Promise((resolve, reject) => {
            client.methodCall('authenticate', methodParams, (error, value) => {
                if (error)
                    reject(error);
                if (value)
                    resolve(value);
                else
                    resolve({ message: 'No UID returned from authentication.' });
            });
        });
    }
    async executeKw({ model, method, params }) {
        let client;
        const methodParams = [
            this.db,
            this.uid,
            this.password,
            model,
            method,
            ...params
        ];
        const clientOptions = {
            host: this.host,
            port: this.port,
            path: '/xmlrpc/2/object'
        };
        if (this.secure) {
            client = xmlrpc_1.default.createSecureClient(clientOptions);
        }
        else {
            client = xmlrpc_1.default.createClient(clientOptions);
        }
        return new Promise((resolve, reject) => {
            client.methodCall('execute_kw', methodParams, (error, value) => {
                if (error)
                    reject(error);
                resolve(value);
            });
        });
    }
    async execWorkflow({ model, method, params }) {
        let client;
        const methodParams = [
            this.db,
            this.uid,
            this.password,
            model,
            method,
            ...params
        ];
        const clientOptions = {
            host: this.host,
            port: this.port,
            path: '/xmlrpc/2/object'
        };
        if (this.secure) {
            client = xmlrpc_1.default.createSecureClient(clientOptions);
        }
        else {
            client = xmlrpc_1.default.createClient(clientOptions);
        }
        return new Promise((resolve, reject) => {
            client.methodCall('exec_workflow', methodParams, (error, value) => {
                if (error)
                    reject(error);
                resolve(value);
            });
        });
    }
    async renderReport({ report, params }) {
        let client;
        const methodParams = [
            this.db,
            this.uid,
            this.password,
            report,
            ...params
        ];
        const clientOptions = {
            host: this.host,
            port: this.port,
            path: '/xmlrpc/2/report'
        };
        if (this.secure) {
            client = xmlrpc_1.default.createSecureClient(clientOptions);
        }
        else {
            client = xmlrpc_1.default.createClient(clientOptions);
        }
        return new Promise((resolve, reject) => {
            client.methodCall('render_report', methodParams, (error, value) => {
                if (error)
                    reject(error);
                resolve(value);
            });
        });
    }
}
exports.Odoo = Odoo;
