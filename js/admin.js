// ── 이미지 압축 공통 ──
function compressImg(file, maxW, quality, cb) {
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      var c = document.createElement('canvas');
      var w = img.width, h = img.height;
      if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      cb(c.toDataURL('image/webp', quality));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ── 이미지 로드 ──
function loadImgs() {
  [0, 1, 2].forEach(function(i) {
    var src = localStorage.getItem('voc_bldg' + i) || document.getElementById('bd' + i).src;
    if (src) applyBldgImg(i, src);
  });
  var bg = localStorage.getItem('voc_splash_bg');
  if (bg) document.getElementById('sbg').style.backgroundImage = 'url("' + bg + '")';
}

function applyBldgImg(i, src) {
  imgStore['bldg' + i] = src;
  var im = document.getElementById('bim' + i);
  var em = document.getElementById('bem' + i);
  if (im) { im.src = src; im.style.display = 'block'; }
  if (em) em.style.display = 'none';
}

// ── 버튼 텍스트 ──
function saveBtnText(which) {
  var el = document.getElementById('btn-' + which + '-text');
  if (!el) return;
  var val = el.value.trim();
  if (!val) { alert('텍스트를 입력해주세요.'); return; }
  try { localStorage.setItem('voc_btn_' + which, val); } catch(e) {}
  applyBtnTexts();
  alert('✅ 저장되었습니다.');
}

function resetBtnText(which) {
  try { localStorage.removeItem('voc_btn_' + which); } catch(e) {}
  var el = document.getElementById('btn-' + which + '-text');
  if (el) el.value = '';
  applyBtnTexts();
}

function applyBtnTexts() {
  var backText = localStorage.getItem('voc_btn_back') || '← 이전';
  var nextText = localStorage.getItem('voc_btn_next') || '점검 시작 →';
  var bbk = document.getElementById('bbk');
  var bbn = document.getElementById('bbn');
  if (bbk) bbk.textContent = backText;
  if (bbn) bbn.textContent = nextText;
  var bi = document.getElementById('btn-back-text');
  var ni = document.getElementById('btn-next-text');
  if (bi) bi.value = localStorage.getItem('voc_btn_back') || '';
  if (ni) ni.value = localStorage.getItem('voc_btn_next') || '';
}

function rebuildStep1() {
  var cards = document.querySelectorAll('#bg .sel-card');
  cards.forEach(function(card, i) {
    var nm = card.querySelector('.sel-name');
    if (nm) nm.textContent = localStorage.getItem('voc_bldgname' + i) || BLDG_NAMES[i];
  });
}

// ── 관리자: 건물 ──
function buildAdmBldg() {
  var textList = document.getElementById('adm-bldg-text');
  if (textList) {
    textList.innerHTML = BLDG_NAMES.map(function(n, i) {
      var saved = localStorage.getItem('voc_bldgname' + i) || n;
      return '<div class="adm-row" style="align-items:center;gap:6px;margin-bottom:8px;">'
        + '<input class="adm-input" style="margin:0;flex:1;" id="bldgname' + i + '" value="' + saved + '" placeholder="건물명">'
        + '<button class="adm-save-btn" onclick="saveBldgName(' + i + ')">저장</button>'
        + '</div>';
    }).join('');
  }
  var bi = document.getElementById('btn-back-text');
  var ni = document.getElementById('btn-next-text');
  if (bi) bi.value = localStorage.getItem('voc_btn_back') || '';
  if (ni) ni.value = localStorage.getItem('voc_btn_next') || '';

  var list = document.getElementById('adm-bldg');
  list.innerHTML = BLDG_NAMES.map(function(n, i) {
    var src = imgStore['bldg' + i] || '';
    var displayName = localStorage.getItem('voc_bldgname' + i) || n;
    var thumb = src ? ('<img src="' + src + '" style="width:100%;height:100%;object-fit:cover;">') : '🏢';
    return '<div class="adm-row">'
      + '<div class="adm-thumb" id="at' + i + '">' + thumb + '</div>'
      + '<div style="flex:1">'
      + '<div style="font-size:12px;font-weight:700;color:#fff;margin-bottom:6px;">' + displayName + '</div>'
      + '<label class="adm-btn">📷 변경<input type="file" accept="image/*" style="display:none" onchange="uploadBldg(' + i + ',this)"></label>'
      + '<button class="adm-reset" onclick="resetBldg(' + i + ')">초기화</button>'
      + '</div></div>';
  }).join('');

  var splashSrc = localStorage.getItem('voc_splash_bg') || SPLASH_DEFAULT;
  var st = document.getElementById('adm-splash-thumb');
  if (st) st.innerHTML = splashSrc
    ? '<img src="' + splashSrc + '" style="width:100%;height:100%;object-fit:cover;">'
    : '🌆';
}

function saveBldgName(i) {
  var val = document.getElementById('bldgname' + i).value.trim();
  if (!val) { alert('건물명을 입력해주세요.'); return; }
  try { localStorage.setItem('voc_bldgname' + i, val); } catch(e) {}
  buildAdmBldg();
  rebuildStep1();
  alert('✅ 저장되었습니다.');
}

function uploadBldg(i, input) {
  if (!input.files[0]) return;
  compressImg(input.files[0], 800, 0.85, function(src) {
    try { localStorage.setItem('voc_bldg' + i, src); } catch(e) {}
    applyBldgImg(i, src);
    buildAdmBldg();
  });
}

function resetBldg(i) {
  try { localStorage.removeItem('voc_bldg' + i); } catch(e) {}
  applyBldgImg(i, document.getElementById('bd' + i).src);
  buildAdmBldg();
}

function uploadSplash(input) {
  if (!input.files[0]) return;
  compressImg(input.files[0], 1080, 0.8, function(src) {
    try { localStorage.setItem('voc_splash_bg', src); } catch(e) {}
    document.getElementById('sbg').style.backgroundImage = 'url("' + src + '")';
    buildAdmBldg();
  });
}

function resetSplash() {
  try { localStorage.removeItem('voc_splash_bg'); } catch(e) {}
  document.getElementById('sbg').style.backgroundImage = 'url("' + SPLASH_DEFAULT + '")';
  buildAdmBldg();
}

// ── 관리자: 구역 ──
function buildAdmZone() {
  if (!cBldg) { alert('먼저 건물을 선택해주세요'); return; }
  var zones    = ORG[cBldg].zones;
  var zoneKeys = Object.keys(zones);

  var textList = document.getElementById('adm-zone-text');
  if (textList) {
    textList.innerHTML = zoneKeys.map(function(z, idx) {
      var saved = localStorage.getItem('voc_zonename_' + cBldg + '_' + z) || z;
      return '<div class="adm-row" style="align-items:center;gap:6px;margin-bottom:8px;">'
        + '<input class="adm-input" style="margin:0;flex:1;" id="zonename' + idx + '" value="' + saved + '" placeholder="구역명" data-orig="' + z + '">'
        + '<button class="adm-save-btn" onclick="saveZoneName(' + idx + ')">저장</button>'
        + '</div>';
    }).join('');
  }

  var list = document.getElementById('adm-zone');
  list.innerHTML = '';
  zoneKeys.forEach(function(z) {
    var src         = localStorage.getItem('img_zone_' + cBldg + '_' + z) || '';
    var displayName = localStorage.getItem('voc_zonename_' + cBldg + '_' + z) || z;
    var row   = document.createElement('div'); row.className = 'adm-row';
    var thumb = document.createElement('div'); thumb.className = 'adm-thumb';
    thumb.innerHTML = src
      ? '<img src="' + src + '" style="width:100%;height:100%;object-fit:cover;">'
      : (zones[z].icon || '🏢');
    var info = document.createElement('div'); info.style.flex = '1';
    var nm   = document.createElement('div');
    nm.style.cssText = 'font-size:12px;font-weight:700;color:#fff;margin-bottom:6px;';
    nm.textContent = displayName;
    var lbl  = document.createElement('label'); lbl.className = 'adm-btn'; lbl.textContent = '📷 변경';
    var inp  = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.style.display = 'none';
    (function(zone) { inp.addEventListener('change', function() { uploadZone(zone, inp); }); })(z);
    lbl.appendChild(inp);
    var rst = document.createElement('button'); rst.className = 'adm-reset'; rst.textContent = '초기화';
    (function(zone) { rst.addEventListener('click', function() { resetZone(zone); }); })(z);
    info.appendChild(nm); info.appendChild(lbl); info.appendChild(rst);
    row.appendChild(thumb); row.appendChild(info);
    list.appendChild(row);
  });
}

function saveZoneName(idx) {
  if (!cBldg) return;
  var el   = document.getElementById('zonename' + idx);
  if (!el) return;
  var orig = el.dataset.orig;
  var val  = el.value.trim();
  if (!val) { alert('구역명을 입력해주세요.'); return; }
  try { localStorage.setItem('voc_zonename_' + cBldg + '_' + orig, val); } catch(e) {}
  buildAdmZone();
  document.querySelectorAll('#zg .sel-card .sel-name').forEach(function(nm) {
    if (nm.textContent === orig) nm.textContent = val;
  });
  alert('✅ 저장되었습니다.');
}

function uploadZone(zone, input) {
  if (!input.files[0]) return;
  compressImg(input.files[0], 600, 0.85, function(src) {
    try { localStorage.setItem('img_zone_' + cBldg + '_' + zone, src); } catch(e) {}
    buildAdmZone();
  });
}

function resetZone(zone) {
  try { localStorage.removeItem('img_zone_' + cBldg + '_'
