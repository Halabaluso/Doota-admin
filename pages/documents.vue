<template>
    <div>
        <div :class="{ hidden: spinnerShow }" class="flex flex-col items-center justify-center h-screen">
            <CirclesToRhombusesSpinner :animation-duration="1000" :size="60" color="#ff1d5e" />
        </div>
        <div class="m-5 text-gray-700 flex flex-row items-center">
                <div class="p-4 bg-primary rounded-lg text-white text-2xl mr-5">
                    <Icon name="dashicons:book-alt"></Icon>
                </div>
                <div>
                    <p><span class="text-gray-400">Inicio</span> / Documentos</p>
                    <p class="font-bold text-lg">Enviar documentos</p>
                </div>
            </div>
        <div role="tablist" class="tabs tabs-boxed m-4">
            <NuxtLink to="/documents" role="tab" class="tab tab-active">Enviar</NuxtLink>
            <NuxtLink to="/searchdocuments" role="tab" class="tab">Buscar</NuxtLink>
            <NuxtLink to = "/singdocuments" role="tab" class="tab">Firmar</NuxtLink>
            <NuxtLink to="/searchsigndocuments" role="tab" class="tab">Buscar firmas</NuxtLink>
        </div>
        <div :class="{ hidden: !spinnerShow }">
            <FormsSendDocuments />
        </div>
    </div>
</template>
  
<script>
import { CirclesToRhombusesSpinner } from 'epic-spinners'
export default {
    data() {
        return {
            spinnerShow: true,
        }
    },
    components: {
        CirclesToRhombusesSpinner,
    },
}
</script>
  
<style></style>