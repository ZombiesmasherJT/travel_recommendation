/*************************************************
 * Show the search bar only on Home (#home)
 *************************************************/
function toggleNavSearch() {
    const box = document.getElementById('nav-search');
    if (!box) return;
    const hash = window.location.hash || '#home';
    box.style.display = (hash === '#home' || hash === '') ? 'flex' : 'none';
  }
  window.addEventListener('hashchange', toggleNavSearch);
  window.addEventListener('load', toggleNavSearch);
  
  /*************************************************
   * Task 6 — Fetch JSON (cached) + console.log
   *************************************************/
  let DATA_CACHE = null;
  
  async function loadData() {
    try {
      if (DATA_CACHE) return DATA_CACHE;
      const res = await fetch('./travel_recommendation_api.json');
      const data = await res.json();
      console.log('✅ Loaded travel data:', data); // Task 6 requirement
      DATA_CACHE = data;
      return data;
    } catch (err) {
      console.error('❌ Failed to load JSON:', err);
      return { countries: [], beaches: [], temples: [] };
    }
  }
  
  /*************************************************
   * Elements
   *************************************************/
  const inputEl   = document.getElementById('search-input');
  const resultsEl = document.getElementById('results');
  const searchBtn = document.getElementById('search-btn');
  const resetBtn  = document.getElementById('reset-btn');
  
  /*************************************************
   * Task 7 — Keyword search (beach/temple/country)
   * Task 8 — Render as recommendation cards
   *************************************************/
  function displayList(list, title) {
    // Title
    resultsEl.innerHTML = `<h2 style="margin:12px 0;">${title}</h2>`;
  
    // Empty state
    if (!list || !list.length) {
      resultsEl.innerHTML += `<p style="color:#555;">No ${title.toLowerCase()} found.</p>`;
      return;
    }
  
    // Card grid
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
    grid.style.gap = '16px';
  
    list.forEach(item => {
      const card = document.createElement('div');
      card.style.border = '1px solid #ddd';
      card.style.borderRadius = '12px';
      card.style.overflow = 'hidden';
      card.style.background = '#fff';
      card.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
  
      card.innerHTML = `
        ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" style="width:100%;height:160px;object-fit:cover;">` : ''}
        <div style="padding:12px;">
          <h3 style="margin:0 0 8px;font-size:18px;">${item.name}</h3>
          ${item.description ? `<p style="margin:0 0 10px;color:#555;line-height:1.5;">${item.description}</p>` : ''}
          <button style="padding:8px 12px;background-color:teal;color:white;border:none;border-radius:6px;cursor:pointer;">Visit</button>
        </div>
      `;
      grid.appendChild(card);
    });
  
    resultsEl.appendChild(grid);
  }
  
  async function doKeywordSearch() {
    const q = (inputEl.value || '').trim().toLowerCase();
    if (!q) {
      resultsEl.innerHTML = '<p>Please type a keyword: beach, temples, or countries.</p>';
      return;
    }
  
    const data = await loadData();
    resultsEl.innerHTML = ''; // clear previous results
  
    // beaches / temples → show items directly from arrays
    if (q.includes('beach')) {
      displayList(data.beaches || [], 'Beaches');
      return;
    }
  
    if (q.includes('temple')) {
      displayList(data.temples || [], 'Temples');
      return;
    }
  
    // countries → flatten all cities so we can show image + description
    if (q.includes('country')) {
      const allCities = (data.countries || []).flatMap(c => (c.cities || []));
      displayList(allCities, 'Countries (Cities)');
      return;
    }
  
    // default
    resultsEl.innerHTML = `<p>No matches for "<strong>${q}</strong>". Try beach, temples, or countries.</p>`;
  }
  
  /*************************************************
   * Wire up buttons (Search + Reset) and Enter key
   *************************************************/
  if (searchBtn) searchBtn.addEventListener('click', doKeywordSearch);
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doKeywordSearch();
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (inputEl) inputEl.value = '';
      resultsEl.innerHTML = '';
      if (inputEl) inputEl.focus();
    });
  }
  


  function clear1(){
    document.getElementById("search-input").value = ''
    document.getElementById("results").innerHTML = "";

    
  }