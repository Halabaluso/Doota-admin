<template>
    <div class="flex flex-col">
        <div class="m-5 text-gray-700 flex flex-row items-center">
            <div class="p-4 bg-primary rounded-lg text-white text-2xl mr-5">
                <Icon name="dashicons:admin-generic"></Icon>
            </div>
            <div>
                <p><span class="text-gray-400">Inicio</span> / Documentos</p>
                <p class="font-bold text-lg">Configuración doota</p>
            </div>
        </div>
    </div>
    <div class="m-5 rounded-lg shadow-lg bg-white text-gray-700 p-5">
        <p class="font-bold text-xl text-primary">
            <Icon name="dashicons:admin-users"></Icon> Datos de empresa
        </p>
        <div class="form-control my-2">
            <label class="label">
                <span class="label-text"> Logo empresa</span>
            </label>
            <label class="input-group">
                <span></span>
                <input v-model="logoDeff" type="url" :placeholder="logo" class="input input-bordered w-full" />
            </label>
            <div class="form-control my-2">
                <label class="label">
                    <span class="label-text"> Nombre empresa</span>
                </label>
                <label class="input-group">
                    <span></span>
                    <input v-model="nombreDeff" type="text" :placeholder="nombre" class="input input-bordered w-full" />
                </label>
            </div>
            <div class="form-control my-2">
                <label class="label">
                    <span class="label-text"> Dirección empresa</span>
                </label>
                <label class="input-group">
                    <span></span>
                    <input v-model="direccionDeff" type="text" :placeholder="direccion"
                        class="input input-bordered w-full" />
                </label>
            </div>
            <div class="form-control my-2">
                <label class="label">
                    <span class="label-text"> Teléfono de empresa</span>
                </label>
                <label class="input-group">
                    <span></span>
                    <input v-model="telefDeff" type="tel" :placeholder="telef" class="input input-bordered w-full" />
                </label>
            </div>
            <div class="form-control my-2">
                <label class="label">
                    <span class="label-text"> NIF/NIE</span>
                </label>
                <label class="input-group">
                    <span></span>
                    <input v-model="nieDeff" type="tel" :placeholder="telef" class="input input-bordered w-full" />
                </label>
            </div>
            <div class="form-control my-2">
                <label class="label">
                    <span class="label-text"> Email de empresa</span>
                </label>
                <label class="input-group">
                    <span></span>
                    <input v-model="emailDeff" type="email" :placeholder="email" class="input input-bordered w-full" />
                </label>
            </div>
            <div class="form-control my-2">
                <label class="label">
                    <span class="label-text"> Email de notificaciones</span>
                </label>
                <label class="input-group">
                    <span></span>
                    <input v-model="emailDeff2" type="email" :placeholder="email2" class="input input-bordered w-full" />
                </label>
            </div>
            <button @click="enviarDatos" class="btn w-max mt-6 bg-green-600 border-green-600">GUARDAR CAMBIOS</button>
        </div>
    </div>
</template>

<script>
import Toast from "awesome-toast-component"
import { baseConnect, baseConnectPut } from "../db/db"
export default {
    data() {
        return {
            datos: null,
            logo: "",
            nombre: "",
            direccion: "",
            telef: "",
            email2: "",
            nif: "",
            logoDeff: "",
            nombreDeff: "",
            direccionDeff: "",
            telefDeff: "",
            emailDeff: "",
            emailDeff2: "",
            nieDeff: "",
        }
    },
    async mounted() {
        this.datos = await baseConnect("empresa")
        if (this.datos !== null) {
            this.logo = this.datos.logo
            this.nombre = this.datos.nombre
            this.direccion = this.datos.direccion
            this.telef = this.datos.telef
            this.email = this.datos.email
            this.nif = this.datos.nif
            this.email2 = this.datos.email2
        }
    },
    methods: {
        async enviarDatos() {
            new Toast("Actualizando datos... 😊")
            if (this.logoDeff === "" || this.nombreDeff === "" || this.direccionDeff === "" || this.telefDeff === "" || this.emailDeff === "" || this.emailDeff2 === "" || this.nieDeff === "") {
                new Toast("❌ Rellene bien todos los datos.")
            } else {
                let objeto = {
                    logo: this.logoDeff,
                    nombre: this.nombreDeff,
                    direccion: this.direccionDeff,
                    telef: this.telefDeff,
                    email: this.emailDeff,
                    email2: this.emailDeff2
                }
                await baseConnectPut(`empresa`, objeto)
                new Toast("Datos actualizados. 😊")
            }

        }
    }
}
</script>

<style></style>