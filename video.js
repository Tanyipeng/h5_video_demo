const videoPlayer = document.getElementsByClassName('video_play')[0],
      controls = document.getElementsByClassName('controls')[0],
      video = document.getElementsByClassName('video')[0],
      progress = document.getElementsByClassName('progress')[0],
      line = document.getElementsByClassName('line')[0],
      dot = document.getElementsByClassName('dot')[0],
      play_state = document.getElementsByClassName('play_state')[0],
      start_time = document.getElementsByClassName('start_time')[0],
      end_time = document.getElementsByClassName('end_time')[0],
      liArr = Array.from(document.getElementsByTagName('li')),
      play_rate = document.getElementsByClassName('play_rate')[0],
      add = document.getElementsByClassName('add')[0],
      minus = document.getElementsByClassName('minus')[0],
      full_screen = document.getElementsByClassName('full_screen')[0];

    function parseTime(t) {
      const m = Math.floor(t / 60) >= 10 ? Math.floor(t / 60) : '0' + Math.floor(t / 60);
      const s = Math.floor(t % 60) >= 10 ? Math.floor(t % 60) : '0' + Math.floor(t % 60);
      return m + ':' + s;
    }

    function clearActive() {
      liArr.forEach(li => li.classList.remove('active'));
    }

    function timeChangeMove() {
      let rate;
      const move = () => {
        rate = video.currentTime / video.duration * 100 + '%';
        start_time.innerHTML = parseTime(video.currentTime);
        line.style.width = rate;
        if (progress.clientWidth * (1 - parseInt(rate) / 100) < dot.clientWidth) {
          dot.style.left = (progress.clientWidth - dot.clientWidth) / progress.clientWidth * 100 + '%';
        } else {
          dot.style.left = rate;
        }
        video.timer = requestAnimationFrame(move);
      }
      video.timer && cancelAnimationFrame(video.timer);
      video.timer = requestAnimationFrame(move);
    }

    liArr.forEach(li => {
      li.onclick = function () {
        const rate = this.innerHTML.slice(0, -1);
        clearActive();
        this.classList.add('active');
        video.playbackRate = rate;
        switch (rate) {
          case '1.0':
            return play_rate.innerHTML = '倍数';
          default:
            return play_rate.innerHTML = this.innerHTML;
        }
      }
    })

    videoPlayer.onmousemove = function () {
      controls.timer && clearTimeout(controls.timer);
      controls.style.display = 'block';
      controls.timer = setTimeout(() => controls.style.display = 'none', 3000);
    }

    videoPlayer.onmouseleave = function () {
      controls.style.display = 'none';
    }

    progress.onclick = function (e) {
      video.currentTime = video.duration * e.layerX / this.clientWidth;
      const rate = video.currentTime / video.duration * 100 + '%';
      start_time.innerHTML = parseTime(video.currentTime);
      line.style.width = rate;
      if (progress.clientWidth * (1 - parseInt(rate) / 100) < dot.clientWidth) {
        dot.style.left = (progress.clientWidth - dot.clientWidth) / progress.clientWidth * 100 + '%';
      } else {
        dot.style.left = rate;
      }
    }

    play_state.onclick = function () {
      if (video.paused) {
        video.play();
        this.innerHTML = '暂停';
      } else {
        video.pause();
        this.innerHTML = '播放';
      }
    }

    full_screen.onclick = function () {
      if (this.isFullScreen) {
        document.exitFullscreen();
        this.isFullScreen = false;
        this.innerHTML = '全屏';
      } else {
        videoPlayer.requestFullscreen();
        this.isFullScreen = true;
        this.innerHTML = '退出';
      }
    }

    video.onloadedmetadata = function () {
      end_time.innerHTML = parseTime(video.duration)
    }

    video.onended = function () {
      if (video.paused) {
        video.timer && cancelAnimationFrame(video.timer);
        video.currentTime = 0;
        start_time.innerHTML = parseTime(video.currentTime);
        play_state.innerHTML = '播放';
        line.style.width = '0%';
        dot.style.left = '0%';
      }
    }

    video.onplay = timeChangeMove;

    video.onpause = function () {
      video.timer && cancelAnimationFrame(video.timer);
    }

    add.onclick = function () {
      video.volume = video.volume + 0.1 >= 1 ? 1 : video.volume + 0.1;
    }

    minus.onclick = function () {
      video.volume = video.volume - 0.1 <= 0 ? 0 : video.volume - 0.1;
    }