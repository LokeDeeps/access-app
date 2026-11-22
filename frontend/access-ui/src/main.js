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
      '<td style="color:#aaa; font-weight:500;">#' + row.id + '</td>' +
      '<td>' + row.name + '</td>' +
      '<td>' + row.status + '</td>' +
      '<td><button class="action-btn" data-id="' + row.id + '">Удалить</button></td>';
    tr.querySelector('.action-btn').addEventListener('click', function () {
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
