var DB_KEY = 'user_db';

// Безопасная загрузка базы
var db = null;
try {
  db = JSON.parse(localStorage.getItem(DB_KEY));
} catch (e) {
  db = null;
}
if (!db || !db.tables) {
  db = { tables: [], activeId: null };
}

function saveDb() {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getActive() {
  for (var i = 0; i < db.tables.length; i++) {
    if (db.tables[i].id === db.activeId) return db.tables[i];
  }
  return null;
}

// ---- Элементы ----
var tableChips = document.getElementById('table-chips');
var tablesHint = document.getElementById('tables-hint');
var newTableName = document.getElementById('new-table-name');
var createTableBtn = document.getElementById('create-table');

var activeCard = document.getElementById('active-card');
var activeTitle = document.getElementById('active-title');
var deleteTableBtn = document.getElementById('delete-table');
var tableBody = document.getElementById('table-body');
var rowNameInput = document.getElementById('row-name');
var rowStatusInput = document.getElementById('row-status');
var addRowBtn = document.getElementById('add-row');

// ---- Список таблиц ----
function renderChips() {
  tableChips.innerHTML = '';
  if (db.tables.length === 0) {
    tablesHint.style.display = 'block';
    return;
  }
  tablesHint.style.display = 'none';
  db.tables.forEach(function (t) {
    var chip = document.createElement('button');
    chip.className = 'chip' + (t.id === db.activeId ? ' active' : '');
    chip.textContent = t.name + ' (' + t.rows.length + ')';
    chip.addEventListener('click', function () {
      db.activeId = t.id;
      saveDb();
      renderAll();
    });
    tableChips.appendChild(chip);
  });
}

// ---- Активная таблица ----
function renderActive() {
  var t = getActive();
  if (!t) {
    activeCard.style.display = 'none';
    return;
  }
  activeCard.style.display = 'block';
  activeTitle.textContent = t.name;

  tableBody.innerHTML = '';
  if (t.rows.length === 0) {
    var empty = document.createElement('tr');
    var cell = document.createElement('td');
    cell.colSpan = 4;
    cell.style.color = '#a0a0b0';
    cell.style.textAlign = 'center';
    cell.textContent = 'Пока пусто — добавьте первую строку';
    empty.appendChild(cell);
    tableBody.appendChild(empty);
    return;
  }

  t.rows.forEach(function (row) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td style="color:#a0a0b0;">#' + row.id + '</td>' +
      '<td>' + row.name + '</td>' +
      '<td>' + row.status + '</td>' +
      '<td><button class="action-btn">Удалить</button></td>';
    tr.querySelector('.action-btn').addEventListener('click', function () {
      t.rows = t.rows.filter(function (r) { return r.id !== row.id; });
      saveDb();
      renderAll();
    });
    tableBody.appendChild(tr);
  });
}

function renderAll() {
  renderChips();
  renderActive();
}

// ---- Создание таблицы ----
createTableBtn.addEventListener('click', function () {
  var name = newTableName.value.trim();
  if (!name) {
    alert('Введите название таблицы!');
    return;
  }
  var newId = 1;
  db.tables.forEach(function (t) { if (t.id >= newId) newId = t.id + 1; });
  var table = { id: newId, name: name, rows: [], nextRowId: 1 };
  db.tables.push(table);
  db.activeId = table.id;
  newTableName.value = '';
  saveDb();
  renderAll();
});

// ---- Удаление таблицы ----
deleteTableBtn.addEventListener('click', function () {
  var t = getActive();
  if (!t) return;
  if (!confirm('Удалить таблицу "' + t.name + '" со всеми данными?')) return;
  db.tables = db.tables.filter(function (x) { return x.id !== t.id; });
  db.activeId = db.tables.length > 0 ? db.tables[0].id : null;
  saveDb();
  renderAll();
});

// ---- Добавление строки ----
addRowBtn.addEventListener('click', function () {
  var t = getActive();
  if (!t) return;
  var name = rowNameInput.value.trim();
  var status = rowStatusInput.value.trim();
  if (!name) {
    alert('Введите название!');
    return;
  }
  t.rows.push({ id: t.nextRowId, name: name, status: status || 'Новый' });
  t.nextRowId = t.nextRowId + 1;
  rowNameInput.value = '';
  rowStatusInput.value = '';
  saveDb();
  renderAll();
});

renderAll();
