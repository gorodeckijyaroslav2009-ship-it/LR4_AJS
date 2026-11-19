const https = require('https');
const BASE = 'https://jsonplaceholder.typicode.com';

// Обработка данных
function sortPostsByTitle(posts) {
  return posts.sort((a, b) => b.title.length - a.title.length);
}

function sortCommentsByName(comments) {
  return comments.sort((a, b) => a.name.localeCompare(b.name));
}

function pickUserFields(users) {
  return users.map(({ id, name, username, email, phone }) => ({ id, name, username, email, phone }));
}

function filterTodos(todos) {
  return todos.filter(todo => !todo.completed);
}

// a) Коллбэки
function getWithCallback(path, callback) {
  https.get(BASE + path, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => callback(null, JSON.parse(data)));
  }).on('error', err => callback(err));
}

function postsCallback() {
  getWithCallback('/posts', (err, posts) => {
    if (err) return console.error(err);
    console.log(sortPostsByTitle(posts));
  });
}

function commentsCallback() {
  getWithCallback('/comments', (err, comments) => {
    if (err) return console.error(err);
    console.log(sortCommentsByName(comments));
  });
}

// b) Промисы
function getWithPromise(path) {
  return fetch(BASE + path).then(res => res.json());
}

function usersPromise() {
  getWithPromise('/users')
    .then(pickUserFields)
    .then(console.log)
    .catch(console.error);
}

function todosPromise() {
  getWithPromise('/todos')
    .then(filterTodos)
    .then(console.log)
    .catch(console.error);
}

// c) async/await
async function getAsync(path) {
  const res = await fetch(BASE + path);
  return res.json();
}

async function postsAsync() {
  try {
    console.log(sortPostsByTitle(await getAsync('/posts')));
  } catch (err) {
    console.error(err);
  }
}

async function commentsAsync() {
  try {
    console.log(sortCommentsByName(await getAsync('/comments')));
  } catch (err) {
    console.error(err);
  }
}

async function usersAsync() {
  try {
    console.log(pickUserFields(await getAsync('/users')));
  } catch (err) {
    console.error(err);
  }
}

async function todosAsync() {
  try {
    console.log(filterTodos(await getAsync('/todos')));
  } catch (err) {
    console.error(err);
  }
}

postsCallback();
commentsCallback();
usersPromise();
todosPromise();
postsAsync();
commentsAsync();
usersAsync();
todosAsync();