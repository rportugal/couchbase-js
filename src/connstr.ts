import * as qs from 'querystring';

export interface ConnStrSpec {
  scheme?: string;
  hosts?: any[] | string; //{Array.<Array.<string,number>>}
  bucket?: string;
  options?: any;
}

/** A container to hold information decoded from a couchbase connection string.  It contains the scheme, hosts, bucket name and various KV options that were attached to the string.*/
export class ConnStr {
  constructor() {}

  _parse(dsn?: string | null): ConnStrSpec {
    const out: ConnStrSpec = {};

    if (!dsn) {
      return out;
    }

    const parts = new RegExp(
      '((.*):\\/\\/)?' + '(([^\\/?:]*)(:([^\\/?:@]*))?@)?' + '([^\\/?]*)(\\/([^\\?]*))?' + '(\\?(.*))?'
    ).exec(dsn);
    if (parts && parts[2]) {
      out.scheme = parts[2];
    }
    if (parts && parts[7]) {
      out.hosts = [];
      const hostMatcher = /((\[[^\]]+\]+)|([^;\,\:]+))(:([0-9]*))?(;\,)?/g;
      while (true) {
        const hostMatch = hostMatcher.exec(parts[7]);
        if (!hostMatch) {
          break;
        }
        out.hosts.push([hostMatch[1], hostMatch[5] ? parseInt(hostMatch[5], 10) : 0]);
      }
    }

    if (parts && parts[9]) {
      out.bucket = parts[9];
    }
    if (parts && parts[11]) {
      out.options = {};
      const kvMatcher = /([^=]*)=([^&?]*)[&?]?/g;
      while (true) {
        const kvMatch = kvMatcher.exec(parts[11]);
        if (!kvMatch) {
          break;
        }
        const optKey = qs.unescape(kvMatch[1]);
        const optVal = qs.unescape(kvMatch[2]);
        if (out.options.hasOwnProperty(optKey)) {
          if (Array.isArray(out.options[optKey])) {
            out.options[optKey].push(optVal);
          } else {
            out.options[optKey] = [out.options[optKey], optVal];
          }
        } else {
          out.options[optKey] = optVal;
        }
      }
    }

    return out;
  }

  _normalize(dsn: ConnStrSpec) {
    var dsnObj: any = {};

    if (dsn.scheme) {
      dsnObj.scheme = dsn.scheme;
    } else {
      dsnObj.scheme = 'http';
    }

    dsnObj.hosts = [];
    if (dsn.hosts) {
      if (typeof dsn.hosts === 'string') {
        dsn.hosts = [dsn.hosts];
      }

      for (var i = 0; i < dsn.hosts.length; ++i) {
        if (typeof dsn.hosts[i] === 'string') {
          var portPos = dsn.hosts[i].indexOf(':');
          if (portPos >= 0) {
            var hostName = dsn.hosts[i].substr(0, portPos);
            var portNum = parseInt(dsn.hosts[i].substr(portPos + 1), 10);
            dsnObj.hosts.push([hostName, portNum]);
          } else {
            dsnObj.hosts.push([dsn.hosts[i], 0]);
          }
        } else {
          dsnObj.hosts.push(dsn.hosts[i]);
        }
      }
    }

    if (dsn.bucket) {
      dsnObj.bucket = dsn.bucket;
    } else {
      dsnObj.bucket = 'default';
    }

    if (dsn.options) {
      dsnObj.options = dsn.options;
    } else {
      dsnObj.options = {};
    }

    return dsnObj;
  }

  _stringify(options: ConnStrSpec): string {
    let dsn = '';
    if (options.scheme) {
      dsn += options.scheme + '://';
    }
    for (let i = 0; i < ((options && options.hosts && options.hosts.length) || 0); ++i) {
      const host = options && options.hosts && options.hosts[i];
      if (i !== 0) {
        dsn += ',';
      }
      dsn += host[0];
      if (host[1]) {
        dsn += ':' + host[1];
      }
    }
    dsn += '/';
    if (options.bucket) {
      dsn += options.bucket;
    }
    if (options.options) {
      let isFirstOption = true;
      for (let j in options.options) {
        /* istanbul ignore else  */
        if (options.options.hasOwnProperty(j)) {
          var opts = [];
          if (Array.isArray(options.options[j])) {
            opts = options.options[j];
          } else {
            opts.push(options.options[j]);
          }
          for (var k = 0; k < opts.length; ++k) {
            if (isFirstOption) {
              dsn += '?';
              isFirstOption = false;
            } else {
              dsn += '&';
            }
            dsn += qs.escape(j) + '=' + qs.escape(opts[k]);
          }
        }
      }
    }
    return dsn;
  }

  normalize(dsn: ConnStrSpec | string): ConnStrSpec | string {
    if (typeof dsn === 'string') {
      return this._stringify(this._normalize(this._parse(dsn)));
    }
    return this._normalize(dsn);
  }

  parse(dsn?: string | null): ConnStrSpec {
    return this._normalize(this._parse(dsn));
  }

  stringify(options: ConnStrSpec): string {
    return this._stringify(this._normalize(options));
  }
}

const connStr = new ConnStr();
export default connStr;
