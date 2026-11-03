let calendarScript;

// Load the existing calendar only when its inline target is mounted.
export const loadNeetoCalEmbed = () => {
  const container = document.getElementById('inline-embed-container');
  if (!container) return;
  let active = true;
  if (!calendarScript) {
    calendarScript = new Promise((resolve, reject) => {
      if (window.neetoCal?.embed) { resolve(); return; }
      const script = document.createElement('script');
      script.src = 'https://cdn.neetocal.com/javascript/embed.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = () => { script.remove(); reject(new Error('Calendar unavailable')); };
      document.body.appendChild(script);
    }).catch(error => { calendarScript = undefined; throw error; });
  }
  calendarScript.then(() => {
    if (!active || !container.isConnected) return;
    window.neetoCal.embed({
      type: 'inline',
      id: 'a8c7f98c-010b-495e-8fc2-067f9c6d38b8',
      organization: 'educonnect-digital-solutions',
      elementSelector: '#inline-embed-container',
      styles: { height: '100%', width: '100%' },
    });
  }).catch(() => {
    if (active) container.textContent = 'The calendar could not load. Please email info@educonnect.com.ng to schedule a meeting.';
  });
  return () => { active = false; container.replaceChildren(); };
};
