/**
 * Virtual base for authenticators.
 */
export interface Authenticator {
  username: string;
  password: string;
}

/**
 * Authenticator for using classic authentication.
 */
export class ClassicAuthenticator implements Authenticator {
  /**
   * Create a new instance of the ClassicAuthenticator class.
   * @param buckets Map of bucket names to passwords.
   * @param username Cluster administration username.
   * @param password Cluster administration password.
   */
  constructor(buckets: { [key: string]: string }, username: string, password: string) {
    this.buckets = buckets;
    this.username = username;
    this.password = password;
  }

  buckets: { [key: string]: string };
  username: string;
  password: string;
}

/**
 * Authenticator for using role-based authentication.
 */
export class PasswordAuthenticator implements Authenticator {
  /**
   * Create a new instance of the PasswordAuthenticator class.
   * @param username RBAC username.
   * @param password RBAC password.
   */
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  username: string;
  password: string;
}
