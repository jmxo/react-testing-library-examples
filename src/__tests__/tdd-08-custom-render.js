import React from 'react'
import {render, fireEvent, wait, waitForElement} from 'react-testing-library'
import {build, fake, sequence} from 'test-data-bot'
import {Redirect as MockRedirect} from 'react-router'
import {savePost as mockSavePost} from '../api'
import {Editor} from '../post-editor-07-error-state'

jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  }
})

jest.mock('../api', () => {
  return {
    savePost: jest.fn(() => Promise.resolve()),
  }
})

afterEach(() => {
  mockSavePost.mockClear()
  MockRedirect.mockClear()
})

const postBuilder = build('Post').fields({
  title: fake(f => f.lorem.words()),
  content: fake(f => f.lorem.paragraphs().replace(/\r/g, '')),
  tags: fake(f => [f.lorem.word(), f.lorem.word(), f.lorem.word()]),
})

const userBuilder = build('User').fields({
  id: sequence(s => `user-${s}`),
})

function renderEditor() {
  const fakeUser = userBuilder()
  const utils = render(<Editor user={fakeUser} />)
  const fakePost = postBuilder()

  utils.getByLabelText(/title/i).value = fakePost.title
  utils.getByLabelText(/content/i).value = fakePost.content
  utils.getByLabelText(/tags/i).value = fakePost.tags.join(', ')

  const submitButton = utils.getByText(/submit/i)
  return {
    ...utils,
    submitButton,
    fakeUser,
    fakePost,
  }
}

test('renders a form with title, content, tags, and a submit button', async () => {
  const {submitButton, fakeUser, fakePost} = renderEditor()

  const preDate = Date.now()

  fireEvent.click(submitButton)

  expect(submitButton).toBeDisabled()
  expect(mockSavePost).toHaveBeenCalledTimes(1)
  expect(mockSavePost).toHaveBeenCalledWith({
    ...fakePost,
    authorId: fakeUser.id,
    date: expect.any(String),
  })

  const postDate = Date.now()
  const date = new Date(mockSavePost.mock.calls[0][0].date).getTime()
  expect(date).toBeGreaterThanOrEqual(preDate)
  expect(date).toBeLessThanOrEqual(postDate)

  // wait for this assertion to pass. (max 4.5 seconds)
  await wait(() => expect(MockRedirect).toHaveBeenCalledTimes(1))
  expect(MockRedirect).toHaveBeenCalledWith({to: '/'}, {})
})

test('renders an error message from the server', async () => {
  const testError = 'test error'
  mockSavePost.mockRejectedValueOnce({data: {error: testError}})

  const {submitButton, getByTestId} = renderEditor()

  fireEvent.click(submitButton)

  const postError = await waitForElement(() => getByTestId('post-error'))
  expect(postError).toHaveTextContent(testError)
  expect(submitButton).not.toBeDisabled()
})
