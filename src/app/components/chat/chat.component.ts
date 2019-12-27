import { Component, OnInit } from '@angular/core';
import { ChatService } from "../../providers/chat.service"; //importamos el servicio



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit{

  mensaje:string="";
  elemento:any;

  constructor(public _cs: ChatService) {
    this._cs.cargarMensajes()
    .subscribe(()=>{
      setTimeout(()=>{
        this.elemento.scrollTop = this.elemento.scrollHeight; //para que se posicione al final
      },20);

    });
  }

  ngOnInit(){
    this.elemento = document.getElementById('app-mensajes'); //aqui ya tengo referencia al elemento del html
  }

  enviar_mensaje(){
    console.log(this.mensaje);
    if(this.mensaje.length === 0){
      return; //si es 0 retorno nada
    }
    this._cs.agregarMensaje(this.mensaje) //mando el mensaje
    .then (()=>this.mensaje="")
    .catch((err)=> console.error('Error al enviar', err));
  }

}
