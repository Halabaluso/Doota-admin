<template>
    <div>
        <div>
            <div class="m-5 text-gray-700 flex flex-row items-center">
                <div class="p-4 bg-primary rounded-lg text-white text-2xl mr-5">
                    <Icon name="dashicons:book-alt"></Icon>
                </div>
                <div>
                    <p><span class="text-gray-400">Inicio</span> / Documentos</p>
                    <p class="font-bold text-lg">Buscar documentos</p>
                </div>
            </div>
            <div role="tablist" class="tabs tabs-boxed m-4">
                <NuxtLink to="/documents" role="tab" class="tab">Enviar</NuxtLink>
                <NuxtLink to="/searchdocuments" role="tab" class="tab tab-active">Buscar</NuxtLink>
                <NuxtLink to="/singdocuments" role="tab" class="tab">Firmar</NuxtLink>
                <NuxtLink to="/searchsigndocuments" role="tab" class="tab">Buscar</NuxtLink>
            </div>
            <TablesSearchDocumentsByDate />
            <TablesSearchDocumentsByNie />
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
            spinnerShow: true,
        }
    },
}
</script>
    
<style></style>