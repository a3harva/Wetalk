


const socket =io();

const chatForm =document.getElementById('chat-form');

const chatMessages=document.querySelector('.chat-messages');
//Message from server 

const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');




//getting username and room from urls 

//remember that Qs library must have Q as uppercase

const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

//console.log(username,room)

//joined chat 



socket.emit('joinroom',{username,room})


//get room and users

socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);

});




socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;



});




//msg submit

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    const msg=e.target.elements.msg.value;
    console.log(msg);

    //emiting msg to server 
    socket.emit('chatMessage',msg)
    //clear msg 

    e.target.elements.msg.value='';
    //clear msg from the front end 
    e.target.elements.msg.focus();

})

//output message to dom 

function outputMessage(message){
const div =document.createElement('div');
div.classList.add('message');

div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
<p class="text">
    ${message.text}
</p>`;

document.querySelector('.chat-messages').appendChild(div);




}



// add room name to dom


function outputRoomName(room){

    roomName.innerHTML=room;



}
function outputUsers(users){
    userList.innerHTML=` ${ users.map(user=>`<li>${user.username}</li>`).join('') }  `;
}