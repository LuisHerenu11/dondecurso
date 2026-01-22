import { useState } from 'react'
import {
  Search,
  User,
  BookOpen,
  Calendar,
  Clock,
  Users,
  MapPin,
  Building,
  GraduationCap,
  Map,
  Navigation,
  Home,
  IdCard,
  ChevronRight,
  FileText 
} from 'lucide-react'

import logoUnahur from './assets/logo-unahur.png'
import logo from './assets/logo.png'
import mapaOrigone from './assets/mapa-origone.png'
import mapaOrigoneAlta from './assets/mapa-origone-planta-alta.png'
import sedePatria from './assets/sede-la-patria.png'

function App() {
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState(null) 
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mapaActivo, setMapaActivo] = useState('origone')
  const [pisoActivo, setPisoActivo] = useState('baja')

  const mapas = {
    origone: {
      nombre: 'Origone',
      descripcion: 'Sede Principal - Av. Origone 151',
      pisos: [
        { id: 'baja', nombre: 'Planta Baja', imagen: mapaOrigone },
        { id: 'alta', nombre: 'Planta Alta', imagen: mapaOrigoneAlta }
      ],
      servicios: [
        'Instituto de Tecnología',
        'Instituto de Salud Comunitaria',
        'Instituto de Educación',
        'Biblioteca Central',
        'Laboratorios',
        'Aulas Magnas'
      ]
    },
    laPatria: {
      nombre: 'La Patria',
      descripcion: 'Sede La Patria - Av. La Patria 123',
      pisos: [
        { id: 'baja', nombre: 'Planta Baja', imagen: sedePatria }
      ],
      servicios: [
        'Aulas Talleres',
        'Espacios de Práctica',
        'Oficinas Administrativas',
        'Salón de Usos Múltiples'
      ]
    }
  }

  const buscarComision = async (e) => {
    e.preventDefault()
    if (!busqueda) {
      setError('Por favor, ingresa tu búsqueda')
      return
    }

    setLoading(true)
    setError(null)
    setResultados(null)

    try {
      const response = await fetch(`/.netlify/functions/consultar?q=${encodeURIComponent(busqueda)}`)
      const data = await response.json()

      if (response.ok) {
        // CAMBIO: Verificamos si la respuesta tiene inscripciones
        if (data.inscripciones && data.inscripciones.length > 0) {
          setResultados(data)
        } else {
          setError('No se encontraron inscripciones.')
        }
      } else {
        setError(data.error || 'Ocurrió un error')
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const manejarReinicio = () => {
    setBusqueda('')
    setResultados(null)
    setError(null)
  }

  
  const obtenerTextoHorario = (horariosObj) => {
    if (!horariosObj) return 'A confirmar' // Pequeña seguridad extra
    const dias = Object.entries(horariosObj).filter(([_, h]) => h !== '-')
    if (dias.length === 0) return 'A confirmar'
    return dias.map(([dia, hora]) => (
      <div key={dia} className="capitalize flex items-center gap-1">
        <span className="font-bold text-unahur-green">{dia}:</span> {hora}
      </div>
    ))
  }

 
  const detectarSede = (aulaTexto) => {
    if (!aulaTexto) return null
    const texto = aulaTexto.toLowerCase()
    if (texto.includes('patria')) return 'laPatria'
    if (texto.includes('origone')) return 'origone'
    return null
  }

  const mapaActual = mapas[mapaActivo] || mapas.origone
  const pisoActual = mapaActual.pisos.find(p => p.id === pisoActivo) || mapaActual.pisos[0]

  // CAMBIO: resultados ya es el objeto del alumno, no un array
  const alumnoDatos = resultados; 

  return (
    <div className="min-h-screen bg-light-bg">
      {/* Header */}
      <header className="bg-unahur-green px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Logo UNAHUR"
              className="hidden md:block w-24 h-24 object-contain"
            />
            <div className="text-center md:text-left">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Universidad Nacional de Hurlingham
              </h1>
              <p className="text-white/90 text-sm md:text-base mt-1">
                "Conocimiento para la inclusión social"
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shadow-md px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white font-medium text-sm md:text-base">
            <Calendar size={20} />
            <span>Ciclo 2026</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-light-gray py-3 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-unahur-green mr-2"></div>
              <span className="font-medium text-medium-gray">Consulta Académica</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-unahur-accent mr-2"></div>
              <span className="font-medium text-medium-gray">Información por Comisión</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-300"></div>
            <div className="flex items-center">
              <Map size={20} className="text-medium-gray" />
              <span className="font-medium text-medium-gray ml-2">Mapas de Sedes</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-unahur-blue mb-4">
            <Search size={32} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-dark-gray mb-4">
            Consulta tu <span className="text-unahur-green">Información Académica</span>
          </h1>
          <p className="text-medium-gray text-lg max-w-3xl mx-auto">
            Busca por número de comisión, DNI o legajo para acceder a tu cursada, horarios y ubicación en nuestras sedes.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 mb-12 max-w-2xl mx-auto border-t-8 border-unahur-green">
          <form onSubmit={buscarComision}>
            <div className="mb-6">
              <label htmlFor="busqueda" className="block text-dark-gray font-semibold text-lg mb-3">
                <div className="flex items-center">
                  <User size={20} className="mr-2" />
                  Ingresá tu DNI
                </div>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="busqueda"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Ej: 2345678"
                  className="w-full px-6 py-4 border-2 border-light-gray rounded-xl text-lg focus:outline-none focus:border-unahur-green focus:ring-4 focus:ring-unahur-green/10 bg-white text-dark-gray"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 bg-unahur-green text-white font-semibold text-lg rounded-xl hover:bg-[#90c473] active:translate-y-0.5 transition-all duration-200 shadow-button hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner mr-2"></span>
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search size={18} className="mr-2" />
                    Buscar Información
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={manejarReinicio}
                className="flex-1 px-6 py-4 bg-unahur-blue text-white font-semibold text-lg rounded-xl hover:bg-[#78cee4] transition-colors duration-200"
              >
                Reiniciar
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-error-red mr-3"></div>
                <span className="text-error-red">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Results Card */}
        {/* CAMBIO: Checkeamos resultados.inscripciones */}
        {resultados && alumnoDatos && resultados.inscripciones && (
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 mb-12 border border-light-gray">
            
            {/* Header del Alumno */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-6 border-b border-light-gray mb-8">
              <div className="flex items-center mb-4 lg:mb-0">
                <div className="p-3 rounded-xl bg-unahur-green mr-4">
                   <User size={24} className="text-white" />
                </div>
                <div>
                    {/* CAMBIO: Usamos alumnoDatos.alumno directo */}
                    <h2 className="text-2xl md:text-3xl font-bold text-dark-gray capitalize">{alumnoDatos.alumno}</h2>
                    <p className="text-medium-gray text-lg mt-1">Estudiante Regular</p>
                </div>
              </div>
              
              <div className="flex items-center text-medium-gray bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <IdCard size={20} className="text-unahur-accent mr-2" />
                <span className="font-mono font-bold">{alumnoDatos.dni}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-dark-gray mb-6 pb-3 border-b border-light-gray flex items-center">
                <BookOpen size={20} className="text-unahur-green mr-3" />
                {/* CAMBIO: Contador de materias desde inscripciones.length */}
                Materias Inscriptas ({resultados.inscripciones.length})
              </h3>

              {/* TABLA DE MATERIAS  */}
              <div className="overflow-hidden rounded-xl border border-light-gray">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-medium-gray text-sm uppercase font-bold tracking-wider border-b border-light-gray">
                        <th className="px-6 py-4">Materia</th>
                        <th className="px-6 py-4">Comisión</th>
                        <th className="px-6 py-4">Docente</th>
                        <th className="px-6 py-4">Día y Horario</th>
                        <th className="px-6 py-4">Aula</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-light-gray bg-white">
                      {/* CAMBIO: Mapeamos sobre resultados.inscripciones */}
                      {resultados.inscripciones.map((materia, index) => {
                        const sedeSugerida = detectarSede(materia.aula);
                        
                        return (
                          <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-6 py-5">
                              <span className="font-bold text-dark-gray text-base block">{materia.materia}</span>
                            </td>
                            <td className="px-6 py-5">
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-unahur-accent/10 text-unahur-blue text-sm font-bold">
                                {materia.comision}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-dark-gray text-sm">
                              {materia.docente}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-start gap-2 text-sm text-dark-gray">
                                <Clock size={16} className="text-unahur-green mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">{obtenerTextoHorario(materia.horarios)}</div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col items-start">
                                <span className="font-bold text-dark-gray flex items-center gap-2">
                                  <MapPin size={16} className="text-error-red" />
                                  {materia.aula}
                                </span>
                                {sedeSugerida && (
                                  <button
                                    onClick={() => {
                                      setMapaActivo(sedeSugerida);
                                      document.getElementById('seccion-mapas').scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="text-xs text-unahur-blue hover:underline mt-1 flex items-center gap-1 font-medium ml-6"
                                  >
                                    Ver mapa <Navigation size={10} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Mensaje Informativo Inferior */}
            <div className="bg-blue-50 border border-unahur-accent/30 rounded-lg p-4 flex items-start gap-3">
               <div className="p-1 bg-unahur-accent rounded-full text-white mt-0.5">
                  <Users size={14} />
               </div>
               <div>
                  <p className="text-sm text-dark-gray">
                    Recuerda verificar el aula en la puerta de la sede. Los horarios mostrados corresponden a tu inscripción actual.
                  </p>
               </div>
            </div>

          </div>
        )}

        {/* Maps Section*/}
        <div id="seccion-mapas" className="bg-unahur-blue rounded-2xl shadow-card border border-light-gray mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-8 bg-unahur-blue rounded-t-2xl">
            <h3 className="text-2xl font-bold text-white mb-4 md:mb-0">
              <span className="text-unahur-light-green">Mapas de Sedes</span> UNAHUR
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setMapaActivo('origone')
                  setPisoActivo('baja')
                }}
                className={`px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-200 ${
                  mapaActivo === 'origone'
                    ? 'bg-unahur-green text-white shadow'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Building size={18} className="mr-2" />
                Origone
              </button>
              <button
                onClick={() => {
                  setMapaActivo('laPatria')
                  setPisoActivo('baja')
                }}
                className={`px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-200 ${
                  mapaActivo === 'laPatria'
                    ? 'bg-unahur-green text-white shadow'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Home size={18} className="mr-2" />
                La Patria
              </button>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-b-2xl">
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Map size={20} className="text-unahur-accent mr-3" />
                <h4 className="text-xl font-bold text-dark-gray">{mapaActual.nombre}</h4>
              </div>
              <p className="text-medium-gray">{mapaActual.descripcion}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-light-gray rounded-xl p-4 border border-gray-300">
                  <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-white">
                    <img
                      src={pisoActual.imagen}
                      alt={`Mapa de ${mapaActual.nombre} - ${pisoActual.nombre}`}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>

                  {mapaActual.pisos.length > 1 && (
                    <div className="flex justify-center gap-4 mt-4">
                      {mapaActual.pisos.map((piso) => (
                        <button
                          key={piso.id}
                          onClick={() => setPisoActivo(piso.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            pisoActivo === piso.id
                              ? 'bg-unahur-green text-white'
                              : 'bg-gray-200 text-medium-gray hover:bg-gray-300'
                          }`}
                        >
                          {piso.nombre}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-light-gray">
                <h5 className="text-lg font-bold text-dark-gray mb-4 flex items-center">
                  <Navigation size={20} className="text-unahur-green mr-2" />
                  Información de la Sede
                </h5>

                <div className="mb-6">
                  <h6 className="font-semibold text-medium-gray text-sm mb-2">Ubicación:</h6>
                  <p className="text-dark-gray text-sm">
                    {mapaActivo === 'origone'
                      ? 'Av. Origone 151, Hurlingham, Buenos Aires'
                      : 'Av. La Patria 3800, Hurlingham, Buenos Aires'}
                  </p>
                </div>

                <div className="mb-6">
                  <h6 className="font-semibold text-medium-gray text-sm mb-2">Servicios disponibles:</h6>
                  <ul className="space-y-2">
                    {mapaActual.servicios.map((servicio, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full bg-unahur-green mr-3 flex-shrink-0"></div>
                        <span className="text-dark-gray">{servicio}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t-8 border-[#5aa531] bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <img
                src={logoUnahur}
                alt="Logo UNAHUR"
                className="w-24 h-10 object-contain mr-4"
              />
              <div>
                <h3 className="font-bold text-dark-gray">UNAHUR</h3>
                <p className="text-medium-gray text-sm">Universidad Nacional de Hurlingham</p>
                <p className="text-medium-gray text-sm mt-1">
                  Origone: Av. Origone 151, Hurlingham<br />
                  La Patria: Av. La Patria 123, Hurlingham
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="flex justify-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-unahur-green flex items-center justify-center">
                  <MapPin size={20} className="text-white" />
                </div>
                <div className="w-10 h-10 rounded-full bg-unahur-accent flex items-center justify-center">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <div className="w-10 h-10 rounded-full bg-unahur-green flex items-center justify-center">
                  <Building size={20} className="text-white" />
                </div>
              </div>
              <p className="text-medium-gray text-sm">
                Sistema Académico © {new Date().getFullYear()}<br />
                <span className="font-medium">Universidad Nacional de Hurlingham</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App