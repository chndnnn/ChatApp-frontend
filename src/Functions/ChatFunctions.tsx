export function displayedUserName(username: string, users: any[]) {
  return users[0].name == username ? users[1].name : users[0].name;
}
export function displayedUserId(username: string, users: any[]) {
  return users[0].name == username ? users[1]._id : users[0]._id;
}
export function displayedUser(username: string, users:any) {
  if(!users){
    return null
  }
  if(users?.users?.length > 2){
    let Data = {
      name:users.chatName,
      completeData : users
    }
    return Data
  }else{
  return users?.users[0].name == username ? users?.users[1] : users?.users[0];
  }
}

export function displayAvatarAtEndMessage(allmessages:any,i:any){

  if(allmessages[i+1]){
    if(allmessages[i].sender._id == allmessages[i+1].sender._id){
      return false
     }else{
       return true
     }
  }
  else{
    return true
  }
  
}