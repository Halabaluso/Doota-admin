<template >
    <form @submit.prevent = "insertarPdfDeff" class="m-5 rounded-lg bg-white">
        <p class="font-bold text-xl mt-10 text-primary"><Icon name = "dashicons:cloud-upload"/> Subir documentos para firmar</p>
        <div class="flex flex-col flex-1 m-1">
            <label class="mb-1 text-sm" for=""><Icon name = "dashicons:cloud"/> Subir archivo</label>
            <input @change="insertarPdf($event)" type="file" class="file-input file-input-bordered w-full "
                accept="application/pdf" />
        </div>
        <div class="w-full m-1 mt-4 flex flex-col md:flex-row">
            <div class="flex flex-col flex-1 m-1">
                <label class="mb-1 text-sm" for="">
                    <Icon name = "dashicons:id-alt"/> DNI/NIE/PASAPORTE</label>
                <input @keypress="txNombres($event)" v-model="nie" type="text" placeholder="34565778X"
                    class="input w-full input-bordered" />
            </div>
        </div>
        <div class="w-full m-1 mt-4">
            <label class="mb-1 text-sm" for=""><Icon name = "dashicons:welcome-view-site"></Icon> Observaciones</label>
            <textarea v-model="observations" class="textarea textarea-bordered w-full h-60"
                placeholder="Documento de acreditación para juzgado."></textarea>
        </div>
        <button type = "submit" class="btn btn-primary m-1">Enviar para firmar <Icon name = "dashicons:edit-page" class = "text-xl"/></button>
    </form>
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
            observations: "",
            datoFile: "",
            idFile: "",
            id: "",
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
        txNombres(event) {
            if ((event.keyCode != 32) && (event.keyCode < 48) || (event.keyCode > 57) && (event.keyCode < 65) || (event.keyCode > 90) && (event.keyCode < 97) || (event.keyCode > 122))
                event.returnValue = false;
        }
    }
}
</script>
<style lang="">
    
</style>