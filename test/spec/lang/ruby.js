var expect = require('chai').expect
  , parse = require('../../../index');

function assert(comments) {
  expect(comments.length).to.eql(3);

  expect(comments[0].description).to.eql('File description');
  expect(comments[0].tags.length).to.eql(1);
  expect(comments[0].tags[0].id).to.eql('file');
  expect(comments[0].tags[0].name).to.eql('spec.rb');


  expect(comments[1].description).to.eql('Print an error message');
  expect(comments[1].tags.length).to.eql(2);
  expect(comments[1].tags[0].id).to.eql('function');
  expect(comments[1].tags[0].name).to.eql('error');

  expect(comments[1].tags[1].id).to.eql('param');
  expect(comments[1].tags[1].name).to.eql('message');
  expect(comments[1].tags[1].type).to.eql('String');

  expect(comments[2].description).to.eql('Inline comment');
}

describe('mkparse:', function() {

  it('should use ruby language', function(done) {
    var source = 'test/fixtures/lang/spec.rb'
      , stream = parse.load(source, {rules: require('../../../lang/ruby')})
      , comments = [];

    stream.on('comment', function(comment) {
      comments.push(comment);
    })

    stream.on('finish', function() {
      assert(comments);
      done();
    })
  });

  it('should use ruby language w/ options', function(done) {
    var source = 'test/fixtures/lang/spec.rb'
      , stream = parse.load(
          source, {
            rules: require('../../../lang/ruby'),
            options: {single: {mark: /#+/, trail: /\s*#+.*$/}}})
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
