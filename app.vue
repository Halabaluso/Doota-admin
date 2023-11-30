<template>
    <div class="drawer">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <!-- Page content here -->
    <div v-if="booleanShow" >
      <CommonHeaderComponent/>
    </div>
    <NuxtLayout>
        <NuxtPage/>
    </NuxtLayout>
  </div> 
  <div class="drawer-side">
    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    <CommonMenuRouter/>
  </div>
</div>
</template>

<script>
import { useRouter } from "vue-router"
import { Preferences } from "@capacitor/preferences"
import { RouterView } from "vue-router"
import moment from "moment"
import { baseConnectPut } from './db/db'

export default {
  name: 'App',
  components: {
    RouterView
  },
  data(){
    return{
      router : useRouter(),
      booleanShow: false
    }
  },
  async mounted(){
    const userData = await Preferences.get({
      key : "name"
    })

    if(userData.value === undefined || userData.value === null){
      this.router.push("/")
    }else{
      this.booleanShow = true
      this.router.push("/documents")
      let object = {
        email: "usuario1@doota.com",
        id: "",
        index: Date.now(),
        login: "",
        loginerror: "",
        name: "DIETA Y SALUD CARDIOVASCULAR SL",
        password: "U2FsdGVkX1/Mi5YWd7yUNZFO5bD2HyQsHgdwAbycTJs=",
        register: "07/27/2023",
      }
      delete object.nie
      delete object.number
      object.login = moment().format("DD-MM-YYYY, HH:mm")
      object.id = Date.now()
      object.loginerror = false
      //await baseConnectPut(`loginconsole/${object.id}`, object)
    }
  }
}
</script>
