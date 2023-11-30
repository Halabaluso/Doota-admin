<template>
    <div class="m-5 text-gray-700 flex flex-row items-center">
        <div class="p-4 bg-primary rounded-lg text-white text-2xl mr-5">
            <Icon name="dashicons:search"></Icon>
        </div>
        <div>
            <p><span class="text-gray-400">Inicio</span> / Documentos</p>
            <p class="font-bold text-lg">Buscar usuarios</p>
        </div>
    </div>
    <div role="tablist" class="tabs tabs-boxed m-4">
        <NuxtLink to="/users" role="tab" class="tab">Nuevos usuarios</NuxtLink>
        <NuxtLink to="/allusers" role="tab" class="tab">Todos los usuarios</NuxtLink>
        <NuxtLink to="/searchusers" role="tab" class="tab tab-active">Buscar usuarios</NuxtLink>
    </div>
    <TablesSearchUsers />
</template>