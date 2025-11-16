(function () {
  var STORAGE_KEY = 'simple-consent-choice';
  var BANNER_ID = 'simple-consent-banner';
  var hasActivated = false;

  function readChoice() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      return null;
    }
  }

  function writeChoice(value) {
    try {
      if (value === null) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, value);
    } catch (err) {
      // Ignore storage errors – the banner will show again next visit.
    }
  }

  function activateAnalyticsScripts() {
    if (hasActivated) return;
    hasActivated = true;

    function startActivation() {
      var placeholders = document.querySelectorAll('script[type="text/plain"][data-category="analytics"]');
      Array.prototype.forEach.call(placeholders, function (placeholder) {
        var liveScript = document.createElement('script');

        Array.prototype.forEach.call(placeholder.attributes, function (attr) {
          if (attr.name === 'type' || attr.name === 'data-category') return;
          liveScript.setAttribute(attr.name, attr.value);
        });

        if (placeholder.src) {
          liveScript.src = placeholder.src;
        } else {
          liveScript.textContent = placeholder.textContent;
        }

        placeholder.parentNode.insertBefore(liveScript, placeholder.nextSibling);
        placeholder.parentNode.removeChild(placeholder);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startActivation);
    } else {
      startActivation();
    }
  }

  function hideBanner() {
    var existing = document.getElementById(BANNER_ID);
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
  }

  function handleChoice(accepted) {
    writeChoice(accepted ? 'yes' : 'no');
    hideBanner();
    if (accepted) activateAnalyticsScripts();
  }

  function buildButton(label, isPrimary) {
    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.padding = '8px 14px';
    button.style.borderRadius = '4px';
    button.style.fontSize = '14px';
    button.style.fontWeight = '600';
    button.style.background = isPrimary ? '#2563eb' : '#e2e8f0';
    button.style.color = isPrimary ? '#fff' : '#0f172a';
    button.style.marginLeft = '8px';
    return button;
  }

  function showBanner() {
    if (document.getElementById(BANNER_ID)) return;

    var container = document.createElement('div');
    container.id = BANNER_ID;
    container.setAttribute('role', 'dialog');
    container.setAttribute('aria-live', 'polite');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.right = '0';
    container.style.bottom = '0';
    container.style.zIndex = '2147483647';
    container.style.background = '#0f172a';
    container.style.color = '#f8fafc';
    container.style.padding = '16px';
    container.style.boxShadow = '0 -4px 16px rgba(0,0,0,0.2)';

    var message = document.createElement('span');
    message.textContent = 'We use a single optional cookie to enable analytics. Accept cookies?';
    message.style.fontSize = '14px';
    message.style.lineHeight = '1.4';

    var actions = document.createElement('div');
    actions.style.marginTop = '12px';

    var acceptBtn = buildButton('Accept', true);
    var rejectBtn = buildButton('Reject', false);

    acceptBtn.addEventListener('click', function () { handleChoice(true); });
    rejectBtn.addEventListener('click', function () { handleChoice(false); });

    actions.appendChild(acceptBtn);
    actions.appendChild(rejectBtn);

    container.appendChild(message);
    container.appendChild(actions);

    document.body.appendChild(container);
  }

  function init() {
    var choice = readChoice();

    if (choice === 'yes') {
      activateAnalyticsScripts();
      return;
    }

    if (choice === 'no') return;

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }

  function resetChoice() {
    writeChoice(null);
    hasActivated = false;
    hideBanner();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }

  window.SimpleConsent = {
    accept: function () { handleChoice(true); },
    reject: function () { handleChoice(false); },
    reset: resetChoice
  };

  init();
})();
