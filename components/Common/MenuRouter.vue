<template>
    <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <!-- Sidebar content here -->
        <img src = "../../img/logo.png" />
        <p class = "mb-2 mt-5 font-bold italic"><Icon name = "dashicons:arrow-right-alt2"/> Herramientas de gestión</p>
        <li>
            <NuxtLink to="/documents">
                <Icon name = "dashicons:media-document" class = "text-primary text-xl"/> Gestión de documentos
            </NuxtLink>
        </li>
        <li>
            <NuxtLink to="/users">
                <Icon name = "dashicons:admin-users" class = "text-primary text-xl"/> Gestión de usuarios
            </NuxtLink>
        </li>
        <li>
            <NuxtLink to="/tickets">
                <Icon name = "dashicons:tickets-alt" class = "text-primary text-xl"/> Gestión de tickets e incidencias
            </NuxtLink>
        </li>
        <li>
            <NuxtLink to="/invoices">
                <Icon name = "dashicons:category"  class = "text-primary text-xl" /> Creación de presupuestos
            </NuxtLink>
        </li>
        <p class = "mb-2 mt-5 font-bold italic"><Icon name = "dashicons:arrow-right-alt2"/> Herramientas de Marketing</p>
        <li>
            <NuxtLink to="/emails">
                <Icon name = "dashicons:email"  class = "text-primary text-xl" /> Email Marketing
            </NuxtLink>
        </li>
        <p class = "mb-2 mt-5 font-bold italic"><Icon name = "dashicons:arrow-right-alt2"/> Configuración de empresa</p>
        <li>
            <NuxtLink to="/config">
                <Icon name = "dashicons:admin-generic"  class = "text-primary text-xl" /> Configuración Doota
            </NuxtLink>
        </li>
    </ul>
</template>
<script>

</script>