import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController, NavCustomEvent } from '@ionic/angular';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
//importacion de toaskcontroller
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-actufotofuncionario',
  templateUrl: './actufotofuncionario.page.html',
  styleUrls: ['./actufotofuncionario.page.scss'],
})
export class ActufotofuncionarioPage implements OnInit {
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
    //se inyecta el servicio del llamdo de la foto
    private foto: TaskService,
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

    console.log('Token -->',token);
    console.log('imgPer -->',idImgPerfil);

    this.usuarioServicio.traerfotoperfil(token, idImgPerfil).subscribe((res: any)=>{
      console.log(res.data.url);
      this.url = res.data.url;
    });
  }

  capturarFoto(event): any{
    //función del llamdo de la foto
    const archivoCapturado = event.target.files[0];

    console.log(archivoCapturado);

    this.extraerBase64(archivoCapturado).then((imagen: any) => {
    this.previsualizacion = imagen.base;
      console.log(imagen);
    });
    this.archivos.push(archivoCapturado);
    //console.log(event.target.files);
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    //función que combierte la imagen en formato 64
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };
    } catch (e) {
      return null;
    }
  });

  subirFoto(): any {
    //función que llama el servicio para actualixar la foto
    try {
      this.loading = true;
      const formularioDeDatos = new FormData();
        formularioDeDatos.append('Myface', this.archivos[0]);


      const foto = this.previsualizacion;
      const token = localStorage.getItem('token');

      this.foto.createsFoto(token,formularioDeDatos).subscribe((res: any) => {
          this.loading = false;
          console.log('Respuesta del servidor', res);

          const correcto = res.data;

          if(correcto === res.data){
          this.chec('SE ACTUALIZO TU FOTO DE PERFIL', 4000);
          }
      },error => {
        console.log(error);

        const err = error.error.msg;

        if(err === 'ERROR_SUBIR_ARCHIVO'){
          this.errorl('DEBES SUBIR UNA IMAGEN PARA TU FOTO DE PERFIL', 5000);
        }

      });

    } catch (e) {
      this.loading = false;
      console.log('ERROR', e);
    }
  }

}
