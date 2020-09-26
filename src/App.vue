<template>
  <div id="app">
       <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  data : function(){
      return {
      	loading : true
      }
  },
  mounted : function(){
	
  }
}
</script>
<style src="@/assets/less/common.less" lang="less"></style>
