(() => {
  const style = document.createElement('style');
  style.textContent = '#recipe{display:none!important}.recipe-links{display:flex;flex-wrap:wrap;gap:9px;margin:14px 0}.recipe-links a{background:#fffdf6;color:#171719;padding:9px 11px;border:1.5px solid #171719;font-size:12px;font-weight:700}.ideas-heading{margin:0 0 10px;font:10px "DM Mono",monospace;letter-spacing:1px;color:#ffcf43}';
  document.head.append(style);
  document.querySelectorAll('.version').forEach(version => {
    if (version.tagName === 'A') return;
    const link = document.createElement('a');
    link.className = 'version';
    link.href = 'version.html';
    link.textContent = version.textContent;
    version.replaceWith(link);
  });

  const pick = list => list[Math.floor(Math.random() * list.length)];
  const card = dish => `<div class="dish-emoji">${pick(['🍜','🍝','🍕','🥘','🌮','🍲','🍣','🥗'])}</div><p class="mono">${dish.cuisine.toUpperCase()} / ${dish.base.toUpperCase()}</p><h3>${dish.name}</h3><p class="result-detail">A ${dish.cuisine.toLowerCase()} idea for hungry humans.</p>`;
  const ideasFor = dish => [
    ['Google recipes', `https://www.google.com/search?q=${encodeURIComponent(`${dish} recipe`)}`],
    ['BBC Good Food', `https://www.bbcgoodfood.com/search?q=${encodeURIComponent(dish)}`],
    ['taste.com.au', `https://www.taste.com.au/search-recipes/?q=${encodeURIComponent(dish)}`]
  ];

  setTimeout(() => {
    const spin = document.querySelector('#dish-spin');
    if (!spin) return;
    spin.onclick = () => {
      const selected = document.querySelector('#dish-filter').value;
      const choices = selected === 'All' ? dishData : dishData.filter(dish => dish.cuisine === selected);
      let dish = pick(choices), count = 0;
      const timer = setInterval(() => {
        dish = pick(choices);
        document.querySelector('#dish-card').innerHTML = card(dish);
        if (++count !== 10) return;
        clearInterval(timer);
        const ideas = document.querySelector('#dish-ideas');
        ideas.hidden = false;
        ideas.innerHTML = `<p class="ideas-heading">SOME IDEAS</p><div class="recipe-links">${ideasFor(dish.base).map(([label, url]) => `<a target="_blank" rel="noopener" href="${url}">${label} ↗</a>`).join('')}</div>`;
      }, 55);
    };
  }, 40);
})();
