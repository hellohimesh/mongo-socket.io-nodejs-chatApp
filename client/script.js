(function(){
var element = function(id){
    return document.getElementById(id);
}
    var status = element('status');
    var messages = element('messages');
    var textarea = element('textarea');
    var username = element('username');
    var clearbtn = element('clear');
    var statusDefault = status.textContent;
    var setStatus = function(s){
        status.textContent = s;
        if(s != statusDefault){
            var delay = setTimeout(function(){
                setStatus(statusDefault);
            },4000);
        }
    }

   // connect to socket

   var socket = io.connect('http://132.140.160.114:4000');


   if(socket != undefined){
       console.log("connected to socket");
        socket.on('output',function(data){
         if(data.length){
             for(var i=0 ; i < data.length;i++ ){
                 var message = document.createElement('div');
                 message.setAttribute('class','chat-message');
                 message.textContent =data[i].name+": "+data[i].message;
                 messages.appendChild(message);
                 messages.insertBefore(message,messages.firstChild);
             }
         }
        });
        socket.on('status',function(data){
                setStatus(typeof data == 'object'? data.message: data);
                if(data.clear){
                    textarea.value = '';
                }
        }); 
            textarea.addEventListener('keydown',function(event){
                if(event.which === 13 && event.shiftKey == false){
                    var msg = {
                        name : username.value,
                        message : textarea.value
                    }
                    console.log(msg);
                    socket.emit('input',msg);
                       console.log("message emitted"); 
                        event.preventDefault();

                }
            })

            clearbtn.addEventListener('click',function(){
                socket.emit('clear');
            })
            socket.on('cleared',function(){
                messages.textContent = '';
            })
    }


})();