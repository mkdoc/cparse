A comment consists of a multi-line description and optional tag annotations:

```javascript
/**
 * Method description
 * that can span multiple lines.
 *
 * @name method
 */

// Method description
// that can span multiple lines.
//
// @name method
```

### Tags

The default tag parser uses the grammar:

```
@id {type[=value]} name description
```

All fields but the tag `id` are considered optional.

When given: `@property {String=mkdoc} [nickname] user` it expand to a tag object such as:

```javascript
{
  id: 'property',
  type: 'String',
  value: 'mkdoc',
  name: 'nickname',
  description: 'user',
  optional: true
}
```

See the [tag api docs](/API.md#tag) to change the tag parsing.

### Block

By default continuous single-line comments are gathered into a single `comment` object. The 
rule is that if the next line does not match whitespace followed by the start of a 
single-line comment then the block is terminated.

Note that inline comments also break the block:

```javascript
// 
// Comment description
// 
var foo; // Separate inline comment
```

Will result in two comments, whilst:

```javascript
// Comment description
// 
// More information.
```

Results in a single comment.