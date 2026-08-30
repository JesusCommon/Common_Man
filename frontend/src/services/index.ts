export type { ServiceResult, ServiceError } from "./types";

// Auth
export { iniciarSesion, refrescarToken } from "./auth.service";

// Usuarios
export {
  registrarUsuario,
  buscarPersonasService,
  miPerfil,
  actualizarPerfil,
  cambiarPassword,
  recargarSaldo,
  listarTodos,
  listarUsuariosInactivos,
  listarUsuariosActivos,
  buscarAdmin,
  obtenerPorUUID,
  obtenerPorObjectId,
  actualizarUsuarioAdmin,
  recargarSaldoAdministrador,
  restarSaldoAdministrador,
  activarCuenta,
  desactivarCuenta,
  obtenerPerfilPublicoService,
} from "./usuario.service";

// Follows
export {
  seguirUsuario,
  dejarDeSeguirUsuario,
  obtenerMisSeguidores,
  obtenerMisSeguidos,
  verificarSiSigueA,
  obtenerSeguidoresDe,
  obtenerSeguidosDe,
} from "./follow.service";

//Categorias Productos
export {
  crearCategoriaService,
  activarCategoriaService,
  actualizarCategoriaService,
  desactivarCategoriaService,
  obtenerCategoriaPorIdService,
  listarCategoriasActivasService,
  listarCategoriasPublicasService,
  listarTodasLasCategoriasService,
  listarCategoriasInactivasService
} from "./categoriasProductos.service";

//Productos
export {
  crearProductoService,
  actualizarProductoService,
  listarProductosService,
  listarProductosActivosAdminService,
  listarProductosInactivosAdminService,
  listarPorCategoriaService,
  listarTodosProductosAdminService,
  buscarProductosService,
  obtenerProductoPorIdAdminService,
  obtenerProductoPorSlugService,
  obtenerProductosRecientesService,
  actualizarStockService,
  descontarStockService,
  establecerStockService,
  activarProductoService,
  desactivarProductoService
} from "./productos.service";

//Compras
export {
  crearCompraService,
  listarMisComprasService,
  obtenerCompraPorIdService,
  obtenerCompraPorNumeroOrdenService,
  listarTodasComprasAdminService,
  listarComprasPorEstadoAdminService,
  obtenerCompraAdminService,
  actualizarEstadoCompraAdminService,
} from "./compras.service";

//Pagos
export {
  procesarPagoService,
  cancelarCompraService,
  obtenerMovimientoDeCompraService,
  listarHistorialMovimientosService,
} from "./pagos.service";

//Configuración Finanzas
export {
  obtenerWalletService,
  listarHistorialFinancieroService,
} from "./configFinanzas.service";