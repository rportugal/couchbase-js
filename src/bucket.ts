import * as rp from 'request-promise';
import * as tough from 'tough-cookie';

import { ConnectionOpts } from './couchbase';

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
      uri: `${this.uiUrl}/uilogin`,
      rejectUnauthorized: !(this.options && this.options.insecure),
      method: 'POST',
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
    // TODO: check if auth is still okay
    await this.authorize();

    const opts = {
      uri: `${this.uiUrl}/pools/default/buckets/${this.name}/docs/${encodeURIComponent(key)}`,
      rejectUnauthorized: !(this.options && this.options.insecure),
      jar: this.cookieJar,
      headers: {
        'ns-server-ui': 'yes'
      }
    };

    return rp.get(opts).then(res => JSON.parse(JSON.parse(res).json));
  }
}
