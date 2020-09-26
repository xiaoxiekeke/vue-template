<template>
  <div :id="audioId" class="xaudio" :class="audioState">
    <div style="display:none;">
      <audio :autoplay="autoplay" class="js-audio" :preload="preload || 'auto' " :src="src"></audio>
    </div>
    <div @click.stop="switchAudio()" class="xaudio__switch" :title="audioAttr.title">
      <a :class="switchState"></a>
    </div>
    <div @mousedown.left="mousedown" @mousemove="mousemove" class="xaudio__bar js-bar">
      <div class="xaudio__bar--loaded"></div>
      <div :style="{width:playedWidth}" class="xaudio__bar--played"></div>
    </div>
    <div class="xaudio__time">
      <span>{{formatDuring(audioAttr.currentTime)}}</span>
      <em>/</em>
      <span>{{formatDuring(audioAttr.duration)}}</span>
    </div>
    <div class="xaudio__down" v-if="state !== 'unable'">
      <a :href="src" download class="down el-icon-download"></a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'xaudio',
  props: {
    src: {type: String, default: ''},
    type: {type: String, default: 'circle'}
  },
  data () {
    return {
      uuid: this.getUUID().substr(0, 5),
      audioElem: null,
      audioAttr: {
        title: '',
        currentTime: 0,
        duration: 0
      },
      autoplay: false,
      preload: false,
      ismove: false, // audio toolbar is move
      continerplay: false, // after set currenttime, is auto play ?
      state: 'unable' // unable canplay playing paused ended
    }
  },
  computed: {
    audioId: function () {
      return 'xaudio_' + this.uuid
    },
    audioState: function () {
      return 'xaudio--' + this.state
    },
    switchState: function () {
      return this.state === 'playing' ? 'xaudio__switch--playing' : 'xaudio__switch--pause'
    },
    playedWidth: function () {
      return (this.audioAttr.currentTime / this.audioAttr.duration * 100) + '%'
    }
  },
  methods: {
    getUUID: function () {
      return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0
        let v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      }))
    },
    formatDuring: function (secs) {
      if (secs < 0.01) {
        return '00:00'
      }
      let hours = Math.floor(secs / 3600)
      let minutes = Math.floor(secs % 3600 / 60)
      let seconds = Math.ceil(secs % 3600 % 60)

      return (hours === 0 ? '' : hours > 0 && hours.toString().length < 2 ? '0' + hours + ':' : hours + ':') + (minutes.toString().length < 2 ? '0' + minutes : minutes) + ':' + (seconds.toString().length < 2 ? '0' + seconds : seconds)
    },
    audioCanPlay: function () {
      this.state = 'canplay'
      this.audioAttr.title = '播放'
      this.audioAttr.duration = this.audioElem.duration
    },
    audioPlaying: function () {
      this.audioAttr.title = '暂停'
      this.state = 'playing'
    },
    audioPause: function () {
      this.audioAttr.title = '播放'
      this.state = 'paused'
    },
    audioEnded: function () {
      this.audioAttr.title = '播放'
      this.audioAttr.currentTime = 0
      this.state = 'edned'
    },
    audioTimeUpdate: function () {
      var _audio = this.audioElem
      this.audioAttr.currentTime = _audio.currentTime
    },
    switchAudio: function () {
      var _audio = this.audioElem;
      if(this.state == 'unable'){
          return;
      }
      if (_audio.paused || _audio.ended) {
        _audio.play()
      } else {
        _audio.pause()
      }
    },
    // 计算currentTime
    calcCurrentTime: function (e) {
      if (isNaN(e.offsetX)) {
        return 0
      }
      var toolBarWidth = document.getElementById(this.audioId).querySelector('.js-bar').offsetWidth
      return this.audioAttr.duration * (parseFloat(e.offsetX) / toolBarWidth)
    },
    mousedown: function (e) {
      var _this = this;
      if (this.state === 'unable') {
        return
      }
      if (this.state === 'playing') {
        this.continerplay = true
      }
      this.audioElem.pause()
      this.ismove = true
      this.audioElem.currentTime =
            this.audioAttr.currentTime = this.calcCurrentTime(e)
       document.onmouseup = function() {
            document.onmouseup = null;
            _this.ismove = false
            if (_this.continerplay) {
              _this.audioElem.play()
            }
            _this.continerplay = false
        };
    },
    mousemove: function (e) {
      if (this.state === 'unable' || !this.ismove) {
        return
      }
      this.audioElem.currentTime =
            this.audioAttr.currentTime = this.calcCurrentTime(e)
    },
    mouseup: function (e) {
  
    },
    init: function () {
      let _that = this
      let src = _that.src
      this.state = 'unable'
      if (!src || !this.canPlayType(src)) {
          this.audioAttr = {
              title: '',
              currentTime: 0,
              duration: 0
          }
          return
      }
      var _audio = _that.audioElem = document.getElementById(_that.audioId).querySelector('.js-audio')

      // add audio events
      _audio.oncanplay = function () {
        _that.audioCanPlay()
      }

      _audio.onplaying = function () {
        _that.audioPlaying()
      }

      _audio.onpause = function () {
        _that.audioPause()
      }

      _audio.onended = function () {
        _that.audioEnded()
      }

      _audio.ontimeupdate = function () {
        _that.audioTimeUpdate()
      }
    },
    canPlayType: function (file) {
      var audioElement = document.createElement('audio')
      return !!(audioElement.canPlayType && audioElement.canPlayType('audio/' + file.split('.').pop().toLowerCase() + ';').replace(/no/, ''))
    }
  },
  watch: {
    src: function (newSrc, oldSrc) {
      this.init()
    }
  },
  mounted: function () {
    this.init()
  }

}

</script>

<style scoped>
.xaudio{
  width:100%;
  display: flex;
  flex-flow:row wrap;
  justify-content:space-between;
  align-items: center;
}
.xaudio__switch{
  position: relative;
  display: inline-block;
  width: 2em;
  height: 2em;
  background: #01cfa5;
  border-radius: 50%;
  cursor: pointer;
}
.xaudio__switch--pause{
  width: 0;
  height: 0;
  border: 0.5em solid transparent;
  border-right: none;
  border-left-color: #fff;
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -0.5em 0 0 -0.25em;
}
.xaudio__switch--playing{
  width: 0.75em;
  height: 0.75em;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -0.375em 0 0 -0.375em;
}
.xaudio__switch--playing:before,.xaudio__switch--playing:after{
  width: 30%;
  height: 100%;
  background-color: #fff;
  content: '';
  position: absolute;
  top: 0
}
.xaudio__switch--playing:before{
  left:0;
}
.xaudio__switch--playing:after{
  right:0;
}
.xaudio__bar{
  height: 0.6em;
  background-color: #01cfa5;
  border-radius: 0.3em;
  cursor: pointer;;
  margin: 0 1em;
  flex-grow:1;
}
.xaudio__bar--loaded{
  z-index:1;
}
.xaudio__bar--played{
  position: relative;
  border-radius: 0.3em;
  background: #00b792;
  width:0;
  z-index: 2;
  transition: all .1s;
  height:100%;
}
.xaudio__bar--played:after{
  content: '';
  width: 12px;
  height: 12px;
  background: #00b792;
  box-shadow: 0 0 4px #00b792;
  border-radius: 6px;
  position: absolute;
  top: -2px;
  right: -8px;
}
.xaudio__down{
  margin-left:0.5em;
  font-size: 1.8em;
}
a.down{
  text-decoration: none;
  color:#00b792;
}
.xaudio--unable.xaudio__down{
  color:#ccc;
  cursor: default;
}

.xaudio--unable .xaudio__switch{
  background: #ccc;
  cursor: default;
}
.xaudio--unable .xaudio__bar{
  background: #ccc;
  cursor: default;
}
.xaudio--unable .xaudio__bar--played{
  display: none;
}
</style>
