(()=>{
const st=document.createElement('style');
st.textContent=`
body.auth-locked{overflow:hidden}
body.auth-locked>main.app,body.auth-locked>.fab{visibility:hidden!important}
#authGate{position:fixed;inset:0;z-index:99999;background:#f4f6f8;display:flex;align-items:center;justify-content:center;padding:20px;font-family:system-ui,-apple-system,"Noto Sans JP",sans-serif}
#authGate .box{width:min(420px,100%);background:#fff;border:1px solid #d9dee7;border-radius:18px;padding:26px;box-shadow:0 14px 40px #1f293720}
#authGate h2{margin:0 0 6px;color:#172b4d;font-size:24px}#authGate p{margin:0 0 20px;color:#667085;font-size:13px}
#authGate input{display:block;width:100%;margin:10px 0;padding:12px;border:1px solid #cbd3df;border-radius:9px;font:inherit;box-sizing:border-box}
#authGate button{width:100%;margin-top:10px;padding:12px;border-radius:9px;border:1px solid #cbd3df;background:#fff;color:#243244;font-weight:800;cursor:pointer}
#authGate .primary{background:#1f3a5f;border-color:#1f3a5f;color:#fff}#authGate .msg{min-height:20px;margin-top:12px;color:#b42318;font-size:12px;text-align:center}
`;
document.head.appendChild(st);
document.body.classList.add('auth-locked');
const gate=document.createElement('div');gate.id='authGate';gate.innerHTML=`<div class="box"><h2>Beyond the Rainbow</h2><p>Kneuklid Romance LIVE PROJECT</p><input id="gateId" placeholder="ID" autocomplete="username"><input id="gatePass" type="password" placeholder="PASS" autocomplete="current-password"><button id="gateLogin" class="primary">ログイン</button><button id="gateGoogle">TAKUYA Googleログイン</button><div id="gateMsg" class="msg"></div></div>`;document.body.appendChild(gate);
function ready(){if(!window.firebase||!firebase.apps||!firebase.apps.length)return setTimeout(ready,100);const a=firebase.auth(),id=document.getElementById('gateId'),pw=document.getElementById('gatePass'),msg=document.getElementById('gateMsg');const member=()=>{const v=id.value.trim().toLowerCase();if(!v||!pw.value){msg.textContent='IDとPASSを入力してください';return}msg.textContent='';a.signInWithEmailAndPassword(v+'@kneuklid.local',pw.value).catch(()=>msg.textContent='IDまたはPASSが違います')};document.getElementById('gateLogin').onclick=member;pw.addEventListener('keydown',e=>{if(e.key==='Enter')member()});document.getElementById('gateGoogle').onclick=()=>a.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(()=>msg.textContent='Googleログインに失敗しました');a.onAuthStateChanged(u=>{if(u){gate.remove();document.body.classList.remove('auth-locked')}else{document.body.classList.add('auth-locked')}})}
window.addEventListener('firebase-sdk-ready',ready);
})();