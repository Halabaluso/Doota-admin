<template>
    <div>
        <div>
            <div class="m-5 text-gray-700 flex flex-row items-center">
                <div class="p-4 bg-primary rounded-lg text-white text-2xl mr-5">
                    <Icon name="dashicons:book-alt"></Icon>
                </div>
                <div>
                    <p><span class="text-gray-400">Inicio</span> / Documentos</p>
                    <p class="font-bold text-lg">Firmar documentos</p>
                </div>
            </div>
            <div role="tablist" class="tabs tabs-boxed m-4">
                <NuxtLink to="/documents" role="tab" class="tab">Enviar</NuxtLink>
                <NuxtLink to="/searchdocuments" role="tab" class="tab">Buscar</NuxtLink>
                <NuxtLink to="/singdocuments" role="tab" class="tab tab-active">Firmar</NuxtLink>
                <NuxtLink to="/searchsigndocuments" role="tab" class="tab">Buscar</NuxtLink>
            </div>
            <FormsSignComponent/>
        </div>
    </div>
</template>
  
<script>
import moment from "moment"
import Toast from "awesome-toast-component"
import { storageRef } from "../plugins/firebase.client";
import { baseConnectPut, baseConnect } from '@/db/db';
//import { baseConnectPost } from "../db/db"
export default {
    data() {
        return {
            file: "",
            nie: "",
            nieSearch: "",
            observations: "",
            datoFile: "",
            idFile: "",
            id: "",
            searchFiles: [],
            spinnerShow: true,
        }
    },
    methods: {
        async agregarDato() {
            this.id = Date.now()
            this.idFile = `${this.file.name}-${this.id}`
            await storageRef.child(`${this.nie.toUpperCase()}/firmas`).child(`${this.file.name}-${this.id}`).put(this.file)
            const urlDescarga = await storageRef.child(`${this.nie.toUpperCase()}/firmas`).child(`${this.file.name}-${this.id}`).getDownloadURL()
            new Toast("Archivo cargado con éxito. 😊")
            return urlDescarga
        },
        async insertarPdfDeff() {
            if (this.file === "" || this.nie === "" || this.nie.length < 5) {
                new Toast("Rellene todos los campos. 🥴")
            } else {
                try {
                    this.spinnerShow = false
                    new Toast("Enviando documentos, espere... ⏳")
                    let link = await this.agregarDato()
                    let objeto = {
                        id: this.id,
                        fecha: moment().format("DD-MM-YYYY"),
                        link: link,
                        nie: this.nie.toUpperCase(),
                        observations: this.observations,
                        sign: false,
                        idFile: this.idFile
                    }
                    await baseConnectPut(`sign/${this.nie.toUpperCase()}/${this.id}`, objeto)
                    await baseConnectPut(`sign/historial/${moment().format("MM-YYYY")}/${this.id}`, objeto)
                    this.spinnerShow = true
                    new Toast("Documento listo para firmar. 😄")
                } catch (error) {
                    console.log(error)
                    this.spinnerShow = true
                    new Toast("Algo ha sucedido, posible error de conexión.")
                }
            }
        },
        async insertarPdf(event) {
            this.file = event.target.files[0]
            const reader = new FileReader();
            reader.readAsDataURL(this.file);
            reader.onload = (e) => {
                this.datoFile = e.target.result
                new Toast("Documento insertado correctamente")
            }
        },
        async buscarDni() {
            if (this.nieSearch === "" || this.nieSearch.length < 5) {
                new Toast("DNI vacio o demasiado corto. 😕")
            } else {
                this.spinnerShow = false
                try {
                    let datos = await baseConnect(`sign/${this.nieSearch.toUpperCase()}`)
                    if (datos !== null) {
                        new Toast("Documentos encontrados. 😋")
                        this.searchFiles = datos
                        this.spinnerShow = true
                    } else {
                        new Toast("Ningún documento encontrado. 😕")
                        this.spinnerShow = true
                    }
                } catch (error) {
                    console.log(error)
                    new Toast("Algo sucedió al llamar al servidor. 😕")
                    this.spinnerShow = true
                }
            }
        },
        txNombres(event) {
            if ((event.keyCode != 32) && (event.keyCode < 48) || (event.keyCode > 57) && (event.keyCode < 65) || (event.keyCode > 90) && (event.keyCode < 97) || (event.keyCode > 122))
                event.returnValue = false;
        }
    }
}
</script>
  
<style></style>