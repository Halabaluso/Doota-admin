import { getDatabase, ref, set, get, remove , child, query, orderByChild, equalTo } from "firebase/database"

const url = "https://asesor-27bd7-default-rtdb.europe-west1.firebasedatabase.app/"
const mailserver = "http://46.183.117.15:4000/enviarmail"

export async function baseConnect(where){
    const db = getDatabase()
    let datos = ""
    const dbref = ref(db)
    await get(child(dbref, where))
        .then(data => {
            datos = data.val()
        })
    return datos
}

export async function baseConnectPut(where, post){
    const db = getDatabase()
    await set(ref(db, where), post)
        .then(() => {
            console.log("Conexión realizada con éxito")
        })
        .catch(err => {
            console.log(err)
        })
}

export async function baseConnectDelete(where){
    const db = getDatabase()
    await remove(ref(db, where))
    .then(() => {
        console.log("Borrado correctamente")
    })
    .catch(err => {
        console.log(err)
    })
}

export async function baseConnectSearch(where0 ,where , query1, what){
    const db = getDatabase()
    let datareturn = ""
    const dbref = query(ref(db, where), orderByChild(query1), equalTo(what))
    await get(dbref, where0)
        .then((data) => {
            datareturn = data.val()
        })
        .catch((err) => {
            console.log(err)
            datareturn = false
        })
    return datareturn
}

// eslint-disable-next-line
export async function enviarMail(where, asunto, cuerpo, footer){
    const db = getDatabase()
    let datos = ""
    await fetch(`${mailserver}?donde=${where}&asunto=${encodeURIComponent(asunto)}&cuerpo=${encodeURIComponent(cuerpo)}&footer=${encodeURIComponent(footer)}`)
        .then(() => {
            datos = "Email enviado"
        })
        .catch(err => {
            datos = "Error al enviar mail."
            console.log(err)
        })
    return datos
}

export async function baseConnectPost(where, post){
    const db = getDatabase()
    let datos = ""
    await fetch(`${url}/${where}.json`, {
        method : "POST",
        body: JSON.stringify(post)
    })
    .then(() => {
        console.log("Post enviado")
    })
    .catch(err => {
        console.log(err)
    })
    return datos
}
