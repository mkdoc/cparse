/**
 *  A language rule is an object containing the `open`, `close` and `strip` 
 *  functions.
 *
 *  The open and close functions are passed the current line and should 
 *  return the `exec` match for the pattern.
 *
 *  The strip function is passed an array of lines for the entire comment and 
 *  should remove comment meta characters from all lines.
 *
 *  @module rule
 */

/**
 *  Creates the default language rules for the C family of languages.
 *
 *  By default recognises continuous lines with `//` comments and terminated 
 *  multi-line comments starting with `/**`.
 *
 *  To include `/*` comments as well set the `greedy` option:
 *
 *  ```javascript
 *  {multi: {greedy: true}
 *  ```
 *
 *  @function defaults
 *  @param {Object} [opts] processing options.
 *
 *  @option {Object} multi multi-line rule configuration.
 *  @option {Object} single single-line rule configuration.
 *
 *  @returns list of language rules.
 */
function defaults(opts) {
  opts = opts || {};
  var set = []
    , useMulti = opts.multi !== undefined ? opts.multi : true
    , useSingle = opts.single !== undefined ? opts.single : true;

  if(useMulti) {
    set.push(multi(opts.multi));
  }

  if(useSingle) {
    set.push(single(opts.single)); 
  }

  return set;
}

/**
 *  Creates a multi-line rule, when no options are given creates the 
 *  default C family multi-line rule.
 *  
 *  @static {function} multi
 *  @param {Object} [opts] processing options.
 *
 *  @option {Boolean} greedy include `/*` comments.
 *  @option {RegExp} start comment start pattern.
 *  @option {RegExp} end comment end pattern.
 *  @option {RegExp} lead remove leading meta characters that match.
 *  @option {RegExp} trail remove trailing meta characters that match.
 *  @option {Function} open override default open function.
 *  @option {Function} close override default close function.
 *  @option {Function} strip override default strip function.
 *
 *  @returns {Object} multi-line language rule.
 */
function multi(opts) {

  // @todo {WARN} trail should be disabled for many multi-line styles

  opts = opts || {};
  var start = opts.greedy ? /\/\*+/ : /\/\*\*+/
    , end = opts.end instanceof RegExp ? opts.end : /\*+\//
    , lead = opts.lead !== undefined ? opts.lead : /^\s*\*([^\/]?)/
    , trail = opts.trail !== undefined ? opts.trail: /\s*\*+\s*$/;

  // override start pattern
  if(opts.start instanceof RegExp) {
    start = opts.start; 
  }

  function open(line) {
    return start.exec(line);
  }

  function close(line, match) {
    end.lastIndex = 0;
    var index;
    if(match) {
      index = match.index + match[0].length; 
    }
    end.lastIndex = index;
    return end.exec(line);
  }

  function strip(lines) {
    return lines.map(function(line) {

      // this catchs opening declarations: '/**'
      line = line.replace(start, '');

      // this catches the close tag: `*/`, should come before pattern below!
      line = line.replace(end, '');

      // and lines prefixed with ` *`
      if(lead) {
        line = line.replace(lead, '$1');
      }

      if(trail) {
        line = line.replace(trail, '');
      }

      return line;
    }) 
  }

  return {
    open: opts.open instanceof Function ? opts.open : open,
    close: opts.close instanceof Function ? opts.close : close,
    strip: opts.strip instanceof Function ? opts.strip : strip,
    multiline: true
  }
}

/**
 *  Creates a single-line rule, when no options are given creates the 
 *  default C family single-line rule.
 *  
 *  @static {function} single
 *  @param {Object} [opts] processing options.
 *
 *  @option {RegExp} mark sub pattern.
 *  @option {RegExp} start comment start pattern.
 *  @option {RegExp} end comment end pattern.
 *  @option {RegExp} lead remove leading meta characters that match.
 *  @option {RegExp} trail remove trailing meta characters that match.
 *  @option {Function} open override default open function.
 *  @option {Function} close override default close function.
 *  @option {Function} strip override default strip function.
 *
 *  @returns {Object} single-line language rule.
 */
function single(opts) {
  opts = opts || {};

  var mark = opts.mark instanceof RegExp ? opts.mark : /\/\//
    , start = opts.start instanceof RegExp
        ? opts.start : new RegExp(mark.source)
    , end = opts.end instanceof RegExp
        ? opts.end : new RegExp('^\\s*' + mark.source)
    , lead = opts.lead instanceof RegExp
        ? opts.strip : new RegExp('^\\s*' + mark.source)
    , trail = opts.trail instanceof RegExp
        ? opts.trail: new RegExp('\\s*' + mark.source + '\\s*$');

  function open(line) {
    return start.exec(line);
  }

  function close(line, match) {
    // testing on the same line
    if(match) {
      return null; 
    }
    return !end.exec(line);
  }

  function strip(lines) {
    return lines.map(function(line) {
      line = line.replace(lead, '');
      if(trail) {
        line = line.replace(trail, '');
      }
      return line;
    }) 
  }

  return {
    open: opts.open instanceof Function ? opts.open : open,
    close: opts.close instanceof Function ? opts.close : close,
    strip: opts.strip instanceof Function ? opts.strip : strip
  }
}

defaults.multi = multi;
defaults.single = single;

module.exports = defaults;
