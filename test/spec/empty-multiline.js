var expect = require('chai').expect
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse empty multiline comment block', function(done) {
    var source = 'test/fixtures/empty-multiline.js'
      , stream = parse.file(source, {trim: true});

    stream.once('comment', function(comment) {
      expect(comment.source).to.be.a('string');
      expect(comment.description).to.be.a('string');
      expect(comment.line).to.be.a('number');
      expect(comment.pos).to.be.an('object');
      expect(comment.tags).to.eql([]);
      done();
    })
  });

});