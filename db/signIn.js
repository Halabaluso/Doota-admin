import CryptoJS from "crypto-js"
import { baseConnectDelete, baseConnectPut, baseConnectSearch} from "./db"




export async function firebaseAutenticate(where, query, objeto){
  let data = ""
  try {
    const response = await baseConnectSearch("user", where, query, objeto.email)
    if(response === null){
      const encriptPassword = CryptoJS.AES.encrypt(objeto.password, "cardiosalus").toString()
      objeto.password  = encriptPassword
      await baseConnectPut(`user/${objeto.index}`, objeto)
      data = true
    }else{
      data = false
    }
    return data
  } catch (error) {
    console.log(error)
    data = false
    return data
  }
}

export async function fireBaseSignIn(where, query, email, pass){
  let data = ""
  try {
    const response = await baseConnectSearch("users", where, query, email)
    if(response === null){
      data = false
    }else{
      const responseArray = Object.values(response)
      const bytes  = CryptoJS.AES.decrypt(responseArray[0].password, 'cardiosalus');
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      console.log(originalText)
      if(originalText === pass){
        data = responseArray[0]
      }else{
        data = false
      }
    }
    return data
  } catch (error) {
    console.log(error)
    data = false
  }
  return data
}

export async function resetPassword(index, password){
  let data = ""
  try {
    const encriptPassword = CryptoJS.AES.encrypt(password, "cardiosalus").toString()
    await baseConnectPut(`user/${index}/password`, encriptPassword)
    data = true
    return data
  } catch (error) {
    console.log(error)
    data = false
    return data
  }
}

export async function userDelete(index){
  let data = ""
  try {
    await baseConnectDelete(`user/${index}`)
    data = true
    return data
  } catch (error) {
    data = false
    return data
  }
}

export async function emailUpdate(index, email){
  let data = ""
  try {
    await baseConnectPut(`user/${index}/email`, email)
    data = true
    return data
  } catch (error) {
    data = false
    return data
  }
}