(() => {
  const dishes = window.EATWHAT_DATA.dishes;
  const restaurants = Object.entries(window.EATWHAT_DATA.restaurants)
    .filter(([type]) => type !== 'All Adelaide picks')
    .flatMap(([type, names]) => names.map(name => ({ name, type, area: 'Adelaide', cuisine: type })));
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const cycle = (choices, render, done) => { let count = 0; const timer = setInterval(() => { const item = pick(choices); render(item); if (++count === 10) { clearInterval(timer); done?.(item); } }, 58); };
  const dishSpin = document.querySelector('#dish-spin');
  if (dishSpin) {
    dishSpin.addEventListener('click', () => {
      const selected = document.querySelector('#dish-filter').value;
      const pool = selected === 'All' ? Object.entries(dishes).flatMap(([cuisine,names]) => names.map(name => ({cuisine,name}))) : dishes[selected].map(name => ({cuisine:selected,name}));
      const card = document.querySelector('#dish-card'), ideas = document.querySelector('#dish-ideas');
      ideas.hidden = true;
      cycle(pool, dish => { card.innerHTML = `<span class="result-icon">${pick(['✦','✳','●','✹'])}</span><p class="card-kicker">${dish.cuisine.toUpperCase()}</p><h2>${dish.name}</h2><p>A very good call for hungry humans.</p>`; }, dish => {
        ideas.hidden = false;
        const query = encodeURIComponent(`${dish.name} recipe`);
        ideas.innerHTML = `<p>MAKE IT HAPPEN</p><div class="link-row"><a target="_blank" rel="noopener" href="https://www.google.com/search?q=${query}">Find recipes ↗</a><a target="_blank" rel="noopener" href="https://www.bbcgoodfood.com/search?q=${encodeURIComponent(dish.name)}">BBC Good Food ↗</a></div>`;
      });
    });
  }
  const restroSpin = document.querySelector('#restro-spin');
  if (restroSpin) {
    restroSpin.addEventListener('click', () => {
      const selected = document.querySelector('#restro-filter').value;
      const pool = selected === 'All' ? restaurants : restaurants.filter(restaurant => restaurant.type === selected);
      const card = document.querySelector('#restro-card'), mapLink = document.querySelector('#maps-link');
      mapLink.hidden = true;
      cycle(pool.length ? pool : restaurants, restaurant => { card.innerHTML = `<span class="result-icon">⌖</span><p class="card-kicker">${restaurant.area.toUpperCase()}</p><h2>${restaurant.name}</h2><p>${restaurant.cuisine} · ${restaurant.type}</p>`; }, restaurant => {
        mapLink.hidden = false;
        mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name}, ${restaurant.area}, Adelaide SA`)}`;
      });
    });
  }
})();
