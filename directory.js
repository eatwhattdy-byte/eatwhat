(() => {
  const data = window.EATWHAT_DATA;
  const mapUrl = name => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, Adelaide SA`)}`;
  const recipeUrl = name => `https://www.google.com/search?q=${encodeURIComponent(`${name} recipe`)}`;
  const restaurantRoot = document.querySelector('#restaurant-directory');
  if (restaurantRoot) restaurantRoot.innerHTML = Object.entries(data.restaurants).filter(([category]) => category !== 'All Adelaide picks').map(([category, names]) => `<section class="directory-section"><p class="eyebrow">${category.toUpperCase()}</p><h2>${category}</h2><div class="directory-grid">${names.map(name => `<article class="listing-card compact-card"><img src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80" alt="Restaurant dining room"><div><p class="card-kicker">ADELAIDE</p><h3>${name}</h3><a class="listing-link" target="_blank" rel="noopener" href="${mapUrl(name)}">Open in Google Maps ↗</a></div></article>`).join('')}</div></section>`).join('');
  const dishRoot = document.querySelector('#dish-directory');
  if (dishRoot) dishRoot.innerHTML = Object.entries(data.dishes).map(([category, names]) => `<section class="directory-section"><p class="eyebrow">${category.toUpperCase()}</p><h2>${category}</h2><div class="directory-grid">${names.map(name => `<article class="listing-card compact-card"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80" alt="Prepared dish"><div><p class="card-kicker">${category.toUpperCase()}</p><h3>${name}</h3><a class="listing-link" target="_blank" rel="noopener" href="${recipeUrl(name)}">Find a recipe ↗</a></div></article>`).join('')}</div></section>`).join('');
})();
