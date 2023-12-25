<template >
    <form @submit.prevent="insertarPdfDeff" class="m-5 rounded-lg bg-white p-5 shadow-lg">
        <p class="font-bold text-xl text-primary">
            <Icon name="dashicons:cloud-upload" /> Subir documentos para firmar
        </p>
        <div class="flex flex-col flex-1 m-1">
            <label class="mb-1 text-sm" for="">
                <Icon name="dashicons:cloud" /> Subir archivo
            </label>
            <input @change="insertarPdf($event)" type="file" class="file-input file-input-bordered w-full "
                accept="application/pdf" />
            <div v-if="arrayfiles.length > 0">
                <p class="my-1">Documentos seleccionados:</p>
                <div v-for="(files, i) in arrayfiles">
                    <p class="grid grid-cols-2 max-w-lg font-bold items-center mb-1">
                    <p>
                        <Icon name="material-symbols:drive-file-move-outline-sharp"></Icon> {{ i + 1 }} {{ files.name }}
                    </p>
                    <button @click="deleteArrayDocument(i)" type="button" class="btn btn-sm btn-error w-max">
                        <Icon name="material-symbols:delete-sweep"></Icon>
                    </button>
                    </p>
                </div>
            </div>
        </div>
        <div class="w-full m-1 mt-4 flex flex-col md:flex-row">
            <div class="flex flex-col flex-1 m-1">
                <label class="mb-1 text-sm" for="">
                    <Icon name="dashicons:id-alt" /> DNI/NIE/PASAPORTE
                </label>
                <input @keypress="txNombres($event)" v-model="nie" type="text" placeholder="34565778X"
                    class="input w-full input-bordered" />
            </div>
        </div>
        <div class="w-full m-1 mt-4">
            <label class="mb-1 text-sm" for="">
                <Icon name="dashicons:welcome-view-site"></Icon> Observaciones
            </label>
            <textarea v-model="observations" class="textarea textarea-bordered w-full h-60"
                placeholder="Documento de acreditación para juzgado."></textarea>
        </div>
        <button type="submit" class="btn btn-primary m-1">Enviar para firmar
            <Icon name="dashicons:edit-page" class="text-xl" />
        </button>
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
            arrayfiles: [],
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
        async agregarDato(element) {
            const fileDeff = element
            this.id = Date.now()
            this.idFile = `${fileDeff.name}-${this.id}`
            await storageRef.child(`${this.nie.toUpperCase()}/firmas`).child(`${fileDeff.name}-${this.id}`).put(fileDeff)
            const urlDescarga = await storageRef.child(`${this.nie.toUpperCase()}/firmas`).child(`${fileDeff.name}-${this.id}`).getDownloadURL()
            new Toast("Archivo cargado con éxito. 😊")
            return urlDescarga
        },
        async insertarPdfDeff() {
            if (this.arrayfiles.length === 0 || this.nie === "" || this.nie.length < 5) {
                new Toast("Rellene todos los campos. 🥴")
            } else {
                try {
                    this.spinnerShow = false
                    new Toast("Enviando documentos, espere... ⏳")
                    this.arrayfiles.forEach(async element => {
                        let link = await this.agregarDato(element)
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
                        new Toast("Documento enviado y listo para firmar. 😄")
                    })
                    this.spinnerShow = true
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
                this.arrayfiles.push(event.target.files[0])
                new Toast("Documento insertado correctamente")
            }
        },
        deleteArrayDocument(index) {
            let newArray = []
            this.arrayfiles.forEach((element, i) => {
                if (index !== i) {
                    newArray.push(element)
                }
            })
            this.arrayfiles = newArray
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