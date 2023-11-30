<template>
    <form @submit.prevent="enviarDatosFirebase" id="enviodocumento" class="m-5 text-gray-700 bg-white rounded-lg shadow">
        <p class="font-bold text-xl mt-10"><Icon name = "dashicons:cloud-upload"/> Subir documentos</p>
        <div class="flex flex-col lg:flex-row mt-4">
            <div class="flex flex-col flex-1 m-1">
                <label class="mb-1 text-sm" for=""><Icon name = "dashicons:id-alt"></Icon> DNI/NIE/PASAPORTE</label>
                <input @keypress="txNombres($event)" v-model="nie" type="text" placeholder="34565778X"
                    class="input w-full input-bordered" />
            </div>
            <div class="flex flex-col flex-1 m-1">
                <label class="mb-1 text-sm" for=""><Icon name = "dashicons:cloud"></Icon> Subir archivo</label>
                <input @change="insertarPdf($event)" type="file" class="file-input file-input-bordered w-full "
                    accept="application/pdf" />
            </div>
        </div>
        <div class="w-full m-1 mt-4">
            <label class="mb-1 text-sm" for=""><Icon name = "dashicons:welcome-view-site"></Icon> Observaciones</label>
            <textarea v-model="observations" class="textarea textarea-bordered w-full h-60"
                placeholder="Documento de acreditación para juzgado."></textarea>
        </div>
        <button type = "submit"  class="btn btn-primary mt-5">Enviar documento <Icon name = "dashicons:cloud-saved" class = "text-2xl"/></button>
    </form>
</template>
<script>
import { CirclesToRhombusesSpinner } from 'epic-spinners'
import Toast from "awesome-toast-component"
import moment from "moment"
import { storageRef } from "../plugins/firebase.client";
import { baseConnectPut,} from "../db/db.js"
export default {
  data(){
    return{
      file : "",
      datoFile : "",
      urlFile : "",
      nie : "",
      telef : "",
      observations : "",
      sendMail : "",
      spinnerShow : true,
    }
  },
  components: {
    CirclesToRhombusesSpinner,
  },
  methods:{
    async insertarPdf(event){
        this.file = event.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = (e) => {
            this.datoFile = e.target.result
            new Toast("Documento insertado correctamente")
        }
    },
    async agregarDato(){
        await storageRef.child(`${this.nie.toUpperCase()}`).child(this.file.name).put(this.file)
        const urlDescarga = await storageRef.child(`${this.nie.toUpperCase()}`).child(this.file.name).getDownloadURL()
        return urlDescarga
    },
    async enviarDatosFirebase(){
      if(this.datoFile !== "" || this.nie !== "" || this.nie.length > 7){
        document.querySelector("#enviodocumento").classList.add("#opacity-5")
        new Toast("Enviando documentos, espere... ⏳")
        this.spinnerShow = false
        try {
              await this.agregarDato()
              let linkDocument = await this.agregarDato()
              let idDeff = Date.now()
              let objeto = {
                  id : idDeff,
                  nie: this.nie.toUpperCase(),
                  send : moment().format('LLLL'),
                  today : moment().format('L'),
                  hours : moment().format('LTS'),
                  link : linkDocument,
              }
              /*
              let userData = await baseConnectSearch("user" ,"user" ,"nie" , this.nie.toUpperCase())
              let footerData = await baseConnect(`empresa`)
              if(userData !== null){
                try {
                    let msg = "Nuevo documento enviado en su app de jano."
                    // eslint-disable-next-line
                    let msg2 = `<p>Le informamos de que ha recibido un nuevo documento el día ${objeto.today} a las ${objeto.hours}.</p>
                    <p>Observaciones de documento: ${this.observations}. <p>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%;" width="100%">
                        <tbody>
                          <tr>
                            <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                <tbody>
                                  <tr>
                                    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #3498db;" valign="top" align="center" bgcolor="#3498db"> <a href="${objeto.link}" target="_blank" style="border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; background-color: #3498db; border-color: #3498db; color: #ffffff;">Ver documento</a> </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    `
                    let footer = ``
                    if(footerData !== null){
                      footer = `${footerData.nombre} Dirección ${footerData.direccion}. Email ${footerData.email} || Teléfono ${footerData.telef}`
                    }
                    await enviarMail(userData.email, msg, msg2, footer)
                } catch (error) {
                  console.log(error)
                  console.log("Email no enviado")
                }
              }
              */
              await baseConnectPut(`files/${this.nie.toUpperCase()}/${idDeff}`, objeto)
              await baseConnectPut(`historial/${(moment().format('L')).substr(0,2)}-${(moment().format('L')).substr(3,2)}-${(moment().format('L')).substr(6,4)}//${idDeff}`, objeto)
              document.querySelector("#enviodocumento").classList.remove("#opacity-5")
              this.nie = ""
              this.observations = ""
              this.spinnerShow = true
              new Toast("Documento enviado con éxito.")
        } catch (error) {
          console.log(error)
          this.spinnerShow = true
          new Toast("Algo ha sucedido al enviar el documento, posible fallo de conexión.")
        }
      }else{
        new Toast("Campos vacios o incorrectos")
      }
    },
    txNombres(event) {
      if ((event.keyCode != 32) && (event.keyCode < 48) || (event.keyCode > 57) && (event.keyCode < 65) || (event.keyCode > 90) && (event.keyCode < 97) || (event.keyCode > 122))
        event.returnValue = false;
      }
  }
}
</script>
<style lang="">
    
</style>