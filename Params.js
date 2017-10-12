const logger = require('disnode-logger');
const EventEmitter = require('events').EventEmitter;

class Params extends EventEmitter {
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
      var params = GetParams(msg.message);
      var SpaceIndex = msg.message.length;
      if( msg.message.indexOf(" ") != -1){
        SpaceIndex = msg.message.indexOf(" ");
      }
      var firstWord = msg.message.substring(0, SpaceIndex);
      if(this.prefix.length == 1){
        firstWord = firstWord.substr(1);
      }else {
        firstWord = firstWord.substr(this.prefix.length - 1);
      }
      var command = {
        msg: msg,
        params: params,
        command: firstWord
      }
      this.emit('message', command);
    }
  }
}
function GetParams(raw){
  var parms = [];
  var lastSpace = -1;
  var end = false;
  while(!end){
    var BeginSpace = raw.indexOf(" ", lastSpace);
    var EndSpace = -1;
    if(BeginSpace != -1){
       EndSpace = raw.indexOf(" ", BeginSpace + 1);
       if(EndSpace == -1){
         EndSpace = raw.length;
         end = true;
       }
       var param = raw.substring(BeginSpace + 1, EndSpace);
       var containsQuoteIndex = param.indexOf('"');
       var BeginQuote = -1;
       var EndQuote = -1;
       if(containsQuoteIndex != -1){
         BeginQuote = raw.indexOf('"', BeginSpace);
         EndQuote = raw.indexOf('"', BeginQuote + 1);
         if(EndQuote != -1){
           BeginSpace = BeginQuote;
           EndSpace = EndQuote;
           param = raw.substring(BeginSpace + 1, EndSpace);
         }
       }
       lastSpace = EndSpace;
       if(param != ""){
         parms.push(param);
       }else{
       }
    }else{
      end = true;
    }
  }
  return parms;
}
module.exports = Params;
