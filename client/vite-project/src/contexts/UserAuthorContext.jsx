import { createContext,useState } from 'react'
import React from 'react'
export const userAuthorContextObj=createContext();

function UserAuthorContext({children}) {
    let [currentUser,setCurrentUser]=useState({
        firstName:'',
        lastName:'',
        email:'',
        profileImageUrl:'',
        role:''
    }
    )
  return (
    <userAuthorContextObj.Provider value={{currentUser,setCurrentUser}}>
        {children}
    </userAuthorContextObj.Provider>
  )
}

export default UserAuthorContext