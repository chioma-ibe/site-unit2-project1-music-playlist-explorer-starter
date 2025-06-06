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

            if (liked) {
                likeBtn.innerHTML = '&#x2665;'; 
            } else {
                likeBtn.innerHTML = '&#x2661;'; 
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
        const currentPlaylist = JSON.parse(JSON.stringify(playlist));

        modalContent.innerHTML = `
        <div class="modal-buttons">
          <button class="delete-btn" id="deleteBtn">Delete Playlist</button>
          <button class="button1" id="closeBtn" autofocus>Close</button>
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
        <div class="song-length">
          <p>${song.length ?? ''}</p>
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

        
        const shuffleBtn = modalContent.querySelector('#shuffleBtn');
        shuffleBtn.addEventListener('click', () => {
            shuffleSongs(currentPlaylist);
        });

        
        const deleteBtn = modalContent.querySelector('#deleteBtn');
        deleteBtn.addEventListener('click', () => {
            deletePlaylist(playlist.playlistID);
        });

        modalOverlay.addEventListener('click', e => {
        if (e.target === modalOverlay) closeModal();
        });

    
}

function closeModal() {
  modalOverlay.classList.remove('show');
  cardContainer.classList.remove('blur');
  document.body.style.overflow = '';
}


function deletePlaylist(playlistID) {
  
  const playlistIndex = playlists.findIndex(pl => pl.playlistID === playlistID);


  if (playlistIndex !== -1) {
    playlists.splice(playlistIndex, 1);


    closeModal();

    
    loadPlaylists();
  }
}

function shuffleSongs(playlist) {
  const songs = [...playlist.songs];

  for (let i = songs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [songs[i], songs[j]] = [songs[j], songs[i]];
  }

  const songsList = document.getElementById('songsList');
  songsList.innerHTML = songs.map(song => `
    <div class="playlist-songs">
      <img src="${(song.art) ? song.art : 'assets/img/song.png'}" alt="Playlist" />
      <div class="song-info">
        <p>${song.title ?? song}</p>
        <p>${song.artist ?? ''}</p>
        <p>${song.album ?? ''}</p>
      </div>
      <div class="song-length">
        <p>${song.length ?? ''}</p>
      </div>
    </div>
  `).join('');
}


function loadFeaturedPlaylist() {
            const featuredSection = document.getElementById('featured-playlist');

            if (!playlists || playlists.length === 0) {
                featuredSection.innerHTML = '<p class="empty">No playlists available</p>';
                return;
            }

            const randomIndex = Math.floor(Math.random() * playlists.length);
            const featuredPlaylist = playlists[randomIndex];

            featuredSection.innerHTML = `
                <div class="featured-container">
                    <div class="featured-left">
                        <img src="${featuredPlaylist.playlist_art}" alt="${featuredPlaylist.playlist_name}" class="featured-image" />
                        <h2 class="featured-title">${featuredPlaylist.playlist_name}</h2>
                        <p class="featured-author">Created by: ${featuredPlaylist.playlist_author}</p>
                    </div>
                    <div class="featured-right">
                        <h3>Songs</h3>
                        <div class="featured-songs">
                            ${featuredPlaylist.songs.map((song, index) => `
                                <div class="featured-song">
                                    <span class="song-number">${index + 1}</span>
                                    <div class="song-info">
                                        <p class="song-title">${song.title ?? song}</p>
                                        <p class="song-artist">${song.artist ?? ''}</p>
                                        <p class="song-album">${song.album ?? ''}</p>
                                    </div>
                                    <div class="song-length">
                                        <p>${song.length ?? ''}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
        window.addEventListener('DOMContentLoaded', loadFeaturedPlaylist);
