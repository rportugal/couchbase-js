import * as rp from 'request-promise';
import * as request from 'request';
import { ConnectionOpts } from './couchbase';

const defaultOpts = (s: any): request.CoreOptions => ({
  timeout: 5000,
  rejectUnauthorized: !(s.options && s.options.insecure),
  jar: s.cookieJar
});

export default class Bucket {
  private uiUrl: string;
  private name: string;
  private username: string;
  private password: string;
  private options: ConnectionOpts;
  private cookieJar: any;

  constructor(uiUrl: string, name: string, username: string, password: string, options: ConnectionOpts) {
    this.uiUrl = uiUrl;
    this.name = name;
    this.username = username;
    this.password = password;
    this.options = options;

    this.cookieJar = rp.jar();
  }

  authorize(): Promise<void> {
    const opts = {
      ...defaultOpts(this),
      uri: `${this.uiUrl}/uilogin`,
      rejectUnauthorized: !(this.options && this.options.insecure),
      jar: this.cookieJar,
      form: {
        user: this.username,
        password: this.password
      }
    };

    return new Promise((resolve, reject) => {
      rp.post(opts)
        .then(() => resolve())
        .catch(err => reject(err));
    });
  }

  async get(key: string): Promise<any> {
    await this.authorize();

    const opts = {
      ...defaultOpts(this),
      uri: `${this.uiUrl}/pools/default/buckets/${this.name}/docs/${encodeURIComponent(key)}`,
      headers: {
        'ns-server-ui': 'yes'
      }
    };

    return rp.get(opts).then(res => JSON.parse(JSON.parse(res).json));
  }

  async query(query: string): Promise<any> {
    await this.authorize();

    const opts = {
      ...defaultOpts(this),
      uri: `${this.uiUrl}/_p/query/query/service`,
      headers: {
        'ns-server-ui': 'yes'
      },
      body: {
        statement: query,
        pretty: true,
        scan_consistency: 'not_bounded'
      },
      json: true
    };

    return rp.post(opts).then(res => res.results);
  }
}
