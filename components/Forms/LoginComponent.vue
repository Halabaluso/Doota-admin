
<template>
    <div class="flex flex-col justify-center items-center h-full animate__animated animate__fadeIn">
        <div class="text-gray-700 mb-10">
            <img src="../../img/logo.png" alt="" class="w-52">
        </div>
        
        <form @submit.prevent="loginDeff" class = "flex flex-col items-center">
            <p class="text-primary text-sm text-center mb-2"><Icon name="uil:user-circle" class = "text-2xl"/> Introducir cuenta Administrador</p>
            <div class="grid grid-rows-1 gap-2">
                <label  class="input-group">
                    <span></span>
                    <input v-model="email" type="text" placeholder="miemail@miemail.com" class="input input-bordered" />
                </label>
                <label class="input-group">
                    <span></span>
                    <input v-model="pass" type="password" placeholder="*********" class="input input-bordered" />
                </label>
                <button type="submit" class="btn btn-primary w-full">Entrar <Icon name="uil:arrow-circle-right" class = "text-2xl"/></button>
                <button type="button" @click="register" class="btn w-full  mt-2 hidden">Registrarse </button>
            </div>
        </form>
    </div>
</template>

<script>
import { fireBaseSignIn } from "../db/signIn"
import { Preferences } from '@capacitor/preferences';
import { useRouter } from "vue-router"
import Toast from "awesome-toast-component"
export default {
    data(){
        return{
            passboolean : true,
            login : true,
            email : "",
            pass : "",
            msg : "",
            router : useRouter()
        }
    },
    methods:{
        async loginDeff(){
            if(this.email.length < 4 || this.pass.length < 4){
                this.presentToast("Campos vacios o demasiado cortos. 😔")
            }else{
                this.presentToast("Verificando datos.")
                const datos = await fireBaseSignIn("users", "email", (this.email).toLowerCase(), this.pass)
                if(datos === false){
                    this.presentToast("Email no encontrado, contraseña erronea o error de conexión")
                }else{
                        this.presentToast("¡Entrando! 🥳")
                        await Preferences.set({
                            key: 'email',
                            value: `${datos.email.toLowerCase()}`
                        });
                        await Preferences.set({
                            key: 'nie',
                            value: `${datos.nie.toUpperCase()}`
                        });
                        await Preferences.set({
                            key: 'name',
                            value: `${datos.name}`
                        });
                        await Preferences.set({
                            key: 'phone',
                            value: `${datos.number}`
                        });
                        await Preferences.set({
                            key: 'index',
                            value: `${datos.index}`
                        });
                        await Preferences.set({
                            key: 'clientdata',
                            value: `${JSON.stringify(datos)}`
                        });
                        this.router.push("/documents")
                }
            }
        },
        async presentToast(msg) {
            new Toast(msg)
        },
        txNombres(event) {
            if ((event.keyCode != 32) && (event.keyCode < 48) || (event.keyCode > 57) && (event.keyCode < 65) || (event.keyCode > 90) && (event.keyCode < 97) || (event.keyCode > 122))
                event.returnValue = false;
        },
        goBack(){
            this.router.push("/pass")
        }
    }
}
</script>

<style></style>