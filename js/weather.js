var WEATHER_CODES = {
  0:'☀️ 맑음', 1:'🌤️ 대체로 맑음', 2:'⛅ 구름 조금', 3:'☁️ 흐림',
  45:'🌫️ 안개', 48:'🌫️ 안개',
  51:'🌦️ 이슬비', 53:'🌦️ 이슬비', 55:'🌦️ 이슬비',
  61:'🌧️ 비', 63:'🌧️ 비', 65:'🌧️ 폭우',
  71:'🌨️ 눈', 73:'🌨️ 눈', 75:'❄️ 폭설',
  80:'🌦️ 소나기', 81:'🌦️ 소나기', 82:'⛈️ 강한 소나기',
  95:'⛈️ 뇌우', 96:'⛈️ 뇌우', 99:'⛈️ 뇌우'
};

function fetchWeather() {
  var box     = document.getElementById('weather-box');
  var content = document.getElementById('weather-content');
  if (box && content) {
    content.innerHTML = '<div style="font-size:12px;color:rgba(255,255,255,.45);">⏳ 날씨 불러오는 중...</div>';
    box.style.display = 'block';
  }

  function loadWeatherByCoords(lat, lon, locName) {
    var url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=' + lat + '&longitude=' + lon
      + '&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,relativehumidity_2m'
      + '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum'
      + '&timezone=Asia%2FSeoul&forecast_days=1';

    fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var c    = data.current;
        var d    = data.daily;
        var box     = document.getElementById('weather-box');
        var content = document.getElementById('weather-content');
        if (!box || !content) return;

        var code = c.weathercode;
        var desc = WEATHER_CODES[code] || '🌡️ -';
        var maxT = d.temperature_2m_max[0];
        var minT = d.temperature_2m_min[0];
        var rain = d.precipitation_sum[0];

        content.innerHTML =
          '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">'
          + '<div style="font-size:28px;line-height:1;">' + desc.split(' ')[0] + '</div>'
          + '<div>'
          + '<div style="font-size:20px;font-weight:700;color:#fff;">' + Math.round(c.temperature_2m) + '°C'
          + '<span style="font-size:12px;font-weight:400;color:rgba(255,255,255,.6);margin-left:6px;">체감 ' + Math.round(c.apparent_temperature) + '°C</span></div>'
          + '<div style="font-size:12px;color:rgba(255,255,255,.75);margin-top:2px;">' + desc.split(' ').slice(1).join(' ') + '</div>'
          + '</div>'
          + '</div>'
          + '<div style="display:flex;gap:16px;margin-top:8px;flex-wrap:wrap;">'
          + '<span style="font-size:11px;color:rgba(255,255,255,.65);">🌡️ 최고 ' + maxT + '° / 최저 ' + minT + '°</span>'
          + '<span style="font-size:11px;color:rgba(255,255,255,.65);">💧 습도 ' + c.relativehumidity_2m + '%</span>'
          + '<span style="font-size:11px;color:rgba(255,255,255,.65);">🌬️ 바람 ' + c.windspeed_10m + 'km/h</span>'
          + (rain > 0 ? '<span style="font-size:11px;color:rgba(255,255,255,.65);">☔ 강수 ' + rain + 'mm</span>' : '')
          + '</div>'
          + '<div style="font-size:10px;color:rgba(255,255,255,.35);margin-top:6px;text-align:right;">📍 ' + locName + '</div>';
        box.style.display = 'block';
      })
      .catch(function() {
        var box     = document.getElementById('weather-box');
        var content = document.getElementById('weather-content');
        if (box && content) {
          content.innerHTML = '<div style="font-size:12px;color:rgba(255,255,255,.5);">⚠️ 날씨 정보를 불러올 수 없습니다.</div>';
          box.style.display = 'block';
        }
      });
  }

  function getLocName(lat, lon, cb) {
    fetch('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lon + '&format=json&accept-language=ko')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var addr = data.address || {};
        var name = addr.city_district || addr.suburb || addr.city || addr.county || addr.state || '현재위치';
        cb(name);
      })
      .catch(function() { cb('현재위치'); });
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        getLocName(lat, lon, function(name) {
          loadWeatherByCoords(lat, lon, name);
        });
      },
      function() {
        loadWeatherByCoords(37.3731, 126.6564, '송도 (기본)');
      },
      { timeout: 6000 }
    );
  } else {
    loadWeatherByCoords(37.3731, 126.6564, '송도 (기본)');
  }
}
