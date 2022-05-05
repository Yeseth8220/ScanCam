import { Component, OnInit } from '@angular/core';
//importación de las rutas
import { Router } from '@angular/router';
//importación de los servicios de la api
import { TaskService } from 'src/app/services/task.service';
//importacion de toaskcontroller
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  //llamdo de los datos url y name como dato tipo string
  url: string;
  nombre: string;

  constructor(
    private router: Router,
    private usuarioServicio: TaskService,
    //inyecta la importación de tosatcontroller
    public toastController: ToastController,
  ) {
    //llamdo del nombre del localstorage
    this.nombre=localStorage.getItem('name');
  }

  async chec(mensaje, duracion) {
    //función que hace el llamado de una alerta sobre un error
    const toast = await this.toastController.create({
      message: mensaje,
      color: 'danger',
      duration: duracion,
    });
    toast.present();
  }

  ngOnInit() {
    //llamdo de la foto
    this.traerfotol();
    //función de mostrar la cantidad de fotos que falan
    const token = localStorage.getItem('token');

    console.log('Token -->',token);

    this.usuarioServicio.totalfoto(token).subscribe((res: any)=>{
      console.log(res);

      const falta = res = ('<5');

      if(falta === res){
      this.chec('DEBES ENTRENAR LA MAQUINA', 4000);
      }

    });
  }

  salir(){
    //función de cerrar seción
    localStorage.clear();
    this.router.navigate(['login']);
  }

  traerfotol(){
    //función de tarer la foto de los servicios de la api
    const token = localStorage.getItem('token');
    const idImgPerfil = localStorage.getItem('idImgPerfil');

    console.log('Token -->',token);
    console.log('imgPer -->',idImgPerfil);

    this.usuarioServicio.traerfotoperfil(token, idImgPerfil).subscribe((res: any)=>{
      console.log(res.data.url);
      this.url = res.data.url;
    });
  }
}
