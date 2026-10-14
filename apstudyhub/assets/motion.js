(function () {
  'use strict';
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'apsh-motion-paused';
  let userPaused = false;
  try { userPaused = localStorage.getItem(key) === 'true'; } catch (_) {}
  let toggle;
  function updatePreference() {
    const paused = userPaused || reduced.matches;
    root.dataset.motion = paused ? 'paused' : 'on';
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', reduced.matches ? 'Animations follow your reduced motion setting' : paused ? 'Resume animations' : 'Pause animations');
      toggle.title = toggle.getAttribute('aria-label');
      toggle.disabled = reduced.matches;
    }
  }
  updatePreference();
  reduced.addEventListener('change', updatePreference);
  function updateVisibility() { root.toggleAttribute('data-page-hidden', document.hidden); }
  document.addEventListener('visibilitychange', updateVisibility);
  updateVisibility();

  function initMotion() {
    const theme = document.getElementById('themeBtn');
    if (theme) {
      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'icon-btn motion-toggle';
      toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/><path class="motion-pause" d="m3 3 18 18"/></svg>';
      theme.before(toggle);
      toggle.addEventListener('click', () => {
        userPaused = !userPaused;
        try { localStorage.setItem(key, String(userPaused)); } catch (_) {}
        updatePreference();
      });
      updatePreference();
    }
    const skyObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-sky-visible', entry.isIntersecting));
    }) : null;
    const positions = [
      [7,12,12,8],[86,9,8,11],[96,47,15,10],[5,74,7,9],[81,84,10,12],[21,27,6,7],
      [93,70,5,9],[38,6,5,11],[12,91,5,8],[72,17,4,10]
    ];
    document.querySelectorAll('main[data-home] .hero,.page-head,.course-hero,.hub-intro,.calc-hero').forEach(host => {
      if (host.querySelector('.motion-sky')) return;
      const home = host.classList.contains('hero');
      const sky = document.createElement('div');
      sky.className = 'motion-sky';
      sky.setAttribute('aria-hidden', 'true');
      const stars = home ? positions : [[96,14,9,8],[87,84,6,11],[65,8,4,9]];
      stars.forEach(([x,y,size,duration], index) => {
        const star = document.createElement('span');
        star.className = 'sky-star';
        star.style.cssText = '--x:' + x + '%;--y:' + y + '%;--size:' + size + 'px;--duration:' + duration + 's;--delay:-' + (index * 1.7) + 's';
        sky.append(star);
      });
      if (home) {
        const trail = document.createElement('span');
        trail.className = 'sky-trail';
        sky.append(trail);
      }
      host.classList.add('has-motion-sky');
      host.prepend(sky);
      if (skyObserver) skyObserver.observe(sky);
      else sky.classList.add('is-sky-visible');
    });

    // Each component enters once, including cards loaded after the first render.
    // Nothing is hidden while waiting for network data or observer support.
    const selector = 'main .reveal,main .page-head,main .hub-intro,main .calc-hero,main .course-hero,main .section-head,main .course-card,main .resource-card,main .study-card,main .panel,main .question-card,main .metric,main .college-card';
    const enterObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-motion-visible');
        enterObserver.unobserve(entry.target);
      });
    }, {threshold: .06}) : null;
    function prepare(element) {
      if (element.classList.contains('motion-enter')) return;
      // Avoid animating both a container and its nested controls/cards.
      if (element.parentElement && element.parentElement.closest('.motion-enter')) return;
      element.classList.add('motion-enter');
      const siblings = element.parentElement ? [...element.parentElement.children] : [];
      element.style.setProperty('--enter-delay', (Math.max(0, siblings.indexOf(element)) % 4) * 55 + 'ms');
      if (enterObserver) enterObserver.observe(element);
    }
    document.querySelectorAll(selector).forEach(prepare);
    const main = document.querySelector('main');
    if (main && enterObserver) {
      new MutationObserver(records => {
        records.forEach(record => record.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          if (node.matches(selector)) prepare(node);
          node.querySelectorAll(selector).forEach(prepare);
        }));
      }).observe(main, {childList:true,subtree:true});
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMotion);
  else initMotion();
})();
