window.addEventListener('DOMContentLoaded', loadPlaylists);

async function loadPlaylists() {
  const container = document.getElementById('playlist-cards');
  container.innerHTML = '<p class="empty">Loading playlists…</p>';

  try {
    const res = await fetch('./data/data.json'); 
    if (!res.ok) throw new Error();
    const playlists = await res.json();

    if (!Array.isArray(playlists) || playlists.length === 0) {
      container.innerHTML = '<p class="empty">No playlists added</p>';
      return;
    }

    container.innerHTML = '';

    playlists.forEach(pl => {
      const card = document.createElement('article');
      card.className = 'playlist';
      card.id = `playlist${pl.playlistID}`;

      card.innerHTML = `
        <img src="${pl.playlist_art}" alt="${pl.playlist_name}" />
        <h3>${pl.playlist_name}</h3>
        <p>${pl.playlist_author}</p>
        <div class="playlist-footer">
          <button class="button">♡</button>
          <span class="likes">${pl.likes ?? 0}</span>
        </div>
      `;

      container.appendChild(card);
    });
  } catch {
    container.innerHTML = '<p class="empty">No playlists added!</p>';
  }
}



const  open = document.getElementById('playlist1');
const modal_container = document.getElementById('playlist-modal')
const close = document.querySelector('.button1');



open.addEventListener('click',() => {
    modal_container.classList.remove('hide');
});

close.addEventListener('click',() => {
    console.log("Button clicked!");
    modal_container.classList.add('hide');
});
