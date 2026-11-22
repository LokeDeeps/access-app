// ---- Переключение вкладок ----
var tabs = document.querySelectorAll('.tab');
var panels = document.querySelectorAll('.panel');

tabs.forEach(function (btn) {
  btn.addEventListener('click', function () {
    tabs.forEach(function (b) { b.classList.remove('active'); });
    panels.forEach(function (p) { p.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ---- Логика входа (PIN) ----
var app = document.querySelector('#tab-main .card');
var pin = document.getElementById('pin');
var btn = document.getElementById('go');
var msg = document.getElementById('msg');
var CORRECT_PIN = '1234';

btn.addEventListener('click', function () {
  if (pin.value === CORRECT_PIN) {
    msg.style.color = '#55efc4';
    msg.textContent = 'Доступ разрешён';
    setTimeout(function () {
      app.innerHTML = '<h1>Добро пожаловать!</h1><p>Приложение работает.</p>';
    }, 800);
  } else {
    msg.textContent = 'Неверный PIN';
    pin.value = '';
  }
});

// ---- Логика заметок ----
var noteTextarea = document.getElementById('note-content');
var saveNoteBtn = document.getElementById('save-note');
var noteStatus = document.getElementById('note-status');

var savedNote = localStorage.getItem('user_note');
if (savedNote) {
  noteTextarea.value = savedNote;
}

saveNoteBtn.addEventListener('click', function () {
  localStorage.setItem('user_note', noteTextarea.value);
  noteStatus.textContent = 'Заметка сохранена!';
  noteStatus.style.color = '#55efc4';
  setTimeout(function () { noteStatus.textContent = ''; }, 3000);
});

// ---- Логика таблицы ----
var tableBody = document.getElementById('table-body');
var rowNameInput = document.getElementById('row-name');
var rowStatusInput = document.getElementById('row-status');
var addRowBtn = document.getElementById('add-row');

var tableData = JSON.parse(localStorage.getItem('user_table')) || [];
var nextId = tableData.length > 0 ? Math.max.apply(null, tableData.map(function (r) { return r.id; })) + 1 : 1;

function renderTable() {
  tableBody.innerHTML = '';
  tableData.forEach(function (row) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>#' + row.id + '</td>' +
      '<td>' + row.name + '</td>' +
      '<td>' + row.status + '</td>' +
      '<td><button data-id="' + row.id + '" style="background:#ff7675; border:none; color:white; padding:4px 8px; border-radius:4px; cursor:pointer;">Удалить</button></td>';
    tr.querySelector('button').addEventListener('click', function () {
      removeRow(row.id);
    });
    tableBody.appendChild(tr);
  });
  localStorage.setItem('user_table', JSON.stringify(tableData));
}

function removeRow(id) {
  tableData = tableData.filter(function (r) { return r.id !== id; });
  renderTable();
}

addRowBtn.addEventListener('click', function () {
  var name = rowNameInput.value.trim();
  var status = rowStatusInput.value.trim();
  if (!name) {
    alert('Введите название!');
    return;
  }
  tableData.push({ id: nextId++, name: name, status: status || 'Новый' });
  rowNameInput.value = '';
  rowStatusInput.value = '';
  renderTable();
});

renderTable();
