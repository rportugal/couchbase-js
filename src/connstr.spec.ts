import connstr from './connstr';

describe('#ConnStr', () => {
  describe('normalize', () => {
    it('should use sensible default scheme', () => {
      const x = connstr._normalize({});
      expect(x.scheme).toEqual('http');
    });

    it('should break apart string hosts', () => {
      const x = connstr._normalize({
        hosts: 'localhost'
      });
      expect(x.hosts).toEqual([['localhost', 0]]);
    });

    it('should break apart string hosts with a port', () => {
      const x = connstr._normalize({
        hosts: 'localhost:8091'
      });
      expect(x.hosts).toEqual([['localhost', 8091]]);
    });

    it('should normalize strings', () => {
      const x = connstr.normalize('localhost');
      expect(x).toEqual('http://localhost/default');
    });

    it('should work with array options', () => {
      const x = connstr.normalize('http://test?opt=1&opt=2');
      expect(x).toEqual('http://test/default?opt=1&opt=2');
    });
  });

  describe('stringify', () => {
    it('should stringify a connstr spec', () => {
      const x = connstr._stringify({
        scheme: 'https',
        hosts: [['1.1.1.1', 8094], ['2.2.2.2', 8099]],
        bucket: 'frank',
        options: {
          joe: 'bob',
          jane: 'drew'
        }
      });
      expect(x).toEqual('https://1.1.1.1:8094,2.2.2.2:8099/frank?joe=bob&jane=drew');
    });

    it('should stringify a connstr spec without a scheme', () => {
      const x = connstr._stringify({
        hosts: [['1.1.1.1', 8094]],
        bucket: 'frank',
        options: { x: 'y' }
      });
      expect(x).toEqual('1.1.1.1:8094/frank?x=y');
    });

    it('should stringify a connstr spec without a bucket', () => {
      const x = connstr._stringify({
        scheme: 'http',
        hosts: [['1.1.1.1', 8094]],
        options: { x: 'y' }
      });
      expect(x).toEqual('http://1.1.1.1:8094/?x=y');
    });

    it('should stringify a connstr spec without options', () => {
      const x = connstr._stringify({
        scheme: 'http',
        hosts: [['1.1.1.1', 8094]],
        bucket: 'joe'
      });
      expect(x).toEqual('http://1.1.1.1:8094/joe');
    });

    it('should stringify a connstr spec with ipv6 addresses', () => {
      const x = connstr._stringify({
        scheme: 'couchbase',
        hosts: [['[2001:4860:4860::8888]', 8094]],
        bucket: 'joe'
      });
      expect(x).toEqual('couchbase://[2001:4860:4860::8888]:8094/joe');
    });
  });

  describe('parse', () => {
    it('should generate a blank spec for a blank string', () => {
      const x = connstr.parse(null);
      expect(x).toEqual({ scheme: 'http', hosts: [], bucket: 'default', options: {} });
    });

    it('should parse a string with no host', () => {
      const x = connstr.parse('https:///shirley');
      expect(x).toEqual({ scheme: 'https', hosts: [], bucket: 'shirley', options: {} });
    });

    it('should parse a string with options', () => {
      const x = connstr.parse('http:///b?c=d&e=f');
      expect(x).toEqual({ scheme: 'http', hosts: [], bucket: 'b', options: { c: 'd', e: 'f' } });
    });

    it('should parse a string with ipv6', () => {
      const x = connstr.parse('couchbase://[2001:4860:4860::8888]:9011/b');
      expect(x).toEqual({ scheme: 'couchbase', hosts: [['[2001:4860:4860::8888]', 9011]], bucket: 'b', options: {} });
    });
  });
});
