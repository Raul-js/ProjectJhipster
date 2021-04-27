export class UsuarioFilter {
  constructor(public nombre?: string, public email?: string) {}

  toMap(): any {
    const map = new Map();

    if (this.nombre != null && this.nombre !== '') {
      map.set('nombre.contains', this.nombre);

      return map;
    }
    if (this.email != null && this.email !== '') {
      map.set('email.contains', this.email);

      return map;
    }
  }
}
