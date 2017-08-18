const express = require('express')
const { h } = require('preact') /** @jsx h */
const Provider = require('preact-context-provider')

const createRenderer = require('../lib/preact-dom-renderer')
const createStore = require('../store')

const App = require('../views/app')

const router = express.Router()

router.get('*', (req, res) => {
  const renderer = createRenderer()
  const { store, dispatch } = createStore(update, onFetchEnd)

  const jsx = (
    <Provider store={store} dispatch={dispatch}>
      <App />
    </Provider>
  )

  dispatch('LOCATION_REPLACE', req.url)

  if (store.app.fetchCount === 0) done()

  function onFetchEnd () {
    if (store.app.fetchCount === 0) process.nextTick(done)
  }

  function update () {
    renderer.render(jsx)
  }

  function done () {
    const status = store.location.name === 'not-found' ? 404 : 200
    res.status(status)

    const content = renderer.html()
    res.render('index', { content, store, title: store.app.title })
  }
})

module.exports = router