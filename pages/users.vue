<template>
    <div>
        <div :class="{ hidden: spinnerShow }" class="flex flex-col items-center justify-center h-screen">
            <CirclesToRhombusesSpinner :animation-duration="1000" :size="60" color="#ff1d5e" />
        </div>
        <div :class="{ hidden: !spinnerShow }">
            <div class="m-5 text-gray-700 flex flex-row items-center">
                <div class="p-4 bg-primary rounded-lg text-white text-2xl mr-5">
                    <Icon name="dashicons:admin-users"></Icon>
                </div>
                <div>
                    <p><span class="text-gray-400">Inicio</span> / Documentos</p>
                    <p class="font-bold text-lg">Nuevos usuarios</p>
                </div>
            </div>
            <div role="tablist" class="tabs tabs-boxed m-4">
                <NuxtLink to="/users" role="tab" class="tab tab-active">Nuevos usuarios</NuxtLink>
                <NuxtLink to="/allusers" role="tab" class="tab">Todos los usuarios</NuxtLink>
                <NuxtLink to="/searchusers" role="tab" class="tab">Buscar usuarios</NuxtLink>
            </div>
            <div class="m-5 flex">
                <label for="createuser" class="btn btn-primary m-1"><Icon name = "dashicons:businessperson"/> Nuevo
                    usuario</label>
                <label for="uploadusers" class="btn btn-secondary m-1"><Icon name = "dashicons:buddicons-buddypress-logo"/> Cargar clientes</label>
            </div>
            <!--Modals-->
            <!-- Put this part before </body> tag -->
            <input type="checkbox" id="eliminaruser" class="modal-toggle" />
            <div class="modal">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Cambiar {{ datoschange.name }} </h3>
                    <div class="py-4">
                        <label class="label">
                            <span class="label-text">Escribir nuevo {{ datoschange.name }}</span>
                        </label>
                        <input v-model="change" type="text" :placeholder="datoschange.data"
                            class="input input-bordered w-full max-w-xs" />
                    </div>
                    <div class="modal-action">
                        <label @click="cambiarDatos" for="eliminaruser" class="btn bg-green-600 border-none">Guardar</label>
                        <label for="eliminaruser" class="btn">atrás</label>
                    </div>
                </div>
            </div>
            <!-- Put this part before </body> tag -->
            <input type="checkbox" id="createuser" class="modal-toggle" />
            <div class="modal">
                <div class="modal-box">
                    <h3 class="font-bold text-lg"> Añadir nuevo cliente</h3>
                    <div class="py-4">
                        <div>
                            <p class="text-sm italic mb-1"> Nombre usuario</p>
                            <label class="input-group mb-2 w-full">
                                <span></span>
                                <input v-model="registername" type="text" placeholder="Daniel Lorenzo Giménez"
                                    class="input input-bordered w-full" />
                            </label>
                            <p class="text-sm italic mb-1"> Correo electrónico</p>
                            <label class="input-group mb-2">
                                <span></span>
                                <input v-model="registeremail" type="text" placeholder="miemail@miemail.com"
                                    class="input input-bordered w-full" />
                            </label>
                            <p class="text-sm italic mb-1"> Estado cliente</p>
                            <select v-model="stateclient" class="select select-bordered w-full w-full mb-2">
                                <option value="Lead">Lead</option>
                                <option value="Interesado">Interesado</option>
                                <option value="Cliente" selected>Cliente</option>
                                <option value="Contacto">Contacto</option>
                                <option value="Personal">Personal</option>
                            </select>
                            <p class="text-sm italic mb-1"> DNI</p>
                            <label class="input-group mb-2">
                                <span></span>
                                <input @keypress="txNombres($event)" v-model="registernie" type="text"
                                    placeholder="Dni o pasaporte" class="input input-bordered w-full" />
                            </label>
                            <p class="text-sm italic mb-1"> Número de teléfono</p>
                            <label class="input-group mb-2">
                                <span></span>
                                <input v-model="registernumber" type="text" placeholder="675890712"
                                    class="input input-bordered w-full" />
                            </label>
                            <p class="text-sm italic mb-1"> Contraseña</p>
                            <label class="input-group mb-2">
                                <span></span>
                                <input v-model="registerpass" type="password" placeholder="Contraseña"
                                    class="input input-bordered w-full" />
                            </label>
                            <p class="text-sm italic mb-1"> Contraseña</p>
                            <label class="input-group mb-2">
                                <span></span>
                                <input v-model="registerpassrepeat" type="password" placeholder="Repetir contraseña"
                                    class="input input-bordered w-full" />
                            </label>
                        </div>
                    </div>
                    <div class="modal-action">
                        <label @click="crearusuario" for="createuser" class="btn bg-green-600 border-none">Crear nuevo
                            cliente</label>
                        <label for="createuser" class="btn">atrás</label>
                    </div>
                </div>
            </div>
            <!-- Put this part before </body> tag -->
            <input type="checkbox" id="uploadusers" class="modal-toggle" />
            <div class="modal">
                <div class="modal-box w-11/12 max-w-5xl">
                    <h3 class="font-bold text-lg"> Nuevos clientes</h3>
                    <div class="py-4">
                        <div>
                            <p class="text-sm italic mb-1"> Link archivo JSON</p>
                            <label class="input-group mb-2 w-full">
                                <span></span>
                                <input v-model="linkJSON" type="text" placeholder="Link archivo JSON"
                                    class="input input-bordered w-full" />
                            </label>
                        </div>
                        <div v-if="arrayData.length > 0">
                            <p>Clientes totales a cargar <span
                                    class="p-1 rounded-lg shadow bg-primary text-white">{{ arrayData.length }}</span></p>
                            <div class="overflow-x-auto mt-5">
                                <p>Seleccione los datos</p>
                                <div class="form-control max-w-xs">
                                    <label class="label cursor-pointer">
                                        <span class="label-text">Identificación aleatoria (NIE)</span>
                                        <input v-model="aleatorynie" type="checkbox" checked="checked" class="checkbox" />
                                    </label>
                                </div>
                                <table class="table w-full">
                                    <!-- head -->
                                    <thead>

                                        <tr>
                                            <th>Dato</th>
                                            <th>Contenido</th>
                                            <th>Seleccion</th>
                                        </tr>
                                        <!--
                                  <tr v-for="(data,i) in arrayData" :key="data">
                                      <template v-if="i === 0" >
                                          <th v-for="datos,index in data" :key="datos">{{index}}</th>
                                      </template>
                                  </tr>
                                  -->
                                    </thead>
                                    <tbody>
                                        <template v-for="(data, i) in arrayData" :key="data">
                                            <template v-if="i === 1">
                                                <tr v-for="datos, index, i in data" :key="datos">
                                                    <th>{{ index }}</th>
                                                    <td>{{ datos }}</td>
                                                    <td>
                                                        <select @change="takeOptions($event, index, i, datos)"
                                                            class="select select-bordered w-full w-max">
                                                            <option selected>Nada</option>
                                                            <option value="email">Email</option>
                                                            <option value="name">Nombre</option>
                                                            <option value="nie">NIE</option>
                                                            <option value="number">Telef</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            </template>
                                        </template>
                                        <!-- row 1
                                  <tr v-for="(data,i) in arrayData" :key="data">
                                      <template v-if="i === 0">
                                          <th v-for="(datos) in data" :key="datos">{{datos}}</th>
                                      </template>
                                  </tr>
                                  -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-action">
                        <label v-if="arrayData.length === 0" @click="uploadusers" for=""
                            class="btn bg-green-600 border-none"><i class="fa-solid fa-upload mr-2"></i> Cargar
                            clientes</label>
                        <label v-if="arrayData.length > 0" @click="chargeList" for=""
                            class="btn bg-green-600 border-none"><i class="fa-solid fa-upload mr-2"></i> Subir
                            clientes</label>
                        <label for="uploadusers" class="btn">atrás</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { CirclesToRhombusesSpinner } from "epic-spinners"
import Toast from "awesome-toast-component"
import { baseConnect, baseConnectPut, baseConnectSearch } from "../db/db"
import moment from 'moment'
import { nanoid, customAlphabet } from 'nanoid'
import { firebaseAutenticate } from "../db/signIn"

export default {
    data() {
        return {
            usersearch: "",
            indexUser: "",
            data: [],
            change: "",
            datoschange: {
                data: "",
                name: "",
                where: ""
            },
            allusers: null,
            numberUsers: 0,
            indexUser2: "",
            initLimit: 0,
            limitPage: 10,
            page: 1,
            spinnerShow: true,

            registername: "",
            registernie: "",
            registeremail: "",
            registernumber: "",
            registerpass: "",
            registerpassrepeat: "",
            stateclient: "Cliente",

            linkJSON: "",
            arrayData: [],
            arrayOptions: ["none", "none", "none", "none"],
            aleatorynie: true
        }
    },
    components: {
        CirclesToRhombusesSpinner
    },
    methods: {
        async search() {
            this.spinnerShow = false
            try {
                new Toast("Buscando cliente. 🧐")
                let datos = await baseConnectSearch(`user`, "user", "nie", this.usersearch.toUpperCase())
                if (datos === null) {
                    new Toast("Cliente no encontrado. 🧐")
                    this.spinnerShow = true
                } else {
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
        async cogerDatos(data, name, where, index) {
            this.datoschange.data = data
            this.datoschange.name = name
            this.datoschange.where = where
            this.indexUser2 = index
            console.log(index)

        },
        async cambiarDatos() {
            if (this.change === "" || this.change.length < 4) {
                new Toast("Campo vacio y muy corto.")
            } else {
                try {
                    this.spinnerShow = false
                    if (this.indexUser2 === undefined) {
                        new Toast("Cambiando datos.")
                        await baseConnectPut(`user/${this.indexUser}/${this.datoschange.where}`, this.change)
                        this.data = []
                        this.change = ""
                        new Toast("Datos cambiados.")
                        let datos = await baseConnect(`user`)
                        let datosArray = Object.values(datos)
                        this.allusers = datosArray
                        this.spinnerShow = true
                    } else {
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
        async bloquearUsuario(index) {
            this.indexUser2 = index
            if (this.indexUser2 !== undefined) {
                new Toast("Bloqueando usuario.")
                await baseConnectPut(`user/${this.indexUser2}/access`, "denied")
                this.indexUser2 = undefined
                this.data = []
                this.change = ""
                let datos = await baseConnect(`user`)
                let datosArray = Object.values(datos)
                this.allusers = datosArray
                new Toast("Acceso bloqueado.")
            } else {
                await baseConnectPut(`user/${this.indexUser}/access`, "denied")
                this.data = []
                this.change = ""
                let datos = await baseConnect(`user`)
                this.allusers = datos
                new Toast("Acceso bloqueado.")
            }
        },
        async aceptarUsuario(index) {
            this.spinnerShow = false
            this.indexUser2 = index
            try {
                if (this.indexUser2 !== undefined) {
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
                } else {
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
        async crearusuario() {
            this.spinnerShow = false
            if (this.registernumber.length < 8 || this.registername === "" || this.registeremail.length < 6 || this.registerpass.length < 8 || this.registernie.length <= 8) {
                new Toast("Porfavor, rellene los datos correctamente. 🤔")
                this.spinnerShow = true
            } else {
                if (this.registerpass === this.registerpassrepeat) {
                    const id = nanoid()
                    let objeto = {
                        index: id,
                        register: moment().format('L'),
                        nie: this.registernie.toUpperCase(),
                        name: this.registername.toUpperCase(),
                        password: this.registerpass,
                        number: this.registernumber,
                        email: this.registeremail.toLowerCase(),
                        state: this.stateclient
                    }
                    const datos = await firebaseAutenticate("user", "email", objeto)
                    if (datos === false) {
                        new Toast("Error de registro, email existente o fallo de conexión.")
                        this.spinnerShow = true
                    } else {
                        let datos = await baseConnect(`user`)
                        let datosArray = Object.values(datos)
                        this.allusers = datosArray
                        new Toast("¡Registrado! 🥳")
                        this.spinnerShow = true
                    }
                } else {
                    new Toast("Las contraseñas no coinciden.")
                    this.spinnerShow = true
                }
            }
        },
        async changestate(state, index) {
            this.spinnerShow = false
            await baseConnectPut(`user/${index}/state`, state)
            this.spinnerShow = true
        },
        txNombres(event) {
            if ((event.keyCode != 32) && (event.keyCode < 48) || (event.keyCode > 57) && (event.keyCode < 65) || (event.keyCode > 90) && (event.keyCode < 97) || (event.keyCode > 122))
                event.returnValue = false;
        },
        delantePagina() {
            this.initLimit = this.initLimit + 10
            this.limitPage = this.limitPage + 10
            this.page++
        },
        atrasPagina() {
            if (this.initLimit !== 0) {
                this.initLimit = this.initLimit - 10
                this.limitPage = this.limitPage - 10
                this.page--
            }
        },
        async uploadusers() {
            this.spinnerShow = false
            this.arrayOptions = ["none", "none", "none", "none"]
            await fetch(this.linkJSON)
                .then(data => {
                    return data.json()
                })
                .then(data => {
                    if (Array.isArray(data)) {
                        this.arrayData = data
                        console.log(this.arrayData)
                    } else {
                        new Toast("Por favor, seleccione un archivo JSON que contenga un Array. ❌")
                    }
                })
                .catch(() => {
                    new Toast("Error de conexión.")
                })
            this.spinnerShow = true
        },
        takeOptions(e, i, index, data) {
            let value = e.target.value
            let datos = i
            let object = {
                value: value,
                data: data,
                datos: datos
            }
            if (value === "email") {
                this.arrayOptions[0] = object
            }
            if (value === "name") {
                this.arrayOptions[1] = object
            }
            if (value === "nie") {
                this.arrayOptions[2] = object
            }
            if (value === "number") {
                this.arrayOptions[3] = object
            }
            console.log(object)
        },
        async chargeList() {
            let boolean1 = true
            let boolean2 = true
            let boolean3 = true
            let boolean4 = true

            this.arrayOptions.forEach(element => {
                if (element.value === "email") {
                    boolean1 = false
                }
                if (element.value === "name") {
                    boolean2 = false
                }
                if (element.value === "nie") {
                    boolean3 = false
                }
                if (element.value === "number") {
                    boolean4 = false
                }
            })

            if (boolean1 === false && boolean2 === false && boolean3 === false && boolean4 === false) {
                this.spinnerShow = false
                this.arrayData.forEach(async (element, i) => {
                    if (i < 541) {
                        const id = nanoid()
                        let nie = ""
                        let name = ""
                        let email = ""
                        const aleatory = customAlphabet("1234567890", 8)
                        const aleatory2 = customAlphabet("QWERTYUIOPÑLKJHGFDSA", 1)
                        let number = "6" + await aleatory()
                        this.arrayOptions.forEach(element1 => {
                            if (element1.value === "email") {
                                email = element[element1.datos]
                            }
                            if (element1.value === "name") {
                                name = element[element1.datos]
                            }
                            if (element1.value === "nie") {
                                nie = element[element1.datos]
                            }
                            /*
                            if(element.value === "number"){
                                number++
                            }
                            */
                            if (this.aleatorynie === true) {
                                nie = aleatory() + aleatory2()
                            }
                        })
                        let objeto = {
                            index: id,
                            register: moment().format('L'),
                            nie: nie,
                            name: name,
                            password: id,
                            number: number,
                            email: email,
                            state: "Client"
                        }
                        const datos = await firebaseAutenticate("user", "email", objeto)
                        if (datos === false) {
                            new Toast("Error de registro, email existente o fallo de conexión.")
                        } else {
                            let datos = await baseConnect(`user`)
                            let datosArray = Object.values(datos)
                            this.allusers = datosArray
                        }
                    }
                })
                this.spinnerShow = true
            } else {
                new Toast("Por favor, seleccione un Nombre, Email, Telefono, y NIE. ❌")
            }
        }
    }
}
</script>
  
<style></style>