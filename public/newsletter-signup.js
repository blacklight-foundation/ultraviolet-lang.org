(function () {
  function getFieldValue(form, name) {
    var field = form.elements.namedItem(name);

    if (!field || typeof field.value !== 'string') {
      return '';
    }

    return field.value.trim();
  }

  function setStatus(form, message, state) {
    var status = form.querySelector('[data-newsletter-status]');

    if (!status) {
      return;
    }

    status.textContent = message;
    status.classList.remove('is-success', 'is-error', 'is-pending');

    if (state) {
      status.classList.add('is-' + state);
    }
  }

  function setSubmitting(form, isSubmitting) {
    var button = form.querySelector('button[type="submit"]');

    if (button) {
      button.disabled = isSubmitting;
    }
  }

  document.addEventListener('submit', async function (event) {
    var form = event.target;

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    if (!form.matches('[data-newsletter-form]')) {
      return;
    }

    event.preventDefault();

    var email = getFieldValue(form, 'email');
    var source = getFieldValue(form, 'source') || 'unknown';
    var company = getFieldValue(form, 'company');

    if (!email) {
      setStatus(form, 'Enter a valid email address.', 'error');
      return;
    }

    setSubmitting(form, true);
    setStatus(form, 'Submitting...', 'pending');

    try {
      var response = await fetch(form.action, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: source,
          company: company,
          referrer: window.location.href,
        }),
      });
      var result = await response.json().catch(function () {
        return {
          ok: false,
          message: 'Newsletter signup is unavailable right now.',
        };
      });

      if (response.ok && result.ok) {
        form.reset();
        setStatus(
          form,
          result.message || 'Check your email to confirm your subscription.',
          'success',
        );
        return;
      }

      setStatus(
        form,
        result.message || 'Newsletter signup is unavailable right now.',
        'error',
      );
    } catch {
      setStatus(form, 'Newsletter signup is unavailable right now.', 'error');
    } finally {
      setSubmitting(form, false);
    }
  });
})();
