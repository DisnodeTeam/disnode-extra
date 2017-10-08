const logger = require('disnode-logger');
const axios = require('axios');
class BotLists {
    constructor(config){
        this.config = config;
        this.en = true;
        this.enpw = true;
        this.enorg = true;
        if(!config.botuserid){
            logger.Error("BotList", "Start","Error: Bot User ID in config is Empty Cannot load if there is no bot user ID");
            this.en =false;
            return;
        }
        if(!config.bdpw || !config.dbpw.auth){
            logger.Warning("BotList", "Start","Warning: Missing dbpw object or missing dbpw.auth");
            this.enpw =false;
        }else{
            this.dbpw = axios.create({
                baseURL: "https://bots.discord.pw/api/bots/" + config.botuserid + "/stats",
                timeout: 1000,
                headers: {
                    'Authorization':'' + config.dbpw.auth
                }
            })
        }
        if(!config.dborg || !config.dborg.auth){
            logger.Warning("BotList", "Start","Warning: Missing dborg object or missing dborg.auth");
            this.enorg =false;
        }else{
            this.dporg = axios.create({
                baseURL: "https://discordbots.org/api/bots/" + config.botuserid + "/stats",
                timeout: 1000,
                headers: {
                    'Authorization':'' + config.dborg.auth
                }
            })
        }
    }
    getConfig(){
      var baseConfig = {
        botuserid: "botuserid here",
        dbpw: {
          auth:"auth token for bots.discord.pw"
        },
        dborg:{
          auth:"auth token for discordbots.org"
        }
      }
      return JSON.stringify(baseConfig, 4);
    }
    getStats(){
      if(self.en){
        if(self.enorg){
          return self.dporg.get();
        }
        if(self.enpw){
          return self.dbpw.get();
        }
      }else{
          logger.Warning("BotList", "Post","Warning: Failed constructor tests. cant do posts");
      }
    }
    postServerCount(count, shardID=0, totalShards=1){
        var self = this;
        if(self.en){
            if(self.enorg){
              self.dporg.post({
                server_count: count,
                shard_id: shardID,
                shard_count: totalShards
              });
            }
            if(self.enpw){
              self.dbpw.post({
                server_count: count,
                shard_id: shardID,
                shard_count: totalShards
              });
            }
        }else{
            logger.Warning("BotList", "Post","Warning: Failed constructor tests. cant do posts");
        }
    }

}
module.exports = BotLists
