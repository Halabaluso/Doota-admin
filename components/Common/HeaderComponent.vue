<template>
    <div class="flex flex-row items-center">
        <div class = "flex flex-col md:flex-row justify-between w-full p-1 bg-secondary text-xs items-center rounded-t">
            <p class="font-bold">{{ data.name }} 👋</p>
            <div class="grid grid-rows-2 md:grid-cols-2 md:gap-4">
                <p>Email: {{ data.email }} </p>
                <p>ID: {{ data.index }} </p>
            </div>
        </div>
    </div>
    <div class="navbar bg-base-100">
        <div class="flex-none">
            <label for="my-drawer" class="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="inline-block w-5 h-5 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16">
                    </path>
                </svg>
            </label>
        </div>
        <div class="flex-1">
            <div class="flex flex-row items-center">
                <img src="../../img/logo.png" class="w-32" />
            </div>
        </div>
        <div class="flex-none">
            <button class="btn btn-square btn-ghost">
                <Icon name="dashicons:dismiss" class="text-2xl text-error" />
            </button>
        </div>
    </div>
</template>
<script>
import { Preferences } from '@capacitor/preferences'
import moment from 'moment'
export default {
    data() {
        return {
            data: "",
            thismoment: ""
        }
    },
    async mounted() {
        const userData1 = await Preferences.get({
            key: "clientdata"
        })
        const userData = JSON.parse(userData1.value)
        this.data = userData
        this.thismoment = moment().format("MM-DD-YYYY, HH:mm")
    },
}
</script>
<style lang="">
    
</style>