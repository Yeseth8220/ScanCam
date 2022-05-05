import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController, NavCustomEvent } from '@ionic/angular';
//importacion de las rutas
import { Router } from '@angular/router';
//importacion de los servicios
import { TaskService } from 'src/app/services/task.service';
//importacion de toaskcontroller
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-base-excel',
  templateUrl: './base-excel.page.html',
  styleUrls: ['./base-excel.page.scss'],
})
export class BaseExcelPage implements OnInit {

//llamdo de los datos url y name en tipo string
url: string;
nombre: string;

//previsualización de la imagen en la vista
// eslint-disable-next-line @typescript-eslint/ban-types
public previsualizacion: String;
//llamdo del archivo para subirlo
public archivos: any = [];
//llamado de la función cargando
public loading: boolean;

constructor(
  //se inyectan las rutas
  private router: Router,
  //se llama el servicio para actualizar la foto
  private usuarioServicio: TaskService,
  //se inyecta sanitizar
  private sanitizer: DomSanitizer,
  //inyecta la importación de tosatcontroller
  public toastController: ToastController,
) {
  this.nombre=localStorage.getItem('name');
}

async errorl(mensaje, duracion) {
  //función que hace el llamado de una alerta sobre un error
  const toast = await this.toastController.create({
    message: mensaje,
    color: 'danger',
    duration: duracion,
  });
  toast.present();
}

async chec(mensaje, duracion) {
  //función que hace el llamado de una alerta sobre un error
  const toast = await this.toastController.create({
    message: mensaje,
    color: 'success',
    duration: duracion,
  });
  toast.present();
}

ngOnInit() {
  //muestra la foto de perfil
  this.traerfotol();
}

salir(){
  //función de cerrar seción
  localStorage.clear();
  this.router.navigate(['login']);
}

traerfotol(){
  //función de traer la foto de perfil
  const token = localStorage.getItem('token');
  const idImgPerfil = localStorage.getItem('idImgPerfil');

  // console.log('Token -->',token);
  // console.log('imgPer -->',idImgPerfil);

  this.usuarioServicio.traerfotoperfil(token, idImgPerfil).subscribe((res: any)=>{
    console.log(res.data.url);
    this.url = res.data.url;
  });
}

capturarFoto(event): any{
  //función del llamdo de la foto
  const archivoCapturado = event.target.files[0];

  //console.log(archivoCapturado);

  this.archivos.push(archivoCapturado);
  //console.log(event.target.files);
}

subirFoto(): any {
  //función que llama el servicio para actualixar la foto
  try {
    this.loading = true;
    const formularioDeDatos = new FormData();
      formularioDeDatos.append('MyExcel', this.archivos[0]);


    const foto = this.previsualizacion;
    const token = localStorage.getItem('token');

    this.usuarioServicio.enviarexcel(token,formularioDeDatos).subscribe((res: any) => {
        this.loading = false;
        console.log('Respuesta del servidor', res);

        const correcto = res.msg;

        if(correcto === 'CREADO CON EXITO'){
        this.chec('SE CREARON TODOS LOS USUARIOS CON EXITO', 4000);
        }
    },error => {
      console.log(error);

      const err = error.error.msg;

      if(err === 'ERROR_DETALLE_ITEMS'){
        this.errorl('DEBES SUBIR UN ARCHIVO EXCEL', 4000);
      }

    });

  } catch (e) {
    this.loading = false;
    console.log('ERROR', e);
  }
}

// enviarExcel(): any {
//   try {
//     const formularioDeDatosEx = new FormData();
//       formularioDeDatosEx.append('MyExcel', this.archivos[0]);


//     const foto = this.previsualizacion;
//     const token = localStorage.getItem('token');

//     this.usuarioServicio.enviarexcel(token,formularioDeDatosEx).subscribe(res => {
//         this.loading = false;
//         console.log('Respuesta del servidor', res);
//     });

//   } catch (e) {
//     this.loading = false;
//     console.log('ERROR', e);
//   }
// }

}
