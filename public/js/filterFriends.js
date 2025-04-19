document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('filter-friends');
  const friendLinks = document.querySelectorAll('.friend-link');
  const noResultsEl = document.getElementById('no-results'); // Make sure this exists in your HTML

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    let anyVisible = false;

    friendLinks.forEach(link => {
      const usernameRaw = link.getAttribute('data-username').toLowerCase();
      const usernameEl = link.querySelector('.friend-username');

      if (usernameRaw.includes(query)) {
        link.style.display = '';
        anyVisible = true;

        const matchIndex = usernameRaw.indexOf(query);
        const originalUsername = usernameEl.getAttribute('data-original');

        if (matchIndex !== -1 && query.length > 0) {
          const beforeMatch = originalUsername.slice(0, matchIndex);
          const matchText = originalUsername.slice(matchIndex, matchIndex + query.length);
          const afterMatch = originalUsername.slice(matchIndex + query.length);

          usernameEl.innerHTML = `${beforeMatch}<span style="color: #493d9e;">${matchText}</span>${afterMatch}`;
        } else {
          usernameEl.innerHTML = originalUsername;
        }
      } else {
        link.style.display = 'none';
      }
    });

    // Show/hide the "No results" message
    noResultsEl.style.display = anyVisible ? 'none' : 'block';
  });
});
