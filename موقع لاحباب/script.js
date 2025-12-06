// script.js — generate decorative bubbles and handle reveal button
document.addEventListener('DOMContentLoaded', function () {
  // Reveal button behaviour
  const btn = document.getElementById('reveal');
  const surprise = document.getElementById('surprise');
  const song = document.getElementById('song');
  if (btn && surprise) {
    btn.addEventListener('click', function () {
      const isHidden = surprise.classList.contains('hidden');
      // show the surprise and play song when opening
      surprise.classList.toggle('hidden');
      if (isHidden) {
        surprise.scrollIntoView({behavior: 'smooth', block: 'center'});
        if (song) {
          try { song.currentTime = 0; } catch (e) {}
          if (song.play) try { song.play(); } catch (e) { /* autoplay may be blocked */ }
        }
      }
    });
  }

  // after-song button behavior: pause and hide surprise
  const afterBtn = document.getElementById('afterSongBtn');
  if (afterBtn) {
    afterBtn.addEventListener('click', function () {
      if (song && song.pause) try { song.pause(); } catch (e) {}
      surprise.classList.add('hidden');
      if (btn) btn.focus();
    });
  }

  // Bubbles generator
  const container = document.querySelector('.bubbles');
  if (!container) {
    console.log('Bubbles container not found');
    return;
  }
  console.log('Bubbles container found, generating bubbles...');

  // Respect user preferences and network conditions
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const saveData = connection && connection.saveData;
  const isMobile = window.innerWidth <= 600;

  // Reduce or disable decorative bubbles for reduced-motion, save-data, or small screens
  let count;
  if (prefersReducedMotion || saveData) count = 0;
  else if (isMobile) count = 10; // fewer on phones
  else count = 28; // desktop

  if (count === 0) { 
    container.style.display = 'none'; 
    console.log('Bubbles disabled due to user preferences');
    return; 
  }
  console.log('Creating ' + count + ' bubbles');

  for (let i = 0; i < count; i++) {
    const b = document.createElement('span');
    b.className = 'bubble';

    // random size class (increase chance for medium/large)
    const r = Math.random();
    if (r < 0.35) b.classList.add('size-sm');
    else if (r < 0.8) b.classList.add('size-md');
    else b.classList.add('size-lg');

    // random horizontal position
    const left = Math.floor(Math.random() * 100);
    b.style.left = left + '%';

    // random animation duration and delay
    const dur = 6 + Math.random() * 24; // seconds (wider range)
    const delay = Math.random() * -16; // negative so some are mid-animation
    b.style.animationDuration = dur + 's';
    b.style.animationDelay = delay + 's';

    // rainbow color variance: create two nearby hues in a soft radial gradient
    const alpha = 0.26 + Math.random() * 0.34; // ~0.26 - 0.6
    const hue = Math.floor(Math.random() * 360);
    const hue2 = (hue + 20 + Math.floor(Math.random() * 80)) % 360;
    b.style.background = `radial-gradient(circle at 30% 30%, hsla(${hue},90%,85%,${alpha}), hsla(${hue2},90%,65%,${alpha}))`;
    // lessen filters on mobile for performance
    b.style.filter = isMobile ? 'saturate(110%)' : 'saturate(125%) blur(0.2px)';

    container.appendChild(b);
  }
  console.log('Bubbles created successfully!');

});
