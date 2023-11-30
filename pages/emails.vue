<template>
    <div>
        <div class="m-5 text-gray-700 flex flex-row items-center">
            <div class="p-4 bg-primary rounded-lg text-white text-2xl mr-5">
                <Icon name="dashicons:media-document"></Icon>
            </div>
            <div>
                <p><span class="text-gray-400">Inicio</span> / Documentos</p>
                <p class="font-bold text-lg">Facturas y presupuestos</p>
            </div>
        </div>
        <div class="flex flex-row bg-secondary m-5 p-5 rounded-lg items-center">
            <Icon name="dashicons:email" class="text-2xl mr-2"></Icon>
            <p class="italic">Envía correos masivos a tus usuarios a través de la integración con la plataforma
                de envíos de Conecta-2s.</p>
        </div>
        <div class="bg-white m-5 rounded-lg ">
            <p class="font-bold text-xl mt-10 text-primary">
                <Icon name="dashicons:image-flip-horizontal"></Icon> Enviar mails
            </p>
            <div class="my-4">
                <label class="label">
                    <span class="label-text"><i class="fa-solid fa-envelope-open-text"></i> Asunto correo</span>
                </label>
                <input v-model="asunto" type="text" placeholder="Recordatorio día 5 de Julio."
                    class="input input-bordered w-full" />
            </div>
            <div class="my-4">
                <label class="label">
                    <span class="label-text"><i class="fa-solid fa-square-envelope"></i> Cuerpo correo</span>
                </label>
                <textarea v-model="cuerpo" type="text"
                    placeholder="Estimados clientes. Le recordamos que día 5 de julio cerramos por la tarde."
                    class="input input-bordered w-full h-60" />
            </div>
            <label for="mailmasivo" class="btn btn-primary">Enviar mail masivo</label>
        </div>
        <!-- Put this part before </body> tag -->
        <input type="checkbox" id="mailmasivo" class="modal-toggle" />
        <div class="modal">
            <div class="modal-box">
                <h3 class="font-bold text-lg"><i class="fa-solid fa-envelopes-bulk"></i> Envio de mail masivo</h3>
                <p class="py-4 text-red-700"><i class="fa-solid fa-circle-exclamation"></i> ¿Estás seguro de que deseas
                    enviar este mail masivo a todos tus clientes?</p>
                <div class="modal-action">
                    <label @click="sendMail" for="mailmasivo"
                        class="btn btn-primary">Enviar</label>
                    <label for="mailmasivo" class="btn">atrás</label>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import Toast from "awesome-toast-component"
import { enviarMail, baseConnect } from "../db/db"
export default {
    data() {
        return {
            asunto: "",
            cuerpo: ""
        }
    },
    methods: {
        async sendMail() {
            if (this.asunto === "" || this.cuerpo === "") {
                new Toast("Campos vacios. 🤔")
            } else {
                try {
                    let footerData = await baseConnect("empresa")
                    let footer = ``
                    if (footerData !== null) {
                        footer = `${footerData.nombre}. Dirección ${footerData.direccion}. Email ${footerData.email} || Teléfono ${footerData.telef}`
                    }
                    await enviarMail("all", this.asunto, this.cuerpo, footer)
                    this.asunto = "",
                        this.cuerpo = ""
                    new Toast("Enviando correos. Se enviarán de 3 en 3 para evitar spam. Puedes cerrar esta ventana. 😉")
                } catch (error) {
                    console.log(error)
                    new Toast("Error al enviar correos, algo ha sucedido. 🤔")
                }
            }
        },
    }
}
</script>
  
<style></style>