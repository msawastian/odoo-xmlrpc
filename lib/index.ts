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

    /**
     * Connect to ODOO database.
     */
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

    this.execute_kw = function(model, method, params, callback){
        var clientOptions = {
            host: this.host,
            port: this.port,
            path: '/xmlrpc/2/object'
        }
        var client;
        if(this.secure == false) {
          client = xmlrpc.createClient(clientOptions);
        }
        else {
          client = xmlrpc.createSecureClient(clientOptions);
        }
        var fparams = [];
        fparams.push(this.db);
        fparams.push(uid);
        fparams.push(this.password);
        fparams.push(model);
        fparams.push(method);
        for(var i = 0; i <params.length; i++){
            fparams.push(params[i]);
        }
        client.methodCall('execute_kw', fparams, function(error, value) {
            if(error){
                return callback(error, null);
            }
            return callback(null,value);
        });
    };
    this.exec_workflow = function(model, method, params, callback){
        var clientOptions = {
            host: this.host
            , port: this.port
            , path: '/xmlrpc/2/object'
        }
        var client;
        if(this.secure == false) {
          client = xmlrpc.createClient(clientOptions);
        }
        else {
          client = xmlrpc.createSecureClient(clientOptions);
        }
        var fparams = [];
        fparams.push(this.db);
        fparams.push(uid);
        fparams.push(this.password);
        fparams.push(model);
        fparams.push(method);
        for(var i = 0; i <params.length; i++){
            fparams.push(params[i]);
        }
        client.methodCall('exec_workflow', fparams, function(error, value) {
            if(error){
                return callback(error, null);
            }
            return callback(null,value);
        });
    };
    this.render_report = function(report, params, callback){
        var clientOptions = {
            host: this.host
            , port: this.port
            , path: '/xmlrpc/2/report'
        }
        var client;
        if(this.secure == false) {
          client = xmlrpc.createClient(clientOptions);
        }
        else {
          client = xmlrpc.createSecureClient(clientOptions);
        }
        var fparams = [];
        fparams.push(this.db);
        fparams.push(uid);
        fparams.push(this.password);
        fparams.push(report);
        for(var i = 0; i <params.length; i++){
            fparams.push(params[i]);
        }
        client.methodCall('render_report', fparams, function(error, value) {
            if(error){
                return callback(error, null);
            }
            return callback(null,value);
        });
    };
}
