window.addEventListener('DOMContentLoaded', function() {
    loadPlaylists();
    setupSearch();
});
const modalOverlay = document.querySelector('.modal-overlay');
const modalContent = document.querySelector('.modal-content');
const cardContainer = document.getElementById('playlist-cards');

async function loadPlaylists(filteredPlaylists) {
    const container = document.getElementById('playlist-cards');
    container.innerHTML = '<p class="empty">Loading playlists…</p>';

    const playlistsToDisplay = filteredPlaylists || window.playlists;

    if (playlistsToDisplay.length === 0) {
        container.innerHTML = '<p class="empty">No playlists found</p>';
        return;
    } else {
        container.innerHTML = '';

        playlistsToDisplay.forEach(pl => {
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
                    <button class="edit-btn" aria-label="edit playlist">Edit</button>
                </div>
            `;
            const likeBtn   = card.querySelector('.like-btn');
            const likesSpan = card.querySelector('.likes');
            const editBtn   = card.querySelector('.edit-btn');

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

            editBtn.addEventListener('click', e => {
                e.stopPropagation();
                openEditModal(pl);
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

  const playlistIndex = window.playlists.findIndex(pl => pl.playlistID === playlistID);


  if (playlistIndex !== -1) {
    window.playlists.splice(playlistIndex, 1);


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


function openEditModal(playlist) {
    const playlistCopy = JSON.parse(JSON.stringify(playlist));

    modalContent.innerHTML = `
        <div class="modal-buttons">
            <button class="button1" id="closeEditBtn" autofocus>Close</button>
        </div>

        <form class="edit-form" id="editPlaylistForm">
            <div class="form-group">
                <label for="playlist-name">Playlist Name</label>
                <input type="text" id="playlist-name" value="${playlistCopy.playlist_name}" required>
            </div>

            <div class="form-group">
                <label for="playlist-author">Author</label>
                <input type="text" id="playlist-author" value="${playlistCopy.playlist_author}" required>
            </div>

            <div class="form-group">
                <label for="playlist-art">Cover Image URL</label>
                <input type="text" id="playlist-art" value="${playlistCopy.playlist_art}">
            </div>

            <div class="form-group">
                <label>Songs</label>
                <div id="songs-container">
                    ${playlistCopy.songs.map((song, index) => `
                        <div class="song-entry" data-index="${index}">
                            <input type="text" class="song-title" placeholder="Title" value="${song.title || ''}" required>
                            <input type="text" class="song-artist" placeholder="Artist" value="${song.artist || ''}">
                            <input type="text" class="song-length" placeholder="Length (e.g. 3:45)" value="${song.length || ''}">
                            <button type="button" class="remove-song-btn">Remove</button>
                        </div>
                    `).join('')}
                </div>
                <button type="button" class="add-song-btn" id="addSongBtn">Add Song</button>
            </div>

            <div class="form-buttons">
                <button type="button" class="cancel-btn" id="cancelEditBtn">Cancel</button>
                <button type="submit" class="save-btn">Save Changes</button>
            </div>
        </form>
    `;

    modalOverlay.classList.add('show');
    cardContainer.classList.add('blur');
    document.body.style.overflow = 'hidden';

    const closeBtn = modalContent.querySelector('#closeEditBtn');
    closeBtn.addEventListener('click', closeModal);

    const cancelBtn = modalContent.querySelector('#cancelEditBtn');
    cancelBtn.addEventListener('click', closeModal);

    const addSongBtn = modalContent.querySelector('#addSongBtn');
    addSongBtn.addEventListener('click', () => {
        const songsContainer = document.getElementById('songs-container');
        const newIndex = songsContainer.children.length;

        const songEntry = document.createElement('div');
        songEntry.className = 'song-entry';
        songEntry.dataset.index = newIndex;

        songEntry.innerHTML = `
            <input type="text" class="song-title" placeholder="Title" required>
            <input type="text" class="song-artist" placeholder="Artist">
            <input type="text" class="song-length" placeholder="Length (e.g. 3:45)">
            <button type="button" class="remove-song-btn">Remove</button>
        `;

        songsContainer.appendChild(songEntry);

        const removeBtn = songEntry.querySelector('.remove-song-btn');
        removeBtn.addEventListener('click', (e) => {
            e.target.closest('.song-entry').remove();
        });
    });

    const removeBtns = modalContent.querySelectorAll('.remove-song-btn');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.song-entry').remove();
        });
    });

    const form = modalContent.querySelector('#editPlaylistForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('playlist-name').value;
        const author = document.getElementById('playlist-author').value;
        const art = document.getElementById('playlist-art').value;

        const songEntries = document.querySelectorAll('.song-entry');
        const songs = Array.from(songEntries).map(entry => {
            return {
                title: entry.querySelector('.song-title').value,
                artist: entry.querySelector('.song-artist').value,
                length: entry.querySelector('.song-length').value
            };
        });

        playlist.playlist_name = name;
        playlist.playlist_author = author;
        playlist.playlist_art = art;
        playlist.songs = songs;

        closeModal();
        loadPlaylists();
    });
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (searchTerm === '') {
            loadPlaylists();
            return;
        }

        const filteredPlaylists = window.playlists.filter(playlist => {
            return (
                playlist.playlist_name.toLowerCase().includes(searchTerm) ||
                playlist.playlist_author.toLowerCase().includes(searchTerm) ||
                playlist.songs.some(song =>
                    (typeof song === 'string' && song.toLowerCase().includes(searchTerm)) ||
                    (song.title && song.title.toLowerCase().includes(searchTerm)) ||
                    (song.artist && song.artist.toLowerCase().includes(searchTerm)) ||
                    (song.album && song.album.toLowerCase().includes(searchTerm))
                )
            );
        });

        loadPlaylists(filteredPlaylists);
    }

    searchButton.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function loadFeaturedPlaylist() {
            const featuredSection = document.getElementById('featured-playlist');

            if (!window.playlists || window.playlists.length === 0) {
                featuredSection.innerHTML = '<p class="empty">No playlists available</p>';
                return;
            }

            const randomIndex = Math.floor(Math.random() * window.playlists.length);
            const featuredPlaylist = window.playlists[randomIndex];

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
