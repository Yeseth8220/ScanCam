import { AbstractType, Component, OnInit,  ViewChild } from '@angular/core';
//importación de las rutas
import { Router } from '@angular/router';
//importación de los servicios de la api
import { TaskService } from 'src/app/services/task.service';

import {Chart} from 'chart.js';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {
  //llamdo de los datos url y name como dato tipo string
  url: string;
  nombre: string;

  entrada: any;
  salida: any;

  constructor(private router: Router, private usuarioServicio: TaskService) {
    //llamdo del nombre del localstorage
    this.nombre=localStorage.getItem('name');
  }

  ngOnInit() {
    //llamdo de la foto
    this.traerfotol();
    //this.estadisticas();
    this.traerregistros();
  }

  traerregistros(){
    //función de tarer la foto de los servicios de la api
    const token = localStorage.getItem('token');

    this.usuarioServicio.numregentrada(token).subscribe((resp: any)=>{
      console.log(resp);
      this.entrada = resp;


      this.usuarioServicio.numregsalida(token).subscribe((res: any)=>{
        console.log(res);
        this.salida = res;

        this.estadisticas(this.entrada, this.salida);
        this.especifico(this.entrada, this.salida);
      });
    });
  }

  async estadisticas(entrada: any, salida: any){
    const canvas = document.getElementById('estadistica') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['ENTRADA', 'SALIDA', 'ACTUALMENTE'],
            datasets: [{
                label: 'REGISTROS',
                data: [entrada.total, salida.total, entrada.total-salida.total],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
  }

  async especifico(entrada, salida){
    const canvas = document.getElementById('especifico') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['INVITADO', 'APRENDIZ', 'FUNCIONARIO', 'GESTOR', 'SEGURIDAD'],
            datasets: [{
                label: 'USUARIOS DENTRO DE LAS INSTALACIONES',
                data: [ entrada.invitado-salida.invitado, entrada.aprendiz-salida.aprendiz,
                  entrada.funcionario-salida.funcionario, entrada.gestor-salida.gestor, entrada.seguridad-salida.seguridad ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
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

    this.usuarioServicio.traerfotoperfil(token, idImgPerfil).subscribe((res: any)=>{
      //console.log(res.data.url);
      this.url = res.data.url;
    });
  }

}
