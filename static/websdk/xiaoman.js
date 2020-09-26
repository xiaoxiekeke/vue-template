(function(){
	let _loadScript = function(src){
		let scriptElem = document.createElement('script');
		scriptElem.src = src;
		document.head.appendChild(scriptElem);
	}
	_loadScript('static/websdk/plugins/jssip.js');
	_loadScript('static/websdk/plugins/crypto.js');
	_loadScript('static/websdk/xiaoman-phone.js?t='+new Date().getTime());
})();