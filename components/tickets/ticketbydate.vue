<template>
    <div class="m-5 p-5 bg-white rounded-lg shadow text-gray-700 border-b border-primary">
        <p class="font-bold"><i class="fa-solid fa-magnifying-glass"></i> Buscar ticket por mes</p>
        <div class="my-4 overflow-x-auto">
            <div class="my-5 text-gray-700 max-w-xs">
                <label class="text-sm italic" for=""><i class="fa-solid fa-clock"></i> Fecha subida</label>
                <Datepicker placeholder = "Seleccionar fecha" v-model="date" class="w-64" month-picker @update:modelValue="buscarMes"></Datepicker>
            </div>
            <table class="table w-full my-4">
                <!-- head -->
                <thead>
                    <tr>
                        <th>De</th>
                        <th>Título</th>
                        <th>Fecha</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody v-for="(listtickets) in ticketListDate" :key="listtickets" class="text-sm">
                    <!-- row 1 -->
                    <tr v-if="listtickets !== null">
                        <td>
                            <div class="flex flex-col">
                                <p class="font-bold"><i class="fa-solid fa-user"></i> {{ listtickets.name }}</p>
                                <p class="text-xs text-gray-500"><i class="fa-solid fa-address-card"></i>
                                    {{ listtickets.nie }}</p>
                            </div>
                        </td>
                        <td>
                            <p>{{ (listtickets.title) }} </p>
                        </td>
                        <td>
                            <div class="flex flex-col">
                                <p class="italic text-xs"><i class="fa-solid fa-clock"></i> {{ listtickets.day }} a las
                                    {{ listtickets.hour }}</p>
                                <p v-if="listtickets.nivel === `1`" class="font-bold">Poco urgente <i
                                        class="fa-solid fa-person-running"></i></p>
                                <p v-if="listtickets.nivel === `2`" class="font-bold text-yellow-700">Urgente <i
                                        class="fa-solid fa-bell"></i></p>
                                <p v-if="listtickets.nivel === `3`" class="font-bold text-red-700">Muy urgente <i
                                        class="fa-solid fa-circle-exclamation"></i></p>

                            </div>
                        </td>
                        <td>
                            <div class="flex flex-col">
                                <label v-if="listtickets.pending === `pending`"
                                    @click="cogerDatosTicket(listtickets.title, listtickets.description, listtickets.name, listtickets.nie, listtickets.id, listtickets.email, listtickets.day, listtickets.userIndex, listtickets.pending)"
                                    for="atender"
                                    class="text-center p-2 pr-4 pl-4 rounded-lg shadow bg-green-600 text-white font-bold m-1 hover:bg-green-800">Atender
                                    <i class="fa-regular fa-eye"></i></label>
                                <label v-if="listtickets.pending === `responsed`"
                                    @click="cogerDatosTicket(listtickets.title, listtickets.description, listtickets.name, listtickets.nie, listtickets.id, listtickets.email, listtickets.day, listtickets.userIndex, listtickets.pending)"
                                    for="atender"
                                    class="text-center p-2 pr-4 pl-4 rounded-lg shadow bg-green-600 text-white font-bold m-1 hover:bg-green-800">+
                                    info <i class="fa-regular fa-eye"></i></label>
                            </div>
                        </td>
                    </tr>
                    <!-- row 2 -->
                </tbody>
            </table>
        </div>
    </div>
    <input type="checkbox" id="atender" class="modal-toggle" />
    <div class="modal">
        <div class="modal-box text-grey-700">
            <h3 class="font-bold text-lg"><i class="fa-solid fa-ticket"></i> Ticket id {{ ticketData.id }} enviado
                día
                {{ ticketData.day }}. </h3>
            <div class="py-4">
                <p class="font-bold text-green-600"><i class="fa-solid fa-user"></i> Datos cliente</p>
                <p><i class="fa-solid fa-square-check"></i> De <span class="font-bold">{{ ticketData.name }}</span>
                    -
                    {{ ticketData.nie }}.</p>
                <p><i class="fa-solid fa-square-check"></i> Email <span class="font-bold">{{ ticketData.email
                }}</span></p>
            </div>
            <div class="py-4">
                <p class="font-bold text-green-600"><i class="fa-solid fa-table"></i> Datos ticket</p>
                <p class="my-2"><i class="fa-solid fa-square-check"></i> Titulo: <span class="font-bold italic">{{
                    ticketData.title }}</span> </p>
                <p class="my-2"><i class="fa-solid fa-square-check"></i> Ticket: <span class="font-bold italic">{{
                    ticketData.description }}</span> </p>
            </div>
            <div v-if="ticketData.pending === `pending`" class="py-4 w-full">
                <p class="font-bold text-green-600"><i class="fa-solid fa-user"></i> Respuesta ticket</p>
                <label class="label">
                    <span class="label-text">Escribir respuesta</span>
                </label>
                <textarea v-model="ticketResponse" class="textarea textarea-bordered w-full"
                    placeholder="Te enviaremos el certificado que solicitas a través del apartado de documentos."></textarea>
            </div>
            <div class="modal-action">
                <button v-if="ticketData.pending === `pending`" for="atender" @click="enviarTicket"
                    class="btn bg-green-600 border-none">Responder ticket</button>
                <label for="atender" class="btn">Cerrar</label>
            </div>
        </div>
    </div>
</template>
<script>
import { CirclesToRhombusesSpinner } from "epic-spinners"
import Datepicker from '@vuepic/vue-datepicker';
import Toast from "awesome-toast-component"
import moment from "moment"
import { baseConnect, baseConnectPut, baseConnectSearch /*enviarMail*/ } from "../db/db"
export default {
    components: {
        Datepicker, CirclesToRhombusesSpinner
    },
    data() {
        return {
            data: "",
            data1: "",
            ticketData: {
                title: "",
                description: "",
                name: "",
                nie: "",
                id: "",
                email: "",
                day: "",
                userIndex: "",
                pending: ""
            },
            ticketResponse: "",
            ticketsearch: "",
            ticketlist: "",
            ticketListDate: "",
            date: null,
            spinnerShow: true
        }
    },
    methods: {
        cogerDatosTicket(title, description, name, nie, id, email, day, index, pending) {
            let objeto = {
                title: title,
                description: description,
                name: name,
                nie: nie,
                id: id,
                email: email,
                day: day,
                userIndex: index,
                pending: pending
            }
            this.ticketData = objeto
        },
        async buscarTicket() {
            this.spinnerShow = false
            new Toast("Buscando tickets. ⏳")
            let datos = await baseConnectSearch(`user`, `user`, "nie", this.ticketsearch.toUpperCase())
            if (datos === null) {
                new Toast("Ningún ticket encontrado con este DNI")
                this.spinnerShow = true
            } else {
                console.log(datos)
                let datosClean = Object.values(datos)
                this.ticketlist = datosClean[0].tickets
                console.log(this.ticketlist)
                new Toast("Tickets encontrados. 😀")
                this.spinnerShow = true
            }
        },
        async recargarDatos() {
            let hoy = moment().format('L');
            this.data = await baseConnect(`ticket/${hoy.substr(0, 2)}-${hoy.substr(6, 4)}`)

            let mesPasado = parseInt(hoy.substr(0, 2))
            let anoPasado = parseInt(hoy.substr(6, 4))
            if (mesPasado === 1) {
                mesPasado = 12
                anoPasado = anoPasado - 1
            } else {
                mesPasado = mesPasado - 1
            }
            this.data1 = await baseConnect(`ticket/${mesPasado}-${anoPasado}`)
        },
        txNombres(event) {
            if ((event.keyCode != 32) && (event.keyCode < 48) || (event.keyCode > 57) && (event.keyCode < 65) || (event.keyCode > 90) && (event.keyCode < 97) || (event.keyCode > 122))
                event.returnValue = false;
        },
    },
}
</script>