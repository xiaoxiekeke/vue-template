window.BConfig = {'jdy' : '筋斗云','zy' : '智语','ai' : 'AI','youhu':'优呼'};
var __bid = localStorage.getItem('__bid') || 'yeta';
let __busName = window.BConfig[__bid] || '耶塔';
document.title = __busName + '电话机器人';
sessionStorage.setItem('__theme',JSON.stringify({name : __busName}))