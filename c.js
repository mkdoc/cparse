function multi() {
  return {
    start: function(line) {
      return /\/\*\*/.exec(line);
    },
    end: function(line) {
      return /\*\//.exec(line);
    },
    strip: function(lines) {
      return lines.map(function(line) {

        // this catchs opening declarations: '/**'
        line = line.replace(/\/\*\*/, '');

        // this catches the close tag: `*/`, should come before pattern below!
        line = line.replace(/\*+\//, '');

        // and lines prefixed with ` *`
        line = line.replace(/^\s*\*([^\/]?)/, '$1');

        return line;
      }) 
    },
    last: true
  }
}

function single() {
  return {
    start: function(line) {
      return /\/\//.exec(line);
    },
    end: function(line) {
      return !/\/\//.exec(line);
    },
    strip: function(lines) {
      return lines.map(function(line) {
        return line.replace(/^\s*\/\//, '');
      }) 
    },
    last: false
  }
}

/**
 *  Creates an array of language rules for the C family of languages.
 *  
 *  @function c
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
function c(opts) {
  opts = opts || {};
  var set = []
    , useMulti = typeof opts.multi === 'boolean' ? opts.multi : true
    , useSingle = typeof opts.single === 'boolean' ? opts.single : true;

  if(useMulti) {
    set.push(multi());
  }

  if(useSingle) {
    set.push(single()); 
  }

  return set;
}

module.exports = c;
