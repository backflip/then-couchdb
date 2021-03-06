require('./helper');
var MemoryCache = couchdb.MemoryCache;

describe('get', function () {
  describe('when a document with the given key exists', function () {
    var doc;
    beforeEach(function () {
      return db.save({ name: 'a test' }).then(function (newDoc) {
        doc = newDoc;
        assert(doc);
      });
    });

    it('returns the document', function () {
      assert(doc._id);
      return db.get(doc._id).then(function (newDoc) {
        assert(newDoc);
        compareDocs(newDoc, doc);
      });
    });
  });

  describe('when a document with the given key does not exist', function () {
    it('returns null', function () {
      return db.get('does-not-exist').then(function (doc) {
        expect(doc).toBe(null);
      });
    });
  });

  describe('when using a cache', function () {
    var cache;
    beforeEach(function () {
      cache = new MemoryCache;
      return db.useCache(cache);
    });

    afterEach(function () {
      return db.stopCaching();
    });

    describe('when a document with the given key exists', function () {
      var doc;
      beforeEach(function () {
        // This call warms the cache.
        return db.save({ name: 'a test' }).then(function (newDoc) {
          doc = newDoc;
          assert(doc);
        });
      });

      it('returns the document', function () {
        return db.get(doc._id).then(function (newDoc) {
          assert(newDoc);
          compareDocs(newDoc, doc);
        });
      });

      it('hits the cache', function () {
        expect(cache.hits).toEqual(0);
        return db.get(doc._id).then(function (newDoc) {
          expect(cache.hits).toEqual(1);
        });
      });
    });

    describe('when a document with the given key does not exist', function () {
      it('returns null', function () {
        return db.get('does-not-exist').then(function (doc) {
          expect(doc).toBe(null);
        });
      });
    });
  }); // when using a cache

});
