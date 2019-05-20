import connStr from './connstr';
export default class Bucket {
  _cb: any;
  connected: boolean | null;
  waitQueue: any[];
  // private _cluster: Cluster;
  // private _name: string;
  // async query(query: string, params: )
  // async _viewQuery()

  constructor(options: any) {
    // We normalize both for consistency as well as to
    //  create a duplicate object to use
    options.dsnObj = connStr.normalize(options.dsnObj);

    const bucketDsn = connStr.stringify(options.dsnObj);
    const bucketUser = options.username;
    const bucketPass = options.password;

    this._cb = new CBjs(bucketDsn, bucketUser, bucketPass);
    this.connected = null;
    this.waitQueue = [];
  }

  /**
   * Invokes an operation and dispatches a callback error if one occurs.
   */
  private _invoke(fn: any, args: any[]): void {
    try {
      fn.apply(this._cb, args);
    } catch (e) {
      args[args.length - 1](e, null);
    }
  }

  /**
   * Will either invoke the binding method specified by fn, or alternatively
   * push the operation to a queue which is flushed once a connection
   * has been established or failed.
   */
  private _maybeInvoke(fn: any, args: any[]): void {
    if (this.connected === true) {
      this._invoke(fn, args);
    } else if (this.connected === false) {
      throw new Error('cannot perform operations on a shutdown bucket');
    } else {
      this.waitQueue.push([fn, args]);
    }
  }

  get(key: string | Buffer, options: any): Promise<any> {
    // this._checkHashkeyOption(options);
    return this._maybeInvoke(this._cb.get, [key, options.hashkey, 0, 0]);
  }

  private _n1ql(query: string, params: any) {

  }

  /**
   * Shuts down this connection
   */
  disconnect() {}
}
