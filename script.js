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

  // staged "No" behavior — give the user several creative chances to say Yes
  let noAttempts = 0;

  function createHint(text){
    const existing = document.querySelector('.hint');
    if(existing) existing.remove();
    const hint = document.createElement('div');
    hint.className = 'hint';
    hint.textContent = text;
    container.appendChild(hint);
    // show then auto-remove
    requestAnimationFrame(()=> hint.classList.add('show'));
    setTimeout(()=> hint && hint.remove(), 1600);
  }

  function showReconsiderDialog(){
    if(document.getElementById('reconsider')) return;
    const dialog = document.createElement('div');
    dialog.id = 'reconsider';
    dialog.className = 'reconsider';
    dialog.innerHTML = `
      <p class="reconsider-text">Are you sure?<br><small>Hint: the answer's closer than you think.</small></p>
      <div class="reconsider-actions">
        <button class="btn yes" id="reconsiderYes">Yes</button>
        <button class="btn no small" id="reconsiderNo">No</button>
      </div>
    `;
    container.appendChild(dialog);

    const yes = document.getElementById('reconsiderYes');
    const noSmall = document.getElementById('reconsiderNo');

    yes.addEventListener('click', ()=>{ dialog.remove(); yesBtn.click(); });

    // small No dodges a couple of times then surrenders
    let dodge = 0;
    function dodgeNo(ev){
      ev.preventDefault();
      dodge++;
      if(dodge < 3){
        const rect = dialog.getBoundingClientRect();
        const btnRect = noSmall.getBoundingClientRect();
        const maxLeft = Math.max(8, rect.width - btnRect.width - 20);
        const maxTop = Math.max(8, rect.height - btnRect.height - 20);
        const left = Math.random() * maxLeft;
        const top = Math.random() * maxTop;
        noSmall.style.position = 'absolute';
        noSmall.style.left = left + 'px';
        noSmall.style.top = top + 'px';
        noSmall.animate([{transform:'translateY(-6px)'},{transform:'translateY(0)'}],{duration:160});
      } else {
        // surrender after several tries
        dialog.remove();
        yesBtn.click();
      }
    }
    ['mouseenter','click','touchstart','focus'].forEach(e => noSmall.addEventListener(e, dodgeNo));
    noSmall.addEventListener('keydown', (ev)=>{ if(ev.key==='Enter' || ev.key===' '){ ev.preventDefault(); dodgeNo(ev); } });

    // auto-remove after some time
    setTimeout(()=>{ if(document.getElementById('reconsider')) dialog.remove(); }, 12000);
  }

  function handleNoTroll(ev){
    ev.preventDefault();
    if(noBtn.dataset.trolling === '1') return;
    noAttempts = Math.min(999, noAttempts + 1);

    if(noAttempts === 1){
      // gentle nudge: invites them to try Yes without taking control
      noBtn.dataset.trolling = '1';
      noBtn.classList.add('troll');
      const yesRect = yesBtn.getBoundingClientRect();
      const noRect = noBtn.getBoundingClientRect();
      const dx = (yesRect.left + yesRect.width/2) - (noRect.left + noRect.width/2);
      const dy = (yesRect.top + yesRect.height/2) - (noRect.top + noRect.height/2);
      noBtn.style.transition = 'transform 520ms cubic-bezier(.2,.9,.2,1)';
      noBtn.style.transform = `translate(${dx*0.5}px, ${dy*0.12}px) rotate(-6deg) scale(.98)`;
      setTimeout(()=>{
        noBtn.style.transform = '';
        noBtn.classList.remove('troll');
        delete noBtn.dataset.trolling;
        createHint('Maybe try Yes? ❤️');
      }, 700);
    } else if(noAttempts === 2){
      // open reconsider dialog which gives prominent Yes and a dodging small No
      showReconsiderDialog();
    } else {
      // eventual surrender: joyful animation then trigger Yes
      noBtn.dataset.trolling = '1';
      noBtn.disabled = true;
      noBtn.textContent = 'Alright...';
      const yesRect = yesBtn.getBoundingClientRect();
      const noRect = noBtn.getBoundingClientRect();
      const dx = (yesRect.left + yesRect.width/2) - (noRect.left + noRect.width/2);
      const dy = (yesRect.top + yesRect.height/2) - (noRect.top + noRect.height/2);
      noBtn.style.transition = 'transform 520ms cubic-bezier(.2,.9,.2,1), opacity 240ms';
      noBtn.style.transform = `translate(${dx}px, ${dy}px) scale(.7)`;
      setTimeout(()=>{ noBtn.style.opacity = '0'; }, 480);
      setTimeout(()=>{
        noBtn.style.transform = '';
        noBtn.style.opacity = '';
        noBtn.textContent = 'No';
        noBtn.disabled = false;
        delete noBtn.dataset.trolling;
        yesBtn.click();
      }, 760);
    }
  }

  // bind the staged handler to interactions
  ['mouseenter','click','touchstart','focus'].forEach(e => noBtn.addEventListener(e, (ev)=>{ handleNoTroll(ev); }));
  noBtn.addEventListener('keydown', (ev)=>{ if(ev.key==='Enter' || ev.key===' ' || ev.key==='Spacebar'){ ev.preventDefault(); handleNoTroll(ev); } });

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