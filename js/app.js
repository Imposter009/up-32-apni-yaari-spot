(function () {
  "use strict";

  let currentPlaylistId = "chai-baatein";
  let currentIndex = 0;
  let shuffledIndices = [];
  let isPlaying = false;
  let started = false;
  let ambienceOn = false;
  let rotationsOpen = false;
  let playerMode = null; // "local" | "youtube"
  let progressTimer = null;
  let ytPlayer = null;
  let ytApiReady = false;
  let pendingYt = null;
  let playerSheetOpen = false;

  function initShuffle() {
    const songs = getSongs();
    shuffledIndices = Array.from({ length: songs.length }, (_, i) => i);
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledIndices[i];
      shuffledIndices[i] = shuffledIndices[j];
      shuffledIndices[j] = temp;
    }
    currentIndex = 0;
  }

  const MOBILE_MQ = window.matchMedia("(max-width: 768px)");

  const $ = (sel) => document.querySelector(sel);

  const els = {
    time: $("#lucknow-time"),
    listeners: $("#listener-count"),
    playlistLabel: $("#current-playlist"),
    sourceBadge: $("#source-badge"),
    title: $("#now-playing-title"),
    artist: $("#now-playing-artist"),
    playBtn: $("#play-btn"),
    prevBtn: $("#prev-btn"),
    nextBtn: $("#next-btn"),
    elapsed: $("#elapsed"),
    duration: $("#duration"),
    progressFill: $("#progress-fill"),
    playerCard: $(".player-card"),
    bottomDock: $("#bottom-dock"),
    playerDisc: $("#player-disc"),
    playerDiscIcon: $(".player-disc__icon"),
    playerBackdrop: $("#player-backdrop"),
    playerClose: $("#player-close"),
    fullscreenBtn: $("#fullscreen-btn"),
    playlistGrid: $("#playlist-grid"),
    rotationsSign: $("#rotations-sign"),
    rotationsPanel: $("#playlists"),
    installBtn: $("#install-btn"),
    ambientToggle: $("#ambient-toggle"),
    iframe: $("#yt-embed"),
    localAudio: $("#local-audio"),
    fileWarning: $("#file-warning"),
  };

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function ytPlayerVars(autoplay) {
    const vars = {
      autoplay: autoplay ? 1 : 0,
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      enablejsapi: 1,
    };
    if (window.location.protocol !== "file:") {
      vars.origin = window.location.origin;
    }
    return vars;
  }

  function ensureYtScript() {
    if (window.YT || document.getElementById("yt-api")) return;
    const tag = document.createElement("script");
    tag.id = "yt-api";
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }

  function resetProgressUI() {
    els.elapsed.textContent = "0:00";
    els.duration.textContent = "—";
    els.progressFill.style.width = "0%";
  }

  function updateLucknowTime() {
    const now = new Date();
    const lucknow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const hours = lucknow.getHours();
    const mins = lucknow.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    const h12 = hours % 12 || 12;
    els.time.textContent = `${h12}:${mins} ${ampm}`;
  }

  function updateListenerCount() {
    const base = 127 + Math.floor(Math.random() * 80);
    const jitter = Math.floor(Math.sin(Date.now() / 30000) * 12);
    els.listeners.textContent = base + jitter;
  }

  function getSongs() {
    return PLAYLISTS[currentPlaylistId].songs;
  }

  function getCurrentSong() {
    const actualIndex = shuffledIndices[currentIndex] !== undefined ? shuffledIndices[currentIndex] : currentIndex;
    return getSongs()[actualIndex];
  }

  function renderPlaylists() {
    els.playlistGrid.innerHTML = "";
    Object.entries(PLAYLISTS).forEach(([id, pl]) => {
      const btn = document.createElement("button");
      btn.className = "playlist-chip" + (id === currentPlaylistId ? " active" : "");
      btn.textContent = pl.name;
      btn.addEventListener("click", () => {
        switchPlaylist(id);
        closeRotations();
      });
      els.playlistGrid.appendChild(btn);
    });
  }

  function updateNowPlayingUI(source) {
    const song = getCurrentSong();
    const pl = PLAYLISTS[currentPlaylistId];
    els.title.textContent = song.title;
    els.artist.textContent = song.artist;
    els.playlistLabel.textContent = pl.name;
    if (els.sourceBadge) {
      if (source === "local") els.sourceBadge.textContent = "Local";
      else if (source === "youtube") els.sourceBadge.textContent = "YouTube";
      else els.sourceBadge.textContent = "";
    }
  }

  function isMobileLayout() {
    return MOBILE_MQ.matches;
  }

  function setPlayingUI(playing) {
    isPlaying = playing;
    els.playBtn.textContent = playing ? "⏸" : "▶";
    els.playerCard.classList.toggle("playing", playing);
    if (els.playerDisc) {
      els.playerDisc.classList.toggle("player-disc--spinning", playing);
      if (els.playerDiscIcon) els.playerDiscIcon.textContent = playing ? "⏸" : "▶";
    }
  }

  function openPlayerSheet() {
    if (!isMobileLayout()) return;
    playerSheetOpen = true;
    els.bottomDock?.classList.add("bottom-dock--open");
    els.playerDisc?.setAttribute("aria-expanded", "true");
    if (els.playerBackdrop) els.playerBackdrop.hidden = false;
    document.body.classList.add("player-sheet-open");
  }

  function closePlayerSheet() {
    if (!isMobileLayout()) return;
    playerSheetOpen = false;
    els.bottomDock?.classList.remove("bottom-dock--open");
    els.playerDisc?.setAttribute("aria-expanded", "false");
    if (els.playerBackdrop) els.playerBackdrop.hidden = true;
    document.body.classList.remove("player-sheet-open");
  }

  function togglePlayerSheet() {
    if (playerSheetOpen) closePlayerSheet();
    else openPlayerSheet();
  }

  function stopPlayers() {
    clearInterval(progressTimer);
    els.localAudio.pause();
    els.localAudio.removeAttribute("src");
    els.localAudio.load();
    if (ytPlayer && typeof ytPlayer.stopVideo === "function") {
      try {
        ytPlayer.stopVideo();
      } catch (_) {}
    }
    playerMode = null;
  }

  function updateProgress() {
    let current = 0;
    let total = 0;

    if (playerMode === "local") {
      current = els.localAudio.currentTime;
      total = els.localAudio.duration;
    } else if (playerMode === "youtube" && ytPlayer && typeof ytPlayer.getCurrentTime === "function") {
      current = ytPlayer.getCurrentTime() || 0;
      total = ytPlayer.getDuration() || 0;
    } else {
      return;
    }

    els.elapsed.textContent = formatTime(current);
    els.duration.textContent = total > 0 ? formatTime(total) : "—";
    if (total > 0) {
      els.progressFill.style.width = `${Math.min(100, (current / total) * 100)}%`;
    }
  }

  function startProgressPolling() {
    clearInterval(progressTimer);
    progressTimer = setInterval(updateProgress, 250);
  }

  async function playLocal(song, autoplay) {
    playerMode = "local";
    els.localAudio.src = song.file;
    els.localAudio.load();
    updateNowPlayingUI("local");
    resetProgressUI();

    if (autoplay) {
      try {
        await els.localAudio.play();
        setPlayingUI(true);
        startProgressPolling();
      } catch (err) {
        console.warn("Local playback blocked:", err);
        setPlayingUI(false);
      }
    } else {
      setPlayingUI(false);
    }
  }

  function playYouTube(song, autoplay) {
    playerMode = "youtube";
    els.localAudio.pause();
    els.localAudio.removeAttribute("src");
    els.localAudio.load();
    updateNowPlayingUI("youtube");
    resetProgressUI();
    setPlayingUI(autoplay);

    if (!ytApiReady) {
      pendingYt = { song, autoplay };
      ensureYtScript();
      return;
    }

    if (ytPlayer && typeof ytPlayer.loadVideoById === "function") {
      if (autoplay) ytPlayer.loadVideoById(song.id, 0);
      else ytPlayer.cueVideoById(song.id, 0);
      startProgressPolling();
      return;
    }

    ytPlayer = new YT.Player("yt-embed", {
      videoId: song.id,
      playerVars: ytPlayerVars(autoplay),
      events: {
        onReady: () => {
          if (autoplay) ytPlayer.playVideo();
          startProgressPolling();
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            setPlayingUI(true);
            startProgressPolling();
          } else if (event.data === YT.PlayerState.PAUSED) {
            setPlayingUI(false);
          } else if (event.data === YT.PlayerState.ENDED) {
            loadSong(currentIndex + 1, true);
          }
        },
      },
    });
  }

  async function loadSong(index, autoplay) {
    const songs = getSongs();
    currentIndex = ((index % songs.length) + songs.length) % songs.length;
    const song = getCurrentSong();

    if (!started) {
      updateNowPlayingUI();
      return;
    }

    stopPlayers();

    if (song.file) {
      await playLocal(song, autoplay);
    } else {
      playYouTube(song, autoplay);
    }
  }

  function switchPlaylist(id) {
    currentPlaylistId = id;
    initShuffle();
    renderPlaylists();
    if (started) loadSong(0, isPlaying);
    else updateNowPlayingUI();
  }

  function openRotations() {
    rotationsOpen = true;
    els.rotationsSign.setAttribute("aria-expanded", "true");
    els.rotationsPanel.classList.add("rotations-panel--open");
    els.playlistGrid.hidden = false;
  }

  function closeRotations() {
    rotationsOpen = false;
    els.rotationsSign.setAttribute("aria-expanded", "false");
    els.rotationsPanel.classList.remove("rotations-panel--open");
    els.playlistGrid.hidden = true;
  }

  function toggleRotations() {
    if (rotationsOpen) closeRotations();
    else openRotations();
  }

  async function enableAmbience() {
    try {
      await ChaiAmbient.start();
      ambienceOn = true;
      els.ambientToggle.setAttribute("aria-pressed", "true");
      els.ambientToggle.classList.add("ambient-toggle--on");
    } catch (err) {
      console.warn("Ambience failed to start:", err);
    }
  }

  async function disableAmbience() {
    try {
      await ChaiAmbient.stop();
    } catch (_) {}
    ambienceOn = false;
    els.ambientToggle.setAttribute("aria-pressed", "false");
    els.ambientToggle.classList.remove("ambient-toggle--on");
  }

  async function startPlayback() {
    started = true;
    await loadSong(currentIndex, true);
  }

  async function togglePlay() {
    if (!started) {
      await startPlayback();
      if (isMobileLayout()) openPlayerSheet();
      return;
    }

    if (playerMode === "local") {
      if (isPlaying) {
        els.localAudio.pause();
        setPlayingUI(false);
        clearInterval(progressTimer);
      } else {
        try {
          await els.localAudio.play();
          setPlayingUI(true);
          startProgressPolling();
        } catch (_) {}
      }
      return;
    }

    if (isPlaying) {
      ytPlayer?.pauseVideo?.();
      setPlayingUI(false);
      clearInterval(progressTimer);
    } else {
      ytPlayer?.playVideo?.();
      setPlayingUI(true);
      startProgressPolling();
    }
  }

  function initLocalAudio() {
    els.localAudio.addEventListener("timeupdate", updateProgress);
    els.localAudio.addEventListener("loadedmetadata", updateProgress);
    els.localAudio.addEventListener("playing", () => {
      if (playerMode === "local") startProgressPolling();
    });
    els.localAudio.addEventListener("ended", () => {
      if (playerMode === "local") loadSong(currentIndex + 1, true);
    });
    els.localAudio.addEventListener("error", () => {
      if (playerMode !== "local") return;
      const song = getCurrentSong();
      console.warn("Local file failed, falling back to YouTube:", song.file);
      playYouTube(song, isPlaying);
    });
  }

  window.onYouTubeIframeAPIReady = function () {
    ytApiReady = true;
    if (pendingYt) {
      playYouTube(pendingYt.song, pendingYt.autoplay);
      pendingYt = null;
    }
  };

  function initFullscreen() {
    if (!els.fullscreenBtn) return;

    function isFs() {
      return !!(document.fullscreenElement || document.webkitFullscreenElement);
    }

    function syncFullscreenUI() {
      const active = isFs();
      document.body.classList.toggle("is-fullscreen", active);
      els.fullscreenBtn.textContent = active ? "⤓" : "⛶";
      els.fullscreenBtn.setAttribute("aria-label", active ? "Exit fullscreen" : "Enter fullscreen");
      els.fullscreenBtn.title = active ? "Exit fullscreen" : "Fullscreen";
    }

    els.fullscreenBtn.addEventListener("click", async () => {
      try {
        if (!isFs()) {
          const el = document.documentElement;
          if (el.requestFullscreen) await el.requestFullscreen();
          else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        } else if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
      } catch (err) {
        console.warn("Fullscreen not available:", err);
      }
    });

    document.addEventListener("fullscreenchange", syncFullscreenUI);
    document.addEventListener("webkitfullscreenchange", syncFullscreenUI);
    syncFullscreenUI();
  }

  function initMobilePlayer() {
    els.playerDisc?.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlayerSheet();
    });

    els.playerClose?.addEventListener("click", (e) => {
      e.stopPropagation();
      closePlayerSheet();
    });

    els.playerBackdrop?.addEventListener("click", closePlayerSheet);

    MOBILE_MQ.addEventListener("change", () => {
      if (!isMobileLayout()) closePlayerSheet();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && playerSheetOpen) closePlayerSheet();
    });
  }
  function initAmbientToggle() {
    els.ambientToggle.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (ambienceOn) await disableAmbience();
      else await enableAmbience();
    });
  }

  function initPWA() {
    let deferredPrompt;
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      els.installBtn.hidden = false;
    });
    els.installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      els.installBtn.hidden = true;
    });
  }

  if (window.location.protocol === "file:") {
    els.fileWarning.hidden = false;
  }

  els.playBtn.addEventListener("click", togglePlay);
  els.prevBtn.addEventListener("click", () => {
    if (!started) {
      const songs = getSongs();
      currentIndex = ((currentIndex - 1) % songs.length + songs.length) % songs.length;
      updateNowPlayingUI();
      return;
    }
    loadSong(currentIndex - 1, isPlaying);
  });
  els.nextBtn.addEventListener("click", () => {
    if (!started) {
      const songs = getSongs();
      currentIndex = (currentIndex + 1) % songs.length;
      updateNowPlayingUI();
      return;
    }
    loadSong(currentIndex + 1, isPlaying);
  });

  els.rotationsSign.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleRotations();
  });

  document.addEventListener("click", (e) => {
    if (rotationsOpen && !els.rotationsPanel.contains(e.target)) {
      closeRotations();
    }
  });

  updateLucknowTime();
  updateListenerCount();
  setInterval(updateLucknowTime, 30000);
  setInterval(updateListenerCount, 45000);

  initShuffle();
  renderPlaylists();
  updateNowPlayingUI();
  initLocalAudio();
  initAmbientToggle();
  initFullscreen();
  initMobilePlayer();
  initPWA();
})();
