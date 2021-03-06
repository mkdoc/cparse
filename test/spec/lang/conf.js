var expect = require('chai').expect
  , parse = require('../../../index');

function assert(comments) {
  expect(comments.length).to.eql(3);

  expect(comments[0].description).to.eql('File description');
  expect(comments[0].tags.length).to.eql(1);
  expect(comments[0].tags[0].id).to.eql('file');
  expect(comments[0].tags[0].name).to.eql('spec.conf');

  expect(comments[1].description).to.eql('Value of a property');
  expect(comments[1].tags.length).to.eql(1);
  expect(comments[1].tags[0].id).to.eql('property');
  expect(comments[1].tags[0].name).to.eql('prop');

  expect(comments[2].description).to.eql('Inline comment');
}

describe('mkparse:', function() {

  it('should use conf language', function(done) {
    var source = 'test/fixtures/lang/spec.conf'
      , stream = parse.load(source, {rules: require('../../../lang/conf')})
      , comments = [];

    stream.on('comment', function(comment) {
      comments.push(comment);
    })

    stream.on('finish', function() {
      assert(comments);
      done();
    })
  });

});
