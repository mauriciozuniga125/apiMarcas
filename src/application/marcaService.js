class MarcaService {
  constructor(marcaRepository) {
    this.marcaRepository = marcaRepository;
  }

  async obtenerMarcas() {
    return await this.marcaRepository.findAll();
  }
}

module.exports = MarcaService;
