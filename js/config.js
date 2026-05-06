function fetchStock() {
  var content = document.getElementById('stock-content');
  var updated = document.getElementById('stock-updated');
  var preview = document.getElementById('adm-stock-preview');
  if (!content) return;

  content.innerHTML = '<div style="font-size:12px;color:rgba(255,255,255,.45);">⏳ 주가 불러오는 중...</div>';

  fetch('./data/stock.json?t=' + Date.now())
    .then(function(r) {
      if (!r.ok) throw new Error('fetch failed');
      return r.json();
    })
    .then(function(data) {
      var price     = data.price;
      var change    = data.change;
      var changePct = data.changePct;
      var high      = data.high;
      var low       = data.low;
      var vol       = data.volume;
      var updatedAt = data.updatedAt;
      var isLive    = data.marketState === 'REGULAR';

      if (!price) throw new Error('no data');

      var arrow = change >= 0 ? '▲' : '▼';
      var color = change >= 0 ? '#ff6b6b' : '#74b9ff';
      var sign  = change >= 0 ? '+' : '';
      var stateLabel = isLive
        ? '<span style="font-size:10px;color:#4ade80;margin-left:6px;">● 장중</span>'
        : '<span style="font-size:10px;color:rgba(255,255,255,.4);margin-left:6px;">장마감</span>';

      content.innerHTML =
        '<div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">'
        + '<span style="font-size:22px;font-weight:800;color:#fff;">'
        + price.toLocaleString()
        + '<span style="font-size:13px;font-weight:400;color:rgba(255,255,255,.6);"> 원</span></span>'
        + '<span style="font-size:14px;font-weight:700;color:' + color + ';">'
        + arrow + ' ' + sign + change.toLocaleString()
        + ' (' + sign + changePct + '%)</span>'
        + stateLabel
        + '</div>'
        + '<div style="display:flex;gap:14px;margin-top:6px;">'
        + '<span style="font-size:11px;color:rgba(255,255,255,.5);">고 <b style="color:#fff">' + high.toLocaleString() + '</b></span>'
        + '<span style="font-size:11px;color:rgba(255,255,255,.5);">저 <b style="color:#fff">' + low.toLocaleString() + '</b></span>'
        + '<span style="font-size:11px;color:rgba(255,255,255,.5);">거래량 <b style="color:#fff">' + Math.round(vol / 1000) + '천주</b></span>'
        + '</div>';

      if (updated) updated.textContent = updatedAt + (isLive ? ' 실시간' : ' 종가');
      if (preview) preview.textContent = '✅ ' + price.toLocaleString() + '원 (' + sign + changePct + '%)';
    })
    .catch(function() {
      content.innerHTML =
        '<div style="font-size:12px;color:rgba(255,255,255,.4);">⚠️ 주가를 불러올 수 없습니다.<br>'
        + '<span style="font-size:11px;">잠시 후 다시 시도해주세요.</span></div>';
      if (preview) preview.textContent = '⚠️ 불러오기 실패';
    });
}
