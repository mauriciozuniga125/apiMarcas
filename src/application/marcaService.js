class MarcaService {
  constructor(marcaRepository) {
    this.marcaRepository = marcaRepository;
  }

  async obtenerMarcas() {
    return await this.marcaRepository.findAll();
  }

  async crearMarca(nombre) {
    if (!nombre || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
      throw new Error("El nombre solo puede contener letras");
    }
    return await this.marcaRepository.create(nombre);
  }

  async actualizarMarca(id, nombre) {
    if (!nombre || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
      throw new Error("El nombre solo puede contener letras");
    }
    return await this.marcaRepository.update(id, nombre);
  }

  async eliminarMarca(id) {
    return await this.marcaRepository.delete(id);
  }

  async obtenerMarcaPorId(id) {
    return await this.marcaRepository.findById(id);
  }
}

module.exports = MarcaService;
