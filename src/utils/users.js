const users = []
//adduser , remove user , get user , get user in room
const addUser = ({id,username,room})=>{
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if(!username || !room){
        return {error:'username and room are required'}
    }
    //check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    if(existingUser){
        return {
            error:'username is in use!'
        }
    }

    //store
    const user = {id,username,room}
    users.push(user)
    return {user}
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })
    if(index!== -1){
        return users.splice(index,1)[0]  // [0] because of diff betn [3] and 3
    }
}

const getUser = (id) =>{
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter((user)=>{
        return room === user.room
    })
}

module.exports = {
    addUser,removeUser,getUser,getUsersInRoom
}