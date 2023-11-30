<template>
    <div class="m-5 bg-white rounded-lg border-b border-primary">
        <div>
            <p class="font-bold text-xl mt-10 text-primary"><Icon name = "dashicons:id" ></Icon> Buscar documentos por fecha</p>
            <div class="my-5 text-gray-700">
                <label class="text-sm italic font-bold" for=""><Icon name = "dashicons:calendar-alt"/> Fecha subida</label>
                <p class="text-xs italic text-primary mb-2">Desde {{ dateGoodFormat }} hasta {{ dateGoodFormat2 }}
                </p>
                <div class = "max-w-xs text-black">
                    <Datepicker placeholder="Elegir fecha" v-model="date" weekPicker
                    @update:modelValue="cargarFecha"></Datepicker>
                </div>
            </div>
            <div class="overflow-x-auto">
                <div v-for="(fechas, index) in data" :key="fechas">
                    <table class="table table-zebra w-full my-5 ">
                        <!-- head -->
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Datos</th>
                                <th>Fecha</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- row 1 -->
                            <tr v-for="(documentos, index1, i) in data[index]" :key="documentos" class="text-sm">
                                <th> <Icon name = "dashicons:index-card"></Icon> {{ documentos.id }} </th>
                                <td> <Icon name = "dashicons:id" ></Icon> {{ documentos.nie }}</td>
                                <td>
                                    <p> <Icon name = "dashicons:calendar-alt"></Icon> {{ documentos.today }}</p>
                                    <p> <Icon name = "dashicons:calendar-alt"></Icon> {{ documentos.hours }}</p>
                                </td>
                                <td>
                                    <a :href="documentos.link" target=”_blank”
                                        class="btn btn-primary mr-2"><Icon name = "dashicons:welcome-view-site"></Icon>Ver</a>
                                    <button
                                        @click="borrarDocumento(index1, documentos.today, documentos.nie, documentos.id)"
                                        class="btn btn-error"><Icon name = "dashicons:trash"></Icon>Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div v-if="booleanData === true"
            class="p-2 pr-4 pl-4 mt-4 rounded-lg shadow-lg bg-yellow-100 text-yellow-700 w-max italic">
            <p>Nada que mostrar, seleccione una fecha.</p>
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
            spinnerShow: true,
        }
    },
    methods: {
        async cargarFecha() {
            try {
                new Toast("Cargando documentos... ⏳")
                this.spinnerShow = false
                this.booleanData = false
                this.data = []
                let start = this.date[0]
                this.dateGoodFormat = moment(this.date[0]).format("DD/MM/YYYY")
                this.dateGoodFormat2 = moment(this.date[1]).format("DD/MM/YYYY")
                let i = 0
                for (i = 0; i < 7; i++) {
                    let dia = moment(start).add(i, 'days').format('L')
                    let datos = await baseConnect(`historial/${dia.substr(0, 2)}-${dia.substr(3, 2)}-${dia.substr(6, 4)}`)
                    if (datos !== null) {
                        this.data.push(datos)
                    }
                    if (i === 6) {
                        if (this.data.length === 0) {
                            new Toast("Ningún documento encontrado en esta fecha. 🥴")
                            this.spinnerShow = true
                        } else {
                            new Toast("Documentos encontrados. 🥳")
                            this.spinnerShow = true
                        }
                    }
                }
            } catch (error) {
                console.log(error)
                this.spinnerShow = true
                new Toast("Algo ha sucedido al cargar los datos, posible error de conexión a internet. 🥴")
            }
        },
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
    async mounted() {
        this.spinnerShow = false
        try {
            this.booleanData = false
            this.data = []
            let start = moment().subtract(7, 'days').format('L')
            this.dateGoodFormat = moment().subtract(7, "days").format("DD/MM/YYYY")
            this.dateGoodFormat2 = moment().format("DD/MM/YYYY")
            let i = 0
            for (i = 0; i <= 7; i++) {
                let dia = moment(start).add(i, 'days').format('L')
                let datos = await baseConnect(`historial/${dia.substr(0, 2)}-${dia.substr(3, 2)}-${dia.substr(6, 4)}`)
                if (datos !== null) {
                    this.data.push(datos)
                }
                if (i === 7) {
                    this.spinnerShow = true
                }
            }
        } catch (error) {
            this.spinnerShow = true
            new Toast("Algo ha sucedido al cargar los documentos, posible error de conexión. 🤓")
        }
    }
}
</script>