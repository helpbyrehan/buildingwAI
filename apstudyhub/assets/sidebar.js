(function () {
  'use strict';

  function initSidebar() {
    if (document.getElementById('studySidebar')) return;
    const header = document.querySelector('.topbar .nav');
    if (!header) return;

    const root = window.APSH_BASE || '../';
    const mobile = window.matchMedia('(max-width: 900px)');
    const storageKey = 'apsh-sidebar-collapsed';
    let collapsed = false;
    let drawerOpen = false;
    let previousFocus = null;
    try { collapsed = localStorage.getItem(storageKey) === 'true'; } catch (_) {}

    const paths = {
      dashboard: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><path d="M14 17.5h7m-3.5-3.5v7"/>',
      graduation: '<path d="m2 9 10-5 10 5-10 5L2 9Zm4 2v6c4 3 8 3 12 0v-6m4-2v7"/>',
      book: '<path d="M12 5.5C9 3.5 5.5 3.5 3 4.5v15c2.5-1 6-1 9 1 3-2 6.5-2 9-1v-15c-2.5-1-6-1-9 1Zm0 0v15"/>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2"/>',
      practice: '<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>',
      sparkle: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7 0v4m-2-2h4"/>',
      calculator: '<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M8 6h8M8 11h1m6 0h1m-8 4h1m6 0h1m-8 4h1m6 0h1"/>',
      bookmark: '<path d="M6 3h12v19l-6-4-6 4V3Z"/>',
      users: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2m1-16a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v2"/>',
      class: '<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8m-4-5v5M7 8h10M7 12h5"/>',
      search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
      plus: '<path d="M12 4v16M4 12h16"/>',
      settings: '<path d="m9 3 1-1h4l1 3 3 1 3 1v4l-2 2v3l-2 2h-3l-2 3H9l-1-3-3-1-3-1v-4l2-2V7l2-2h3V3Z"/><circle cx="12" cy="12" r="3"/>',
      help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 8a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4m0 4h.01"/>',
      arrow: '<path d="m9 5 7 7-7 7"/>',
      menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
    };
    const icon = name => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[name] + '</svg>';
    const url = path => new URL(root + path, location.href).href;
    const groups = [
      [
        ['My Hub', 'dashboard/', 'dashboard'],
        ['Courses', 'courses/', 'book'],
        ['Study planner', 'planner/', 'calendar'],
        ['College applications', 'colleges/', 'graduation'],
        ['Practice', 'practice/', 'practice'],
        ['Study AI', 'assistant/', 'sparkle'],
        ['Score calculator', 'calculator/', 'calculator'],
        ['Saved resources', 'saved/', 'bookmark'],
        ['Community', 'community/', 'users'],
        ['Classes', 'classes/', 'class']
      ],
      [
        ['Search library', 'browse/', 'search'],
        ['Add resource', 'add/', 'plus'],
        ['Settings', 'settings/', 'settings'],
        ['Help & policies', 'policies/', 'help']
      ]
    ];
    const normalized = path => path.replace(/\/index\.html$/, '/').replace(/\/$/, '');
    const current = normalized(location.pathname);
    const parentPages = { course: 'courses/', resource: 'browse/', about: 'policies/', admin: 'dashboard/' };
    const parent = parentPages[current.split('/').pop()];
    const selectedPage = parent ? normalized(new URL(url(parent)).pathname) : current;
    const navGroup = (items, label) => '<div class="study-sidebar-group" aria-label="' + label + '">' + items.map(([label, target, glyph]) => {
      const href = url(target);
      const active = normalized(new URL(href).pathname) === selectedPage;
      return '<a class="study-sidebar-link" href="' + href + '" aria-label="' + label + '" title="' + label + '"' + (active ? ' aria-current="page"' : '') + '>' + icon(glyph) + '<span class="study-sidebar-label">' + label + '</span></a>';
    }).join('') + '</div>';

    const sidebar = document.createElement('aside');
    sidebar.id = 'studySidebar';
    sidebar.className = 'study-sidebar';
    sidebar.setAttribute('aria-label', 'Site navigation');
    sidebar.innerHTML = '<div class="study-sidebar-brand-row"><a class="study-sidebar-brand" href="' + url('') + '" aria-label="AP Study Hub home"><img src="' + url('assets/logo.svg?v=20261015mark') + '" alt=""><span class="study-sidebar-label">AP Study Hub</span></a><button class="study-sidebar-toggle" type="button" aria-controls="studySidebarNav" aria-label="Collapse sidebar">' + icon('arrow') + '</button></div>' +
      '<nav class="study-sidebar-nav" id="studySidebarNav" aria-label="Primary">' + navGroup(groups[0], 'Study workspace') + navGroup(groups[1], 'Library and account') + '</nav>' +
      '<a class="study-sidebar-account" href="' + url('profile/') + '" aria-label="Open profile"><span class="study-sidebar-avatar">' + icon('user') + '</span><span class="study-sidebar-account-copy study-sidebar-label"><small data-sidebar-greeting>Your workspace</small><strong data-sidebar-name>Your account</strong></span>' + icon('arrow') + '</a>';

    const backdrop = document.createElement('button');
    backdrop.type = 'button';
    backdrop.className = 'study-sidebar-backdrop';
    backdrop.tabIndex = -1;
    backdrop.setAttribute('aria-label', 'Dismiss navigation');
    const opener = document.createElement('button');
    opener.type = 'button';
    opener.className = 'study-sidebar-opener';
    opener.setAttribute('aria-label', 'Open study navigation');
    opener.setAttribute('aria-controls', 'studySidebar');
    opener.innerHTML = icon('menu');
    const caption = document.createElement('span');
    caption.className = 'study-sidebar-page-title';
    caption.textContent = document.querySelector('[data-home]') ? 'Home' : document.title.split('|')[0].trim();
    header.prepend(caption);
    header.prepend(opener);
    document.body.prepend(backdrop);
    document.body.prepend(sidebar);
    document.body.classList.add('has-study-sidebar');
    const toggle = sidebar.querySelector('.study-sidebar-toggle');
    const navigation = sidebar.querySelector('.study-sidebar-nav');
    if (current === normalized(new URL(url('')).pathname)) {
      sidebar.querySelector('.study-sidebar-brand').setAttribute('aria-current', 'page');
    }
    const background = [...document.querySelectorAll('.topbar, main, .footer, .skip')]
      .map(element => ({ element, wasInert: element.hasAttribute('inert') }));

    function update() {
      document.body.classList.toggle('is-sidebar-collapsed', collapsed);
      document.body.classList.toggle('is-sidebar-open', mobile.matches && drawerOpen);
      opener.setAttribute('aria-expanded', String(drawerOpen));
      toggle.setAttribute('aria-expanded', String(mobile.matches ? drawerOpen : !collapsed));
      toggle.setAttribute('aria-label', mobile.matches ? 'Close study navigation' : collapsed ? 'Expand sidebar' : 'Collapse sidebar');
      toggle.title = toggle.getAttribute('aria-label');
      sidebar.inert = mobile.matches && !drawerOpen;
      background.forEach(({ element, wasInert }) => {
        element.inert = wasInert || (mobile.matches && drawerOpen);
      });
      if (mobile.matches) {
        sidebar.setAttribute('aria-hidden', String(!drawerOpen));
        if (drawerOpen) {
          sidebar.setAttribute('role', 'dialog');
          sidebar.setAttribute('aria-modal', 'true');
        } else {
          sidebar.removeAttribute('role');
          sidebar.removeAttribute('aria-modal');
        }
      } else {
        sidebar.removeAttribute('aria-hidden');
        sidebar.removeAttribute('role');
        sidebar.removeAttribute('aria-modal');
      }
    }

    function closeDrawer(restoreFocus) {
      drawerOpen = false;
      update();
      if (restoreFocus && previousFocus && previousFocus.isConnected) previousFocus.focus();
    }
    function revealCurrentPage() {
      const active = navigation.querySelector('[aria-current=page]');
      if (!active) return;
      const top = active.offsetTop;
      const bottom = top + active.offsetHeight;
      if (top < navigation.scrollTop) navigation.scrollTop = top;
      else if (bottom > navigation.scrollTop + navigation.clientHeight) navigation.scrollTop = bottom - navigation.clientHeight + 10;
    }
    opener.addEventListener('click', () => {
      previousFocus = document.activeElement;
      drawerOpen = true;
      update();
      revealCurrentPage();
      toggle.focus();
    });
    toggle.addEventListener('click', () => {
      if (mobile.matches) return closeDrawer(true);
      collapsed = !collapsed;
      try { localStorage.setItem(storageKey, String(collapsed)); } catch (_) {}
      update();
    });
    backdrop.addEventListener('click', () => closeDrawer(true));
    sidebar.addEventListener('click', event => {
      if (mobile.matches && event.target.closest('a')) closeDrawer(false);
    });
    document.addEventListener('keydown', event => {
      if (!mobile.matches || !drawerOpen) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDrawer(true);
      } else if (event.key === 'Tab') {
        const focusable = [...sidebar.querySelectorAll('a[href], button:not(:disabled)')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    });
    mobile.addEventListener('change', () => { drawerOpen = false; update(); });
    update();
    revealCurrentPage();
    requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('sidebar-ready')));

    // Reuse the existing session lookup; the sidebar never starts another auth request.
    function updateAccount() {
      const promise = window.AP_STUDY_HUB_RUNTIME && window.AP_STUDY_HUB_RUNTIME.userPromise;
      if (!promise) return;
      Promise.resolve(promise).then(user => {
        const account = sidebar.querySelector('.study-sidebar-account');
        const name = sidebar.querySelector('[data-sidebar-name]');
        const greeting = sidebar.querySelector('[data-sidebar-greeting]');
        if (user) {
          const displayName = String(user.user_metadata && user.user_metadata.display_name || 'Your profile');
          name.textContent = displayName;
          greeting.textContent = 'Welcome back';
          account.title = 'Open profile';
        } else {
          account.href = url('login/') + '?next=' + encodeURIComponent(location.pathname + location.search);
          account.setAttribute('aria-label', 'Log in');
          name.textContent = 'Log in';
          greeting.textContent = 'Make it yours';
          account.title = 'Log in';
        }
        if (normalized(new URL(account.href).pathname) === current) account.setAttribute('aria-current', 'page');
      }).catch(() => {});
    }
    updateAccount();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSidebar);
  else initSidebar();
})();
