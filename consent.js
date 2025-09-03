<script>
/**
 * Cookie Consent + Pluggable Trackers (single-consent)
 * - Paste in <head>. Do NOT include GA/Plausible/Pixel elsewhere.
 * - Edit `config.tools` to add/remove trackers.
 * - Exposes window.CookieConsent.accept()/reject()/reset() if you need custom UI.
 */
(function () {
  var BRAND_PRIMARY = '#E65100';   // EmailFinder primary
  var BRAND_SECONDARY = '#FF9800'; // EmailFinder secondary
  var KEY = 'cookieConsent';
  var config = {
    policyUrl: '/cookie-policy.html',
    // ===== Add/remove tools here =====
    tools: [
      {
        name: 'google_analytics',
        load: function () {
          loadScript('https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX', { async: true })
            .then(function () {
              window.dataLayer = window.dataLayer || [];
              window.gtag = function () { dataLayer.push(arguments); };
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXX');
            });
        }
      },
      {
        name: 'plausible',
        load: function () {
          // Replace with your domain
          loadScript('https://plausible.io/js/plausible.js', { defer: true, 'data-domain': 'emailfinder.xyz' });
        }
      },
      {
        name: 'meta_pixel',
        load: function () {
          // Minimal Meta Pixel init; replace with your Pixel ID
          !function (f, b, e, v, n, t, s) {
            if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
            t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
          }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
          window.fbq('init', '000000000000000'); // <-- your Pixel ID
          window.fbq('track', 'PageView');
        }
      }
    ]
  };

  // ---------- Core ----------
  function loadScript(src, attrs) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      if (attrs) {
        Object.keys(attrs).forEach(function (k) {
          if (attrs[k] === true) s.setAttribute(k, '');
          else s.setAttribute(k, attrs[k]);
        });
      }
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function runTools() {
    (config.tools || []).forEach(function (t) {
      try { t.load && t.load(); } catch (e) { console && console.warn('Tracker failed:', t.name, e); }
    });
  }

  function stateAccepted() { return localStorage.getItem(KEY) === 'yes'; }
  function stateRejected() { return localStorage.getItem(KEY) === 'no'; }
  function save(choice) { localStorage.setItem(KEY, choice ? 'yes' : 'no'); }

  function removeBanner() {
    var el = document.getElementById('cookie-consent');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function showBanner() {
    if (document.getElementById('cookie-consent')) return;
    var bar = document.createElement('div');
    bar.id = 'cookie-consent';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-live', 'polite');
    bar.style.cssText = [
      'position:fixed','left:0','right:0','bottom:0','z-index:1080',
      'background:#111','color:#fff','box-shadow:0 -6px 20px rgba(0,0,0,.3)'
    ].join(';');

    bar.innerHTML = '' +
      '<div style="max-width:1140px;margin:0 auto;padding:12px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap">' +
        '<span style="font-size:14px;line-height:1.4;flex:1">We use cookies to improve your experience and analyze traffic.</span>' +
        '<a href="'+ (config.policyUrl || '#') +'" style="color:'+BRAND_SECONDARY+';text-decoration:underline;font-size:14px" target="_blank" rel="noopener">Learn more</a>' +
        '<button id="cc-reject" style="background:#333;color:#fff;border:0;border-radius:8px;padding:8px 12px;font-size:14px">Reject</button>' +
        '<button id="cc-accept" style="background:'+BRAND_PRIMARY+';color:#fff;border:0;border-radius:8px;padding:8px 12px;font-size:14px">Accept</button>' +
      '</div>';

    document.body.appendChild(bar);

    document.getElementById('cc-accept').addEventListener('click', function () {
      save(true); removeBanner(); runTools();
      window.dispatchEvent(new CustomEvent('cookie-consent:accepted'));
    });
    document.getElementById('cc-reject').addEventListener('click', function () {
      save(false); removeBanner();
      window.dispatchEvent(new CustomEvent('cookie-consent:rejected'));
    });
  }

  // Public API (optional)
  window.CookieConsent = {
    accept: function(){ save(true); removeBanner(); runTools(); },
    reject: function(){ save(false); removeBanner(); },
    reset: function(){ localStorage.removeItem(KEY); },
    config: config
  };

  // Boot
  if (stateAccepted()) {
    runTools();
  } else if (stateRejected()) {
    // do nothing
  } else {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showBanner);
    else showBanner();
  }
})();
</script>
