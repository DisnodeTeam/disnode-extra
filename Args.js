const logger = require('disnode-logger');
const EventEmitter = require('events').EventEmitter;

class Args extends EventEmitter {
  constructor(bot, prefix) {
    super();
    this.prefix = prefix;
    bot.on('message',(msgObject) => {
      this.ParseMessage(msgObject);
    })
  }
  ParseMessage(msg){
    var testpref = msg.message.slice(0, this.prefix.length);
    if(testpref == this.prefix){
      var args = {};
      var split = msg.message.split(" -");
      args.cmd = split[0].split(" ")[0];
      args.args = [];
      if(this.prefix.length == 1){
        args.cmd = args.cmd.substr(1);
      }else {
        args.cmd = args.cmd.substr(this.prefix.length - 1);
      }
      for (var i = 1; i < split.length; i++) {
        var argument = split[i].split(" ");
        var arg = argument[0];
        argument.shift()
        args.args.push({arg: arg, data: argument.join(" ")});
      }
      args.msg = msg;
      this.emit('message', args);
    }
  }
}
module.exports = Args;
