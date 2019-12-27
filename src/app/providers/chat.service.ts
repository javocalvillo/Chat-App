import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Mensaje } from "../interface/mensaje"; //importo la interfaz mensaje
import { map } from 'rxjs/operators';

//para trabajar la auth con firebase
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  //manejo la colección con firebase y la interfaz
  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];
  public usuario:any = [];

  constructor(private afs: AngularFirestore,
    public afAuth: AngularFireAuth) {
        this.afAuth.authState.subscribe(user =>{ //queda atento a los cambios de autenticación
          console.log('Estado del usuario: ', user); //imprime el usuario y sus valores

          if(!user){
            return;
          }
          this.usuario.nombre = user.displayName; //propiedad del objeto usuario
          this.usuario.uid = user.uid; //propiedad que denota una cuenta única
        })
    }

    login(proveedor:string) {
      this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()); //autenticamos por google
    }

    logout() {
      this.usuario = {}; //limpio el usuario
      this.afAuth.auth.signOut();
    }

  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref=> ref.orderBy('fecha', 'desc')
  .limit(5));
    return this.itemsCollection.valueChanges().pipe(
      map((mensajes:Mensaje[])=>{
        console.log(mensajes);
        this.chats = [];
        for(let mensaje of mensajes){
          this.chats.unshift(mensaje); //lo deja en la primera posición siempre
        }
        return this.chats;
        //this.chats = mensajes;
    })
  )
}

  agregarMensaje( texto: string ){ //enviar texto a firebase
    let mensaje:Mensaje = { //para eso debo mandar la estructura del objeto
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(), //fecha que quiero grabar
      uid: this.usuario.uid
    }
    return this.itemsCollection.add(mensaje); //mando el mensaje
  }

}
