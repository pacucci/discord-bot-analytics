A redesign of an npm program made BY CheweyZ,
If you want to get the original one, go to https://github.com/CheweyZ/discord-bot-analytics.
This will be a modified version capturing more info about the bot and reporting it on another website.

# Getting started
To first get started you will need a key to use https://api.chewey-bot.ga/ (Free)


If you are using Discord.js or Eris then this module is already built with full auto reporting

To get started 
```
const cheweyBotAnalyticsAPI=require("discord-bot-analytics")
const customAnalytics = new cheweyBotAnalyticsAPI("YOUR API TOKEN", discordBot)
```
If you using Discord.js or Eris then thats all you reporting is setup

# How to access my analytics
Webdash board (Very Simple)
https://cheweyz.github.io/discord-bot-analytics-dash/index.html?id=YOU-USERID
Demo: https://cheweyz.github.io/discord-bot-analytics-dash/index.html?id=220625669032247296

Webdash board (Custom one, by LolloG) [You login with discord]
https://https://analyticexpressjs.glitch.me/

Get all stats for chart (fetch every 5 minutes)
https://api.chewey-bot.ga/analytics/getall/YOUR-USERID

Getting latest (fetch every minute)
https://api.chewey-bot.ga/analytics/getlatest/YOUR-USERID

# What can I track
Currently supported: servers, users, channels, sent messages, received messages, Ram

# Details
Analytics are reported at 10minute intervals and stored forever (Details below)

As time goes on the stats will become more aggregated when stored on the server (Up per day stats)
    This is so more data can be held longer giving better insight to your bot
    As you may not care about per hour data from 6 months ago hence as time goes it might be compressed to for that day

# Whats the catch
There is none as long as I can pay the bills then this service will be free 
Like the service or want to help out then checkout https://www.patreon.com/CheweyZ

Perks coming soon: Higher resolution data (per minute)
