import Bucket from './bucket';

export interface ConnectionOpts {
  insecure?: boolean;
}

export default class Couchbase {
  private uiUrl: string;
  private username: string;
  private password: string;
  private options: ConnectionOpts;

  constructor(uiUrl: string, username: string, password: string, options?: ConnectionOpts) {
    const defaultOptions = { insecure: false };
    this.uiUrl = uiUrl;
    this.username = username;
    this.password = password;
    this.options = options || defaultOptions;
  }

  openBucket(name: string): Bucket {
    return new Bucket(this.uiUrl, name, this.username, this.password, this.options);
  }
}
