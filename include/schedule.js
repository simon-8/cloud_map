let schedule = require('node-schedule');
let http = require('http');

/**
 * 定时采集
 * 每4个小时采集更新一次
 */
let spiderSchedule = function() {
    schedule.scheduleJob('00 00 */4 * * *', function() {
        http.get('http://localhost:3000/spider/init/10', function(res) {
            let date = new Date().toString();
            date = date.match(/\d{4}\s(\d{2}\:){2}\d{2}/g);
            console.log(`${date} 开始抓取任务`);
        });
    });    
};

module.exports = {
    spiderSchedule: spiderSchedule
};

// spiderSchedule();