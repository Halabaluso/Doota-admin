<template>
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
                <NuxtLink to="/tickets" role="tab" class="tab">Tickets pendientes</NuxtLink>
                <NuxtLink to="/ticketsbydni" role="tab" class="tab">Buscar por DNI</NuxtLink>
                <NuxtLink to="/ticketsbydate" role="tab" class="tab tab-active">Buscar tickets por mes</NuxtLink>
            </div>
    <TicketsTicketbydate/>
</template>