document.addEventListener('DOMContentLoaded', ()=>{
  const container = document.querySelector('.card');
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('closeBtn');
  const share = document.getElementById('share');

  // customize elements
  const customizeBtn = document.getElementById('customizeBtn');
  const customizePane = document.getElementById('customize');
  const customClose = document.getElementById('customClose');
  const saveCustom = document.getElementById('saveCustom');
  const cancelCustom = document.getElementById('cancelCustom');
  const customMessageInput = document.getElementById('customMessage');
  const customGifInput = document.getElementById('customGif');
  const modalMsg = document.getElementById('modalMsg');
  const modalGif = document.getElementById('modalGif');

  const DEFAULT_MSG = "I'm so happy you said yes. Happy Valentine's Day!";
  const DEFAULT_GIF = 'https://media.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy.gif';

  function loadCustom(){
    const msg = localStorage.getItem('valentineMessage') || DEFAULT_MSG;
    const gif = localStorage.getItem('valentineGif') || DEFAULT_GIF;
    modalMsg.textContent = msg;
    modalGif.src = gif;
    customMessageInput.value = msg;
    customGifInput.value = gif;
  }

  loadCustom();

  // move "No" button whenever user tries to interact
  function moveNoButton(){
    const contRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const maxLeft = Math.max(0, contRect.width - btnRect.width - 8);
    const maxTop = Math.max(0, contRect.height - btnRect.height - 8);
    const left = Math.random() * maxLeft;
    const top = Math.random() * maxTop;
    noBtn.style.position = 'absolute';
    noBtn.style.left = left + 'px';
    noBtn.style.top = top + 'px';
    // tiny shake to make it playful
    noBtn.animate([{transform:'translateY(-6px)'},{transform:'translateY(0)'}],{duration:220,easing:'ease-out'});
  }

  // events to try and click the "no" button
  ['mouseenter','click','touchstart','focus'].forEach(e => noBtn.addEventListener(e, (ev)=>{ ev.preventDefault(); moveNoButton(); }));

  // Also keep it moving if user uses keyboard navigation
  noBtn.addEventListener('keydown', (ev)=>{ ev.preventDefault(); moveNoButton(); });

  // simple confetti
  function launchConfetti(){
    const canvas = document.createElement('canvas');
    canvas.id = 'confettiCanvas';
    canvas.style.position = 'fixed';
    canvas.style.left = 0; canvas.style.top = 0; canvas.style.width = '100%'; canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const particles = [];
    const colors = ['#ff4d6d','#ffd166','#9b5de5','#06d6a0','#f15bb5'];
    for(let i=0;i<120;i++){
      particles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height - canvas.height/2,
        r: Math.random()*6+4,
        color: colors[Math.floor(Math.random()*colors.length)],
        vx: (Math.random()-0.5)*6,
        vy: Math.random()*6+2,
        rot: Math.random()*360,
        vr: (Math.random()-0.5)*10
      });
    }

    let t0 = performance.now();
    function frame(t){
      const dt = t - t0; t0 = t;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(const p of particles){
        p.x += p.vx * (dt/16);
        p.y += p.vy * (dt/16);
        p.vy += 0.12; // gravity
        p.rot += p.vr * (dt/16);
        ctx.save();
        ctx.translate(p.x,p.y);
        ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
        ctx.restore();
      }
    
      requestId = requestAnimationFrame(frame);
    }
    let requestId = requestAnimationFrame(frame);
    // remove after 2.6s
    setTimeout(()=>{
      cancelAnimationFrame(requestId);
      canvas.remove();
    },2600);
  }

  // Yes button: show modal with gif and message, and launch confetti
  yesBtn.addEventListener('click', ()=>{
    launchConfetti();
    // a tiny delay so confetti starts
    setTimeout(()=>{
      modal.classList.add('show');
      modal.setAttribute('aria-hidden','false');
    },120);
  });

  closeBtn.addEventListener('click', ()=>{
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
  });

  // share link (copies the current custom message to clipboard)
  share.addEventListener('click', (e)=>{
    e.preventDefault();
    const text = modalMsg.textContent + ' 💖';
    if(navigator.clipboard){
      navigator.clipboard.writeText(text).then(()=>{
        share.textContent = 'Copied!';
        setTimeout(()=> share.textContent = 'Share the love', 1800);
      });
    }
  });

  // customize panel
  customizeBtn.addEventListener('click', ()=>{
    customizePane.classList.add('show');
    customizePane.setAttribute('aria-hidden','false');
  });
  customClose.addEventListener('click', ()=>{
    customizePane.classList.remove('show');
    customizePane.setAttribute('aria-hidden','true');
  });
  cancelCustom.addEventListener('click', (e)=>{ e.preventDefault(); customClose.click(); });

  saveCustom.addEventListener('click', (e)=>{
    const msg = customMessageInput.value.trim() || DEFAULT_MSG;
    const gif = customGifInput.value.trim() || DEFAULT_GIF;
    localStorage.setItem('valentineMessage', msg);
    localStorage.setItem('valentineGif', gif);
    loadCustom();
    customClose.click();
  });

  // keep inputs accessible: pressing Enter saves
  [customMessageInput, customGifInput].forEach(inp => inp.addEventListener('keydown', (ev)=>{ if(ev.key==='Enter'){ ev.preventDefault(); saveCustom.click(); } }));

});