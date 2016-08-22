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
  var newContent
  var lastNewChild
  var seriesSeen = 0
  var content = form.content
  var length = content.length
  var lastWasChild = false
  var lastChildIndex = null
  for (var index = 0; index < length; index++) {
    var element = content[index]
    if (isChild(element)) {
      if (!lastWasChild) {
        seriesSeen++
      }
      if (seriesSeen > 1) {
        if (!lastWasChild && seriesSeen === 2) {
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
