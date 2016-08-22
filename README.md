Common Forms are hierarchical in structure, like XML and JSON
documents more generally.  Unlike some other document formats, Common
Form allow arbitrary nesting of block elements (forms) within other
block elements.  For example:

> in the states:
>
> 1.  Virginia
> 2.  New York
>
> and the territories:
>
> 1.  Guam
> 2.  Puerto Rico

is represented:

```javascript
var first = {
  content: [
    'in the states:',
    {form: {content: ['Virgina']}},
    {form: {content: ['New York']}},
    'and the territories:',
    {form: {content: ['Guam']}},
    {form: {content: ['Puerto Rico']}}
  ]
}
```

`simplify` splits the root content array into multiple children,
with one series of contiguous child forms in each

```javascript
var simplify = require('commonform-simplify-structure')
var assert = require('assert')

simplify(first)

assert.deepEqual(first, {
  content: [
    {
      form: {
        content: [
          'in the states:',
          {form: {content: ['Virgina']}},
          {form: {content: ['New York']}}
        ]
      }
    },
    {
      form: {
        content: [
          'and the territories:',
          {form: {content: ['Guam']}},
          {form: {content: ['Puerto Rico']}}
        ]
      }
    }
  ]
})
```

A form with multiple series of contiguous child forms in a child form

```javascript
var second = {
  content: [
    {
      heading: 'Jurisdiction',
      form: {
        content: [
          'in the states:',
          {form: {content: ['Virgina']}},
          {form: {content: ['New York']}},
          'and the territories:',
          {form: {content: ['Guam']}},
          {form: {content: ['Puerto Rico']}}
        ]
      }
    }
  ]
}
```

gets changed in the same way, preserving an child-form headings so
references remain correct

```javascript
simplify(second)

assert.deepEqual(second, {
  content: [
    {
      heading: 'Jurisdiction',
      form: {
        content: [
          {
            form: {
              content: [
                'in the states:',
                {form: {content: ['Virgina']}},
                {form: {content: ['New York']}}
              ]
            }
          },
          {
            form: {
              content: [
                'and the territories:',
                {form: {content: ['Guam']}},
                {form: {content: ['Puerto Rico']}}
              ]
            }
          }
        ]
      }
    }
  ]
})
```

Each new paragraph in a form ends up in a separate child form

```javascript
var third = {
  content: [
    {
      heading: 'Jurisdiction',
      form: {
        content: [
          // Paragraph
          'in the states:',
          // Series
          {form: {content: ['Virgina']}},
          {form: {content: ['New York']}},
          // Paragraph
          'and the territories:',
          // Series
          {form: {content: ['Guam']}},
          {form: {content: ['Puerto Rico']}},
          // Paragraph
          'and Washington, D.C.'
        ]
      }
    }
  ]
}

simplify(third)

assert.deepEqual(third, {
  content: [
    {
      heading: 'Jurisdiction',
      form: {
        content: [
          {
            form: {
              content: [
                'in the states:',
                {form: {content: ['Virgina']}},
                {form: {content: ['New York']}}
              ]
            }
          },
          {
            form: {
              content: [
                'and the territories:',
                {form: {content: ['Guam']}},
                {form: {content: ['Puerto Rico']}}
              ]
            }
          },
          {
            form: {
              content: [
                'and Washington, D.C.'
              ]
            }
          }
        ]
      }
    }
  ]
})
```

Definitions, uses, references, and blanks are preserved:

```javascript
var fourth = {
  content: [
    {
      heading: 'Jurisdiction',
      form: {
        content: [
          // Paragraph
          'in the ', {use: 'States'}, ':',
          // Series
          {form: {content: ['Virgina']}},
          {form: {content: ['New York']}},
          // Paragraph
          'and the ', {use: 'Territories'}, ':',
          // Series
          {form: {content: ['Guam']}},
          {form: {content: ['Puerto Rico']}},
          // Paragraph
          'and Washington, D.C.'
        ]
      }
    }
  ]
}

simplify(fourth)

assert.deepEqual(fourth, {
  content: [
    {
      heading: 'Jurisdiction',
      form: {
        content: [
          {
            form: {
              content: [
                'in the ', {use: 'States'}, ':',
                {form: {content: ['Virgina']}},
                {form: {content: ['New York']}}
              ]
            }
          },
          {
            form: {
              content: [
                'and the ', {use: 'Territories'}, ':',
                {form: {content: ['Guam']}},
                {form: {content: ['Puerto Rico']}}
              ]
            }
          },
          {
            form: {
              content: [
                'and Washington, D.C.'
              ]
            }
          }
        ]
      }
    }
  ]
})
```

See also [this blob post by the author][reproduction].

[reproduction]: https://writing.kemitchell.com/2015/08/21/Reproduction-of-Hierarchy.html
