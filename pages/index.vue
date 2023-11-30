<template>
    <div class="h-screen">
        <FormsLoginComponent/>
    </div>
</template>

<script>
import { firebaseAutenticate, fireBaseSignIn } from "../db/signIn"
import { Preferences } from '@capacitor/preferences';
import moment from "moment"
import { useRouter } from "vue-router"
import { nanoid } from "nanoid"
import Toast from "awesome-toast-component"
export default {
    data(){
        return{
            passboolean : true,
            login : true,
            email : "",
            pass : "",
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
        register(){
            if(this.login === true){
                this.login = false
            }else{
                this.login = true
            }
        },
        passbool(){
            if(this.passboolean === true){
                this.passboolean = false
            }else{
                this.passboolean = true
            }
        },
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
        async loginDeff(e){
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
                        this.router.push("/initpage")
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