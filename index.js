const https = require('https')
const os = require('os')
/**
 * @typedef AnalyticData
 * @property {Number} servers
 * @property {Number} users
 * @property {Number} channels
 * @property {Number} sent_messages
 * @property {Number} received_messages
 * @property {Number} ram_used
 */

class Analytics{
    /**
     * @param {String} apiToken Chewey Bot api Token
     * @param {import("eris").Client | import("discord.js").Client} discordBot (recommended) optional if want auto reporter (stats recorded for you)
     */
    constructor(apiToken,discordBot){
        this.options={
            apiToken,
            discordBot:discordBot,
            sent_messages:0,
            received_messages:0,
            bot_id:0,
            bot_profilepicture:""
            
        }
        if(discordBot!=null){
            discordBot.on("messageCreate",(msg)=>{
                this.options.received_messages++;
                if(msg.author.id==discordBot.user.id){
                    this.options.sent_messages++;
                }
            })
            discordBot.on("message", (msg) => {
                this.options.received_messages++;
                if (msg.author.id == discordBot.user.id) {
                    this.options.sent_messages++;
                }
            })
            // allow bot to warmup
            discordBot.on("ready",()=>{
                setTimeout(() => {
                    this.startAutoReport()
console.log("[API REPORTER]: AutoReport started.");
                    // send initial on load
                    this.sendReport(this.buildBody(this.options.discordBot)).then(() => {
console.log("[API REPORTER]: Initial Report sent.");

}, () => {})

                }, 10000);
            })
        }
    }

    /**
     * Start auto reporting - only used if discordBot Client provided
     */
    startAutoReport(){
        if (this.options.discordBot && !this.options.interval) {
            this.options.interval = setInterval(() => {
                this.sendReport(this.buildBody(this.options.discordBot)).then(() => {}, () => {}) //ignore auto errors
            }, 10.1 * 60 * 1000); //10minute + extra to ensure clean limits
        }
    }

    /**
     * Stop auto reporting - to start again use startAutoReport()
     */
    stopAutoReport(){
        if (this.options.interval){
            clearInterval(this.options.interval)   
            delete this.options.interval
        }
    }

    /**
     * Used to auto construct the body to send
     * @param {@param {import("eris").Client | import("discord.js").Client} discordBot} discordBot
     * @returns {AnalyticData}
     */
    buildBody(discordBot){
        // Eris : Discord.js
        let channelCount = discordBot.channelGuildMap ? Object.keys(discordBot.channelGuildMap).length : discordBot.channels.size
        let reply= {
            servers:discordBot.guilds.size,
            users:discordBot.users.size,
            channels:channelCount,
            sent_messages:this.options.sent_messages,
            bot_id:discordBot.user.id,
            bot_profilepicture:discordBot.user.displayAvatarURL,
            received_messages: this.options.received_messages,
            ram_used:process.memoryUsage().rss //not true usage but is true ram consumption by pc spec
            ram_total:os.totalmem()
        }
        this.options.sent_messages=0;
        this.options.received_messages=0;
        return reply
    }
    /**
     * @param {AnalyticData} body
     * @returns {Promise<String|null>}
     */
    sendReport(body){
        // console.log("Sending rep",body);
        return httpsPost(body,this.options.apiToken)
    }
}
function httpsPost(body,auth){
    return new Promise((resolve,reject)=>{
        const data = JSON.stringify(body)
        const options = {
            hostname: 'api.chewey-bot.ga',
            port: 443,
            path: '/analytics/post',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': auth
            }
        }
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', function (d) {
                body += d;
            });
            res.on("end",()=>{
                try{
                    body=JSON.parse(body)
                }catch(e){}
                if(res.statusCode!=200){
                    console.log("CheweyBot API Reporter Error (CODE NOT 200): ",body);
                }
                resolve(body)
            })
        })
        
        req.on('error', (error) => {
            console.error("CheweyBot API Reporter Error (ERR): ",error)
            reject(error)
        })
        
        req.write(data)
        req.end()

    })
}


module.exports=Analytics
