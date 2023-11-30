<template>
    <div :class="{ hidden: spinnerShow }" class="flex flex-col items-center justify-center h-screen">
        <CirclesToRhombusesSpinner :animation-duration="1000" :size="60" color="#ff1d5e" />
    </div>
    <div :class="{ hidden: !spinnerShow }">
        <div class="m-5 text-gray-700 flex flex-row items-center">
            <div class="p-4 bg-primary rounded-lg text-white text-2xl mr-5">
                <Icon name="dashicons:media-document"></Icon>
            </div>
            <div>
                <p><span class="text-gray-400">Inicio</span> / Documentos</p>
                <p class="font-bold text-lg">Facturas y presupuestos</p>
            </div>
        </div>
        <div class="rounded-lg text-gray-700">
            <div class="p-5 m-5 rounded-lg bg-white border-b border-primary">
                <p class="font-bold text-xl mt-10 text-primary">
                    <Icon name="dashicons:admin-users"></Icon> Buscar cliente
                </p>
                <div class="input-group my-4 flex flex-row items-center">
                    <input v-model="usersearch" type="text" placeholder="Buscar por DNI" class="input input-bordered" />
                    <button @click="search" class="btn btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div v-if="data.length !== 0" class="overflow-x-auto p-5 m-5 rounded-lg border-b border-primary bg-white">
                <table class="table w-full">
                    <!-- head -->
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Datos</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- row 1 -->
                        <tr v-for="(user) in data" :key="user">
                            <th>
                                <p class="font-bold">{{ user.name }}</p>
                                <p class="font-thin">Registro {{ user.register }} </p>
                                <p class="font-thin text-xs font-bold">ID: {{ user.index }} </p>
                            </th>
                            <td>
                                <div class="flex flex-col text-sm">
                                    <p> {{ user.email }} </p>
                                    <p> {{ user.number }} </p>
                                    <p class="font-bold"> {{ user.nie }} </p>
                                </div>
                            </td>
                            <td>
                                <div class="flex flex-col">
                                    <label @click="recogerDatos(user)" for="createinvoice" class="btn btn-sm w-max">Crear
                                        presupuesto </label>
                                    <label @click="recogerDatos(user)" for="createnotes"
                                        class="btn btn-sm w-max mt-1">Registrar actividad </label>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="showpresupuesto" class="p-5 m-5 rounded-lg bg-white border-b border-primary">
                <div class="stats stats-vertical lg:stats-horizontal shadow w-full">

                    <div class="stat">
                        <div class="stat-title">Total presupuestos</div>
                        <div class="stat-value">{{ this.totalInvoices }} </div>
                        <div class="stat-desc">Presupuestos lanzados</div>
                    </div>

                    <div class="stat">
                        <div class="stat-title">Total aceptados</div>
                        <div class="stat-value text-green-700">{{ this.totalAceptados }} </div>
                        <div class="stat-desc">✅ Aceptados</div>
                    </div>

                    <div class="stat">
                        <div class="stat-title">Total pendientes</div>
                        <div class="stat-value text-yellow-700">{{ this.totalPendientes }} 
                        </div>
                        <div class="stat-desc"> No observados</div>
                    </div>
                    <div class="stat">
                        <div class="stat-title">Total rechazados</div>
                        <div class="stat-value text-red-700">{{ this.totalRechazados }} </div>
                        <div class="stat-desc">❎ Rechazados</div>
                    </div>

                </div>
                <div class="stats stats-vertical lg:stats-horizontal shadow w-full mt-5">

                    <div class="stat">
                        <div class="stat-title">Total presupuestos</div>
                        <div class="stat-value">{{ this.totalPresupuestos }}€</div>
                        <div class="stat-desc">Presupuestos lanzados</div>
                    </div>

                    <div class="stat">
                        <div class="stat-title">Mejor presupuesto</div>
                        <div class="stat-value text-green-700">{{ this.bestPresupuesto }}€</div>
                        <div class="stat-desc">✅ Mejor lanzado</div>
                    </div>

                    <div class="stat">
                        <div class="stat-title">Total aceptados</div>
                        <div class="stat-value text-green-700">{{ this.totalPresupuestosAceptados }}€</div>
                        <div class="stat-desc"> Dinero ganado</div>
                    </div>
                    <div class="stat">
                        <div class="stat-title">Puntuación cliente</div>
                        <div class="stat-value p-1 rounded-lg bg-green-700 text-white w-max">{{ this.puntuacionCliente }} </div>
                        <div class="stat-desc">Estado cliente</div>
                    </div>

                </div>
                <div class="overflow-x-auto">
                    <table class="table mt-6">
                        <!-- head -->
                        <thead>
                            <tr>
                                <th>ID presupuesto</th>
                                <th>Datos</th>
                                <th>Articulos/servicios</th>
                                <th>Estado</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- row 1 -->
                            <tr v-for="(presupuestos) in data[0].presupuestos" :key="presupuestos">
                                <th v-if="data[0].presupuestos === undefined">
                                    <p class="font-normal">Ningún presupuesto encontrado 🧐</p>
                                </th>
                                <th v-if="data[0].presupuestos !== undefined">
                                    <p class="font-thin">CIF/DNI: {{ presupuestos.nieEmpresa }}</p>
                                    <p class="font-thin text-xs font-bold">ID: {{ presupuestos.invoiceNumber }}</p>
                                </th>
                                <td v-if="data[0].presupuestos !== undefined">
                                    <div class="flex flex-col text-sm">
                                        <p>Cliente: {{ presupuestos.nombreEmpresa }} </p>
                                    </div>
                                </td>
                                <td v-if="data[0].presupuestos !== undefined">
                                    <div class="flex flex-col text-sm">
                                        <div v-for="articles in presupuestos.articles" :key="articles"
                                            class="flex flex-row items-center">
                                            <p class="m-1">{{ articles.concept }},</p>
                                            <p class="m-1">{{ articles.price }}€,</p>
                                            <p class="m-1">{{ articles.ud }}u.</p>
                                        </div>
                                    </div>
                                </td>
                                <td v-if="data[0].presupuestos !== undefined">
                                    <select :v-model="presupuestos.state"
                                        @change="cambiarestadopresupuesto(presupuestos.invoiceNumber, $event)"
                                        class="select select-ghost w-36">
                                        <option :value="presupuestos.state" selected disabled>{{ presupuestos.state }}
                                        </option>
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Aceptado">Aceptado</option>
                                        <option value="Finalizado">Aceptado</option>
                                        <option value="Rechazado">Rechazado</option>
                                    </select>
                                </td>
                                <td v-if="data[0].presupuestos !== undefined">
                                    <div class="flex flex-col">
                                        <label @click="factura(presupuestos)" class="btn btn-secondary">Ver </label>
                                        <label @click="factura(presupuestos)"
                                            class="btn btn-primary mt-2">Crear factura de venta </label>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-if="data.length === 0" class="p-5 m-5 rounded-lg bg-white">
                <p>Ningun usuario encontrado. 🤔</p>
            </div>
            <div v-if="shownotes" class="p-5 m-5 rounded-lg bg-white border-b border-primary">
                <p class="text-green-700 font-bold mt-5 mb-2"> Registro de actividad</p>
                <div class="w-full">
                    <div class="overflow-x-auto w-full">
                        <table class="table w-full overflow-x-auto">
                            <!-- head -->
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Registro</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- row 1 -->
                                <tr v-for="notes, index, i in listNotes" :key="notes">
                                    <th>{{ i + 1 }} </th>
                                    <td> {{ notes.note }} </td>
                                    <td class="hidden">
                                        <div class="form-control flex flex-row">
                                            <input :id="a + index" @change="changecheck(notes.check, index)" type="checkbox"
                                                v-if="notes.check === true" checked class="checkbox" />
                                            <input :id="`a` + index" @change="changecheck(notes.check, index)"
                                                type="checkbox" v-if="notes.check === false" class="checkbox" />
                                        </div>
                                    </td>
                                    <td>
                                        <div class="flex flex-row">
                                            <button @click="deletecheck(index)" class="btn bg-red-600 border-none"></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Put this part before </body> tag -->
    <input type="checkbox" id="createinvoice" class="modal-toggle" />
    <div class="modal">
        <div class="modal-box text-grey-700">
            <div :class="{ hidden: !facturaShow }" class="m-5 text-gray-700 text-sm">
                <div v-if="seeFacturas === true" id="paso1" class="my-5 animate__animated animate__fadeIn">
                    <div class="flex-row items-center justify-between flex mb-5">
                        <h3 class="font-bold text-xl"> Crear presupuesto cliente</h3>
                        <label for="createinvoice" class="btn"></label>
                    </div>
                    <p class="font-bold text-green-600"> Datos cliente presupuesto</p>
                    <div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Razón social*</span>
                            </label>
                            <label class="input-group">
                                <span></span>
                                <input style="text-transform:uppercase" v-model="social" type="text"
                                    placeholder="EMPRESA S.L." class="input input-bordered w-full" />
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">NIE/CIF*</span>
                            </label>
                            <label class="input-group">
                                <span></span>
                                <input style="text-transform:uppercase" v-model="nie" type="text" placeholder="000000000X"
                                    class="input input-bordered w-full" />
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Dirección</span>
                            </label>
                            <label class="input-group">
                                <span></span>
                                <input style="text-transform:uppercase" v-model="adress" type="text"
                                    placeholder="C/ Navarro nº2" class="input input-bordered w-full" />
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Provincia</span>
                            </label>
                            <label class="input-group">
                                <span></span>
                                <input style="text-transform:uppercase" v-model="provincia" type="text"
                                    placeholder="La Unión, Murcia" class="input input-bordered w-full" />
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Código postal</span>
                            </label>
                            <label class="input-group">
                                <span></span>
                                <input style="text-transform:uppercase" v-model="cod" type="text" placeholder="30360"
                                    class="input input-bordered w-full" />
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">ID presupuesto</span>
                            </label>
                            <label class="input-group">
                                <span></span>
                                <input style="text-transform:uppercase" v-model="numberinvoice" type="number"
                                    placeholder="1002.2" class="input input-bordered" />
                            </label>
                        </div>
                        <div class="form-control hidden">
                            <label class="label">
                                <span class="label-text">Trasferir dinero a</span>
                            </label>
                            <label class="input-group">
                                <span></span>
                                <input style="text-transform:uppercase" v-model="payto" type="text"
                                    placeholder="ESXX XXXX XXXX XXXX XXXX XXXX" class="input input-bordered" />
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">IRPF en %</span>
                            </label>
                            <label class="input-group">
                                <span></span>
                                <input @keyup="recargarIva" style="text-transform:uppercase" v-model="irpf" type="number"
                                    class="input input-bordered" />
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Iva</span>
                            </label>
                            <select @change="recargarIva" id="iva" class="select select-bordered w-full max-w-xs">
                                <option disabled selected>Sin iva</option>
                                <option value="4">4%</option>
                                <option value="10">10%</option>
                                <option value="21">21%</option>
                            </select>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Observaciones factura</span>
                            </label>
                            <textarea v-model="observations" class="textarea textarea-bordered"
                                placeholder="Pago de 50% por adelantado."></textarea>
                        </div>
                        <div class="form-control w-full mt-2">
                            <div class="flex flex-col justify-between items-center">
                                <div class="flex flex-col w-full mr-2">
                                    <div class="flex flex-col">
                                        <div class="m-1">
                                            <p>Descripción</p>
                                            <input v-model="complementsname" type="text" placeholder="Desarrollo software"
                                                class="input input-bordered w-full" />
                                        </div>
                                        <div class="m-1">
                                            <p>Precio</p>
                                            <input v-model="complementsprice" type="number" placeholder="32.99"
                                                class="input input-bordered w-full" />
                                        </div>
                                        <div class="m-1">
                                            <p>Cantidad</p>
                                            <input v-model="complementsq" type="number" placeholder="1"
                                                class="input input-bordered w-full" />
                                        </div>
                                    </div>
                                    <div v-for="complementos in complements" :key="complementos"
                                        class="flex flex-row justify-between w-full items-center border rounded mt-1 border-gray-300 p-2">
                                        <div class="font-bold flex flex-row">
                                            <p class="mr-2">{{ complementos.complement }}, </p>
                                            <p>{{ complementos.price }}€</p>
                                        </div>
                                        <div class="items-center flex flex-row">
                                            <button @click="borrarComplements(complementos.id)"
                                                class="btn btn-xs btn-error ml-2"></button>
                                        </div>
                                    </div>
                                </div>
                                <button @click="anadirComplementos" class="btn rounded-lg mt-5 w-full"> Añadir</button>
                            </div>
                        </div>
                        <div class="overflow-x-auto my-6">
                            <p class="font-bold"> Articulos o servicios añadidos
                            </p>
                            <table id="my-table" class="table w-full my-2">
                                <!-- head -->
                                <thead>
                                    <tr>
                                        <th>Artículo</th>
                                        <th>Descripción</th>
                                        <th>Precio</th>
                                        <th>Unidades</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- row 1 -->
                                    <tr v-for="(invoice, index) in invoiceList" :key="invoice">
                                        <th>
                                            <div class="flex flex-row items-center">
                                                <button @click="remove(index)" class="p-2"></button>
                                                <p>{{ index }}</p>
                                            </div>
                                        </th>
                                        <td>{{ invoice.concept }}</td>
                                        <td>{{ invoice.price }}€ </td>
                                        <td>{{ invoice.ud }}</td>
                                        <td>{{ invoice.ud * invoice.price }}€ </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table id="my-table2" v-if="invoiceList.length !== 0" class="table w-full my-2">
                                <!-- head -->
                                <thead>
                                    <tr>
                                        <th>Base imponible</th>
                                        <th>{{ irpf }}% IRPF</th>
                                        <th>{{ ivaDeff }}% IVA</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- row 1 -->
                                    <tr v-for="(total) in finalList" :key="total">
                                        <td>{{ total.base }}€</td>
                                        <td>{{ total.irpf }}€ </td>
                                        <td>{{ total.iva }}€ </td>
                                        <td>{{ total.total }}€</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <label for="createinvoice" v-if="invoiceList.length !== 0" @click="factura()"
                            class="btn bg-green-600 border-green-600 mt-2 w-full">Obtener factura</label>
                    </div>
                </div>
                <!-- The button to open modal -->

                <div v-if="seeFacturas === false" id="verfacturas" class="animate__animated animate__fadeIn">
                    <div class="my-5 text-gray-700">
                        <!--@update:modelValue = "cargarFecha"-->
                        <Datepicker v-model="date" monthPicker @update:modelValue="cargarFecha"></Datepicker>
                    </div>
                    <div v-if="baseInvoiceList !== null" class="overflow-x-auto">
                        <table class="table w-full">
                            <!-- head -->
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Empresa</th>
                                    <th>Datos</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- row 1 -->
                                <tr v-for="(invoice, index, i) in baseInvoiceList" :key="invoice" class="text-xs">
                                    <th>{{ i }} </th>
                                    <td>
                                        <div class="flex flex-col">
                                            <p class="font-bold text-green-600"> {{ (invoice.social) }} </p>
                                            <p class="italic"> {{ (invoice.nie) }} </p>
                                            <p class="italic"> {{ (invoice.provincia) }} </p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="flex flex-col">
                                            <p>Fecha: {{ (invoice.date) }} </p>
                                            <p class="my-1">Cantidad: <span
                                                    class="text-green-600 bg-green-100 p-1 rounded font-bold shadow">{{
                                                        (invoice.price) }}€</span>
                                            </p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="flex flex-col">
                                            <a @click="presentToast(`Descargando factura, espere... ⏳`)"
                                                :href="invoice.link" class="btn btn-xs">Ver factura</a>
                                            <button @click="eliminarFactura(index, invoice.date)"
                                                class="btn btn-xs text-red-600 bg-red-100 my-1 shadow">Eliminar</button>
                                        </div>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <div v-if="baseInvoiceList === null">
                        <p>Ninguna factura encontrada este mes. 🧐</p>
                    </div>
                </div>
            </div>
            <div :class="{ hidden: facturaShow }"
                class="flex flex-col justify-center items-center w-full h-screen text-gray-700">
                
                <p class="w-3/4 text-center text-sm my-2">Para realizar presupuestos debe completar los datros de
                    configuración. 🧐</p>
            </div>
        </div>
        <div class="modal-action">
            <label for="createinvoice" class="btn">Cerrar</label>
        </div>
    </div>
    <!-- Put this part before </body> tag -->
    <input type="checkbox" id="createnotes" class="modal-toggle" />
    <div class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Generar registro cliente</h3>
            <div class="py-5">
                <p class="mb-2 text-sm italic"> Actividad</p>
                <textarea v-model="clientnote" class="textarea w-full h-44 mb-5 border"
                    placeholder="El cliente ha pagado el 50% de la factura, queda por pagar el 50% restante."></textarea>
                <div class="form-control hidden">
                    <label class="label cursor-pointer">
                        <span class="label-text">Actividad finalizada</span>
                        <input v-model="checknote" type="checkbox" class="toggle" checked />
                    </label>
                </div>
            </div>
            <div class="modal-action">
                <label @click="crearnotas()" for="createnotes" class="btn">Crear registro</label>
                <label for="createnotes" class="btn">Cerrar</label>
            </div>
        </div>
    </div>
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { Preferences } from '@capacitor/preferences';
import { baseConnect, baseConnectDelete, baseConnectPost, baseConnectPut, baseConnectSearch } from "../db/db"
import moment from "moment"
import { alertController, toastController } from "@ionic/vue"
import { storageRef } from "../plugins/firebase.client";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import Toast from 'awesome-toast-component';
export default {
    props: {
        name: String
    },
    components: {
        Datepicker
    },
    data() {
        return {
            usersearch: "",
            indexUser: "",
            data: [],
            change: "",
            datoschange: {
                data: "",
                name: "",
                where: ""
            },
            allusers: null,
            indexUser2: "",
            initLimit: 0,
            limitPage: 10,
            page: 1,
            spinnerShow: true,
            listNotes: {},
            shownotes: false,

            irpf: 0,
            invoiceList: [],
            finalList: [],
            social: "",
            nie: "",
            adress: "",
            cod: "",
            provincia: "",
            concept: "",
            numberinvoice: 1000,
            price: 0,
            ud: 0,
            totalPrice: "",
            totalPriceIva: "",
            alertdismiss: true,
            payto: undefined,
            logo: "",
            miEmpresa: "",
            miDireccion: "",
            miCodPostal: "",
            miProvincia: "",
            miEmail: "",
            miTlfn: "",
            miLogo: "",
            facturaShow: true,
            observations: "",
            seeFacturas: true,
            file: "",
            baseInvoiceList: [],
            date: "",
            ivaDeff: 0,
            remember: false,
            bussinesList: null,

            complements: [],
            complementsname: "",
            complementsprice: 0,
            complementsq: 1,
            objectuser: {},

            showpresupuesto: false,

            totalInvoices: 0,
            totalPendientes: 0,
            totalAceptados: 0,
            totalRechazados: 0,
            bestPresupuesto: 0,
            totalPresupuestos: 0,
            totalPresupuestosAceptados: 0,
            puntuacionCliente: 0,

            clientnote: "",
            checknote: "",
        }
    },
    async mounted() {
        let datos = await baseConnect(`empresa`)
        console.log(datos)
        if (datos === null) {
            this.facturaShow = false
        } else {
            if (datos.nombre === undefined) {
                this.facturaShow = false
            } else {
                this.facturaShow = true
                this.miEmpresa = datos.nombre
                this.miDireccion = datos.direccion
                this.miEmail = datos.email
                this.miTlfn = datos.telef
            }

        }
    },
    methods: {
        async factura(e) {
            this.presentToast("Creando factura. 😉")
            const doc = new jsPDF()
            console.log(e)
            if (e !== undefined) {
                console.log("Pasa :D")
                this.invoiceList = e.articles
                this.numberinvoice = e.invoiceNumber
                this.nie = e.nieEmpresa
                this.social = e.nombreEmpresa
                this.adress = e.adressEmpresa
                this.cod = e.codEmpresa
                this.observations = e.observaciones
                this.provincia = e.provinciaEmpresa
            }
            let nombreEmpresa = this.social.toUpperCase()
            let nieEmpresa = this.nie.toUpperCase()
            let adressEmpresa = this.adress.toUpperCase()
            let codEmpresa = this.cod
            let provinciaEmpresa = this.provincia
            let invoiceNumber = this.numberinvoice
            let pdfEmpresa = this.miEmpresa
            let pdfProvincia = this.miProvincia
            let pdfCodigo = this.miCodPostal
            let pdfInvoice = this.numberinvoice
            let pdfDireccion = this.miDireccion
            //let pdfPay = this.payto
            let pdfMail = this.miEmail
            let pdfTelef = this.miTlfn
            let pdfLogo = this.miLogo
            let observaciones = this.observations
            //let logoFinal = "iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoCAYAAABNo9TkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAANHZJREFUeNrs3d1vXOed2PGHb2PRlmVKsq1k7Y3GSZTYLmzTRmtskQIeohfdNRZrORfb3KimerPbK8so0LtC8j9QOVcFtkDFgC0Wu8VCSi/UpG0qJhvkrZtYsWrHiZyIjqz4VW+USInUDNnzaA5j2pZkvszMeft8gMHYSYDYvyHF8+XznOeEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUHB9RgAA1CbH6slb/WP/8UjyGu3g/810+lrpwsKeY8d9AgAg0AGgrMHdSP9yZXg/lkb3x//zPLmQvFYG+3dv8J8fT6L+gk8ZAIEOAGQd38sr28uRvTN97/SKd95Np68Y6z9f8ffTScBP+0oBQKADAJ0K8caKCF9e/W6YzKodT+P9uyvi3eo7AAIdALhpiC+vhsf3p0J+t5+XxfJ2+d+HexLtU8YCgEAHgOrFeHw9lr43TCU3jqevuF3+uGgHQKADQHlifHlL+vLKuBgvZrRPpdE+5d52AAQ6ABQjyEc/FuN1UymdC2mwfzcNdo+IA0CgA0AOgjwG+O4VQT5iKoLdSAAQ6ADQ/SAf+ViQ102FWwT7EVviARDoANC5KB9No/yZUK1njNMZMdCPxGBPYv2IcQAg0AFg9UG+fLDbM2mY27ZOJ8VI/2Zw4BwAAh0Abhrlu1dEOfRCvF/9G8FWeAAEOgAVj/J6GuPPBVvXyUesT8Vgd9AcgEAHgCpEeVwpHxfl5Nx0aK+sT1hZBxDoAFC2KLd9naKyDR5AoANA4cN8ZZQ76I0yWD5gLsb6BeMAEOgAkOcorydvz6dRXjcRSupCGutfd786gEAHgLyF+Xho31feMA0qZjqGemjfr25VHUCgA0AmUV4P7dXyGOe2sEMS6aF9CvyUUQAIdADoRZjvTsO8YRpwQ9PJ68XgXnUAgQ4AXYjyuEK+L7S3sddNBFYlxvlEaN+rPm0cAAIdADYS5jHG94f2NnZg/ZYPlZsyCgCBDgBrCfNGGuYN04COOp6G+oRRAAh0ALhVmI+H9v3lo6YBXTUdnP4OINAB4CZhHlfM66YBPXUhDfWXhDqAQAegulHu4DfIX6hPOFAOQKADUL0wj1vZPb8c8mcieb0o1AEEOgDCHBDqAAIdALoU5zHM9wtzKKQXg3vUAQQ6AIUP8/Hg8DcoA4fJAQh0AAoa5ruTt4PCHEoZ6nHb+0tGASDQAch3mDdCe8W8YRpQatNpqE8YBYBAByBfYV4P7RXz3aYBlTKVhvqUUQAIdACyDfPlk9n3mwZU2pHk9YIT3wEEOgDZxPl4aK+aO5kdWObEdwCBDkAPw7yRhvmoaQA3EOP8BfenAwh0ALoX5iNpmI+bBrAKU2moHzcKAIEOQOfifPk+c9vZgbWKj2R70bZ3AIEOwMbCPG5jPxRsZwc2Zjq0V9OPGAWAQAdgbWEeV8rjivk+0wA6aCp57XXaO4BAB2B1cd4I7VXzumkAXRC3usct7y8ZBYBAB+DGYT6Shvlu0wB6YCo4RA7gI/qNAIAkzmOUnxLnQA81ktfLyZ8/B4wCoM0KOkC1w9yqOZAHcRV9r9V0oOqsoANUN86tmgN5EZ8UYTUdqDwr6ADVC3Or5kCexVX0Z530DlSRFXSAasV5I3l7WZwDOba8mu4xj0DlWEEHqE6cHwyeaw4Uy5HQvjf9glEAAh2AMoR5XI2KW9pHTQMooBjnccv7lFEAZWeLO0C543w8eTsmzoECi+dmHEt3AQGUmhV0gHKGebygjRez46YBlIgD5ACBDkCh4jyulh9OXnXTAEoobnmP96UfMQqgbGxxByhXnI+H9int4hwoq7hD6LAt70AZWUEHKEeY29IOVJEt74BAByBXce6UdqDKnPIOlIYt7gDFjvPdwSntQLUtn/J+wCiAorOCDlDcOI8Xo/tNAuD34sFx8QC5C0YBCHQAehHmcbUobmnfbRoAn3A8jfTjRgEIdAC6GefuNwf4dO5LBwQ6AF2N80ZoP998xDQAViWupE8YA1AUDokDKEacj4f2YXDiHGD1DiV/fh4yBqAorKAD5D/O48XluEkArNtUaG95d3gcINABWFeYOwwOoHOOp5E+bRSAQAdgrXHu+eYAnRVX0Mec8A7klXvQAfIX5zHKXxbnAB13/Zef6bkeALljBR0gf3HuMDiA7nPCO5A7VtAB8hPn4+IcoGfiCe8HjQHIEyvoAPmJc48CAui9iYU9x/YaA5AHVtABso/zfeIcIDPjnpUO5IUVdIBs49wzzgHyIZ7sPuZZ6YBABxDnAIh0QKADIM4BEOmAQAcQ5wCIdACBDtDDMI+PT4uPURs1DYBCRHp8VvpxowAEOoA4ByBbcQV9TKQDAh1AnAMg0gGBDoA4B0CkAwIdQJwDINIBgQ6AOAfgJpH+gNPdgW7pNwKArjgozgFK5/ovX9NfwgJ0nBV0gA7znHOA0vOcdECgA4hzAEQ6INABEOcAiHSga9yDDtCZOD8gzgEqJ541csgYgE6xgg6w8Tgfd4EGUGkTC3uO7TUGQKADiHMARDpQAgNGALDuOG8kb4dNAoDE6MBXH7jYOjz9I6MA1ssKOsD64jzed3gstJ+JCwDL9i7sOTZhDIBAB+hNnMcoPyXOAbiJeLL7lDEAa+UUd4C1x7mVcwBu5XC60wpAoAN086IrtB+rAwA3M5JGul/mAgIdoBuSC614WnvDJABYhXryOibSAYEO0Pk435e8jZsEAGsQd1wdNAZgtTxmDeDT43x38KxzANYZ6QNffaCvdXh6yiiAT+MUd4Bbx7nHqQHQCR6/Bgh0gA3EeYzyl0P7PkIA2IgLof34teNGAdyMe9ABbu6wOAegQ64/ptOhcYBAB1ij5AIqHurTMAkAOh3pxgAIdIDVx/l48rbPJADogtH0sZ0An+AedICPxrlD4QDoBYfGAQId4BZx7lA4AHrFoXHAJ9jiDvChQ+IcgB6JvxQ+7NA4QKADfExygXQgedttEgD0UD20fzkMcN2AEQDifKzhAgmAjDw48NUHLrYOT//IKAD3oANVj/O4tfBUcCgcANl63P3ogC3uQNUdFucA5OHnkfvRAYEOVFZyIRSfdd4wCQByoB7cbgWV5x50oKpxHp93ftgkAMgR96NDxbkHHahinHveOQB55fnoUGG2uANVdFCcA5BT8ZfItrqDQAcov9rkWHzW+bhJAJBjo8nPq4PGANVjiztQpTivh/bWdqfkAlAEcav7lDFAdVhBB6rkkDgHoEg/tzx6DQQ6QOl4pBoABVQP7keHSrHFHahCnMcLHFvbASiqZxf2HDtiDFB+VtCBKrC1HYBC/xyz1R0EOkDh2doOQAl49BpUhC3uQJnjvB5sbQegPGx1h5Kzgg6Uma3tAJTq55qt7iDQAQrH1nYASijG+UFjgPKyxR0oY5zHC5hTweo5AOU0trDn2JQxQPlYQQfKyNZ2AEr9c85WdxDoALmXXLA0krfdJgFAidWT1z5jgPKxxR0oU5zH1YSX0wsXACi7xxf2HDtuDFAeVtCBMtknzgGoEAfGQclYQQdKIX3m+SmTAKBi9i7sOTZhDFAOVtCBsjhkBABU0EEHxoFAB8iN5MIkHgrXMAkAKijG+X5jgHKwxR0oepw7GA4AHBgHpWAFHSg6B8MBgAPjoBSsoAOF5WA4APiIZxf2HDtiDFBcVtCBIrNaAAB+LoJAB8hSbXKskbztNgkA+L168vPxgDGAQAfoNSfWAsAnPe+xayDQAXomufAYDx6rBgA3EuPcVncQ6AA9Y/UcAG5uPD1IFRDoAN2T3lvnogMAbs0qOhSQx6wBRYrzuG0vPlbNvXUA8OnGFvYcmzIGKA4r6ECR7BPnALBqbgmDgrGCDhSC1XMAWBer6FAgVtCBojgozgFgzayiQ4FYQQdyLz2J9pRJAMC67F3Yc2zCGCD/rKADReC3/wDg5ygIdIAspavn4yYBAOtWT36e+lkKAh1gw/zWHwD8PAWBDpAlq+cA0DFW0UGgA2yI3/YDgJ+rUBlOcQdyycntANAVnosOOWYFHcgrv+UHAD9foVKsoAO5U5scGwnt1fMR0wCAjrOKDjllBR3Io33iHAC6xio65JQVdCBXrJ4DQE88vrDn2HFjgHyxgg7kzW5xDgBd97wRQP5YQQdypTY5FlfP6yYB5MUX+ofDlwd3GASl82e3N579zMA9F0yifJ5++ukpUxDoABuN8/Hk7ZBJAFlpDH0mPDT4ufAHg/eGHQP3hHsH7jYUoMhiqMdbGX4e/zoJ92kjEegAqw30Y/H62CSAXvrz274cHqntCjsH7w9b+u80EKDMYqAfSV7fSGLdGQQCHeCmcR7D/JhJAL0Qt60/M/xPwmjtYVEOVFUM9K8noT5hFAId4OOBHre2j5sE0E1P9I+EZ+/4Z+GR2kOGAdAWzyH4evJ6KYl1ZxIIdECcj9VD+9FqAF2xvGL+5G2jYVPfbQYCcONQf8GKukAHBPqB5G2/SQDd8HStHr52xx/byg6wOlPJa68D5QQ6UN1A92g1oOPiqvm/vP0r4cnbHjcMgLWJq+kvJpH+klEIdKBacb47eTtsEkAnxXvN/3LLsx6TBrAxE6G97d296T3SbwRAxp43AqCT4rPM/93IvxLnABs3nryOHT16dMQoesMKOpAZh8MBnfbcpkfDn9zecBAcQGfFFfQxz07vPivoQJasngMdjfNn7/gX4hyg8+IKelxJHzUKgQ6U17gRAJ0Qt7XHOAeg65Fuu7tAB8omPRzOH/BAR+L8L+/8c4MAEOkCHWCdnjMCYKPio9T+9ebdtrUD9E7c5n7IGAQ6UBLp4XC7TQLYqL/Y/HTY0n+nQQD01u6jR4/uMwaBDpTkD3UjADbq3ww/Gb409HmDAMjGQYfGCXSgHGxvBzbkif6R8NTwHxkEQLZsdRfoQJHVJsfib1r9thXYkK9t/ufuOwfI3qit7gIdKDar58CGPF2r29oOkB/7neou0IHicv85sCF/sumfGgJAfsQ4t4ou0IGiSZ99XjcJYL3i6vkfDt1vEAD58rxVdIEOFM8zRgBshNVzgFyyii7QgQKyvR1Yt3hyu9VzgNxyzpBAB4oi3d5u6xOwbn98+z82BID8qh89etRijEAHCsL2dmBDHhz6oiEAuN4T6AAd4DeqwLo1hj4TtvTfaRAArvcEOsBG2N4ObNRDg58zBID8Gzl69GjDGAQ6kG+2OwEb8vDQFwwBoBgEukAHcs52J2BD7hm8xxAAiuEpIxDoQE7VJsdGg+3twAY80dwWNvXdZhAAxTBqBAIdyC/PxAQ25J6z2wwBoDjifegWZwQ6kFMNIwA24kt33W8IAMViFV2gA3lTmxyr+wMa2KjWXJ8hACDQATbI4XDAhm0f3mIIAMVigUagAznkFE9gQ5qtELbdcadBABSLe9AFOpBDVtCBDdk8O2AIAAh0gI2oTY6JcwAAEOhADtjeDmxYq+VSBQCBDrBRDSMANmpwzqUKAAIdYN08Xg0AAAQ6kA8NIwAAAIEOZM/950BHLM64VAFAoANsRMMIAABAoAMZSu8/r5sEAAAIdCBbDSMAOmXwoksVAAQ6wHq5/xwAAAQ6kAMNIwAAAIEOZMj950AnbZoZMAQABDrAOo0aAQAACHQge+4/BwAAgQ7kgBV0oGP6Lg0aAgACHWCdGkYAAAACHchQbXJMnAMAgEAHcsD2dqCj+mb7DAEAgQ6wDo8ZAdBJrZZAB0CgA6yHFXQAABDogEAHyqZ22WUKAAIdYG0X0Q6IA7pgsWUGAAh0gLWqGwEAAAh0IHsOiAM6qjbnEgUAgQ6wHu4/Bzp7gdJ0gjsAAh1gPRpGAAAAAh3IUG1yrG4KQKc1bXEHQKADrJlABzpuqOUSBQCBDrBWDSMAAACBDmTvLiMAOm1p3gwAEOgAa+UEd6ALge4SBQCBDiDQAQBAoAMFNGIEQKcNzXsOOgACHWDVapNjDVMAumHpqkAHoHoGjQDYAKvnAB20ffv2UK/Xw7333msYUBLXrl0L7733Xjh58mS4cuWKgSDQga5x/znQcVU9IO7+++8PjzzyiC8AKJmhoaFw3333Xf/F209+8pMwMzNjKNyULe7ARuw0AqDThit4//mOHTvEOVQg1J988skwPDxsGAh0oCvqRgCwcQ899JAhQEUifdeuXQaBQAcEOlAMrVa1Lk/ifedW1KA64nZ3EOiAQAcKYXCuWpcn27Zt86FDxcRfzIFABzqmNjnmBHcAABDoQA44wR3ozsVJ0wwAEOgAAJlrzrk8AUCgA6xFwwgAAECgAwBlvTixxR0AgQ6wJjuNAOjKxcmsyxMABDrAWtSNAAAABDoAUELNlhkAINAB1qphBECnbZ4dMAQABDoAAAAg0AEAAECgA6xFbXJs1BSAbui7NGgIAAh0gDUYMQIAABDoAAAAINABALplccalCQACHWAtGkYA0BkzMzOGAL7vQaADAGTt3Llz4dq1awYBFXH+/Hnf8wh0ACD/Bi9W79IkXqi/+eabPnyoiJMnTxoCAh0AIM8X7GfOnDEIKLkTJ06Es2fPGgQ35WGjAAA58Morr1y/L7Ver4fh4WEDgRKJ39uvv/66OEegA13xlBEAnbZpZqDyM5ienr7+2rJlSxgaGvJFASUwNzcXrly5YhAIdACAInLCM0A1uQcdAAAABDoAQFtzzmUJAAIdACBzQy2XJQAIdAAAAECgAwCE0DfbZwgACHQAgKy1WgIdAIEOAAAACHQAgBBql12WAFBtg0YAPbrwnBwbSd5GS/KvM+ITBTptsWUGAGXwTuv9ncm1b6Ob/x8Le45NCXQghvZoGqgrg/uuj8X3qIgFAKCKfnXtN+PJ23iX/29KeXCJQIdPBng9eauviOyn0v+qYToAXfqzd872dgAQ6AjxdnjvXPHXAPRYf9MJ7gAg0KlSjI+mr6eCLegAAIBAh54EeWNFjDfEOEC+Lc3b4g4AAp0yBXljRZADUCD9CwIdAAQ6RQ3yevK2O1ghBwAABDr0PMqXgzy+100EoDyW5s0AAAQ6eQ7yuCreSF7PpFFulRygtIFuizsACHTyGOW7V0Q5AACAQIcehvnKKLdSDlAxQ/N9YckYABDokFmUx8egPZe8xkU5QLUtXe0zBAAEuhHQ4yhf3sL+fGg/pxwAAACBTg/DfDSNclvYAfgIB8QBgECnN2E+HqyWA3ALw/O2twOAQKdbUR5XyPelYW61HAAAQKDT4zCvJ2/7Q/vQNwBYlVarPwwYAwAIdDoS5o3w4f3lALC2i5E596ADgECnE2EeV8wbpgEAACDQEeYAFFh/0wwAQKAjzAHIXHOu3wUJAAh0Vhnm8RFpB4U5AACAQCebMK8Hp7ID0GW2uAOAQOfmYb78HPP9pgFA1wN91inuACDQuVGcj4f2dvYR0wAAABDo9D7MG2mYj5oGAL3SbJkBAAh0lsN8JA3zcdMAoNc2zw4YAgCk3PRV7TiP95mfEucAAADZs4JezTD32DQAAICcsYJevTg/kLy9LM4ByIO+S9YKAGCZn4rVCfMY5A6BAwAAEOhkGOcxzPeZBAAAgEAnmzCPq+WHglVzAHJqcabf/XYAINBLH+cHkrf9JgEAxbR9+3ZDgIKbm5sLV65cMQgEeoXDvB7aq+YN0wCA4kX5rl27wtatWw0DSuTMmTPh5MmTYh2BXrE4353G+YhpAFCIC5GLNrgve/jhh8POnTsNAkrovvvuC/fee294/fXXw1tvvWUgCPSSh3kM8rid3UFwAFBAO3bsEOdQckNDQ+HBBx8MMzMz119wI35tXfw4jwfAHRPnAFBcjzzyiCFARSI93sYCAr2ccb47jXOntANQOJtmBgwhtO87jxftQDXEre6+5xHo5Yvz+Gzzw8H95gBQaNu2bTMEqJgtW7YYAjfkHvTihflIGuYN0wAAACgPK+jFivO4lf1lcQ5AGTTnXIYAgEAvZpyPh/b95nXTAKAMhlouQwBAoBcvzg8EzzcHAAAoNfeg5z/OY5iPmwQAZdM322cIACDQCxHmcbXcI9QAKK1Wq8+FCACsYIt7PuO8Ls4BAACqxS+u8xfno2mcu98cgHL/zLvcHxaNAQB+zwq6OAeATCy2zAAABHo+43w8tJ9xLs4BAAAEOhnG+SGTAKAqluZdggCAQBfnAJC54XmPWAMAgS7OAQAAEOiIcwCwxR0ABLo4B4B8XIAsuAQBAIEuzgGAHDl37pwhQMXMzMwYAgJdnANAPizNm8Gys2fPhmvXrhkEVMT58+d9zyPQxTkA5CnQXYKs9MYbbxgCVMRrr71mCAh0cQ4A5NX09HQ4c+aMQUDJnThxwvZ2bmnQCMQ5APTa0HxfWDKGj3jllVfCu+++Gx566KEwPDxsIFAicVv7yZMnr9/SAgI9uzgfTd4OmgQAfNTS1T5DuIEY6PEVA/322283ECiBuGLunnMEej7i/FjyGjENAGAtrly5cv0FQLW4B707cV4X5wBwY82WGQCAQO9NnMcoPyzOAeDGNs8OGAIACPSeiCvno8YAAACAQM9IbXLskDgHgFtrtVx+AIBA726c70vexk0CAG5tcM7lBwAI9O7F+e7gcWoAAAAI9EzjPG5pP2QSALDKi4+mGQCAQO98nDuxHQDWqGmLOwAI9C6IcV43BgAAAAR6RmqTYweSt4ZJAMAaLz5scQcAgd7BOI+Hwu03CQBYx8XHrMsPABDonYnzenAoHAAAAAI9cw6FAwAAQKBnqTY5Fp91PmoSALA+m2YGDAEABPqG4zzed77PJAAAABDo2cV53NLuvnMAAAAEesbcdw4AHdB3adAQAECgr09tcixua2+YBAAAAAI9uziPB8IdNAkAAAAEerbcdw4AHbQ449IDAAT6GtUmxw4Ej1QDAABAoGca5zHM95sEAAAAAj1btrYDQBcMXnTpAQACfZVsbQcAAECgZx/n9WBrOwAAAAI9c7a2A0CX1OZcdgCAQF/NRcPk2Hjy1jAJAOjSRUezzxAAQKB/apyPJG8HTQIAAACBnq143/mIMQBA9zRtcQcAgX4r6TPP9/lSAIDuGmoJdAAQ6LdmazsAAAACPUsOhgOA3umbdUgcAAj0G8d5vOfcM88BoEdaLYEOAAL9xuJ953VfAgAAAAj0jKSr58/7+AGghz9/Lzv6BgAE+ifFg+E8Vg0AemixZQYAINBXqE2O1ZO3cR89AAAAAj1bDoYDgB5bmre9HQAE+gq1ybFGsHoOAD03PO8EdwAQ6B9l9RwAAACBnqV09bzhIweA3rPFHQAE+kpWzwEgqwuOBYEOAJ9msAr/klbPAYAiGR4eDrfffrtBQAnMzMyEa9euGQQCfQWr5wCQoaV5M1iNHTt2hC9+8Ythy5YthgElcv78+fDaa69dj3W4ldLvN0ufe97wUQNAloFui/unefTRR8MTTzwhzqGEtm7dGr7yla+E+++/3zCodqAHq+cAQM7V6/Vw3333GQSU3COPPOKXcFQ30NPV83EfMwBka8hz0G8pbmsHquHhhx82BKoZ6InnfcQAkL2lqwL9ZrZv3x6GhoYMAioibnf3PU/lAr02OTYSrJ4DADm3bds2Q4CKsc2dygV6GucjPmIAyFazZQYAUPVAt70dAHJg8+yAIQBAVQO9Njk2nrzVfbwAAAAI9Gw956MFgHxotTwDHQAqGejpo9UaPloAyIfBOYEOAJUM9ODecwAAAAR6Loz7WAEgRxcbTTMAgMoFeno4nEerAUCONG1xB4DqBXpwOBwAAAACPVsOhwOAnF5s2OIOANUK9ODecwDI58XGrC3uAFC1QLe9HQAAAIGepdrk2GjyVvdxAgAAINCz5dnnAJBDm2YGDAEAKhbou32UAAAACPQM1SbHYpx79jkAUEjnzp0zBKiYmZkZQ6CcgZ54xscIAPnUd2nQED7F2bNnw7Vr1wwCKuK9997zPU+pA932dgCg0E6cOGEIUBEnT540BMoZ6La3AwBl8O6774Y333zTIKDE4qp5/GWc7e3cStH3ndneDgA5tjjTX5oTabvttddeux7qu3btClu3bjUQKJEzZ85cXzm/cuWKYVDqQG/4CAGAsoj3o8dXtH37dgOBgour5lbMqUSg1ybHRpO3uo8QAChrrANQLUXedeZwOADIudplG9wBoAqB7v5zAMi5xZYZAECpA702ORZPbh/18QEAACDQs2V7OwDkXG3O9nYAqEKgP+WjA4CcX2Q0+wwBACoQ6A0fHQAAAAI9Qx6vBgDF0LTFHQDKHejB6jkAFMJQS6ADQNkD3f3nAAAACPQcaPjYACD/+mYdEgcApQ309P7zER8bAORfqyXQAaC0gZ4Y9ZEBAAAg0LPn/nMAKIiheSvoAFDmQLeCDgAFsXRVoANAKQO9Njk2ItABAAAQ6NkT5wBQEEvznoEOAGUO9IaPCwCKYdj95wBQ6kB/zMcFAACAQM+eLe4AUBC2uANAuQO97uMCgIJcYCwIdAAoZaDXJscaPioAAAAEevZsbweAAlmaNwMAKGug7/RRAUCRAt0WdwAoa6BbQQcAAECg50DdRwUABbrAaJoBAAh0ACD7C4xZW9wBoHSB7gR3AAAABHo+jPiYAKA4mi0zAICyBroD4gCgQDbPDhgCAJQ00O/yMQEAACDQs2cFHQAKpNVyQBwAlDXQ3YMOAAUyOCfQAaCsgW4FHQAAAIEOALCmi4umGQBA6QLdM9ABoHiatrgDVNrZ1gVDKGOgAwAAUCzvL84YQkkD3QFxAAAABTK3dNUQShroDogDgIIZvGiDHkCVTV17xxBKGugAAAAUxHutDwyhxIF+l48IAACgGN5tvW8IJQ50W9wBoEA2zQwYAkCFvXHtt4ZQ4kAHAACgIE4sCHSBDgAAQKbi/ec/W/QM9DIHusesAUCB9F0aNASAinp5/lVDKHmguwcdAACgAH48/ytDKHmgAwAAkHO/uvYb29s7wD40AKBjFmf6/fYfSuR3s++EC3Pnw1uX377+93PNq+HNy2cMhk/49twvQ2i+1f6bP9gZatvuNhSBDgAArNeF+QvhxHu/CD/74P+Fb58/aSCsTmsuhLnftP96x2fFuUAHAADW42rrang1ifJvn/778P3LbxkIazf/uw/jfNeD5iHQAYA8qF3uD4vGAIUJ8+/99gfh705/L5xuzhkI6xNXz5OvJXEu0AGAnFlsmQEUwd+f/mH4L6e+LczZuKunxblABwAA1ireY/6N1/6b+8vpjPn3Q7jnbnFehUCvTY6N+HgAoDhqc85vhzz76dsvh786+U2r5nTG4nwIW/vFeVUCHQAolv5mnyFATh05eTT81ekpg6AzlhZD2NIKtS+I847/LM3rP9jCnmOecg8AABv017/4O3FOZ42EJM53mkOVAh0AKJamLe6QyziffPvHBkHn3NUXavUd5tAltrgDAB0x1BLoIM4ptW2bQu0P7zSHLvKTFAAASiYeCCfOEecCHQCoqL5Zh8RBHvxu9p3w73/x1wZBmeP8uEAHALiFVkugQ9autq6GiVf/1iAoe5yPCXQAACDXvvfbH4TvX37LICh1nJf5iV8CHQDoiKF5K+iQpQvzF8JLp75lEIhzgQ4AVN3SVYEOWfofv/mOISDOBXpXTfvuAACAW4ur505tR5wLdIEOAISleZvyIEtWzxHnAh0A4Lph959DZuLJ7VPvnzAIxLlABwAAsvTqe78Ip5tzBoE4F+hdN+27BQDyzxZ3yM7PPnjVEBDnAr0n3vQdAwAFuKBYEOiQlX84/4YhIM4FOgAAkKXfzb5jezviXKD3zLTvHADIv6V5M4AsvD3ztiEgzgW6QAcAVga6TXmQhbNXzxsC4lygAwAAWfvFhV8bAuJcoPf0AwMA8n5B0TQDAHEuzksd6D4sACjIBcWsTXmQhXevnDMExLlA76lpHxMAANygcq6eNQTEuUAX6ABAW7NlBgDiXJwLdAAgc5tnBwwBQJyL84oE+ps+JgAAAHEu0LM37WMCgPxqtRwQByDOxblABwAyNzgn0AHEuTivSqB7FjoAAIA4F+hZSz9QHyoA5PViomkGAOJcnFci0Fd8wABADjVtcQcQ5+JcoAMAAIhzcS7Qe8uj1gAAAMS5QM/Jhw0A5NDgRVvcAcS5OBfoAAAA4lycC/TeST/saR8XAAAgzsW5QM+eQAeAnNk0M2AIAOKcCgb6d31cAACAOBfnAj0fXwQAAADiXJwL9IxN+bgAIF/6Lg0aAoA4p2qB7qA4AABAnItzgZ6vLwoAAABxLs4FesYcFAcAOdI322cIAOKcigb6lI8MAPKj1RLoAOKcSgZ68oVhizsAACDOxblAz4kpHxsA5EPtcr8hAIhzKhzo7kMHgJxYbJkBgDinyoF+xMcGAACIc3Eu0DOW3ofuCwYAMlabs70dQJxT6UBPTfnoACDji4imE9wBxDkC3X3oAACAOBfnAj0X3IcOABlr2uIOIM4R6MkX0HTyNu3jA4DsDLUEOoA4p/KBnrKKDgAAiHNxLtBzwH3oAJChpXkzABDnCPRwfZt7XEH3RQUAmQW6Le4A4hyB/iHb3AEAAHEuzgV6DtjmDgAZGZr3HHQAcY5A/5AVdADIyNJVgQ4gzhHoqfSLTKQDAADiXJwL9Bz4po8RAHrLAXEA4hyBfiNW0AGgx4bdfw4gzhHoH5d+0U34KAEAAHEuzgV69mxzB4AessUdQJwj0G8o+QKM29x9EQJAry4gFgQ6IM7FOQL95tyLDgAAiHMEeg583ccJAD26gGiaASDOxTkC/SaSL8j4hTntIwWA7mvO2eIOiHNxjkC/NavoAACAOEeg58CEjxQAenABYYs7IM7FOQL9VjwTHQB6dAExa4s7IM7FOQL9033DxwoAAIhzBHrGki/WqeCwOADommbLDABxLs4R6Kv3oo8WALpj8+yAIQDiXJwj0FftSPLyxQsAAIhzBHqWHBYHAN3TajkgDhDn4hyBvjaeiQ4AXTA4J9ABcS7OEehrkHwhTwer6AAAgDhHoOeCR64BAADiHIGetfSRa1M+ZgDonMUZW9wBcS7OEejr45FrAACAOEegZ80qOgAAIM4R6PnhRHcA6JDBi7a4A+JcnCPQ1yn5Yj+SvE37uAEAQJyLcwR69tyLDgAA4lycI9CzlnzhT6TfBADAOm2aGTAEQJyLcwR6R7zgIwcAAHEuzhHoGXOiOwAAiHNxjkDPD/eiA8A69V0aNARAnItzBHpnWEUHAABxLs4R6Pmx10cPAADiXJwj0DOWfHNMJ28TPn4AWJu+2T5DAMS5OEegd1w80d03CgCsQasl0AFxLs4R6B2WfqN83ZcAAACIc3GOQM8+0g8kb9O+DABgdWqX+w0BEOfiHIHeNS8YAQCszmLLDABxLs4R6F2SfPMcCR67BgAA4lycI9BzwWPXAOBT1OZcNgDiXJwj0LssfezaiyYBALe4aGg6wR0Q5+Icgd6bSD8QHBgHAADiXJwj0HPBVncAuImmLe6AOBfnCPReSb65ppK3CZMAgE8aarlsAMS5OEeg91Z87JpvNAAAEOfiHIGepfQbzVZ3APiYpXkzAMS5OEeg9z7S47PRj5gEAKwMdJcNgDgX5wj0bMRVdN98AAAgzsU5Aj1LtroDwEcNzXsOOiDOQaBnF+lxm/tLJgEAISxdFeiAOAeBnq0Xk9e0MQAAgDgHgZ6h9BvyWZMAoMocEAeIcxDoeYn0+A36gkkAUFXD7j8HxDkI9BxFerwXfcokAABAnINAz17c6u6bFYDKscUdEOcg0HPF/egAVPaCYcElAyDOQaDnL9KngvvRAQBAnINAz0Wkx/vRj5gEAJW5YGiaASDOQaDn1970GxoASq8555IBEOcg0HMq/UaOke4bGgAAxDkI9Iwj/Xga6QBQ7gsGW9wBcQ4CvQCRHu9Ff9EkACj1BcOsSwZAnINAL0akH0jeJkwCAADEOQj07L0QHBoHQAk1W2YAiHMQ6AWSfrOPJa9p0wCgTDbPDhgCIM5BoBcy0p8NTnYHAECci3MQ6JlH+vU/BEQ6AADiXJyDQM9HpL9gEgCUQd+lQUMAxDkI9EJH+kTwjHQA2LCTH5wxBBDn4hyBTkci3Uo6AADiXJyDQM9BpL8UPCMdgAJbnMn2cuHslUs+BBDn4hyBTscifa9IBwCBDuJcnINAF+kAUFg//OAtQwBxLs4R6Ih0ABi8mP3lwtuXzvogQJyLcwQ6Ih0AsvbG2d8ZAohzcY5AR6QDQNZOCnQQ5+IcgY5IB6DKNs0M5OKf42fn3IcO4lycI9AR6QCQufML8+HVd6cNAsS5OEegI9IBIGs/fuuXhgDiXJwj0OlJpL9kEgDkTXMuP5cK33nn1+H8Vc9EB3EOAp3uR/oLydtekwAgT4Za+bpU+L+nraKDOAeBTm8ifUKkA8DN/ffpn4f5awsGAeIcBDo9i/Sx5OUPIQAy1zfbl6t/nnhY3HenX/HBgDgHgU7PIn1KpAOQB61WX+7+meIqunvRQZyDQKeXkR7/UHog/cMJAEjFVfTDr/7AIECcg0Cnp5Ee/1CKK+lHTAOALNQu5/NSIZ7o7rnoIM5BoNPzSE9ezwaPYQMgA4ut/P6z/cdXvuPAOBDnINDJJNSXH8PmDywACO2t7v/pZ98yCBDnINDJJNInQnvL+7RpANBttbn8Xyb88IO3wv88+Q8+LBDnINDJJNLjH2CPJ68p0wCgqxcJzb5C/HN+41c/CT9961c+MBDnINDJJNLjfelxJd196QCQ+A8//98iHcQ5CHQyDfV4X3o8QM4fagB03NJ8sS4TRDqIcxDoZB3p8RFsjwfPSweg0xcJC8W7TBDpcAMjA+IcBDo9jPTp5BUj3ZZ3ACovRrqD4yB112Ko7dwmzkGgk0Goxy3v8d50f+ABsGFL88X9Z48Hx/3nn37bc9Kp8DfwtRA2z4VafYc4B4FOhpE+lbw9kLyOmAYAGwv0Yl8mfOedX4d/OzUZTp1/24dJxS4IzyVxPhtqX9gpzqFgBoygfFqHp68mr78Z+OoDF5O//aPktclUAFirwQ+GQv98X6H/Ha62WuH/nH49XLx0Ljx8z+fC4IBLH8rlv576Xx/+TVw1v3KqfSDcri+LcxDo5CzUf5RE+t8kfzmavOomAsBaDJ+phdDsK8W/y6nL58P3Tr8aBhcXw/1b7hbqlCvQlxZDmD8TwtXkde89SZw/KM6hoPqMoBpqk2P7krf9yWvENABYjTt+dEcp/7221m4Lf1Z/LDxVfzTcNlTzQVNYM4uXwte+9RchNJP2XUr+gx2fFecg0ClQpNeTt0PJq2EaAFQ10Ff60z98KDy644Hwj3bUfeAUwtWl+XDy2m/CiYWT4W/nfxkWvn+s/V+IcxDoFDbUx5O3g8FqOgA3EQ+I2/zycGX+feOq+ld2fD58adt94fN3fzZs3XSnLwJy473WB2G6eTq8ce309Shf6Xqgi3MQ6BQ+0kfSSB83DQA+8XNirj/0vXlbbv55hub7wtLV3l22xGB/cMs94XN33h02DdXC9uEtYdsdxYr2/tuXQn//oi/mgrmwdCmcX5wJZ1sXwvvJ+9GF6Vv+7xdOvRFqD3xRnINApySh3khDfdQ0AAAQ5yDQyT7UHSIHAIA4B4FOTiLdtncAAMQ5CHRyFOqjaag3TAMAAHEOAp3sQz0GenwsW900AAAQ5yDQyT7Ux0P7/nShDgCAOAeBTg5C/UDy9nxwkBwAgDgX5yDQyTzSY5zvE+oAAOIcEOgIdQAAxDkIdLhBqO8O7lEHABDngEAnN7E+LtQBAMQ5INDJT6g30lBvmAYAgDgHBDrZh3o9DfW4Bd596gAA4hwQ6GQc6u5TBwAQ54BAJ2ex3kjengtW1QEAxDkg0MlFqC+vqsfHtI2aCACAOAeBDtnHej15Gw/tlfW6iQAAiHMQ6JB9rI+GD7fAi3UAAHEOAh3EOgCAOAcEOtwo1htpsLtnHQBAnINAhxzE+vIBc08Fp8EDAIhzEOiQm2BfXl1/Kn0X7AAA4hwEOuQs2ONf100FAECcg0CH7IO9nob66Ipot8oOAIhzQKBDzqL9sdBeZXf4HAAgzgGBDjkJ99EVsb4z/evlFwCAOAcEOuQg3pdDfSR8uNr+WPhwu7yt8wCAOAcEOuQw6Bs3+a+EPADQSy+JcwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP4/e3BAAgAAACDo/+t2BCoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWwkwAFRLN5caZ0qdAAAAAElFTkSuQmCC"

            let margin = 20
            console.log(pdfLogo)
            if (pdfLogo === "") {
                console.log("nada")
            } else {
                let dataUri = await this.urlContentToDataUri(pdfLogo)
                doc.addImage(dataUri, 10, 5)
                margin = 50
            }

            doc.setTextColor(100)
            autoTable(doc, {
                styles: { fillColor: [120, 120, 120] },
                head: [['DOCUMENTO', 'NÚMERO', "PÁGINA", 'FECHA']],
                body: [
                    ['FACTURA', `${invoiceNumber}`, '1/1', `${moment().format('DD/MM/YYYY')}`],
                ],
                margin: { top: margin + 45 },
                didDrawPage: function (data) {

                    // Header
                    doc.setFontSize(9);
                    doc.setTextColor(100);

                    doc.text(`Factura para:`, 110, margin);
                    doc.text(`${nombreEmpresa.toUpperCase()}`, 110, margin + 5);
                    doc.text(`${nieEmpresa.toUpperCase()}`, 110, margin + 10);
                    doc.text(`${adressEmpresa.toUpperCase()}`, 110, margin + 15);
                    doc.text(`${provinciaEmpresa.toUpperCase()}`, 110, margin + 20);
                    doc.text(`${codEmpresa.toUpperCase()}`, 110, margin + 25);

                    doc.text(`Facturado por:`, data.settings.margin.left, margin);
                    doc.text(`${pdfEmpresa.toUpperCase()}`, data.settings.margin.left, margin + 5);
                    doc.text(`${pdfDireccion.toUpperCase()}`, data.settings.margin.left, margin + 10);
                    doc.text(`${pdfProvincia.toUpperCase()}`, data.settings.margin.left, margin + 15);
                    doc.text(`${pdfCodigo.toUpperCase()}`, data.settings.margin.left, margin + 20);
                    doc.text(`Observaciones y método de pago en la última página.`, data.settings.margin.left, margin + 35);
                    if (pdfMail !== undefined) {
                        doc.text(`${pdfMail.toUpperCase()}`, data.settings.margin.left, margin + 25);
                        console.log("Pasa despues...")
                    }
                    if (pdfTelef !== undefined) {
                        doc.text(`${pdfTelef.toUpperCase()}`, data.settings.margin.left, margin + 30);
                    }

                    // Footer
                    var str = "Página " + doc.internal.getNumberOfPages();

                    // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                    var pageSize = doc.internal.pageSize;
                    var pageHeight = pageSize.height
                        ? pageSize.height
                        : pageSize.getHeight();
                    doc.text(`${str}`, data.settings.margin.left, pageHeight - 10);
                }
            })
            doc.autoTable({
                html: '#my-table',
                columnStyles: {
                    0: {

                        tableWidth: 100,
                    },
                    1: {
                        tableWidth: 400,
                    },
                    2: {
                        tableWidth: 100,
                    },
                    3: {
                        tableWidth: 100,
                    },
                    4: {
                        tableWidth: 100,
                    }
                },
                styles: { fillColor: [235, 235, 235] },
                theme: "plain"
            })
            doc.autoTable({
                html: '#my-table2', styles: { fillColor: [120, 120, 120] },
            })
            doc.addPage()
            /*
            if(pdfLogo === ""){
                console.log("nada")
            }else{
                let dataUri = await this.urlContentToDataUri(pdfLogo)
                doc.addImage(dataUri, 10,  5)
                margin = 50
            }
            */
            doc.autoTable({
                didDrawPage: function (data) {
                    doc.setFontSize(11);
                    doc.setTextColor(100);
                    //doc.text(`Pagar a: ${pdfPay}`, data.settings.margin.left, 20);
                    doc.text(`${observaciones}`, data.settings.margin.left, 25);
                    doc.setFontSize(9);
                    doc.setTextColor(100);
                    var str = "Página " + doc.internal.getNumberOfPages();
                    var pageSize = doc.internal.pageSize;
                    var pageHeight = pageSize.height
                        ? pageSize.height
                        : pageSize.getHeight();
                    doc.text(`${str}`, data.settings.margin.left, pageHeight - 10);
                }
            })
            let objeto = {
                nombreEmpresa: this.social.toUpperCase(),
                nieEmpresa: this.nie.toUpperCase(),
                adressEmpresa: this.adress.toUpperCase(),
                codEmpresa: this.cod,
                provinciaEmpresa: this.provincia,
                invoiceNumber: this.numberinvoice,
                pdfEmpresa: this.miEmpresa,
                pdfProvincia: this.miProvincia,
                pdfCodigo: this.miCodPostal,
                pdfInvoice: this.numberinvoice,
                pdfDireccion: this.miDireccion,
                //let pdfPay = this.payto
                pdfMail: this.miEmail,
                pdfTelef: this.miTlfn,
                pdfLogo: this.miLogo,
                observaciones: this.observations,
                articles: this.invoiceList,
                state: "Pendiente",
                total: this.finalList,
                when: moment().format("MM-DD-YYYY")
            }
            if (e === undefined) {
                await baseConnectPut(`user/${this.objectuser.index}/presupuestos/${this.numberinvoice}`, objeto)
                await this.search()
            }
            await doc.save(`factura${pdfInvoice}.pdf`)
            this.file = doc.output("blob")

        },
        async presentAlert() {
            if (this.social === "" || this.nie === "" || this.numberinvoice === 0) {
                this.presentToast("Por favor, rellene los campos de empresa a facturar. 😔")
            } else {
                const alert = await alertController.create({
                    header: `Añadir nuevo`,
                    message: `Añade un artículo o servicio nuevo a esta factura`,
                    inputs: [
                        {
                            placeholder: 'Descripción artículo',
                            id: "concept"
                        },
                        {
                            type: 'number',
                            placeholder: 'Precio',
                            id: "value",
                        },
                        {
                            type: 'number',
                            placeholder: 'Cantidad',
                            id: "ud",
                        },
                    ],
                    buttons: [{
                        text: "Añadir",
                        handler: () => {
                            let concept = document.querySelector("#concept").value
                            let value = document.querySelector("#value").value
                            let ud = document.querySelector("#ud").value
                            if (concept === "" || value === "") {
                                this.presentToast("Concepto vacio o ninguna unidad seleccionada. ❌")
                            } else {
                                let objeto = {
                                    concept: concept,
                                    price: value,
                                    ud: ud
                                }
                                this.invoiceList.push(objeto)
                                this.totalPrice = 0
                                this.invoiceList.forEach((element, index) => {

                                    let finalPrice = parseFloat(element.price) * parseFloat(element.ud)
                                    this.totalPrice = parseFloat(this.totalPrice) + parseFloat(finalPrice)
                                    if (index === (this.invoiceList.length - 1)) {
                                        this.finalList = []
                                        if (document.querySelector("#iva").value !== "Sin iva") {
                                            let irpf = ""
                                            if (this.irpf === "") {
                                                irpf = 0
                                            } else {
                                                irpf = (parseFloat(this.totalPrice) * parseFloat(this.irpf)) / 100
                                            }
                                            let iva = (parseFloat(this.totalPrice) * parseFloat(document.querySelector("#iva").value)) / 100
                                            this.ivaDeff = document.querySelector("#iva").value
                                            let objeto = {
                                                base: this.totalPrice,
                                                irpf: irpf.toFixed(2),
                                                iva: (iva).toFixed(2),
                                                total: ((parseFloat(this.totalPrice) - irpf) + parseFloat(iva)).toFixed(2)
                                            }
                                            this.finalList.push(objeto)
                                        } else {
                                            let irpf = (parseFloat(this.totalPrice) * parseFloat(this.irpf)) / 100
                                            let objeto = {
                                                base: this.totalPrice,
                                                irpf: irpf.toFixed(2),
                                                iva: 0,
                                                total: (parseFloat(this.totalPrice) - irpf)
                                            }
                                            this.finalList.push(objeto)
                                        }
                                    }
                                });
                            }
                        }
                    },
                    { text: "Atrás" }
                    ],
                });
                await alert.present();
            }
        },
        async presentToast(msg) {
            const toast = await toastController.create({
                message: msg,
                duration: 2000,
                position: "top"
            });

            await toast.present();
        },
        async remove(index) {
            this.invoiceList.splice(index, 1)
            this.recargarIva()
        },
        recargarIva() {
            this.totalPrice = 0
            this.invoiceList.forEach((element, index) => {

                let finalPrice = parseFloat(element.price) * parseFloat(element.ud)
                this.totalPrice = parseFloat(this.totalPrice) + parseFloat(finalPrice)
                if (index === (this.invoiceList.length - 1)) {
                    this.finalList = []
                    if (document.querySelector("#iva").value !== "Sin iva") {
                        let irpf = ""
                        if (this.irpf === "") {
                            irpf = 0
                        } else {
                            irpf = (parseFloat(this.totalPrice) * parseFloat(this.irpf)) / 100
                        }
                        let iva = (parseFloat(this.totalPrice) * parseFloat(document.querySelector("#iva").value)) / 100
                        this.ivaDeff = document.querySelector("#iva").value
                        let objeto = {
                            base: this.totalPrice,
                            irpf: irpf.toFixed(2),
                            iva: (iva).toFixed(2),
                            total: ((parseFloat(this.totalPrice) - irpf) + parseFloat(iva)).toFixed(2)
                        }
                        this.finalList.push(objeto)
                    } else {
                        let irpf = (parseFloat(this.totalPrice) * parseFloat(this.irpf)) / 100
                        let objeto = {
                            base: this.totalPrice,
                            irpf: irpf.toFixed(2),
                            iva: 0,
                            total: (parseFloat(this.totalPrice) - irpf)
                        }
                        this.finalList.push(objeto)
                    }
                }
            });
        },
        async agregarDato() {
            let id = Date.now()
            let miNie = await Preferences.get({ key: 'nie' })
            await storageRef.child(`${miNie.value.toUpperCase()}`).child("facturas").child(`${moment().format('MM-YYYY')}`).child(`factura${this.numberinvoice}-${id}.pdf`).put(this.file)
            const urlDescarga = await storageRef.child(`${miNie.value.toUpperCase()}`).child("facturas").child(`${moment().format('MM-YYYY')}`).child(`factura${this.numberinvoice}-${id}.pdf`).getDownloadURL()
            return urlDescarga
        },
        async meterFacturaServidor() {
            let miNie = await Preferences.get({ key: 'nie' })
            let link = await this.agregarDato()
            let objeto = {
                id: Date.now(),
                date: moment().format('L'),
                link: link,
                social: this.social,
                nie: this.nie,
                adress: this.adress,
                cod: this.cod,
                provincia: this.provincia,
                price: this.finalList[0].total
            }
            await baseConnectPost(`invoices/${miNie.value}/${moment().format('MM-YYYY')}`, objeto)
            this.presentToast("Factura creada con éxito. 🥳")
        },
        async meterEmpresaServidor() {
            let miIndex = await Preferences.get({ key: 'index' })
            let objeto = {
                id: Date.now(),
                social: this.social.toUpperCase(),
                nie: this.nie.toUpperCase(),
                adress: this.adress.toUpperCase(),
                cod: this.cod,
                provincia: this.provincia
            }
            await baseConnectPost(`user/${miIndex.value}/datosempresas`, objeto)
        },
        seleccionarEmpresa(e) {
            if (e.target.value !== "1") {
                let index = e.target.value
                this.comprobatesocial = this.bussinesList[index].social
                this.social = this.bussinesList[index].social
                this.nie = this.bussinesList[index].nie
                this.adress = this.bussinesList[index].adress
                this.cod = this.bussinesList[index].cod
                this.provincia = this.bussinesList[index].provincia
                this.remember = false
            }
        },
        async cargarFacturas() {
            let miNie = await Preferences.get({ key: 'nie' })
            let datos = await baseConnect(`invoices/${miNie.value}/${moment().format('MM-YYYY')}`)
            this.baseInvoiceList = datos
        },
        async cargarFecha() {
            this.presentToast("Cargando facturas.")
            let fecha = moment(this.date).format("MM-YYYY")
            let miNie = await Preferences.get({ key: 'nie' })
            let datos = await baseConnect(`invoices/${miNie.value}/${fecha}`)
            if (datos === null) {
                this.presentToast("No hay facturas en este mes.")
            } else {
                this.presentToast("Facturas cargadas. 🥳")
            }
            this.baseInvoiceList = datos
        },
        async eliminarFactura(index, date) {
            let miNie = await Preferences.get({ key: 'nie' })
            let data = moment(date).format("MM-YYYY")
            await baseConnectDelete(`invoices/${miNie.value}/${data}/${index}`)
            this.presentToast("Factura eliminada. 🥳")
            this.cargarFecha()
        },
        async urlContentToDataUri(url) {
            return fetch(url)
                .then(response => response.blob())
                .then(blob => new Promise(callback => {
                    let reader = new FileReader();
                    reader.onload = function () { callback(this.result) };
                    reader.readAsDataURL(blob);
                }));
        },
        async recogerDatos(object) {
            this.social = object.name
            this.nie = object.nie
            this.numberinvoice = Date.now()
            this.objectuser = object
            /*
                        social : "",
            nie : "",
            adress : "",
            cod : "",
            provincia : "",
            */
        },
        anadirComplementos() {
            if (this.complementsname.length === 0) {
                new Toast("Complemento vacio, no se puede añadir.")
            } else {
                let id = Date.now()
                let date = moment().format("DD/MM/YYYY, HH:mm")
                const objeto1 = {
                    id: id,
                    complement: this.complementsname,
                    price: this.complementsprice,
                    quantity: this.complementsq,
                    check: false,
                    date: date,
                }
                this.complements.push(objeto1)
                let objeto = {
                    concept: this.complementsname,
                    price: this.complementsprice,
                    ud: this.complementsq
                }
                this.invoiceList.push(objeto)
                this.totalPrice = 0
                this.invoiceList.forEach((element, index) => {

                    let finalPrice = parseFloat(element.price) * parseFloat(element.ud)
                    this.totalPrice = parseFloat(this.totalPrice) + parseFloat(finalPrice)
                    if (index === (this.invoiceList.length - 1)) {
                        this.finalList = []
                        if (document.querySelector("#iva").value !== "Sin iva") {
                            let irpf = ""
                            if (this.irpf === "") {
                                irpf = 0
                            } else {
                                irpf = (parseFloat(this.totalPrice) * parseFloat(this.irpf)) / 100
                            }
                            let iva = (parseFloat(this.totalPrice) * parseFloat(document.querySelector("#iva").value)) / 100
                            this.ivaDeff = document.querySelector("#iva").value
                            let objeto = {
                                base: this.totalPrice,
                                irpf: irpf.toFixed(2),
                                iva: (iva).toFixed(2),
                                total: ((parseFloat(this.totalPrice) - irpf) + parseFloat(iva)).toFixed(2)
                            }
                            this.finalList.push(objeto)
                        } else {
                            let irpf = (parseFloat(this.totalPrice) * parseFloat(this.irpf)) / 100
                            let objeto = {
                                base: this.totalPrice,
                                irpf: irpf.toFixed(2),
                                iva: 0,
                                total: (parseFloat(this.totalPrice) - irpf)
                            }
                            this.finalList.push(objeto)
                        }
                    }
                });
                this.complementsname = ""
                this.complementsprice = 0
                new Toast("Complemento añadido.")
            }
        },
        async cambiarestadopresupuesto(e, what) {
            await baseConnectPut(`user/${this.indexUser}/presupuestos/${e}/state`, what.target.value)
            await this.search()
        },
        borrarComplements(id) {
            const complementostodos = this.complements
            this.complements = []
            complementostodos.forEach(element => {
                if (element.id !== id) {
                    this.complements.push(element)
                }
            })
        },
        comprobarRemember() {
            //let texto = document.querySelector("#selectempresa").textContent 
            if (document.querySelector("#selectempresa").value !== "1") {
                this.presentToast("Por favor seleccione 'Ninguna' en empresas guardadas para guardar. 😔")
                this.remember = false
            }
        },
        txNombres(event) {
            if ((event.keyCode != 32) && (event.keyCode < 48) || (event.keyCode > 57) && (event.keyCode < 65) || (event.keyCode > 90) && (event.keyCode < 97) || (event.keyCode > 122))
                event.returnValue = false;
        },
        async search() {
            this.totalInvoices = 0
            this.totalPendientes = 0
            this.totalAceptados = 0
            this.totalRechazados = 0
            this.bestPresupuesto = 0
            this.totalPresupuestos = 0
            this.totalPresupuestosAceptados = 0
            this.puntuacionCliente = 0
            this.shownotes = false
            this.showpresupuesto = false
            this.spinnerShow = false
            try {
                new Toast("Buscando cliente. 🧐")
                let datos = await baseConnectSearch(`user`, "user", "nie", this.usersearch.toUpperCase())
                if (datos === null) {
                    new Toast("Cliente no encontrado. 🧐")
                    this.spinnerShow = true
                } else {
                    this.spinnerShow = true
                    this.showpresupuesto = true
                    new Toast("Usuario encontrado. 🧐")
                    let datosDeff = Object.values(datos)
                    this.data = datosDeff
                    this.indexUser = datosDeff[0].index
                    if (datosDeff[0].presupuestos === undefined) {
                        this.showpresupuesto = false
                    } else {
                        const presupuestosArray = Object.values(datosDeff[0].presupuestos)
                        presupuestosArray.forEach(element => {
                            this.totalInvoices++
                            if (element.state === "Pendiente") {
                                this.totalPendientes++
                            } else if (element.state === "Aceptado") {
                                this.totalAceptados++
                                this.totalPresupuestosAceptados = (parseInt(this.totalPresupuestosAceptados) + parseInt(element.total[0].total)).toFixed(2)
                            } else if (element.state === "Rechazado") {
                                this.totalRechazados++
                            }
                            this.totalPresupuestos = (parseInt(this.totalPresupuestos) + parseInt(element.total[0].total)).toFixed(2)
                            if (element.total[0].total > this.bestPresupuesto) {
                                this.bestPresupuesto = element.total[0].total
                            }
                        })

                        if (presupuestosArray.length / 2 > this.totalAceptados) {
                            this.puntuacionCliente = "Normal"
                        } else {
                            this.puntuacionCliente = "Vip"
                        }
                    }
                    if (datosDeff[0].notes === undefined) {
                        this.shownotes = false
                    } else {
                        this.shownotes = true
                        this.listNotes = datosDeff[0].notes
                    }
                }
            } catch (error) {
                this.spinnerShow = true
                console.log(error)
                new Toast("Algún error ha sucedido. 🧐")
            }
        },
        async crearnotas() {
            const id = Date.now()
            const objeto = {
                note: this.clientnote,
                check: this.checknote,
                when: moment().format("MM-DD-YYYY, HH:mm")
            }
            await baseConnectPut(`user/${this.objectuser.index}/notes/${id}`, objeto)
            await this.search()
            this.clientnote = ""
            this.checknote = false
        },
        async deletecheck(e) {
            await baseConnectDelete(`user/${this.indexUser}/notes/${e}`)
            new Toast("Registro borrado ✅")
        },
        async changecheck(e, index) {
            let select = document.querySelector(`#a${index}`).value
            console.log(select)
            let check = false
            if (e === false || e === "false") {
                check = true
            } else {
                check = false
            }
            await baseConnectPut(`user/${this.indexUser}/notes/${index}/check`, check)
            new Toast("Registro cambiado ✅")
        }
    }
}
</script>

<style></style>