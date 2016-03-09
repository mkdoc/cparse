var expect = require('chai').expect
  , parse = require('../../index');

describe('cparse:', function() {

  it('should use shell language', function(done) {
    var source = 'test/fixtures/shell.sh'
      , stream = parse.load(source, {rules: require('../../shell')})
      , comments = [];

    stream.on('comment', function(comment) {
      comments.push(comment);
    })

    stream.on('finish', function() {
      expect(comments.length).to.eql(2);

      expect(comments[0].description).to.eql('File description');
      expect(comments[0].tags.length).to.eql(1);
      expect(comments[0].tags[0].id).to.eql('file');
      expect(comments[0].tags[0].name).to.eql('shell.sh');


      expect(comments[1].description).to.eql('Print an error message');
      expect(comments[1].tags.length).to.eql(2);
      expect(comments[1].tags[0].id).to.eql('function');
      expect(comments[1].tags[0].name).to.eql('error');

      expect(comments[1].tags[1].id).to.eql('param');
      expect(comments[1].tags[1].name).to.eql('1');
      expect(comments[1].tags[1].type).to.eql('String');
      done();
    })
  });

});