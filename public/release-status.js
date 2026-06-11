(() => {
  if (window.__uvReleaseStatusBound) return;
  window.__uvReleaseStatusBound = true;

  const endpoint = '/api/release-status';

  const setText = (selector, value, root = document) => {
    root.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  };

  const setReleaseLinks = (status) => {
    document.querySelectorAll('[data-release-link]').forEach((link) => {
      link.setAttribute('href', status.href);
    });
  };

  const setStatusIcon = (element, isReady) => {
    if (!element) return;

    element.textContent = isReady ? 'OK' : '...';
    element.classList.toggle('is-pending', !isReady);
  };

  const platformLabel = (platform) => (
    platform?.verified ? 'build verified' : 'validation pending'
  );

  const integrityLabel = (status) => {
    if (status.hasChecksums) return 'checksums published';
    return status.source === 'github'
      ? 'checksum metadata pending'
      : 'GitHub status unavailable';
  };

  const updateStatusStrips = (status) => {
    document.querySelectorAll('[data-release-status-root]').forEach((root) => {
      setText('[data-release-version]', status.version, root);
      setText('[data-release-date]', status.date, root);
      setText('[data-release-integrity-status]', integrityLabel(status), root);
      setStatusIcon(root.querySelector('[data-release-integrity-icon]'), status.hasChecksums);

      root.querySelectorAll('[data-release-platform-target]').forEach((cell) => {
        const target = cell.getAttribute('data-release-platform-target');
        const platform = status.platforms.find((item) => item.target === target);

        if (!platform) return;

        setText('[data-release-platform-label]', platform.label, cell);
        setText('[data-release-platform-status]', platformLabel(platform), cell);
        setStatusIcon(cell.querySelector('[data-release-platform-icon]'), platform.verified);

        const link = cell.querySelector('[data-release-platform-link]');
        if (link) link.setAttribute('href', platform.href);
      });
    });
  };

  const createArtifactCell = (className, text) => {
    const cell = document.createElement('span');
    cell.className = className;
    cell.setAttribute('role', 'cell');
    cell.textContent = text;
    return cell;
  };

  const createArtifactRow = (artifact) => {
    const row = document.createElement('a');
    row.className = 'ddp-artifact-row';
    row.href = artifact.href;
    row.setAttribute('role', 'row');

    row.append(
      createArtifactCell('target', artifact.target),
      createArtifactCell('file', artifact.file),
      createArtifactCell('sum', artifact.sum),
      createArtifactCell('ok', artifact.verified ? 'build verified' : 'pending'),
    );

    return row;
  };

  const updateArtifactTables = (status) => {
    document.querySelectorAll('[data-release-artifact-table]').forEach((table) => {
      const body = table.querySelector('[data-release-artifact-body]');
      const empty = table.querySelector('[data-release-artifact-empty]');

      if (!body) return;

      body.replaceChildren(...status.artifacts.map(createArtifactRow));

      if (empty) {
        empty.hidden = status.artifacts.length > 0;
      }
    });
  };

  const updateReleaseText = (status) => {
    setText('[data-release-version]', status.version);
    setText('[data-release-date]', status.date);
    setText('[data-release-integrity-status]', integrityLabel(status));

    document.querySelectorAll('[data-release-artifact-heading]').forEach((heading) => {
      heading.textContent = status.source === 'github'
        ? `What ships in ${status.version}.`
        : 'What ships in the current GitHub release.';
      });
  };

  const loadJson = async (url) => {
    if (typeof fetch === 'function') {
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Release status returned ${response.status}`);
      return await response.json();
    }

    return await new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.setRequestHeader('Accept', 'application/json');
      request.onreadystatechange = () => {
        if (request.readyState !== 4) return;

        if (request.status < 200 || request.status >= 300) {
          reject(new Error(`Release status returned ${request.status}`));
          return;
        }

        try {
          resolve(JSON.parse(request.responseText));
        } catch (error) {
          reject(error);
        }
      };
      request.onerror = () => reject(new Error('Release status request failed'));
      request.send();
    });
  };

  const loadReleaseStatus = async () => {
    const status = await loadJson(endpoint);
    if (!status || typeof status.version !== 'string' || !Array.isArray(status.platforms)) {
      return;
    }

    setReleaseLinks(status);
    updateReleaseText(status);
    updateStatusStrips(status);
    updateArtifactTables(status);
  };

  loadReleaseStatus().catch((error) => {
    console.warn('Unable to update GitHub release status.', error);
  });
})();
