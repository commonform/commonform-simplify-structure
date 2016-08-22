/* Copyright 2016 Kyle E. Mitchell
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you
 * may not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var assert = require('assert')
var simplify = require('./')

// This form has two series of contiguous child forms in its root
// content array.
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

simplify(first)

// `simplify` splits the root content array into multiple children, with
// one series of contiguous child forms in each.
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

// This form has two series of contiguous child forms in a child form.
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

simplify(second)

// `simplify` splits the content array of the child form.
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
