

const RuleMap = {
    "require" : {
        msg : "%s不能为空",
        rule : function(val){
            if(val == null || val == ""){
                return false;
            }
            return true;
        }
    },
    //手机号码
    "phone" : {
        msg : "%s格式错误",
        rule : /^1[3|4|5|6|7|8|9]\d{9}$/
    },
    //密码
    "password" : {
        msg : "%s为8-20位，须含字母+数字（不含特殊符号）",
        rule : /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/
    },
    //邮箱
    "email" : {
        msg : "%s格式错误",
        rule : /^[A-Za-z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    },
    //微信
    "wechat" : {
        msg : "%s格式错误",
        rule : /^[a-zA-Z\d_]{5,}$/
    },
    "qq" : {
        msg : "%s格式错误",
        rule : /^\d{4,14}$/
    },
    //图片验证码
    "verifyCode" : {
        msg : "%s格式错误",
        rule :/[a-zA-Z0-9]{4}/
    },
    //话术名称
    "wordsName" : {
        msg : "%s格式错误",
        rule : /^[\u4e00-\u9fa5_a-zA-Z0-9\u0800-\u4e00]{1,50}$/
    },
    "name" : {
        msg : "%s格式错误",
        rule : /^[\u4e00-\u9fa5_a-zA-Z0-9\u0800-\u4e00]+$/
    },
    "sms" : {
        msg : "%s格式错误",
        rule : /^[^<>]+$/
    },
    "namelength":{
        msg : "%s不得大于20个字符",
        rule : /^\S{1,20}$/
    },
    "ename" : { //英文名称
        msg : '%s格式错误',
        rule : /^[a-zA-Z]+$/
    },
    //转人工号码
    "agentNumber" : {
        msg : "%s格式错误",
        rule : /^\d+([,|，]\d+)*$/
    },
    //转人工话术
    "agentCallProcPrompt" : {
        msg : "%s格式错误",
        rule : /^[\u4e00-\u9fa5a-zA-Z0-9,，?。!]{1,60}$/
    },
    //checkbox验证
    "checked":{
        msg:"%s",
        rule:true
    },
    //身份证号
    "identification":{
        msg : "%s格式错误",
        rule : function(val){
            var reg =  /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i;
            if(!reg.test(val)){
                return false;
            }
            var arr = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
            var sum = 0;
            for(var i=0; i<arr.length; i++){
                sum += parseInt(val.charAt(i)) * arr[i];
            }
            var c = sum % 11;
            var ch = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
            var code = ch[c];
            var last = val.charAt(17);
            last = last.toLowerCase()=='x' ? 'X': last;
            return last == code;
        }
    },
    //公司名称
    "company": {
        msg : "%s格式错误",
        rule : /^([a-zA-Z0-9\u4e00-\u9fa5]{2,30})$/
    },
    "representative" : {
        msg : "%s格式错误",
        rule : /^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,15})$/
    },
    "number": {
        msg : "%s必须为数字",
        rule : /^[0-9]*$/
    },
};

export function validateRule(value,rules){
	let result = -1;
	for(let i = 0,len = rules.length; i < len; i++){
		let ruleObj = RuleMap[rules[i]],
			rule = ruleObj ? ruleObj.rule : null;
		if(!rule){
			continue;
		}
		if(typeof rule == 'function' && !rule(value)){
			result = i;
			break;
		}else if(typeof rule == 'object' && !new RegExp(rule).test(value) ){
			result = i;
			break;
		}
	}
	return result;
}