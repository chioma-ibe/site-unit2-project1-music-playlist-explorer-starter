window.addEventListener('DOMContentLoaded', loadPlaylists);
const modalOverlay = document.querySelector('.modal-overlay');
const modalContent = document.querySelector('.modal-content');

async function loadPlaylists() {
  const container = document.getElementById('playlist-cards');
  container.innerHTML = '<p class="empty">Loading playlists…</p>';

    if (playlists.length === 0) {
      container.innerHTML = '<p class="empty">No playlists added</p>';
      return;
    } else {
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
            card.addEventListener('click', () => {
                openModal(pl)
            })
            container.appendChild(card);
        });
    }
}

function openModal(playlist) {
        // modalContent.appendChild(button)
        modalContent.innerHTML = `
        <button class="button1" id="closeBtn" autofocus>close</button>

  <div class="playlist-info">
    <img src="${playlist.playlist_art}" alt="${playlist.playlist_name}" />
    <div class="title-info">
      <h3>${playlist.playlist_name}</h3>
      <h3>${playlist.playlist_author}</h3>
    </div>
  </div>

  <div class="songs">
    ${playlist.songs.map(song => `
      <div class="playlist-songs">
        <img src="${(song.art) ? song.art : 'assets/img/song.png'}" alt="Playlist" />
        <div class="song-info">
          <p>${song.title ?? song}</p>
          <p>${song.artist ?? ''}</p>
          <p>${song.album  ?? ''}</p>
        </div>
      </div>
    `).join('')}
  </div>
        `;
        modalOverlay.style.display = 'block'
        // document.querySelector('#close').addEventListener('click', () => {
        //     const modal = document.querySelector('.modal-overlay')
        //     modal.style.display = 'none'
        // });
}