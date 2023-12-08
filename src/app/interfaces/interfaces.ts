export interface Clientes {
    _id?: string;
    numeroCliente?: string;
    nombre?: string;
    edad?: string;
    direccion?: string;
    colonia?: string;
    senasDomicilio?: string;
    entrecalles?: string;
    ciudad?: string;
    celular?: string;
    telefonoFijo?: string;
    telefonoAdicional?: string;
    estadoCivil?: string;
    tiempoCasados?: string;
    dependientes?: string;
    tipoVivienda?: string;
    tiempoViviendo?: string;
    pagoRenta?: string;
    tipoNegocio?: string;
    tiempoNegocio?: string;
    numeroIdentificacion?: string;
    RFC?: string;
    nombreConyugue?: string;
    trabajoConyugue?: string;
    domicilioConyugue?: string;
    antiguedadConyugue?: string;
    ingresoSolicitante?: Number;
    ingresoConyugue?: Number;
    gastosTotales?: Number;
    gestorAsignado?: string;
    fotoComprobante?: string;
    fotoFachada?: string;
    fotoIneFrente?: string;
    fotoIneReverso?: string;
    tipo?: string;
    fechaRegistro?: string;
    numeroPrestamos?: Number;
    numeroActivos?: Number;
    prestamosActivos?:Boolean;
    clasificacion?:string;
    sucursal?: string;
    puntuacion?: string;
    comentarios?: string
}

export interface Renovaciones {
    _id?: number;
    fecha_Solicitud?: string;
    montoSolicitado?: string;
    montoAutorizado?: string;
    total?: string;
    pagoDiario?: string;
    plazo?: string;
    nombre?: string;
    edad?: string;
    direccion?: string;
    colonia?: string;
    señasdomicilio?: string;
    entrecalles?: string;
    ciudad?: string;
    telefonofijo?: string;
    telefonocel?: string;
    telefonoadicional?: string;
    estadocivil?: string;
    tiempocasados?: string;
    dependientes?: string;
    casapropia?: string;
    casarentada?: string;
    pagorenta?: string;
    tiempoviviendo?: string;
    casafamiliar?: string;
    tiponegocio?: string;
    cobranza?: string;
    tiemponegocio?: string;
    numeroidentificacion?: string;
    rfc?: string;
    conyugue?: string;
    trabajoconyugue?: string;
    domicilioconyugue?: string;
    antiguedadconyugue?: string;
    ingresosolicitante?: string;
    ingresoconyugue?: string;
    gastostotales?: string;
    gestor?: string;
    numeroDependientes?: string;
    infoCredito?: string;
    creditosActuales?: string;
    estatus?: string;
}

export interface Solicitudes {
    _id?: string;
    fechaSolicitud?: string;
    montoSolicitado?: Number;
    montoAutorizado?: Number;
    totalPagar?: Number;
    pagoDiario?: Number;
    plazo?: string;
    numeroCliente?: string;
    nombre?: string;
    edad?: string;
    direccion?: string;
    colonia?: string;
    senasDomicilio?: string;
    entrecalles?: string;
    ciudad?: string;
    celular?: string;
    telefonoFijo?: string;
    telefonoAdicional?: string;
    estadoCivil?: string;
    tiempoCasados?: string;
    dependientes?: string;
    tipoVivienda?: string;
    tiempoViviendo?: string;
    pagoRenta?: string;
    tipoNegocio?: string;
    tiempoNegocio?: string;
    numeroIdentificacion?: string;
    RFC?: string;
    nombreConyugue?: string;
    trabajoConyugue?: string;
    domicilioConyugue?: string;
    antiguedadConyugue?: string;
    ingresoSolicitante?: Number;
    ingresoConyugue?: Number;
    gastosTotales?: Number;
    gestorAsignado?: string;
    infoCredito?: string;
    estatus?: string;
    tipo?: string;
    tipoPrestamo?: string;
    sucursal?: string;
}

export interface Pago {
    _id?: number;
    fecha?: string;
    folio?: string;
    nombreCliente?: string;
    numCliente?: string;
    cobranza?: Number;
    cantidadPrestamo?: Number;
    plazo?: Number;
    totalPagar?: Number;
    totalRestante?: Number;
    pagoDiario?: Number;
    folioPrestamo?: string;
    fechaPago?: string;
    horaPago?:string;
    gestor?: string;
    tipo?:string;
    comentario?:string;
    abono?: Number;
    personasCobrador?: string;
    sucursal?: string;
}

export interface Prestamo {
    _id?: string;
    fecha?: string;
    folio?: string;
    tipoPrestamo?: string;
    nombre?: string;
    direccion?: string;
    colonia?: string;
    telefono?: string;
    cobranza?: Number;
    cantidadPrestamo?: Number;
    cantidadPagar?: Number;
    plazoPrestamo?: Number;
    totalRestante?: Number;
    pagoDiario?: Number;
    fechaPago?: string;
    proximoPago?: string;
    tipoUltiPago?: string;
    gestor?: string;
    estatus?: string;
    nota?: string;
    numeroCliente?: string;
    urlDinero?: string;
    urlPagare?: string;
    urlFachada?: string;
    estado?: boolean;
    sucursal?: string;
}

export interface AuthResponse {
    ok: boolean;
    uid?: string;
    name?: string;
    email?: string;
    token?: string;
    msg?: string;
    area: string;
    password: string;
}

export interface Usuario {
    uid: string;
    name: string;
    email: string;
    area: string; 
}

//Este ya no se usara
export interface Actividad {
    _id?: number;
    fecha?: string;
    hora?: string;
    gestor?: string;
    movimiento?: string;
    latitud?: string;
    longitud?: string;
    link?: string;
}

//Nuueva version de Actividad -->> Seguimiento
export interface Seguimiento{
    _id?: string;
    gestor?: string;
    fecha?: string;
    hora?: string;
    latitud?: string;
    longitud?: string;
    actividad?: string;
    sucursal?: string;
}


export interface DecodedToken {
    exp: number;
    ia: number;
    nombre: string;
    sucursal: string;
    uid: string;
    usuario: string;
  }

export interface ApiResponse {
    msg: string;
    cliente: {
      _id: string;
    };
}