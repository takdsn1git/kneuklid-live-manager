(()=>{
const style=document.createElement('style');
style.textContent=`
.taskColumns{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;align-items:start}
.taskColumn{background:#fff;border:1px solid #d9dee7;border-radius:14px;overflow:hidden;min-height:230px;box-shadow:0 4px 14px #1f29370b}
.taskColumnHead{background:#1f3a5f;color:#fff;padding:12px 8px;text-align:center;font-weight:850;font-size:16px}
.taskCount{display:inline-block;margin-left:5px;background:#fff;color:#1f3a5f;border-radius:999px;padding:2px 7px;font-size:11px}
.taskItems{padding:8px}
.taskItem{display:block;width:100%;border:0;border-bottom:1px solid #e5e9f0;background:#fff;color:#172b4d;text-align:left;padding:11px 8px;font:inherit;font-size:13px;font-weight:750;line-height:1.45;cursor:pointer}
.taskItem:hover{background:#f3f7fb}.taskItem:last-child{border-bottom:0}.taskEmpty{padding:18px 8px;text-align:center;color:#98a2b3;font-size:12px}
.syncBtn,.readyBtn{border:1px solid transparent;border-radius:999px;padding:6px 11px;font-size:12px;font-weight:800;cursor:pointer}
.syncOn{background:#e5f7ed;border-color:#9fd0b0;color:#166534}.syncOff{background:#eef1f5;border-color:#c9d0da;color:#475467}
.readyOn{background:#e5f7ed;border-color:#9fd0b0;color:#166534}.readyOff{background:#fff0d5;border-color:#efc16d;color:#8a4f00}
.editMini{border:1px solid #cbd3df;background:#fff;color:#1f3a5f;border-radius:9px;padding:7px 10px;font-weight:700;cursor:pointer}
.decisionGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
@media(max-width:900px){.taskColumns{grid-template-columns:repeat(2,minmax(0,1fr))}.decisionGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:560px){.taskColumns,.decisionGrid{grid-template-columns:1fr}}
`;
document.head.appendChild(style);

function taskFilters(){
 const q=(document.getElementById('q')?.value||'').toLowerCase();
 const status=document.getElementById('sf')?.value||'';
 return tasks.filter(t=>(!q||((t.title||'')+' '+(t.desc||'')).toLowerCase().includes(q))&&(!status||t.status===status));
}
function renderTaskColumns(){
 const grid=document.getElementById('taskGrid'); if(!grid)return;
 const filtered=taskFilters();
 const owners=['TAKUYA','Kenichi','Yutaka','ばっさん','かえで'];
 grid.className='taskColumns';
 grid.innerHTML=owners.map(owner=>{
   const list=filtered.filter(t=>t.owner===owner);
   const label=owner==='Yutaka'?'YUTAKA':owner;
   return `<div class="taskColumn"><div class="taskColumnHead">${label}<span class="taskCount">${list.length}</span></div><div class="taskItems">${list.length?list.map(t=>`<button class="taskItem" onclick="taskModal('${t.id}')">${E(t.title)}</button>`).join(''):'<div class="taskEmpty">タスクなし</div>'}</div></div>`;
 }).join('');
}

function restoreDecisions(){
 const sec=document.getElementById('decisions'); if(!sec)return;
 sec.innerHTML=`<h2>決定・方向性</h2><div class="decisionGrid">
 <div class="card"><div class="cardTitle">ライブ</div><div class="cardBody"><b>タイトル：Beyond the Rainbow</b><div class="desc">解散を終着点にせず、前回の続きとして現在進行形の活動を示す。</div></div></div>
 <div class="card"><div class="cardTitle">楽曲</div><div class="cardBody">全アルバムからまんべんなく選曲する方向。</div></div>
 <div class="card"><div class="cardTitle">ドラム</div><div class="cardBody">かえでくん。</div></div>
 <div class="card"><div class="cardTitle">リハ</div><div class="cardBody">新宿／ライブ直近で月2回程度／13:00以降〜17:00。</div></div>
 <div class="card"><div class="cardTitle">グッズ</div><div class="cardBody">Tシャツ・タオルを受注生産。</div></div>
 <div class="card"><div class="cardTitle">告知</div><div class="cardBody">簡易HPは作らず、公式X＋公式LINE。</div></div>
 <div class="card"><div class="cardTitle">写真</div><div class="cardBody">新規撮影は行わない方向で検討。各自、自撮り写真をKenichiへ送る案などで検討。</div></div>
 <div class="card"><div class="cardTitle">VIP</div><div class="cardBody">公開リハ／アフターパーティー／最前列確保／VIPグッズ。実施可否・追加料金・売上受取条件をTAKUYAが確認。</div></div>
 </div>`;
}

window.toggleSongState=function(i,key){
 if(!songs[i])return;
 if(key==='sync')songs[i].sync=songs[i].sync==='あり'?'なし':'あり';
 if(key==='ready')songs[i].ready=songs[i].ready==='準備完了'?'未だ':'準備完了';
 save(); renderSongs();
};
window.editSongRow=function(i){
 const s=songs[i]; if(!s)return;
 M(`<h2>曲を編集</h2><div class="field"><label>曲名</label><input id="ect" value="${E(s.title)}"></div><div class="field"><label>出典</label><input id="ecs" value="${E(s.source)}"></div><div class="field"><label>メモ</label><input id="ecn" value="${E(s.note)}"></div><div class="actions"><button class="btn" onclick="closeM()">取消</button><button class="btn" onclick="saveSongEdit(${i})">保存</button></div>`);
};
window.saveSongEdit=function(i){songs[i].title=document.getElementById('ect').value;songs[i].source=document.getElementById('ecs').value;songs[i].note=document.getElementById('ecn').value;save();closeM();renderSongs();};

renderSongs=function(){
 const body=document.getElementById('songList'); if(!body)return;
 body.innerHTML=songs.length?songs.map((s,i)=>`<tr><td>${i+1}</td><td><b>${E(s.title)}</b></td><td>${E(s.source)}</td><td><button class="syncBtn ${s.sync==='あり'?'syncOn':'syncOff'}" onclick="toggleSongState(${i},'sync')">${s.sync==='あり'?'同期あり':'同期なし'}</button></td><td><button class="readyBtn ${s.ready==='準備完了'?'readyOn':'readyOff'}" onclick="toggleSongState(${i},'ready')">${s.ready==='準備完了'?'準備完了':'未だ'}</button></td><td>${E(s.note)}</td><td><button class="editMini" onclick="editSongRow(${i})">編集</button></td></tr>`).join(''):'<tr><td colspan="7">まだありません</td></tr>';
};
const table=document.querySelector('#setlist table thead tr');if(table&&!table.textContent.includes('編集'))table.insertAdjacentHTML('beforeend','<th></th>');

const baseRenderTasks=renderTasks;
renderTasks=function(){
 baseRenderTasks();
 renderTaskColumns();
};
const of=document.getElementById('of');if(of)of.style.display='none';
restoreDecisions();
renderTasks();
renderSongs();
})();