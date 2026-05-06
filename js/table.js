function buildTable() {
  var tb = document.getElementById('tb');
  tb.innerHTML = '';
  curRooms.forEach(function(g) {
    var gr  = document.createElement('tr'); gr.className = 'grp';
    var gtd = document.createElement('td');
    gtd.colSpan   = 3 + curItems.length + 1;
    gtd.textContent = '▸ ' + g.group;
    gr.appendChild(gtd); tb.appendChild(gr);

    g.list.forEach(function(room) {
      if (!state[room]) {
        state[room] = {};
        curItems.forEach(function(it) { state[room][it] = false; });
      }
      var rid = room.replace(/ /g, '-');
      var tr  = document.createElement('tr');

      // 공간
      var td0 = document.createElement('td');
      var cfg = ZONE_CONFIG[cZone];
      td0.textContent = (cfg && cfg.displayName && cfg.displayName[room]) ? cfg.displayName[room] : room;
      tr.appendChild(td0);

      // 좌석
      var td1 = document.createElement('td');
      td1.textContent = curSeatMap[room] || '-';
      tr.appendChild(td1);

      // 전체
      var td2    = document.createElement('td');
      td2.style.borderRight = '2px solid var(--bd)';
      var allChk = document.createElement('div');
      allChk.className = 'chk'; allChk.textContent = '✓'; allChk.id = 'all-' + rid;
      (function(r, ri) { allChk.addEventListener('click', function() { tAll(r, ri, allChk); }); })(room, rid);
      td2.appendChild(allChk); tr.appendChild(td2);

      // 항목 체크박스
      curItems.forEach(function(it) {
        var tdi = document.createElement('td');
        var chk = document.createElement('div');
        chk.className = 'chk'; chk.textContent = '✓'; chk.id = 'chk-' + rid + '-' + it;
        (function(r, ri, i) { chk.addEventListener('click', function() { tOne(r, ri, i, chk); }); })(room, rid, it);
        tdi.appendChild(chk); tr.appendChild(tdi);
      });

      // 조치사항
      var tdn  = document.createElement('td');
      var wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;align-items:center;gap:3px;';
      var ni = document.createElement('input');
      ni.className = 'ni'; ni.id = 'note-' + rid;
      ni.placeholder = '비고'; ni.style.cssText = 'flex:1;min-width:0;';
      var lbl  = document.createElement('label');
      lbl.style.cssText = 'cursor:pointer;font-size:14px;flex-shrink:0;';
      lbl.textContent = '📷';
      var finp = document.createElement('input');
      finp.type = 'file'; finp.accept = 'image/*';
      finp.setAttribute('capture', 'environment');
      finp.style.display = 'none';
      (function(ri) { finp.addEventListener('change', function() { addPhoto(ri, finp); }); })(rid);
      lbl.appendChild(finp);
      wrap.appendChild(ni); wrap.appendChild(lbl);
      var phDiv = document.createElement('div');
      phDiv.id = 'ph-' + rid;
      phDiv.style.cssText = 'display:flex;flex-wrap:wrap;gap:2px;margin-top:2px;';
      tdn.appendChild(wrap); tdn.appendChild(phDiv); tr.appendChild(tdn);
      tb.appendChild(tr);
    });
  });
}

function tOne(room, rid, it, el) {
  state[room][it] = !state[room][it];
  el.classList.toggle('on', state[room][it]);
  var all = curItems.every(function(i) { return state[room][i]; });
  var ae  = document.getElementById('all-' + rid);
  if (ae) ae.classList.toggle('on', all);
}

function tAll(room, rid, el) {
  var allOn = curItems.every(function(it) { return state[room][it]; });
  curItems.forEach(function(it) {
    state[room][it] = !allOn;
    var c = document.getElementById('chk-' + rid + '-' + it);
    if (c) c.classList.toggle('on', !allOn);
  });
  el.classList.toggle('on', !allOn);
}

function addPhoto(rid, input) {
  if (!input.files[0]) return;
  if (photoStore[rid] && photoStore[rid].length >= 1) {
    alert('사진은 1장만 첨부할 수 있습니다.\n기존 사진을 삭제 후 다시 첨부해주세요.');
    input.value = '';
    return;
  }
  compressImg(input.files[0], 600, 0.7, function(src) {
    if (!photoStore[rid]) photoStore[rid] = [];
    var idx  = photoStore[rid].length;
    photoStore[rid].push(src);
    var wrap = document.getElementById('ph-' + rid);
    if (wrap) {
      var div = document.createElement('div');
      div.style.cssText = 'position:relative;width:36px;height:36px;';
      var im  = document.createElement('img');
      im.src  = src;
      im.style.cssText = 'width:36px;height:36px;object-fit:cover;border-radius:3px;border:1px solid #ddd;';
      var btn = document.createElement('button');
      btn.textContent = '×';
      btn.style.cssText = 'position:absolute;top:-3px;right:-3px;width:14px;height:14px;border-radius:50%;background:#ef4444;color:#fff;border:none;cursor:pointer;font-size:9px;line-height:1;padding:0;';
      (function(d, r, i) { btn.addEventListener('click', function() { rmPhoto(r, i, d); }); })(div, rid, idx);
      div.appendChild(im); div.appendChild(btn); wrap.appendChild(div);
    }
  });
  input.value = '';
}

function rmPhoto(rid, idx, el) {
  if (photoStore[rid]) photoStore[rid].splice(idx, 1);
  el.remove();
}
