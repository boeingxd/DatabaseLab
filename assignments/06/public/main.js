// public/main.js
//
// Task 6: list and add. Task 7: delete.

const list = document.getElementById('list');
const form = document.getElementById('form');
const message = document.getElementById('message');
const count = document.getElementById('count');

function showMessage(text, isError) {
  message.textContent = text;
  message.className = isError ? 'error' : 'ok';
}

// Escape text before putting it into innerHTML
function esc(value) {
  const div = document.createElement('div');
  div.textContent = value ?? '';
  return div.innerHTML;
}

// Task 6: fetch every book and render one row per book
async function load() {
  const res = await fetch('/books');
  const books = await res.json();

  count.textContent = `(${books.length})`;
  list.innerHTML = books
    .map(
      (b) => `
      <li>
        <div class="info">
          <strong>${esc(b.title)}</strong>
          <span class="author">${esc(b.author)}</span>
        </div>
        <span class="price">฿${Number(b.price).toFixed(2)}</span>
        <span class="stock">stock ${b.stock}</span>
        <button class="delete" data-id="${b.id}">Delete</button>
      </li>`
    )
    .join('');
}

// Task 6: POST the form as JSON, then reload the list
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const body = {
    title: form.elements.title.value,
    author: form.elements.author.value,
    price: form.elements.price.value,
    stock: form.elements.stock.value,
  };

  const res = await fetch('/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  if (!res.ok) {
    showMessage(data.error, true);
    return;
  }

  showMessage(`Added "${body.title}" (id ${data.id})`, false);
  form.reset();
  load();
});

// Task 7: one listener on the list handles every Delete button
list.addEventListener('click', async (e) => {
  if (!e.target.matches('button.delete')) return;

  const id = e.target.dataset.id;
  const res = await fetch(`/books/${id}`, { method: 'DELETE' });

  if (!res.ok) {
    const data = await res.json();
    showMessage(data.error, true);
    return;
  }

  showMessage(`Deleted book id ${id}`, false);
  load();
});

load();
