<template>
    <div class="m-5 bg-white rounded-lg border-b border-primary">
        <p class="font-bold text-xl mt-10 text-primary"><Icon name = "dashicons:id" ></Icon> Buscar documentos por DNI</p>
        <form @submit.prevent="cargarDni" class="input-group my-5 flex flex-row items-center">
            <input @keypress="txNombres($event)" v-model="dni" type="text" placeholder="24153786B"
                class="input input-bordered" />
            <button type="submit" class="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </form>
        <div class="overflow-x-auto">
            <table class="table w-full">
                <!-- head -->
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>PARA</th>
                        <th>FECHA</th>
                        <th>OPCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- row 1 -->
                    <tr class="text-sm" v-for="documentos in dniList" :key="nielist">
                        <th> <Icon name = "dashicons:index-card"></Icon> {{ documentos.id }} </th>
                                <td> <Icon name = "dashicons:id" ></Icon> {{ documentos.nie }}</td>
                                <td>
                                    <p> <Icon name = "dashicons:calendar-alt"></Icon> {{ documentos.today }}</p>
                                    <p> <Icon name = "dashicons:calendar-alt"></Icon> {{ documentos.hours }}</p>
                                </td>
                                <td>
                                    <a :href="documentos.link" target=”_blank”
                                        class="btn btn-primary mr-2"><Icon name = "dashicons:welcome-view-site"></Icon>Ver</a>
                                </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { CirclesToRhombusesSpinner } from "epic-spinners"
import Toast from "awesome-toast-component"
import moment from "moment"
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { baseConnect, baseConnectDelete } from "../db/db"
export default {
    components: {
        Datepicker, CirclesToRhombusesSpinner
    },
    data() {
        return {
            booleanData: true,
            data: [],
            date: "",
            dateGoodFormat: "",
            dateGoodFormat2: "",
            dniList: "",
            dni: "",
            spinnerShow: true,
        }
    },
    methods: {
        async borrarDocumento(index, fecha, dni, id) {
            try {
                console.log(id)
                new Toast("Borrando documento, espere.")
                this.spinnerShow = false
                await baseConnectDelete(`historial/${fecha.substr(0, 2)}-${fecha.substr(3, 2)}-${fecha.substr(6, 4)}/${index}`)
                await baseConnectDelete(`files/${dni}/${index}`)
                await this.recargarDatos()
                this.spinnerShow = true
                new Toast("Documento borrado. 🥳")
            } catch (error) {
                new Toast("Algo ha sucedido al borrar el documento.")
                console.log(error)
                this.spinnerShow = true
            }
        },
        async cargarDni() {
            this.spinnerShow = false
            if (this.dni === "" || this.dni.length < 7) {
                new Toast("Dni vacio o demasiado corto")
                this.spinnerShow = true
            } else {
                try {
                    new Toast("Buscando")
                    let datos = await baseConnect(`files/${(this.dni).toUpperCase()}`)
                    if (datos === null) {
                        new Toast("Ningún documento encontrado. 🥴")
                        this.spinnerShow = true
                    } else {
                        new Toast("Documentos encontrados. 🤓")
                        this.dniList = datos
                        this.spinnerShow = true
                    }
                } catch (error) {
                    this.spinnerShow = true
                    console.log(error)
                    new Toast("Algo ha sucedido al cargar los documentos por DNI, posible error de conexión. 🤓")
                }
            }
        },
        async recargarDatos() {
            this.booleanData = false
            this.data = []
            let start = moment().subtract(7, 'days').format('L')
            let i = 0
            for (i = 0; i <= 7; i++) {
                let dia = moment(start).add(i, 'days').format('L')
                let datos = await baseConnect(`historial/${dia.substr(0, 2)}-${dia.substr(3, 2)}-${dia.substr(6, 4)}`)
                if (datos !== null) {
                    this.data.push(datos)
                }
            }
        },
        txNombres(event) {
            if ((event.keyCode != 32) && (event.keyCode < 48) || (event.keyCode > 57) && (event.keyCode < 65) || (event.keyCode > 90) && (event.keyCode < 97) || (event.keyCode > 122))
                event.returnValue = false;
        }
    },
}
</script>