const app = document.querySelector('.card');
const pin = document.getElementById('pin');
const btn = document.getElementById('go');
const msg = document.getElementById('msg');

const CORRECT_PIN = '1234';

btn.addEventListener('click', () => {
  if (pin.value === CORRECT_PIN) {
    msg.style.color = '#55efc4';
    msg.textContent = 'Доступ разрешён';
    setTimeout(() => {
      app.innerHTML = '<h1>Добро пожаловать!</h1><p>Приложение работает.</p>';
    }, 800);
  } else {
    msg.textContent = 'Неверный PIN';
    pin.value = '';
  }
});
