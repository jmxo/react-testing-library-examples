import 'jest-axe/extend-expect'
import React from 'react'
import {render} from 'react-testing-library'
import {axe} from 'jest-axe'

function Form() {
  return (
    <form>
      <label htmlFor="username">Username</label>
      <input id="username" placeholder="username" name="username" />
    </form>
  )
}

test('the form is accessible', async () => {
  /* 
  react-testing-library creates a container and adds it to document.body,
  Then jest-axe creates another container and also appends it to document.body here.
  So we end up with two rendered versions of <MyComponent /> in document.body which is why axe-core is throwing the duplicate ids error
  Workaround: Pass an element to the container option of react-testing-library's render() so that it doesn't add it to the document at all.
  */

  const div = document.createElement('div')
  const {container} = render(<Form />, {container: div})
  const results = await axe(container.innerHTML)
  expect(results).toHaveNoViolations()
})
