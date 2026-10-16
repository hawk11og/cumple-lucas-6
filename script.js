const garage=document.getElementById('garage');
const startEngine=document.getElementById('startEngine');
const experience=document.getElementById('experience');
const missions=[...document.querySelectorAll('.mission')];
const hudBar=document.getElementById('hudBar');
const missionName=document.getElementById('missionName');
const musicBtn=document.getElementById('musicBtn');
const bgAudio=document.getElementById('bgAudio');
const finalAudio=document.getElementById('finalAudio');
const kachowAudio=document.getElementById('kachowAudio');
const fx=document.getElementById('fx');
let currentMission=0;
let audioCtx=null;

function synthRev(){
  try{
    audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
    const osc=audioCtx.createOscillator(); const gain=audioCtx.createGain();
    osc.type='sawtooth'; osc.frequency.setValueAtTime(70,audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(220,audioCtx.currentTime+.65);
    gain.gain.setValueAtTime(.0001,audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(.11,audioCtx.currentTime+.06); gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.8);
    osc.connect(gain).connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime+.85);
  }catch(e){}
}

startEngine.addEventListener('click',async()=>{
  synthRev();
  garage.classList.add('open');
  confetti(24); speedFX();
  try{bgAudio.volume=.58; bgAudio.loop=true; await bgAudio.play(); musicBtn.textContent='⏸️';}catch(e){musicBtn.textContent='▶️';}
  setTimeout(()=>{garage.style.display='none'; experience.classList.add('show'); experience.setAttribute('aria-hidden','false'); showMission(0);},900);
});

function showMission(index){
  if(index<0||index>=missions.length)return;
  missions.forEach((m,i)=>m.classList.toggle('active',i===index));
  currentMission=index;
  const label=missions[index].dataset.name||`Misión ${index+1}`;
  missionName.textContent=index<7?`Misión ${index+1} · ${label}`:'Meta · Ganador';
  hudBar.style.width=`${((index+1)/missions.length)*100}%`;
  window.scrollTo({top:0,behavior:'smooth'});
  speedFX();
}

document.querySelectorAll('.next-btn:not(#mission1Next):not(#mission2Next):not(#mission4Next)').forEach(btn=>btn.addEventListener('click',()=>showMission(currentMission+1)));
document.querySelectorAll('.prev-btn').forEach(btn=>btn.addEventListener('click',()=>showMission(currentMission-1)));

musicBtn.addEventListener('click',async()=>{
  if(bgAudio.paused){try{await bgAudio.play();musicBtn.textContent='⏸️';}catch(e){}}else{bgAudio.pause();musicBtn.textContent='▶️';}
});

// MISION 1: ACELERADOR
let speed=0;
const accelerateBtn=document.getElementById('accelerateBtn'); const speedFill=document.getElementById('speedFill'); const lucasDriver=document.getElementById('lucasDriver'); const mission1Next=document.getElementById('mission1Next'); const accelerateHint=document.getElementById('accelerateHint');
accelerateBtn.addEventListener('click',()=>{
  if(speed>=100)return;
  synthRev(); speed=Math.min(100,speed+20); speedFill.style.width=speed+'%';
  const left=4+(speed*.72); lucasDriver.style.left=Math.min(76,left)+'%'; lucasDriver.classList.add('boost'); setTimeout(()=>lucasDriver.classList.remove('boost'),180); speedFX();
  if(speed>=100){accelerateHint.textContent='🏁 ¡Lucas llegó a la salida! Misión desbloqueada.'; mission1Next.disabled=false; mission1Next.classList.remove('locked'); confetti(20);}
  else accelerateHint.textContent=`Velocidad: ${speed}% · ¡Sigue acelerando!`;
});
mission1Next.addEventListener('click',()=>showMission(1));

// MISION 2: PIT BOXES
const pitCards=[...document.querySelectorAll('.pit-card')]; let revealed=0; const pitMessage=document.getElementById('pitMessage'); const mission2Next=document.getElementById('mission2Next');
const values={age:'6 AÑOS',date:'23 OCT',time:'7:00 PM',place:'LAS COLINAS'};
pitCards.forEach(card=>card.addEventListener('click',()=>{
  if(card.classList.contains('revealed'))return;
  card.classList.add('revealed'); card.querySelector('b').textContent=values[card.dataset.reveal]; revealed++; confetti(5);
  pitMessage.textContent=revealed<4?`🔧 ${revealed}/4 datos desbloqueados.`:'✅ Pit stop completo. ¡Todo listo para continuar!';
  if(revealed===4){mission2Next.disabled=false; mission2Next.classList.remove('locked'); confetti(18);}
}));
mission2Next.addEventListener('click',()=>showMission(3));

// FOTO POPUP
const photoModal=document.getElementById('photoModal');
function openPhoto(){photoModal.classList.add('show');photoModal.setAttribute('aria-hidden','false');confetti(12);}
function closePhotoModal(){photoModal.classList.remove('show');photoModal.setAttribute('aria-hidden','true');}
document.querySelectorAll('.photo-pop-btn').forEach(b=>b.addEventListener('click',openPhoto));
document.getElementById('photoBackdrop').addEventListener('click',closePhotoModal); document.getElementById('closePhoto').addEventListener('click',closePhotoModal); document.getElementById('photoOk').addEventListener('click',closePhotoModal);

// SEMAFORO
let lightStep=0; const trafficLight=document.getElementById('trafficLight'); const lamps=[...trafficLight.querySelectorAll('.lamp')]; const trafficText=document.getElementById('trafficText'); const raceReveal=document.getElementById('raceReveal'); const mission4Next=document.getElementById('mission4Next');
trafficLight.addEventListener('click',()=>{
  if(lightStep>=2)return;
  lightStep++; lamps.forEach(l=>l.classList.remove('on'));
  lamps[lightStep].classList.add('on');
  if(lightStep===1){trafficText.textContent='🟡 PREPÁRATE';}
  if(lightStep===2){
    trafficText.textContent='🟢 ¡YA!';
    raceReveal.classList.remove('hidden');
    const greenTrack=raceReveal.querySelector('.green-race-track'); if(greenTrack) greenTrack.classList.add('running');
    mission4Next.disabled=false; mission4Next.classList.remove('locked'); speedFX(); confetti(16); synthRev();
    try{const oldVol=bgAudio.volume; bgAudio.volume=.18; kachowAudio.currentTime=0; kachowAudio.volume=1; kachowAudio.play(); kachowAudio.onended=()=>{bgAudio.volume=oldVol||.58};}catch(e){}
  }
});
mission4Next.addEventListener('click',()=>showMission(4));

// COUNTDOWN
function countdown(){
  const target=new Date('2026-10-23T19:00:00-05:00'); let diff=target-new Date();
  if(diff<0)diff=0; const days=Math.floor(diff/86400000); diff%=86400000; const hours=Math.floor(diff/3600000); diff%=3600000; const mins=Math.floor(diff/60000);
  document.getElementById('days').textContent=days; document.getElementById('hours').textContent=hours; document.getElementById('minutes').textContent=mins;
}
countdown(); setInterval(countdown,60000);

// CONFIRMACION
const confirmBtn=document.getElementById('confirmBtn');
confirmBtn.addEventListener('click',async()=>{
  confirmBtn.disabled=true; confirmBtn.textContent='🏁 ¡CONFIRMADO!'; bgAudio.pause(); musicBtn.textContent='🔇';
  showMission(7); confetti(60); speedFX();
  try{finalAudio.currentTime=0;await finalAudio.play();}catch(e){}
});

document.getElementById('restartBtn').addEventListener('click',async()=>{
  finalAudio.pause(); finalAudio.currentTime=0; confirmBtn.disabled=false; confirmBtn.textContent='✅ Confirmar asistencia'; showMission(0);
  try{await bgAudio.play();musicBtn.textContent='⏸️';}catch(e){}
});

// TECLADO Y SWIPE
let touchX=0,touchY=0;
document.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].screenX;touchY=e.changedTouches[0].screenY},{passive:true});
document.addEventListener('touchend',e=>{if(!experience.classList.contains('show'))return;const dx=e.changedTouches[0].screenX-touchX,dy=e.changedTouches[0].screenY-touchY;if(Math.abs(dx)<85||Math.abs(dx)<Math.abs(dy))return;if(dx>0&&currentMission>0)showMission(currentMission-1);},{passive:true});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePhotoModal();if(e.key==='ArrowLeft'&&currentMission>0)showMission(currentMission-1)});

function confetti(n=20){const icons=['🏁','⚡','⭐','🏎️','🎈','🎉'];for(let i=0;i<n;i++)setTimeout(()=>{const x=document.createElement('span');x.className='fx-item';x.textContent=icons[Math.floor(Math.random()*icons.length)];x.style.left=Math.random()*100+'vw';x.style.fontSize=14+Math.random()*20+'px';x.style.animationDuration=3.5+Math.random()*3+'s';fx.appendChild(x);setTimeout(()=>x.remove(),7000)},i*55)}
function speedFX(){for(let i=0;i<7;i++)setTimeout(()=>{const l=document.createElement('span');l.className='speed-line';l.style.top=10+Math.random()*78+'vh';l.style.width=70+Math.random()*170+'px';fx.appendChild(l);setTimeout(()=>l.remove(),1000)},i*55)}
