<template>
    <div>
        <div>
            <div class="m-5 text-gray-700 flex flex-row items-center">
                <div class="p-4 bg-primary rounded-lg text-white text-2xl mr-5">
                    <Icon name="dashicons:book-alt"></Icon>
                </div>
                <div>
                    <p><span class="text-gray-400">Inicio</span> / Documentos</p>
                    <p class="font-bold text-lg">Tickets pendientes</p>
                </div>
            </div>
            <div role="tablist" class="tabs tabs-boxed m-4">
                <NuxtLink to="/tickets" role="tab" class="tab tab-active">Tickets pendientes</NuxtLink>
                <NuxtLink to="/ticketsbydni" role="tab" class="tab">Buscar por DNI</NuxtLink>
                <NuxtLink to="/ticketsbydate" role="tab" class="tab">Buscar tickets por mes</NuxtLink>
            </div>
            <TicketsPendingtickets />
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
            let objeto = {
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
  
<style></style>