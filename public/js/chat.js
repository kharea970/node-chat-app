const socket = io()
//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')

//templates for rendering
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
//options
const {username,room} = Qs.parse(location.search,{ ignoreQueryPrefix:true})

const autoscroll = ()=>{
    //new message element
   const $newMessage = $messages.lastElementChild

   //ht of the last image
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
   const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

   console.log(newMessageMargin)
}

socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(url)=>{
    console.log(url)
    const html = Mustache.render(locationMessageTemplate,{
        username:url.username,
        time: moment(url.createdAt).format('h:mm a'),
        url:url.url
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,users
    })
    document.querySelector('#sidebar').innerHTML = html
})


$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')
    //disable
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{
        //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=""
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('message delievered ')
     })
 })

document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocatio is not supported by ur browser. ')
    }
    document.querySelector('#send-location').setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            console.log('location shared')
            document.querySelector('#send-location').removeAttribute('disabled')
        })
    })
    
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})