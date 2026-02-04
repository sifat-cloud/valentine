document.addEventListener('DOMContentLoaded', ()=>{
  // Elements
  const card = document.querySelector('.card');
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const status = document.getElementById('statusMsg');
  const heart = document.getElementById('heart');
  const sadOverlay = document.getElementById('sadOverlay');
  const sadMsg = document.getElementById('sadMsg');
  const cheerBtn = document.getElementById('cheerBtn');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMsg = document.getElementById('modalMsg');
  const celebrateGif = document.getElementById('celebrateGif');
  const closeBtn = document.getElementById('closeBtn');
  const customizeBtn = document.getElementById('customizeBtn');
  const customizePane = document.getElementById('customize');
  const customClose = document.getElementById('customClose');
  const saveCustom = document.getElementById('saveCustom');
  const cancelCustom = document.getElementById('cancelCustom');
  const customMessageInput = document.getElementById('customMessage');
  const customGifInput = document.getElementById('customGif');
  const soundToggle = document.getElementById('soundToggle');

  // State
  const DEFAULT_GIF = 'https://media.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy.gif';
  let state = {
    noCount: Number(localStorage.getItem('valentine:noCount')||0),
    yesCount: Number(localStorage.getItem('valentine:yesCount')||0),
    sound: localStorage.getItem('valentine:sound')==='1'
  };

  const sadPhrases = [
    "Oh… that stung a little.",
    "I thought we had a moment…",
    "That's okay. I still care.",
    "I guess I tried. Still here."
  ];

  function save(){ localStorage.setItem('valentine:noCount', String(state.noCount)); localStorage.setItem('valentine:yesCount', String(state.yesCount)); localStorage.setItem('valentine:sound', state.sound?'1':'0'); }

  // Initialize UI
  function refreshUI(){
    // heart pulse subtle when hopeful
    if(state.noCount === 0) heart.classList.add('pulse'); else heart.classList.remove('pulse');
    // sad tone when any No pressed
    if(state.noCount > 0){ document.body.classList.add('sad'); status.textContent = "I'm a little sad. If you press Yes, I'll be okay."; }
    else { document.body.classList.remove('sad'); status.textContent = "Be honest — you can press No, but I might get a little sad."; }
    soundToggle.textContent = `Sound: ${state.sound? 'On':'Off'}`;
  }
  refreshUI();

  // Sound helpers (soft chime and gentle sigh)
  function playChime(){ if(!state.sound) return; try{ const ctx = new (window.AudioContext||window.webkitAudioContext)(); const o = ctx.createOscillator(), g = ctx.createGain(); o.type='sine'; o.frequency.value=720; g.gain.value=0.02; o.connect(g); g.connect(ctx.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.3); setTimeout(()=>{ o.stop(); ctx.close(); },380); }catch(e){} }
  function playSigh(){ if(!state.sound) return; try{ const ctx = new (window.AudioContext||window.webkitAudioContext)(); const o = ctx.createOscillator(), g = ctx.createGain(); o.type='sine'; o.frequency.value=220; g.gain.value=0.02; o.connect(g); g.connect(ctx.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.7); setTimeout(()=>{ o.stop(); ctx.close(); },800); }catch(e){} }

  // Sad behavior when No pressed
  function handleNo(){
    state.noCount++;
    save();
    refreshUI();

    // Show sad overlay with increasingly tender messages
    sadMsg.textContent = sadPhrases[Math.min(sadPhrases.length-1, state.noCount-1)];
    sadOverlay.classList.add('show'); sadOverlay.setAttribute('aria-hidden','false');

    // play a soft sigh and reduce heart opacity
    playSigh(); heart.style.opacity = String(Math.max(0.35, 1 - state.noCount*0.18));

    // slow down heart pulse based on sadness
    if(state.noCount >= 3){ heart.classList.remove('pulse'); card.classList.add('soft-slow'); }

    // change status microcopy
    status.textContent = 'It hurts a little. You can press Yes to make it better.';
  }

  noBtn.addEventListener('click', (e)=>{ e.preventDefault(); handleNo(); });

  // allow small 'cheer up' button on overlay
  cheerBtn.addEventListener('click', ()=>{ sadOverlay.classList.remove('show'); sadOverlay.setAttribute('aria-hidden','true'); status.textContent = 'Thanks. If you feel it, say Yes.'; });

  // Yes button: reset sadness and celebrate
  function handleYes(){
    state.yesCount++;
    state.noCount = 0;
    save();
    refreshUI();

    sadOverlay.classList.remove('show'); sadOverlay.setAttribute('aria-hidden','true');
    heart.style.opacity = '1';

    // celebration: gentle if they had said No before, big if immediate Yes
    const mode = (state.yesCount>0 && state.noCount===0 && state.yesCount===1) ? 'joyful' : 'gentle';
    if(mode==='gentle') launchConfetti('gentle'); else launchConfetti('joyful');

    // show modal with customize message
    modal.classList.add('show'); modal.setAttribute('aria-hidden','false');
    modalTitle.textContent = 'Yay! 💖';
    modalMsg.textContent = customMessageInput.value.trim() || 'You made me so happy.';
    celebrateGif.style.backgroundImage = `url('${customGifInput.value.trim() || DEFAULT_GIF}')`;

    playChime();
  }
  yesBtn.addEventListener('click', handleYes);
  closeBtn.addEventListener('click', ()=>{ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); });

  // Confetti: simple canvas burst
  function launchConfetti(mode='joyful'){
    if(mode==='gentle'){
      const canvas=document.createElement('canvas');canvas.id='confettiCanvas';canvas.width=innerWidth;canvas.height=innerHeight;document.body.appendChild(canvas);const ctx=canvas.getContext('2d');let particles=[];for(let i=0;i<36;i++){particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height/2,r:Math.random()*6+6,alpha:1,vx:(Math.random()-0.5)*0.8,vy:Math.random()*0.8+0.2,color:`rgba(255,77,109,0.85)`});}let t0=performance.now();function f(t){const dt=t-t0;t0=t;ctx.clearRect(0,0,canvas.width,canvas.height);for(const p of particles){p.x+=p.vx*(dt/16);p.y+=p.vy*(dt/16);p.alpha-=0.004;ctx.fillStyle=`rgba(255,77,109,${p.alpha})`;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}req=requestAnimationFrame(f);}let req=requestAnimationFrame(f);setTimeout(()=>{cancelAnimationFrame(req);canvas.remove();},2400);return;}
    // joyful
    const canvas=document.createElement('canvas');canvas.id='confettiCanvas';canvas.width=innerWidth;canvas.height=innerHeight;document.body.appendChild(canvas);const ctx=canvas.getContext('2d');let parts=[];const colors=['#ff4d6d','#ffd166','#9b5de5','#06d6a0','#f15bb5'];for(let i=0;i<120;i++){parts.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height/2,r:Math.random()*6+4,color:colors[Math.floor(Math.random()*colors.length)],vx:(Math.random()-0.5)*6,vy:Math.random()*6+2,rot:Math.random()*360,vr:(Math.random()-0.5)*10});}let t0=performance.now();function frame(t){const dt=t-t0;t0=t;ctx.clearRect(0,0,canvas.width,canvas.height);for(const p of parts){p.x+=p.vx*(dt/16);p.y+=p.vy*(dt/16);p.vy+=0.12;p.rot+=p.vr*(dt/16);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);ctx.fillStyle=p.color;ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*0.6);ctx.restore();}}let rid=requestAnimationFrame(frame);setTimeout(()=>{cancelAnimationFrame(rid);canvas.remove();},2600);
  }

  // Customize
  customizeBtn.addEventListener('click', ()=>{ customizePane.classList.add('show'); customizePane.setAttribute('aria-hidden','false'); });
  customClose.addEventListener('click', ()=>{ customizePane.classList.remove('show'); customizePane.setAttribute('aria-hidden','true'); });
  cancelCustom.addEventListener('click', (e)=>{ e.preventDefault(); customClose.click(); });
  saveCustom.addEventListener('click', ()=>{ localStorage.setItem('valentineMessage', customMessageInput.value.trim()); localStorage.setItem('valentineGif', customGifInput.value.trim()); customClose.click(); });
  customMessageInput.value = localStorage.getItem('valentineMessage') || 'You made me so happy.';
  customGifInput.value = localStorage.getItem('valentineGif') || DEFAULT_GIF;

  // Sound toggle
  soundToggle.addEventListener('click', ()=>{ state.sound = !state.sound; save(); refreshUI(); });

  // Small thoughtful timers: idle 'stay' message
  let idle=null; function resetIdle(){ if(idle) clearTimeout(idle); idle=setTimeout(()=>{ if(state.noCount===0){ const note=document.createElement('div');note.className='idle-note';note.textContent="I was hoping you'd stay."; card.appendChild(note); setTimeout(()=>note.remove(),4300); } },15000); }
  ['mousemove','keydown','click','touchstart'].forEach(ev=>document.addEventListener(ev, resetIdle, {passive:true})); resetIdle();

  // Save and refresh initially
  save(); refreshUI();

});