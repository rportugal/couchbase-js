import { Authenticator, PasswordAuthenticator } from './auth';
import Bucket from './bucket';

/**
 * Authenticator for performing certificate-based authentication.
 */
declare class CertAuthenticator implements Authenticator {
  /**
   * Create a new instance of the CertAuthenticator class.
   */
  constructor();

  username: string;
  password: string;
}

interface ClusterConstructorOptions {
  /**
   * The path to the certificate to use for SSL connections
   */
  certpath: string;
}

export default class Cluster {
  _auther: Authenticator | null = null;
  _connectingBuckets: Bucket[] = [];
  _connectedBuckets: Bucket[] = [];

  constructor(cnstr?: string, options?: ClusterConstructorOptions) {
    this.dsnObj = connstr.parse(cnstr);
    this._auther = null;
  }

  /**
   * Authenticate to the cluster using a specific authentication type.
   * @param auther
   */
  authenticate(auther: Authenticator): void;

  /**
   * Authenticate to the cluster using role-based authentication.
   * @param username RBAC username.
   * @param password RBAC password.
   */
  authenticate(username: string, password: string): void;

  authenticate(arg1: Authenticator | string, arg2?: string): void {
    if (arg2 && typeof arg1 === 'string') {
      this._auther = new PasswordAuthenticator(arg1, arg2);
    }
    this._auther = arg1 as Authenticator;
  }

  /**
     * Open a bucket to perform operations. This will begin the handshake process immediately and operations will complete later. Subscribe to the connect event to be alerted when the connection is ready, though be aware operations can be successfully queued before this.
     * @param name The name of the bucket to open.
     */
    openBucket(name?: string): Promise<Bucket>;


    /**
     * Open a bucket to perform operations. This will begin the handshake process immediately and operations will complete later. Subscribe to the connect event to be alerted when the connection is ready, though be aware operations can be successfully queued before this.
     * @param name The name of the bucket to open.
     * @param password Password for the bucket.
     */
    openBucket(name?: string, password?: string): Promise<Bucket>;

    openBucket(name?: string, password?: string): Promise<Bucket> {
      const bucketDsnObj = connstr.normalize(this.dsnObj);

    }

}