import Config from './config.js'

const isDebug = Config.debug;

export function kinfo(message,data){
	if(!isDebug){
		return;
	}
	if(data){
　　	console.log("%s%o",message,data);
	}else{
		console.log(message)
	}
}

export function kerror(message,data){
	if(!isDebug){
		return;
	}
	if(data){
　　	console.error("%s%o",message,data);
	}else{
		console.error(message)
	}
}

export function zeroFill(str){
	if (str != null && parseInt(str) < 10) {
    	return '0' + str;
    }
    return str;
}
//
export function formatDate(date,fmt){
    fmt = fmt  ? fmt.toUpperCase() : "Y-M-D H:M:S";
    let y = date.getFullYear(),
    	m = zeroFill((date.getMonth() + 1)),
    	d = zeroFill(date.getDate()),
    	h = zeroFill(date.getHours()),
    	min = zeroFill(date.getMinutes()),
    	s = zeroFill(date.getSeconds());
  	if (fmt.indexOf("Y") >= 0 && fmt.indexOf("M") >= 0) {
        return fmt.replace(/Y/, y).replace(/M/, m).replace(/D/, d).replace(/H/, h).replace(/M/, min)
                .replace(/S/, s);
    }
    return fmt.replace(/D/, d).replace(/H/, h).replace(/M/, min).replace(/S/, s);
}

export function formatLongDate(longTime,fmt){
 	if(!longTime || longTime <= 0){
        return "";
    }
    return formatDate(new Date(Number(longTime)),fmt)
}

export function getNowTime(fmt){
    fmt = fmt || "y-m-d h:m:s";
    return formatDate(new Date(), fmt);
}

export function milliFormat(input) {
    return input && input.toString()
        .replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}


export function formatSecond(second) {
  if(!second){
    return ''
  }
  let result = '';
  let min = parseInt(second / 60);
  let sec = second % 60;
  if(min > 0){
    result += min + '分';
  }
  if(sec > 0){
    result += sec + '秒';
  }
  return result;
}
   

export function extend(){
    let target = arguments[0];
    for(let i = 0,len = arguments.length; i < len; i++){
        let source = arguments[i];
        for (let key in source) {
            target[key] = source[key];
        }
    }
    return target;
}

/*
* 异步加载脚本文件
*/
export function loadScript(url){
    let asyncMap = window.asyncMap = window.asyncMap || {};
    asyncMap[url] = asyncMap[url] || {loaded : false,callback : []};
    let curMap = asyncMap[url];
    return new Promise(function(resolve, reject){
        if(curMap.loaded === true){
            resolve && resolve();
            return;
        }
        if(curMap.loaded != null){
            curMap.callback.push(resolve);
        }
        let script = document.createElement('script');
        script.type = 'text/JavaScript';
        script.onload = function(){
            curMap.loaded = true;
            for(let i = 0,len = curMap.callback.length; i < len;i++){
                curMap.callback[i] && curMap.callback[i]();
            }
        }
        script.src = url;
        document.getElementsByTagName('body')[0].appendChild(script);
    });
}

export function getUUID(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
