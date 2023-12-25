<template>
    <div class="m-5 rounded-lg bg-white p-5">
        <p class="font-bold text-xl text-primary"><Icon name = "dashicons:id" ></Icon> Buscar documentos por fecha</p>
        <div>
            <div class="form-control mt-5">
                <div class="input-group flex flex-row items-center">
                    <input @keypress="txNombres($event)" v-model="nieSearch" type="text" placeholder="20034789X"
                        class="input input-bordered" />
                    <button @click="buscarDni" class="btn btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <div class="my-5">
            <div class="overflow-x-auto">
                <table class="table w-full">
                    <!-- head -->
                    <thead>
                        <tr>
                            <th></th>
                            <th> De</th>
                            <th> Datos</th>
                            <th> Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- row 1 -->
                        <tr v-for="(files, index, i) in searchFiles" :key="files" class="text-xs">
                            <th>{{ i }}</th>
                            <td>
                                <div>
                                    <p class="italic">ID: {{ files.id }}</p>
                                    <p>DNI: <span class="font-bold">{{ files.nie }}</span> </p>
                                    <p class="italic">NOMBRE ARCHIVO: {{ files.idFile }}</p>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p class="font-bold">{{ files.fecha }}</p>
                                    <p class="italic">{{ files.observations }}</p>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <a class="btn btn-sm" :href="files.link" target="_blank">Ver documento</a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
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
            nie: "",
            nieSearch: "",
            searchFiles: [],
            spinnerShow: true,
        }
    },
    methods: {
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