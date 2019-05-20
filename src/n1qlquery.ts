/**
 * Class for dynamically construction of N1QL queries.  This class should never
 * be constructed directly, instead you should use the
 * N1qlQuery.fromString static method to instantiate a
 * N1qlStringQuery.
 */
class N1qlQuery {}

/**
 * Enumeration for specifying N1QL consistency semantics.
 */
enum Consistency {
  /**
   * 	This is the default (for single-statement requests).
   */
  NOT_BOUND,

  /**
   * This implements strong consistency per request.
   */
  REQUEST_PLUS,

  /**
   * This implements strong consistency per statement.
   */
  STATEMENT_PLUS
}
