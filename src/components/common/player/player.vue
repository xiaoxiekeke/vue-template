<template>
  <div @click="click">
    <svg v-if="type === 'circle'" class="player" :class="{muited:src === ''}" viewBox="0,0,100,100">
      <circle class="progress-bg" cx="50" cy="50" r="45" stroke-width="10" stroke="#EEE" fill="none"></circle>
      <circle :class="{progress : progress !== 0}" transform="matrix(0,-1,1,0,0,100)" :stroke-dasharray="solid+' '+empty" cx="50" cy="50" r="45" stroke-width="10"
        stroke="#00b792" fill="none"></circle>
      <circle class="btn-bg" cx="50" cy="50" r="40" fill="#00b792" />
      <path class="icon-play" v-show="!playing" d="M40 30 L40 70 L70 50 Z" fill="#FFF" />
      <rect class="icon-pause" v-show="playing" x="35" y="30" width="10" height="40" fill="#FFF" />
      <rect class="icon-pause" v-show="playing" x="55" y="30" width="10" height="40" fill="#FFF" />
    </svg>

    <svg v-else viewBox="0,0,100,20" :class="{muited:src === ''}">
      <circle class="btn-bg" cx="10" cy="10" r="10" fill="#00b792"/>
      <path v-show="!playing" d="M8 6 L14 10 L8 14 Z" fill="#FFF" />
      <rect v-show="playing" x="7" y="6" width="2" height="8" fill="#FFF" />
      <rect v-show="playing" x="11" y="6" width="2" height="8" fill="#FFF" />

      <path stroke="#EEE" d="M25 10 l75 0" stroke-width="4" />
      <path stroke="#00b792" :d="`M25 10 l${progress*75} 0`" stroke-width="4"  />
    </svg>

    <video @timeupdate="timeupdate" @ended="ended" :src="source" ref="player" class="video"/>
  </div>
</template>

<script>
export default {
  name: 'Player',
  props: {
    src: {type: String, default: ''},
    type: {type: String, default: 'circle'},
    pauseKey: undefined
  },
  data () {
    return {
      progress: 0,
      playing: false,
      source: ''
    }
  },
  watch : {
    src : function (val,oldVal) {
      this.source = val;
      this.progress = 0
      this.playing = false
    }
  },
  computed: {
    solid () {
      return this.progress * Math.PI * 2 * 45
    },
    empty () {
      return Math.PI * 2 * 45 - this.solid
    }
  },
  methods: {
    timeupdate () {
      if (this.$refs.player) {
        if (this.$refs.player.currentTime !== 0) {
          this.progress = this.$refs.player.currentTime / this.$refs.player.duration
        }
      }
    },
    ended () {
      this.progress = 0
      this.playing = false
    },
    click () {
      if (this.src === '') {
        return
      }
      if (this.playing) {
        this.pause()
      } else {
        this.play()
      }
      this.$emit('statusChange', this.playing)
    },
    play () {
      if (this.src === '') {
          return
      }
      if (this.source === '') {
          this.source = this.src
      }

      this.playing = true

      this.$nextTick(() => {
        this.$refs.player.play()

        if (this.pauseKey !== undefined) {
          if (window[this.pauseKey] !== undefined) {
            if (window[this.pauseKey] !== this) {
              window[this.pauseKey].pause()
            }
          }
          window[this.pauseKey] = this
        }
      })
    },
    pause () {
      this.$refs.player.pause()
      this.playing = false
    }

  },
  beforeDestroy () {
    if (this.pauseKey !== undefined) {
      if (window[this.pauseKey] === this) {
        window[this.pauseKey] = undefined
      }
    }
  }
}
</script>

<style scoped>

  .player {
    height: 100%;
    width: 100%;
    cursor: pointer;
  }
  .muited{
    cursor:not-allowed;
    opacity: 0.5;
  }
  .video{
    display: none;
  }
  .progress{
     transition: stroke-dasharray .5s;
  }
</style>
