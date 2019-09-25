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
import url from 'url';
import xmlrpc from 'xmlrpc';
import { Config } from './types/IConfig';
import { ExecuteParams } from './types/IExecuteParams';
import { RenderParams } from './types/IRenderParams';

export class Odoo {
  urlParts: url.UrlWithStringQuery;
  host: string | undefined;
  port: number;
  db: string | undefined;
  username: string | undefined;
  password: string | undefined;
  secure: boolean;
  uid: number | undefined;

  constructor(private readonly config: Config) {
    this.urlParts = url.parse(this.config.url);
    this.host = this.urlParts.hostname;
    this.port = this.config.port || (this.urlParts.port ? parseInt(this.urlParts.port, 10) : 80);
    this.db = this.config.db;
    this.username = this.config.username;
    this.password = this.config.password;
    this.secure = this.urlParts.protocol === 'https:' ? true : false;
    this.uid = 0;
  }

  public async connect(): Promise<any> {
    let client: xmlrpc.Client;
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
      client = xmlrpc.createSecureClient(clientOptions);
    } else {
      client = xmlrpc.createClient(clientOptions);
    }

    return new Promise((resolve, reject) => {
      client.methodCall('authenticate', methodParams, (error, value) => {
        if (error) reject(error);
        if (value) resolve(value);
        else resolve({ message: 'No UID returned from authentication.' });
      });
    });
  }

  public async executeKw({ model, method, params }: ExecuteParams): Promise<any> {
    let client: xmlrpc.Client;
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
      client = xmlrpc.createSecureClient(clientOptions);
    } else {
      client = xmlrpc.createClient(clientOptions);
    }

    return new Promise((resolve, reject) => {
      client.methodCall('execute_kw', methodParams, (error, value) => {
        if (error) reject(error);
        resolve(value);
      });
    });
  }

  public async execWorkflow({ model, method, params }: ExecuteParams): Promise<any> {
    let client: xmlrpc.Client;
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
      client = xmlrpc.createSecureClient(clientOptions);
    } else {
      client = xmlrpc.createClient(clientOptions);
    }

    return new Promise((resolve, reject) => {
      client.methodCall('exec_workflow', methodParams, (error, value) => {
        if (error) reject(error);
        resolve(value);
      });
    });
  }

  public async renderReport({ report, params }: RenderParams): Promise<any> {
    let client: xmlrpc.Client;
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
      client = xmlrpc.createSecureClient(clientOptions);
    } else {
      client = xmlrpc.createClient(clientOptions);
    }

    return new Promise((resolve, reject) => {
      client.methodCall('render_report', methodParams, (error, value) => {
        if (error) reject(error);
        resolve(value);
      });
    });
  }
}
