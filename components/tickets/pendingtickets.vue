<template>
    <div class="m-5 bg-white rounded-lg border-b border-primary text-gray-700 p-5">
        <p class="font-bold text-xl text-primary">
            <Icon name="dashicons:tickets-alt"></Icon> Tickets pendientes
        </p>
        <div v-if="data !== null" class="overflow-x-auto my-4">
            <table class="table w-full">
                <!-- head -->
                <thead>
                    <tr>
                        <th>De</th>
                        <th>Título</th>
                        <th>Fecha</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody v-for="(ticket) in data" :key="ticket" class="text-sm">
                    <!-- row 1 -->
                    <tr v-if="ticket.pending === `pending`">
                        <td>
                            <div class="flex flex-col">
                                <p class="font-bold">
                                    <Icon name="dashicons:admin-users" /> {{ ticket.name }}
                                </p>
                                <p class="text-xs text-gray-500">
                                    <Icon name="dashicons:media-interactive" /> {{ ticket.nie }}
                                </p>
                            </div>
                        </td>
                        <td>
                            <p>
                                <Icon name="dashicons:text" /> {{ (ticket.title) }}
                            </p>
                        </td>
                        <td>
                            <div class="flex flex-col">
                                <p class="italic text-xs">
                                    <Icon name="dashicons:buddicons-community" /> {{ ticket.day }} a las
                                    {{ ticket.hour }}
                                </p>
                                <p v-if="ticket.nivel === `1`" class="font-bold">Poco urgente </p>
                                <p v-if="ticket.nivel === `2`" class="font-bold text-yellow-700">Urgente </p>
                                <p v-if="ticket.nivel === `3`" class="font-bold text-red-700">Muy urgente </p>

                            </div>
                        </td>
                        <td>
                            <div class="flex flex-col">
                                <label
                                    @click="cogerDatosTicket(ticket.title, ticket.description, ticket.name, ticket.nie, ticket.id, ticket.email, ticket.day, ticket.userIndex, ticket.pending)"
                                    for="atender" class="btn btn-primary">Atender
                                    <Icon name="dashicons:arrow-right-alt" />
                                </label>
                            </div>
                        </td>
                    </tr>
                    <!-- row 2 -->
                </tbody>
            </table>
            <div v-if="data === null">
                <p class="p-5">¡Todos los tickets atendidos! 👍</p>
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
                <div>
                    <div class="flex flex-col flex-1 m-1">
                        <label class="mb-1 text-sm" for="">
                            <Icon name="dashicons:cloud"></Icon> Subir archivo
                        </label>
                        <input @change="insertarPdf($event)" type="file" class="file-input file-input-bordered w-full "
                            accept="application/pdf" />
                        <div v-if="arrayfiles.length > 0">
                            <p class="my-1">Documentos seleccionados:</p>
                            <div v-for="(files, i) in arrayfiles">
                                <p class="flex flex-row justify-between w-full font-bold items-center mb-1">
                                <p>
                                    <Icon name="material-symbols:drive-file-move-outline-sharp"></Icon> {{ i + 1 }} {{
                                        files.name }}
                                </p>
                                <button @click="deleteArrayDocument(i)" type="button" class="btn btn-sm btn-error">
                                    <Icon name="material-symbols:delete-sweep"></Icon>
                                </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-action">
                    <button v-if="ticketData.pending === `pending`" for="atender" @click="enviarTicket"
                        class="btn bg-green-600 border-none">Responder ticket</button>
                    <label for="atender" class="btn">Cerrar</label>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { storageRef } from "../plugins/firebase.client";
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
            arrayfiles: [],
            file: "",
            datoFile: "",
            urlFile: "",
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
            reloadInterval: "",
            date: null,
            spinnerShow: true
        }
    },
    async mounted() {
        this.spinnerShow = false
        try {
            let hoyModificar = moment().subtract(1, 'month').format("MM-YYYY")
            let hoy = moment().format('MM-YYYY');
            let datos = await baseConnect(`ticket/${hoy}`)
            if (datos !== null) {
                this.data = Object.values(datos)
            } else {
                this.data = []
            }
            let datos2 = await baseConnect(`ticket/${hoyModificar}`)
            if (datos2 !== null) {
                this.data1 = Object.values(datos2)
                this.data1.forEach(element => {
                    this.data.push(element)
                })
            }
            this.spinnerShow = true
        } catch (error) {
            console.log(error)
            this.spinnerShow = true
            new Toast("Algo sucedió al cargar los tickets.")
        }

        this.reloadInterval = setInterval(async () => {
            await this.recargarDatos()
        }, 120000);
    },
    unmounted() {
        clearInterval(this.reloadInterval)
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
        async enviarTicket() {
            this.spinnerShow = false
            new Toast("Enviando respuesta.")
            const arraylinks = []
            this.arrayfiles.forEach(async (element, i) => {
                let linkDocument = await this.agregarDato(element)
                arraylinks.push(await linkDocument)
                if (i  == (this.arrayfiles.length-1)) {
                    console.log("Pasa :D")
                    let objeto = {
                        linksdocuments: arraylinks,
                        response: this.ticketResponse,
                        today: moment().format('L'),
                        hour: moment().format('LTS'),
                        id: Date.now()
                    }
                    try {
                        await baseConnectPut(`ticket/${this.ticketData.day.substr(0, 2)}-${this.ticketData.day.substr(6, 4)}/${this.ticketData.id}/response`, objeto)
                        await baseConnectPut(`ticket/${this.ticketData.day.substr(0, 2)}-${this.ticketData.day.substr(6, 4)}/${this.ticketData.id}/pending`, "responsed")
                        await baseConnectPut(`user/${this.ticketData.userIndex}/tickets/${this.ticketData.id}/response`, objeto)
                        await baseConnectPut(`user/${this.ticketData.userIndex}/tickets/${this.ticketData.id}/pending`, "responsed")
                        await this.recargarDatos()
                        new Toast("Respuesta enviada con éxito. 🥳")
                        this.spinnerShow = true
                    } catch (error) {
                        console.log(error)
                        new Toast("Algo malo ha sucedido al enviar la respuesta, posible fallo de conexión. ❌")
                        this.spinnerShow = true
                    }
                }
            })
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
        async agregarDato(fileelement) {
            const fileDeff = fileelement
            await storageRef.child(`${this.ticketData.nie.toUpperCase()}`).child(fileDeff.name).put(fileDeff)
            const urlDescarga = await storageRef.child(`${this.ticketData.nie.toUpperCase()}`).child(fileDeff.name).getDownloadURL()
            return urlDescarga
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
        },
        async buscarMes() {
            this.spinnerShow = false
            this.ticketListDate = ""
            try {
                if (this.date !== null) {
                    new Toast("Buscando tickets, espere...")
                    let fechaDeff = moment(this.date).format("MM-YYYY")
                    let datos = await baseConnect(`ticket/${fechaDeff}`)
                    if (datos !== null) {
                        this.ticketListDate = datos
                        new Toast("Tickets encontrados.")
                        this.spinnerShow = true
                    } else {
                        new Toast("Ningun ticket encontrado.")
                        this.spinnerShow = true
                    }
                } else {
                    new Toast("Seleccione una fecha.")
                    this.spinnerShow = true
                }
            } catch (error) {
                console.log(error)
                new Toast("Ningun ticket encontrado.")
                this.spinnerShow = true
            }
        }
    },
}
</script>