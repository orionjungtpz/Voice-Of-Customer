// ── 전역 상태 ──
var step = 1, cBldg = '', cBldgIdx = 0, cZone = '', cIns = '';
var curItems = [], curItemNames = [], curSeatMap = {}, curRooms = [];
var state = {}, photoStore = {}, imgStore = {};
var adminFromStep = 1;

// ── 초기화 ──
window.onload = function() {
  var now = new Date().toLocaleString('ko-KR', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
  document.getElementById('td1').textContent = now;
  document.getElementById('td2').textContent = now;
  loadImgs();
  [0, 1, 2].forEach(function(i) {
    var saved = localStorage.getItem('voc_bldgname' + i);
    if (saved) {
      var nm = document.querySelector('#bg .sel-card:nth-child(' + (i + 1) + ') .sel-name');
      if (nm) nm.textContent = saved;
    }
  });
  applyBtnTexts();
  fetchStock();
  fetchWeather();
  showStep(1);
  setTimeout(function() {
    var s = document.getElementById('splash');
    s.classList.add('hide');
    setTimeout(function() { s.style.display = 'none'; }, 700);
  }, 2500);
};

// ── 스텝 제어 ──
function showStep(n) {
  step = n;
  [1, 2, 3, 4, 5, 6].forEach(function(i) {
    var el = document.getElementById('step' + i);
    if (el) el.style.display = (i === n) ? 'block' : 'none';
  });
  var bar = document.getElementById('bbar');
  var btn = document.getElementById('bbn');
  var bbk = document.getElementById('bbk');
  if (n >= 4) {
    bar.className = 'bbar show';
    btn.style.display = 'none';
    bbk.style.display = 'flex';
  } else if (n === 1) {
    bar.className = 'bbar';
    btn.style.display = 'none';
    bbk.style.display = 'none';
  } else {
    bar.className = 'bbar show';
    btn.style.display = 'flex';
    btn.disabled = (n === 2) ? !cZone : !cIns;
    bbk.style.display = 'flex';
  }
}

function goBack() {
  if (step >= 4) { showStep(adminFromStep); return; }
  if (step > 1) showStep(step - 1);
}

function handleNext() {
  if (step === 2) showStep(3);
  else if (step === 3) goPage2();
}

function goAdmin(fromStep) {
  var pw = prompt('관리자 비밀번호');
  if (pw !== ADMIN_PW) { if (pw !== null) alert('비밀번호 오류'); return; }
  adminFromStep = fromStep;
  if (fromStep === 1)      { buildAdmBldg(); showStep(4); }
  else if (fromStep === 2) { buildAdmZone(); showStep(5); }
  else if (fromStep === 3) { buildAdmIns();  showStep(6); }
}

// ── 건물 선택 ──
function selBldg(name, idx, el) {
  cBldg = name; cBldgIdx = idx; cZone = ''; cIns = '';
  document.querySelectorAll('#bg .sel-card').forEach(function(c) { c.classList.remove('selected'); });
  el.classList.add('selected');
  var zones = ORG[name].zones;
  var keys  = Object.keys(zones);
  var grid  = document.getElementById('zg');
  grid.className = 'sel-grid' + (keys.length >= 3 ? ' three' : '');
  grid.innerHTML = keys.map(function(z) {
    var src  = localStorage.getItem('img_zone_' + name + '_' + z);
    var img  = src ? ('<img src="' + src + '" style="width:100%;height:100%;object-fit:cover;">') : zones[z].icon;
    var displayName = localStorage.getItem('voc_zonename_' + name + '_' + z) || z;
    return '<div class="sel-card" onclick="selZone(\'' + z + '\',this)">'
      + '<div class="sel-icon">' + img + '</div>'
      + '<div class="sel-name">' + displayName + '</div></div>';
  }).join('');
  var displayBldgName = localStorage.getItem('voc_bldgname' + idx) || name;
  document.getElementById('s2b').textContent = displayBldgName;
  document.getElementById('adm-zone-title').textContent = displayBldgName + ' 구역명 편집';
  setTimeout(function() { showStep(2); }, 150);
}

// ── 구역 선택 ──
function selZone(name, el) {
  cZone = name; cIns = '';
  document.querySelectorAll('#zg .sel-card').forEach(function(c) { c.classList.remove('selected'); });
  el.classList.add('selected');
  var ins  = ORG[cBldg].zones[name].inspectors;
  var grid = document.getElementById('ig');
  grid.style.gridTemplateColumns = 'repeat(' + (ins.length >= 3 ? 3 : 2) + ', 1fr)';
  grid.innerHTML = ins.map(function(p) {
    var lsSrc    = localStorage.getItem('img_ins_' + cBldg + '_' + cZone + '_' + p);
    var photoSrc = 'photos/' + encodeURIComponent(p) + '.jpg';
    var initials = p.length >= 2 ? p.slice(-2) : p;
    var av;
    if (lsSrc) {
      av = '<img src="' + lsSrc + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
    } else {
      av = '<img src="' + photoSrc + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.hidden=true;">'
        + '<span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;">' + initials + '</span>';
    }
    return '<div class="ins-card" onclick="selIns(\'' + p + '\',this)">'
      + '<div class="ins-av" style="overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;">' + av + '</div>'
      + '<div class="ins-nm">' + p + '</div></div>';
  }).join('');
  document.getElementById('s3b').textContent = cBldg;
  document.getElementById('s3z').textContent = name;
  document.getElementById('bbn').disabled = true;
  document.getElementById('adm-ins-title').textContent = name + ' 점검자 프로필';
  setTimeout(function() { showStep(3); }, 150);
}

// ── 점검자 선택 ──
function selIns(name, el) {
  cIns = name;
  document.querySelectorAll('.ins-card').forEach(function(c) { c.classList.remove('selected'); });
  el.classList.add('selected');
  document.getElementById('bbn').disabled = false;
}

// ── page2 ──
function goPage2() {
  if (!cIns) return;
  var cfg = ZONE_CONFIG[cZone];
  var dt  = new Date().toLocaleString('ko-KR', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
  document.getElementById('p2b').textContent = '🏢 ' + cBldg;
  document.getElementById('p2z').textContent = '📍 ' + cZone;
  document.getElementById('p2i').textContent = '👤 ' + cIns;
  document.getElementById('p2d').textContent = '📅 ' + dt;
  document.getElementById('page1').style.display = 'none';
  document.getElementById('page2').style.display = 'flex';
  if (!cfg) {
    document.getElementById('twrap').style.display = 'none';
    document.getElementById('wip').style.display   = 'flex';
  } else {
    document.getElementById('twrap').style.display = '';
    document.getElementById('wip').style.display   = 'none';
    curItems     = cfg.items;
    curItemNames = cfg.itemNames;
    curSeatMap   = cfg.seatMap;
    curRooms     = cfg.rooms;
    state = {};
    Object.keys(photoStore).forEach(function(k) { delete photoStore[k]; });
    var thr = document.getElementById('thr');
    thr.innerHTML = '<th>공간</th><th>좌석</th>'
      + '<th style="border-right:2px solid rgba(255,255,255,.4);">전체</th>'
      + curItemNames.map(function(n) { return '<th>' + n + '</th>'; }).join('')
      + '<th>조치사항(첨부)</th>';
    buildTable();
  }
  window.scrollTo(0, 0);
}

function goPage1() {
  document.getElementById('page2').style.display = 'none';
  document.getElementById('page1').style.display = 'flex';
  showStep(3);
}

// ── 이메일 빌더 ──
function buildEmailHeader(dt, statusColor, statusText) {
  return '<div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;">'
    + '<div style="background:#003087;padding:20px 24px;border-radius:8px 8px 0 0;">'
    + '<h2 style="color:#fff;margin:0;font-size:18px;">📋 ' + cZone + ' 일일점검 결과</h2>'
    + '</div>'
    + '<div style="background:#f8faff;padding:20px 24px;border:1px solid #dde5f4;border-top:none;">'
    + '<table style="width:100%;border-collapse:collapse;margin-bottom:16px;">'
    + '<tr><td style="padding:6px 12px;font-weight:bold;color:#6b7280;width:80px;">건물</td>'
    + '<td style="padding:6px 12px;color:#1a2340;">' + cBldg + '</td></tr>'
    + '<tr style="background:#fff;"><td style="padding:6px 12px;font-weight:bold;color:#6b7280;">구역</td>'
    + '<td style="padding:6px 12px;color:#1a2340;">' + cZone + '</td></tr>'
    + '<tr><td style="padding:6px 12px;font-weight:bold;color:#6b7280;">점검자</td>'
    + '<td style="padding:6px 12px;color:#1a2340;">' + cIns + '</td></tr>'
    + '<tr style="background:#fff;"><td style="padding:6px 12px;font-weight:bold;color:#6b7280;">일시</td>'
    + '<td style="padding:6px 12px;color:#1a2340;">' + dt + '</td></tr>'
    + '<tr><td style="padding:6px 12px;font-weight:bold;color:#6b7280;">결과</td>'
    + '<td style="padding:6px 12px;font-weight:bold;color:' + statusColor + ';">' + statusText + '</td></tr>'
    + '</table>';
}

function buildEmailTable(details, KEYS, NAMES) {
  var headerCells = KEYS.map(function(k) {
    return '<th style="padding:8px;text-align:center;border:1px solid #dde5f4;">' + NAMES[k] + '</th>';
  }).join('');
  var rows = details.map(function(r, i) {
    var bg     = i % 2 === 0 ? '#fff' : '#f8faff';
    var rowBad = KEYS.some(function(k) { return r[k] === '미체크'; });
    if (rowBad) bg = '#fff5f5';
    var photoCell = r.photoUrls
      ? '<a href="__PHOTO_' + r.room + '__" style="color:#003087;font-size:12px;">📷 보기</a>'
      : '<span style="color:#d1d5db;font-size:12px;">-</span>';
    var itemCells = KEYS.map(function(k) {
      var ok = r[k] === '✓';
      return '<td style="padding:7px 8px;text-align:center;border:1px solid #dde5f4;color:'
        + (ok ? '#22c55e' : '#ef4444') + ';font-weight:bold;">' + (ok ? '✓' : '✗') + '</td>';
    }).join('');
    return '<tr style="background:' + bg + ';">'
      + '<td style="padding:7px 8px;border:1px solid #dde5f4;font-weight:' + (rowBad ? 'bold' : 'normal')
      + ';color:' + (rowBad ? '#ef4444' : '#1a2340') + ';">' + r.room + '</td>'
      + itemCells
      + '<td style="padding:7px 8px;border:1px solid #dde5f4;color:#6b7280;font-size:12px;">' + (r.note || '-') + '</td>'
      + '<td style="padding:7px 8px;text-align:center;border:1px solid #dde5f4;">' + photoCell + '</td>'
      + '</tr>';
  }).join('');
  return '<h3 style="color:#003087;font-size:14px;margin:20px 0 8px;">전체 점검 결과</h3>'
    + '<table style="width:100%;border-collapse:collapse;font-size:13px;">'
    + '<thead><tr style="background:#003087;color:#fff;">'
    + '<th style="padding:8px;text-align:left;border:1px solid #dde5f4;">공간</th>'
    + headerCells
    + '<th style="padding:8px;text-align:left;border:1px solid #dde5f4;">비고</th>'
    + '<th style="padding:8px;text-align:center;border:1px solid #dde5f4;">사진</th>'
    + '</tr></thead><tbody>' + rows + '</tbody></table>';
}

function buildEmailBadSummary(bad, KEYS, NAMES) {
  if (!bad.length) return '';
  return '<h3 style="color:#ef4444;font-size:14px;margin:20px 0 8px;">⚠️ 미체크 항목</h3>'
    + '<table style="width:100%;border-collapse:collapse;font-size:13px;">'
    + '<thead><tr style="background:#fef2f2;">'
    + '<th style="padding:8px;text-align:left;border:1px solid #fecaca;color:#ef4444;">공간</th>'
    + '<th style="padding:8px;text-align:left;border:1px solid #fecaca;color:#ef4444;">미체크 항목</th>'
    + '</tr></thead><tbody>'
    + bad.map(function(r) {
      return '<tr><td style="padding:7px 8px;border:1px solid #fecaca;font-weight:bold;">' + r.room + '</td>'
        + '<td style="padding:7px 8px;border:1px solid #fecaca;color:#ef4444;">'
        + KEYS.filter(function(k) { return r[k] === '미체크'; }).map(function(k) { return NAMES[k]; }).join(', ')
        + '</td></tr>';
    }).join('')
    + '</tbody></table>';
}

function buildEmailFooter() {
  return '</div>'
    + '<div style="background:#f0f4fb;padding:12px 24px;border
