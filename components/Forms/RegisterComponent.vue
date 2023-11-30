<template>
    <div  class="flex flex-col my-10 items-center h-full animate__animated animate__fadeIn">
        <div class="text-gray-700 mb-10">
            <img src="../img/logo.png" alt="" class="w-52">
        </div>
        <form  @submit.prevent="registerDeff">
            <p class="text-green-600 text-sm text-center mb-2">¡Empecemos!</p>
            <div>
                <label class="input-group mb-2">
                    <span></span>
                    <input v-model = "registername" type="text" placeholder="Daniel Lorenzo Giménez" class="input input-bordered" />
                </label>
                <label class="input-group mb-2">
                    <span></span>
                    <input v-model="registeremail" type="text" placeholder="miemail@miemail.com" class="input input-bordered" />
                </label>
                <label class="input-group mb-2">
                    <span></span>
                    <input @keypress="txNombres($event)" v-model="registernie" type="text" placeholder="Dni o pasaporte" class="input input-bordered" />
                </label>
                <label class="input-group mb-2">
                    <span></span>
                    <input v-model="registernumber" type="text" placeholder="675890712" class="input input-bordered" />
                </label>
                <label class="input-group mb-2">
                    <span></span>
                    <input v-model="registerpass" type="password" placeholder="Contraseña" class="input input-bordered" />
                </label>
                <label class="input-group mb-2">
                    <span></span>
                    <input v-model="registerpassrepeat" type="password" placeholder="Repetir contraseña" class="input input-bordered" />
                </label>
            </div>
            <button type = "submit" class="btn w-full bg-gradient-to-tr from-green-500 to-green-700 mt-10 border-none">Registrarse </button>
        </form>
    </div>
</template>
<script>
import { firebaseAutenticate} from "../db/signIn"
import { Preferences } from '@capacitor/preferences';
import moment from "moment"
import { useRouter } from "vue-router"
import { nanoid } from "nanoid"
import Toast from "awesome-toast-component"
export default {
    data(){
        return{
            registername : "",
            registernie : "",
            registeremail : "",
            registernumber : "",
            registerpass : "",
            registerpassrepeat : "",
            msg : "",
            router : useRouter()
        }
    },
    methods:{
        async registerDeff(){
            if(this.registernumber.length < 8 || this.registername === "" || this.registeremail.length < 6 || this.registerpass.length < 8 || this.registernie.length <= 8){
                this.presentToast("Porfavor, rellene los datos correctamente. 🤔")
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
                        email : this.registeremail.toLowerCase()
                    }
                    const datos = await firebaseAutenticate("users", "email" , objeto)
                    if(datos === false){
                        this.presentToast("Error de registro, email existente o fallo de conexión.")
                    }else{
                        this.presentToast("¡Registrado! 🥳")
                        await Preferences.set({
                            key: 'email',
                            value: `${this.registeremail.toLowerCase()}`
                        });
                        await Preferences.set({
                            key: 'nie',
                            value: `${this.registernie.toUpperCase()}`
                        });
                        await Preferences.set({
                            key: 'name',
                            value: `${this.registername}`
                        });
                        await Preferences.set({
                            key: 'phone',
                            value: `${this.registernumber}`
                        });
                        await Preferences.set({
                            key: 'index',
                            value: `${id}`
                        });
                        this.router.push("/initpage")
                    }
                }else{
                    this.presentToast("Las contraseñas no coinciden.")
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
<style>
    
</style>