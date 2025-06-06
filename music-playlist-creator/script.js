window.addEventListener('DOMContentLoaded', loadPlaylists);
const modalOverlay = document.querySelector('.modal-overlay');
const modalContent = document.querySelector('.modal-content');
const cardContainer = document.getElementById('playlist-cards');

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
                <button class="like-btn" aria-label="like/unlike">&#x2661;</button>
                <span class="likes">${pl.likes ?? 0}</span>
                </div>
            `;
            const likeBtn   = card.querySelector('.like-btn');
            const likesSpan = card.querySelector('.likes');

            likeBtn.addEventListener('click', e => {
            e.stopPropagation();

            const liked = likeBtn.classList.toggle('liked');
            pl.likes    = (pl.likes ?? 0) + (liked ? 1 : -1);
            likesSpan.textContent = pl.likes;

            // Change heart from outline to filled when liked
            if (liked) {
                likeBtn.innerHTML = '&#x2665;'; // Filled heart
            } else {
                likeBtn.innerHTML = '&#x2661;'; // Outline heart
            }
            });


            card.addEventListener('click', () => {
                openModal(pl)
            })
            container.appendChild(card);
        });
    }
}

function openModal(playlist) {
        // Create a copy of the playlist to work with
        const currentPlaylist = JSON.parse(JSON.stringify(playlist));

        // modalContent.appendChild(button)
        modalContent.innerHTML = `
        <div class="modal-buttons">
          <button class="button1" id="closeBtn" autofocus>close</button>
        </div>

  <div class="playlist-info">
    <img src="${currentPlaylist.playlist_art}" alt="${currentPlaylist.playlist_name}" />
    <div class="title-info">
      <h3>${currentPlaylist.playlist_name}</h3>
      <h3>${currentPlaylist.playlist_author}</h3>
    </div>
  </div>

  <div class="shuffle-container">
    <button class="shuffle-btn" id="shuffleBtn">Shuffle</button>
  </div>

  <div class="songs" id="songsList">
    ${currentPlaylist.songs.map(song => `
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
        modalOverlay.classList.add('show');
        cardContainer.classList.add('blur');
        document.body.style.overflow = 'hidden';

        const closeBtn = modalContent.querySelector('#closeBtn');
        closeBtn.addEventListener('click', closeModal);

        // Add event listener for the shuffle button
        const shuffleBtn = modalContent.querySelector('#shuffleBtn');
        shuffleBtn.addEventListener('click', () => {
            shuffleSongs(currentPlaylist);
        });

        modalOverlay.addEventListener('click', e => {
        if (e.target === modalOverlay) closeModal();
        });

        // document.querySelector('#close').addEventListener('click', () => {
        //     const modal = document.querySelector('.modal-overlay')
        //     modal.style.display = 'none'
        // });
}

function closeModal() {
  modalOverlay.classList.remove('show');
  cardContainer.classList.remove('blur');
  document.body.style.overflow = '';
}

// Function to shuffle songs in the playlist
function shuffleSongs(playlist) {
  // Create a copy of the songs array
  const songs = [...playlist.songs];

  // Fisher-Yates (Knuth) shuffle algorithm
  for (let i = songs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [songs[i], songs[j]] = [songs[j], songs[i]];
  }

  // Update the songs list in the DOM
  const songsList = document.getElementById('songsList');
  songsList.innerHTML = songs.map(song => `
    <div class="playlist-songs">
      <img src="${(song.art) ? song.art : 'assets/img/song.png'}" alt="Playlist" />
      <div class="song-info">
        <p>${song.title ?? song}</p>
        <p>${song.artist ?? ''}</p>
        <p>${song.album ?? ''}</p>
      </div>
    </div>
  `).join('');
}
