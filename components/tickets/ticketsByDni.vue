<template>
    <div class="m-5 bg-white rounded-lg shadow text-gray-700  border-b border-primary p-5">
        <p class="font-bold text-xl text-primary">
            <Icon name="dashicons:tickets-alt"></Icon> Tickets por DNI
        </p>
        <div class="my-4 overflow-x-auto">
            <form @submit="buscarTicket($event)" class="flex flex-row items-center">
                <input @keypress="txNombres($event)" v-model="ticketsearch" type="text" placeholder="Buscar por DNI"
                    class="input input-bordered mn" />
                <button type="submit" class="btn btn-square">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>
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
                <tbody v-for="(listtickets) in ticketlist" :key="listtickets" class="text-sm">
                    <!-- row 1 -->
                    <tr v-if="listtickets !== null">
                        <td>
                            <div class="flex flex-col">
                                <p class="font-bold"> {{ listtickets.name }}</p>
                                <p class="text-xs text-gray-500">
                                    {{ listtickets.nie }}</p>
                            </div>
                        </td>
                        <td>
                            <p>{{ (listtickets.title) }} </p>
                        </td>
                        <td>
                            <div class="flex flex-col">
                                <p class="italic text-xs"> {{ listtickets.day }} a
                                    las {{ listtickets.hour }}</p>
                                <p v-if="listtickets.nivel === `1`" class="font-bold">Poco urgente </p>
                                <p v-if="listtickets.nivel === `2`" class="font-bold text-yellow-700">Urgente </p>
                                <p v-if="listtickets.nivel === `3`" class="font-bold text-red-700">Muy urgente </p>
                            </div>
                        </td>
                        <td>
                            <div class="flex flex-col">
                                <label v-if="listtickets.pending === `pending`"
                                    @click="cogerDatosTicket(listtickets.title, listtickets.description, listtickets.name, listtickets.nie, listtickets.id, listtickets.email, listtickets.day, listtickets.userIndex, listtickets.pending)"
                                    for="atender" class="btn btn-primary">Atender
                                </label>
                                <label v-if="listtickets.pending === `responsed`"
                                    @click="cogerDatosTicket(listtickets.title, listtickets.description, listtickets.name, listtickets.nie, listtickets.id, listtickets.email, listtickets.day, listtickets.userIndex, listtickets.pending)"
                                    for="atender" class="btn btn-secondary">+
                                    info </label>
                            </div>
                        </td>
                    </tr>
                    <!-- row 2 -->
                </tbody>
            </table>
            <div v-if="this.ticketlist === null">
                <p class="p-5">¡Ningún ticket encontrado! 👍</p>
            </div>
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
            ticketlist: null,
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
        async buscarTicket(e) {
            e.preventDefault();
            this.spinnerShow = false
            new Toast("Buscando tickets. ⏳")
            let datos = await baseConnectSearch(`user`, `user`, "nie", this.ticketsearch.toUpperCase())
            if (datos === null) {
                new Toast("Ningún ticket encontrado con este DNI")
                this.ticketlist = null
                this.spinnerShow = true
            } else {
                console.log(datos)
                let datosClean = Object.values(datos)
                this.ticketlist = datosClean[0].tickets
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