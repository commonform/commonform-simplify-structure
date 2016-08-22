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

module.exports = function simplify (form) {
  // Count series of contiguous child forms in the form's content.  If
  // there is more than one, create a replacement content array that
  // splits "paragraphs" of contiguous non-child elements and "series"
  // of contiguous child forms.
  var seriesSeen = 0

  // New content array.
  var newContent
  // The last new child form elements in `newContent`.
  var lastNewChild

  // Iterate content elements.
  var content = form.content
  var lastWasChild = false
  var lastChildIndex = null
  var length = content.length
  for (var index = 0; index < length; index++) {
    var element = content[index]

    if (isChild(element)) {
      if (!lastWasChild) {
        seriesSeen++
      }
      if (seriesSeen > 1) {
        // Just discovered that there is more than one series in this
        // form's content array.  Set `newContent` to an array.
        if (!lastWasChild && seriesSeen === 2) {
          // Thew new array's initial content is:
          //
          // 1.  A new child form object with content elements from the
          //     start through the last child form in the first series.
          //
          // 2.  Another new child form object with content from after
          //     the last series through the current (child) element.
          var lastInlineIndex = lastChildIndex + 1
          newContent = [
            {form: {content: content.slice(0, lastInlineIndex)}},
            {form: {content: content.slice(lastInlineIndex, index + 1)}}
          ]
          lastNewChild = newContent[1]
        } else {
          lastNewChild.form.content.push(element)
        }
      }
      lastWasChild = true
      lastChildIndex = index
      simplify(element.form)
    } else {
      if (newContent) {
        // If this is the start of a new "paragraph", push a new child
        // form object to the new content array to hold it.
        if (lastWasChild) {
          lastNewChild = {form: {content: [element]}}
          newContent.push(lastNewChild)
        } else {
          lastNewChild.form.content.push(element)
        }
      }
      lastWasChild = false
    }
  }
  // If we created a replacement content array, sub it it.
  if (newContent) {
    form.content = newContent
  }
}

function isChild (element) {
  return (
    typeof element === 'object' &&
    element.hasOwnProperty('form')
  )
}
