<template>
    <div class="bg-white rounded-lg shadow p-5 m-5 text-gray-700 border-b border-primary">
        <p class="font-bold"><i class="fa-solid fa-users"></i> Buscar usuario</p>
        <div class="flex flex-row mt-4">
            <input v-model="usersearch" type="text" placeholder="Buscar por DNI" class="input input-bordered" />
            <button @click="search" class="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </div>
        <div class="overflow-x-auto">
            <table class="table w-full">
                <!-- head -->
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Datos</th>
                        <th>Estado</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- row 1 -->
                    <tr v-for="(user) in data" :key="user">
                        <th>
                            <p class="font-bold">{{ user.name }} <label @click="cogerDatos(user.name, `nombre`, `name`)"
                                    for="eliminaruser"><i class="fa-solid fa-pen-to-square p-2 text-yellow-600"></i></label>
                            </p>
                            <p class="font-thin">Registro {{ user.register }} </p>
                            <p class="font-thin text-xs font-bold">ID: {{ user.index }} </p>
                        </th>
                        <td>
                            <div class="flex flex-col text-sm">
                                <p><i class="fa-solid fa-envelope"></i> {{ user.email }} <label
                                        @click="cogerDatos(user.email, `email`, `email`)" for="eliminaruser"><i
                                            class="fa-solid fa-pen-to-square p-2 text-yellow-600"></i></label></p>
                                <p><i class="fa-solid fa-mobile"></i> {{ user.number }} <label
                                        @click="cogerDatos(user.number, `numero`, `number`)" for="eliminaruser"><i
                                            class="fa-solid fa-pen-to-square p-2 text-yellow-600"></i></label></p>
                                <p class="font-bold"><i class="fa-regular fa-address-card"></i> {{ user.nie }} </p>
                            </div>
                        </td>
                        <td>
                            <select @change="changestate(user.state, user.index)" v-model="user.state"
                                class="select select-bordered w-full mb-2">
                                <option value="Lead">Lead</option>
                                <option value="Interesado">Interesado</option>
                                <option value="Cliente" selected>Cliente</option>
                                <option value="Contacto">Contacto</option>
                                <option value="Personal">Personal</option>
                            </select>
                        </td>
                        <td>
                            <button @click="bloquearUsuario(user.id)"
                                v-if="user.access === undefined || user.access === `accepted`" class="btn btn-sm btn-primary">Bloquear
                                <i class="fa-solid fa-lock ml-2"></i></button>
                            <button @click="aceptarUsuario(user.id)" v-if="user.access === `denied`"
                                class="btn btn-sm border-none bg-green-600">Desbloquear <i
                                    class="fa-solid fa-lock ml-2 "></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="data.length === 0" class="p-5">
                <p>Ningun usuario encontrado. 🤔</p>
            </div>
        </div>
    </div>
</template>

<script>
import  Toast  from "awesome-toast-component"
import { baseConnect, baseConnectPut, baseConnectSearch } from "../db/db"
import moment from 'moment'
import { nanoid, customAlphabet } from 'nanoid'
import { firebaseAutenticate } from "../db/signIn"

export default {
    data(){
        return{
            usersearch : "",
            indexUser : "",
            data : [],
            change : "",
            datoschange : {
                data : "",
                name : "",
                where : ""
            },
            allusers : null,
            numberUsers: 0,
            indexUser2 : "",
            initLimit : 0,
            limitPage : 10,
            page : 1,
            spinnerShow : true,

            registername : "",
            registernie : "",
            registeremail : "",
            registernumber : "",
            registerpass : "",
            registerpassrepeat : "",
            stateclient: "Cliente",

            linkJSON: "",
            arrayData : [],
            arrayOptions: ["none", "none", "none", "none"],
            aleatorynie: true
        }
    },
    methods:{
        async search(){
            this.spinnerShow = false
            try {
                new Toast("Buscando cliente. 🧐")
                let datos = await baseConnectSearch(`user`, "user", "nie", this.usersearch.toUpperCase())
                if(datos === null){
                    new Toast("Cliente no encontrado. 🧐")
                    this.spinnerShow = true
                }else{
                    this.spinnerShow = true
                    new Toast("Usuario encontrado. 🧐")
                    let datosDeff = Object.values(datos)
                    this.data = datosDeff
                    this.indexUser = datosDeff[0].index
                }
            } catch (error) {
                this.spinnerShow = true
                console.log(error)
                new Toast("Algún error ha sucedido. 🧐")
            }
        },
        async cogerDatos(data, name , where, index){
            this.datoschange.data = data
            this.datoschange.name = name
            this.datoschange.where = where
            this.indexUser2 = index
            console.log(index)
            
        },
        async cambiarDatos(){
            if(this.change === "" || this.change.length < 4){
                new Toast("Campo vacio y muy corto.")
            }else{
                try {
                    this.spinnerShow = false
                    if(this.indexUser2 === undefined){
                        new Toast("Cambiando datos.")
                        await baseConnectPut(`user/${this.indexUser}/${this.datoschange.where}`, this.change)
                        this.data = []
                        this.change = ""
                        new Toast("Datos cambiados.")
                        let datos = await baseConnect(`user`)
                        let datosArray = Object.values(datos)
                        this.allusers = datosArray
                        this.spinnerShow = true
                    }else{
                        new Toast("Cambiando datos.")
                        await baseConnectPut(`user/${this.indexUser2}/${this.datoschange.where}`, this.change)
                        this.data = []
                        this.change = ""
                        this.indexUser2 = undefined
                        new Toast("Datos cambiados.")
                        let datos = await baseConnect(`user`)
                        let datosArray = Object.values(datos)
                        this.allusers = datosArray
                        this.spinnerShow = true
                    }   
                } catch (error) {
                    console.log(error)
                    new Toast("Algún error ha sucedido.")
                    this.spinnerShow = true
                }
            }
        },
        async bloquearUsuario(index){
            this.indexUser2 = index
            if(this.indexUser2 !== undefined){
                new Toast("Bloqueando usuario.")
                await baseConnectPut(`user/${this.indexUser2}/access`, "denied")
                this.indexUser2 = undefined
                this.data = []
                this.change = ""
                let datos = await baseConnect(`user`)
                let datosArray = Object.values(datos)
                this.allusers = datosArray
                new Toast("Acceso bloqueado.")
            }else{
                await baseConnectPut(`user/${this.indexUser}/access`, "denied")
                this.data = []
                this.change = ""
                let datos = await baseConnect(`user`)
                this.allusers = datos
                new Toast("Acceso bloqueado.")
            }
        },
        async aceptarUsuario(index){
            this.spinnerShow = false
            this.indexUser2 = index
            try {
                if(this.indexUser2 !== undefined){
                    new Toast("Aceptando usuario.")
                    await baseConnectPut(`user/${this.indexUser2}/access`, "accepted")
                    this.indexUser2 = undefined
                    this.data = []
                    this.change = ""
                    let datos = await baseConnect(`user`)
                    let datosArray = Object.values(datos)
                    this.allusers = datosArray
                    new Toast("Acceso reestablecido.")
                    this.spinnerShow = true
                }else{
                    await baseConnectPut(`user/${this.indexUser}/access`, "accepted")
                    this.data = []
                    this.change = ""
                    let datos = await baseConnect(`user`)
                    let datosArray = Object.values(datos)
                    this.allusers = datosArray
                    new Toast("Acceso reestablecido.")
                    this.spinnerShow = true
                }
            } catch (error) {
                console.log(error)
                this.spinnerShow = true
                new Toast("Un error a ocurrido al acceder a la base de datos.")
            }
        
        },
        async crearusuario(){
            this.spinnerShow = false
            if(this.registernumber.length < 8 || this.registername === "" || this.registeremail.length < 6 || this.registerpass.length < 8 || this.registernie.length <= 8){
                new Toast("Porfavor, rellene los datos correctamente. 🤔")
                this.spinnerShow = true
            }else{
                if(this.registerpass === this.registerpassrepeat){
                    const id = nanoid()
                    let objeto = {
                        index : id,
                        register : moment().format('L'),
                        nie : this.registernie.toUpperCase(),
                        name : this.registername.toUpperCase(),
                        password : this.registerpass,
                        number : this.registernumber,
                        email : this.registeremail.toLowerCase(),
                        state: this.stateclient
                    }
                    const datos = await firebaseAutenticate("user", "email" , objeto)
                    if(datos === false){
                        new Toast("Error de registro, email existente o fallo de conexión.")
                        this.spinnerShow = true
                    }else{
                        let datos = await baseConnect(`user`)
                        let datosArray = Object.values(datos)
                        this.allusers = datosArray
                        new Toast("¡Registrado! 🥳")
                        this.spinnerShow = true
                    }
                }else{
                    new Toast("Las contraseñas no coinciden.")
                    this.spinnerShow = true
                }
            }
        },
        async changestate(state, index){
            this.spinnerShow = false
            await baseConnectPut(`user/${index}/state`, state)
            this.spinnerShow = true
        },
          txNombres(event) {
            if ((event.keyCode != 32) && (event.keyCode < 48) || (event.keyCode > 57) && (event.keyCode < 65) || (event.keyCode > 90) && (event.keyCode < 97) || (event.keyCode > 122))
                event.returnValue = false;
        },
        delantePagina(){
            this.initLimit = this.initLimit + 10
            this.limitPage = this.limitPage + 10
            this.page ++
        },
        atrasPagina(){
            if(this.initLimit !== 0){
                this.initLimit = this.initLimit - 10
                this.limitPage = this.limitPage - 10
                this.page --
            }
        },
        async uploadusers(){
            this.spinnerShow = false
            this.arrayOptions = ["none", "none", "none", "none"]
            await fetch(this.linkJSON)
                .then(data => {
                    return data.json()
                })
                .then(data => {
                    if(Array.isArray(data)){
                        this.arrayData = data
                        console.log(this.arrayData)
                    }else{
                        new Toast("Por favor, seleccione un archivo JSON que contenga un Array. ❌")
                    }
                })
                .catch(() => {
                    new Toast("Error de conexión.")
                })
            this.spinnerShow = true
        },
        takeOptions(e, i, index, data){
            let value = e.target.value
            let datos = i
            let object = {
                value: value,
                data: data,
                datos: datos
            }
            if(value === "email"){
                this.arrayOptions[0] = object
            }
            if(value === "name"){
                this.arrayOptions[1] = object
            }
            if(value === "nie"){
                this.arrayOptions[2] = object
            }
            if(value === "number"){
                this.arrayOptions[3] = object
            }
            console.log(object)
        },
        async chargeList(){
            let boolean1 = true
            let boolean2 = true
            let boolean3 = true
            let boolean4 = true

            this.arrayOptions.forEach(element => {
                if(element.value === "email"){
                    boolean1 = false
                }
                if(element.value === "name"){
                    boolean2 = false
                }
                if(element.value === "nie"){
                    boolean3 = false
                }
                if(element.value === "number"){
                    boolean4 = false
                }
            })

            if(boolean1 === false && boolean2 === false && boolean3 === false && boolean4 === false){
                    this.spinnerShow = false
                    this.arrayData.forEach(async (element,i) => {
                        if(i < 541){
                                                    const id = nanoid()
                        let nie = ""
                        let name = ""
                        let email = ""
                        const aleatory = customAlphabet("1234567890", 8)
                        const aleatory2 = customAlphabet("QWERTYUIOPÑLKJHGFDSA", 1)
                        let number = "6" + await aleatory()
                        this.arrayOptions.forEach(element1 => {
                            if(element1.value === "email"){
                                email = element[element1.datos]
                            }
                            if(element1.value === "name"){
                                name = element[element1.datos]
                            }
                            if(element1.value === "nie"){
                                nie = element[element1.datos]
                            }
                            /*
                            if(element.value === "number"){
                                number++
                            }
                            */
                            if(this.aleatorynie === true){
                                nie = aleatory() + aleatory2()
                            }
                        })
                        let objeto = {
                            index : id,
                            register : moment().format('L'),
                            nie : nie,
                            name : name,
                            password : id,
                            number : number,
                            email : email,
                            state: "Client"
                        }
                        const datos = await firebaseAutenticate("user", "email" , objeto)
                        if(datos === false){
                            new Toast("Error de registro, email existente o fallo de conexión.")
                        }else{
                            let datos = await baseConnect(`user`)
                            let datosArray = Object.values(datos)
                            this.allusers = datosArray
                        }
                        }
                    })
                    this.spinnerShow = true
            }else{
                new Toast("Por favor, seleccione un Nombre, Email, Telefono, y NIE. ❌")
            }
        }
    }
}
</script>