<template>
  <div class="chat-box">
    <ul>
      <template v-for="(item,index) in list">
        <li v-if="item.role === 'robot'" class="robot" :key="index">
          <div class="icon-box"></div>
          <div class="text-box">
         <!--    <div class="node-box">
              <span class="node-name">{{item.nodeName}}</span>
            </div> -->
            <span v-if="item.role === 'robot'" class="content">{{item.output}}</span>
          </div>
        </li>
        <li v-else class="user" :key="index">
          <div class="icon-box"></div>
          <div class="text-box">
        <!--     <div class="node-box">
              <span class="node-name">{{item.nodeName}}</span> 
              <div class="chat-player-box">
                <Player v-if="item.asr !== ''" type="line" :src="item.asr" />
              </div>
            </div> -->
            <span class="content">{{item.input}}</span>
           <!--  <span class="hit" v-if="item.hits.length > 0">命中节点：{{item.hits[0].hit}}</span> -->
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
//import Player from '@/components/Player'
export default {
  name: 'chatlist',
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      asrsLength: 0
    }
  },
  computed: {

  },
  methods: {
    get1 (value) {
      this.asrsLength = value
      return ''
    }
  }/*,
  components: {
    Player
  }*/
}
</script>

<style scoped>
  .chat-box li{
    list-style: none;

    display: flex;
    margin-bottom: 15px;
    padding: 0 15px;

  }
  .chat-box ul{
    padding-left: 0;
  }
  .chat-box .user{
    flex-direction: row-reverse;
  }
  .chat-box .icon-box {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-size: contain;
  }
  .chat-box .robot .icon-box {
    background-image: url('./images/robot-photo.png');
  }

  .chat-box .user .icon-box {
    background-image: url('./images/seat-photo.png');
  }

  .chat-box .text-box {
    border-radius: 4px;
    padding: 10px;
    max-width: 50%;
    position: relative;

  }

  .chat-box .node-box{
    display: flex;
  }
  .chat-box .chat-player-box{
    height: 20px;
    width: 100px;
    margin-left: 10px;
  }
  .chat-box .text-box span{
    display: block;
  }
  .chat-box .text-box .node-name{
    font-size: 12px;
    color: #999;
    line-height: 20px;
    margin-bottom: 5px;
  }
  .chat-box .text-box .hit{
    font-size: 12px;
    color: #999;
    margin-top:5px;
  }

  .chat-box .robot .text-box{
    margin-left: 20px;
    background: #a9e9dc;
  }

  .chat-box .user .text-box{
    margin-right: 20px;
    background: #f3f3f3;
  }

  .chat-box .text-box:after,.chat-box .text-box::before{
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    border: 6px solid transparent;
    top: 10px;
  }

  .chat-box .robot .text-box:after{
    left: -12px;
    border-right-color: #a9e9dc;
  }
  .chat-box .robot .text-box:before{
    left: -13px;
    border-right-color: #a9e9dc;
  }

  .chat-box .user .text-box:after{
    right: -12px;
    border-left-color: #f3f3f3;
  }
  .chat-box .user .text-box:before{
    right: -13px;
    border-left-color: #eae9e9;
  }

</style>
