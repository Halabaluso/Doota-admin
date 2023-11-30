<template>
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
            <NuxtLink to="/searchdocuments" role="tab" class="tab">Buscar</NuxtLink>
            <NuxtLink to="/singdocuments" role="tab" class="tab">Firmar</NuxtLink>
            <NuxtLink to="/searchsigndocuments" role="tab" class="tab tab-active">Buscar</NuxtLink>
        </div>
        <TablesSearchSignDocuments/>
    </div>
</template>
<script>

</script>