const form = document.getElementById('form');
const q = document.getElementById('q');
const alertBox = document.getElementById('alert');
const card = document.getElementById('card');
const place = document.getElementById('place');
const time = document.getElementById('time');
const desc = document.getElementById('desc');
const temp = document.getElementById('temp');
const feels = document.getElementById('feels');
const hum = document.getElementById('hum');
const wind = document.getElementById('wind');
const precip = document.getElementById('precip');
const icon = document.getElementById('icon');


function showAlert(msg){
alertBox.textContent = msg;
alertBox.hidden = !msg;
}


function setLoading(on){
form.querySelector('button').disabled = !!on;
form.querySelector('button').textContent = on ? 'Consultando…' : 'Consultar';
}


form.addEventListener('submit', async (e) => {
e.preventDefault();
const query = q.value.trim();
if (!query) return showAlert('Captura una localidad para consultar el clima.');
showAlert('');
setLoading(true);
card.hidden = true;
try {
const res = await fetch(`/api/weather?query=${encodeURIComponent(query)}`);
const data = await res.json();
if (!res.ok || !data.ok) throw new Error(data.error || 'Error consultando clima');


place.textContent = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
time.textContent = data.location.localtime;
desc.textContent = data.current.description;
temp.textContent = `${data.current.temperature}°C`;
feels.textContent = `Sensación ${data.current.feelslike}°C`;
hum.textContent = data.current.humidity;
wind.textContent = data.current.wind_speed;
precip.textContent = data.current.precip;
if (data.current.icon) { icon.src = data.current.icon; icon.hidden = false; } else { icon.hidden = true; }


card.hidden = false;
} catch (err) {
showAlert(err.message || 'Ocurrió un error');
} finally {
setLoading(false);
}
});