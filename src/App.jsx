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
  FileText,
  X,
  Maximize2,
  Menu,
  Smartphone
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
  const [imagenAmpliada, setImagenAmpliada] = useState(null)
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)

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
      descripcion: 'Sede La Patria - Av. La Patria 3800',
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

  const detectarSede = (aulaTexto) => {
    if (!aulaTexto) return null
    const texto = aulaTexto.toLowerCase()
    if (texto.includes('patria')) return 'laPatria'
    if (texto.includes('origone')) return 'origone'
    return null
  }

  const mapaActual = mapas[mapaActivo] || mapas.origone
  const pisoActual = mapaActual.pisos.find(p => p.id === pisoActivo) || mapaActual.pisos[0]

  const alumnoDatos = resultados; 

  // Función para renderizar tabla en desktop
  const renderDesktopTable = () => (
    <div className="hidden lg:block overflow-hidden rounded-xl border border-light-gray">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-medium-gray text-sm uppercase font-bold tracking-wider border-b border-light-gray">
              <th className="px-6 py-4 w-[25%]">Materia</th>
              <th className="px-6 py-4 w-[10%] text-center">Comisión</th>
              <th className="px-6 py-4 w-[20%]">Docente</th>
              <th className="px-6 py-4 w-[15%]">Días de Cursada</th>
              <th className="px-6 py-4 w-[15%]">Horario</th>
              <th className="px-6 py-4 w-[15%]">Aula</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-gray bg-white">
            {resultados.inscripciones.map((materia, index) => {
              const sedeSugerida = detectarSede(materia.aula);
              
              const diasActivos = materia.horarios 
                ? Object.entries(materia.horarios).filter(([_, h]) => h !== '-')
                : [];

              return (
                <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-5">
                    <span className="font-bold text-dark-gray text-lg block break-words leading-relaxed">
                      {materia.materia}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-unahur-accent/10 text-unahur-blue text-lg font-bold min-w-[80px] justify-center">
                      {materia.comision}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-dark-gray text-base">
                    <div className="break-words max-w-[300px] leading-relaxed">
                      {materia.docente}
                    </div>
                  </td>
                  
                  {/* COLUMNA DÍAS */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2">
                      {diasActivos.length > 0 ? (
                        diasActivos.map(([dia, _]) => (
                          <span key={dia} className="capitalize font-bold text-unahur-green flex items-center gap-2 text-base">
                            <Calendar size={16} className="flex-shrink-0" /> 
                            <span className="truncate">{dia}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-medium-gray text-base">A confirmar</span>
                      )}
                    </div>
                  </td>

                  {/* COLUMNA HORARIOS */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2">
                      {diasActivos.length > 0 ? (
                        diasActivos.map(([dia, hora]) => (
                          <span key={dia} className="text-dark-gray text-base font-medium flex items-center gap-2">
                            <Clock size={16} className="text-medium-gray flex-shrink-0" /> 
                            <span className="truncate">{hora}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-medium-gray text-base">-</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-dark-gray flex items-center gap-2 text-lg">
                        <MapPin size={18} className="text-error-red flex-shrink-0" />
                        <span className="break-words">{materia.aula}</span>
                      </span>
                      {sedeSugerida && (
                        <button
                          onClick={() => {
                            setMapaActivo(sedeSugerida);
                            document.getElementById('seccion-mapas').scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-sm text-unahur-blue hover:underline mt-2 flex items-center gap-1 font-medium"
                        >
                          Ver mapa <Navigation size={12} />
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
  )


  const renderMobileCards = () => (
    <div className="lg:hidden space-y-4">
      {resultados.inscripciones.map((materia, index) => {
        const sedeSugerida = detectarSede(materia.aula);
        const diasActivos = materia.horarios 
          ? Object.entries(materia.horarios).filter(([_, h]) => h !== '-')
          : [];

        return (
          <div key={index} className="bg-white rounded-xl border border-light-gray p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              {/* Materia y Comisión */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-bold text-dark-gray text-lg mb-2">{materia.materia}</h4>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-unahur-accent/10 text-unahur-blue font-bold">
                      Comisión {materia.comision}
                    </span>
                    {sedeSugerida && (
                      <button
                        onClick={() => {
                          setMapaActivo(sedeSugerida);
                          document.getElementById('seccion-mapas').scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-xs text-unahur-blue hover:underline flex items-center gap-1 font-medium"
                      >
                        Ver mapa <Navigation size={10} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Docente */}
              <div className="border-t pt-3">
                <p className="text-sm text-medium-gray mb-1">Docente:</p>
                <p className="text-dark-gray font-medium">{materia.docente}</p>
              </div>

              {/* Días y Horarios */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-medium-gray mb-2">Días:</p>
                  <div className="space-y-1">
                    {diasActivos.length > 0 ? (
                      diasActivos.map(([dia, _]) => (
                        <div key={dia} className="flex items-center gap-2">
                          <Calendar size={14} className="text-unahur-green flex-shrink-0" />
                          <span className="capitalize text-dark-gray font-medium">{dia}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-medium-gray">A confirmar</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-medium-gray mb-2">Horarios:</p>
                  <div className="space-y-1">
                    {diasActivos.length > 0 ? (
                      diasActivos.map(([dia, hora]) => (
                        <div key={dia} className="flex items-center gap-2">
                          <Clock size={14} className="text-medium-gray flex-shrink-0" />
                          <span className="text-dark-gray font-medium">{hora}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-medium-gray">-</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Aula */}
              <div className="border-t pt-3">
                <p className="text-sm text-medium-gray mb-1">Aula:</p>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-error-red flex-shrink-0" />
                  <span className="font-bold text-dark-gray">{materia.aula}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen bg-light-bg">
      {/* Modal para imagen ampliada */}
      {imagenAmpliada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh]">
            <button
              onClick={() => setImagenAmpliada(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>
            <img
              src={imagenAmpliada}
              alt="Mapa ampliado"
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={() => window.open(imagenAmpliada, '_blank')}
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-dark-gray px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg"
            >
              <Maximize2 size={18} />
              Ampliar
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-unahur-green px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-4 w-full justify-center">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <img
                src={logo}
                alt="Logo UNAHUR"
                className="w-32 h-32 md:w-40 md:h-40 object-contain"
              />
              <div className="text-center">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                  UNIVERSIDAD NACIONAL DE HURLINGHAM
                </h1>
                {/*
                <div className="hidden md:flex items-center gap-2 shadow-md px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white font-medium text-sm md:text-base mt-2">
                  <Calendar size={20} />
                  <span>Ciclo 2026</span>
                </div>
                */}
              </div>
            </div>
            
    
            <button
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              className="md:hidden text-white p-2 absolute right-4"
            >
              <Menu size={28} />
            </button>
          </div>
          
         
          {/*
          <div className={`md:hidden items-center gap-2 shadow-md px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white font-medium text-sm ${menuMovilAbierto ? 'flex mt-4' : 'hidden'}`}>
            <Calendar size={20} />
            <span>Ciclo 2026</span>
          </div>
          */}
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-light-gray py-3 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 ${menuMovilAbierto ? 'block' : 'hidden md:flex'}`}>
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
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-unahur-blue mb-4">
            <Search size={40} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-gray mb-4">
            Consulta tu <span className="text-unahur-green">Información Académica</span>
          </h1>
          <p className="text-medium-gray text-lg md:text-xl max-w-4xl mx-auto">
            Busca por número DNI para acceder a tu cursada, horarios y ubicación en nuestras sedes.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 mb-12 max-w-3xl mx-auto border-t-8 border-unahur-green">
          <form onSubmit={buscarComision}>
            <div className="mb-6">
              <label htmlFor="busqueda" className="block text-dark-gray font-semibold text-lg md:text-xl mb-3">
                <div className="flex items-center">
                  <User size={24} className="mr-2" />
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
                  className="w-full px-6 py-4 md:py-5 border-2 border-light-gray rounded-xl text-lg md:text-xl focus:outline-none focus:border-unahur-green focus:ring-4 focus:ring-unahur-green/10 bg-white text-dark-gray"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 md:py-5 bg-unahur-green text-white font-semibold text-lg md:text-xl rounded-xl hover:bg-[#90c473] active:translate-y-0.5 transition-all duration-200 shadow-button hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner mr-2"></span>
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search size={20} className="mr-2" />
                    Buscar Información
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={manejarReinicio}
                className="flex-1 px-6 py-4 md:py-5 bg-unahur-blue text-white font-semibold text-lg md:text-xl rounded-xl hover:bg-[#78cee4] transition-colors duration-200"
              >
                Reiniciar
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 md:p-5 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-error-red mr-3"></div>
                <span className="text-error-red">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Results Card */}
        {resultados && alumnoDatos && resultados.inscripciones && (
          <div className="bg-white rounded-2xl shadow-card p-4 md:p-8 mb-12 border border-light-gray w-full mx-auto">
            
            {/* Header del Alumno */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-6 border-b border-light-gray mb-8">
              <div className="flex items-center mb-4 lg:mb-0">
                <div className="p-3 rounded-xl bg-unahur-green mr-4">
                   <User size={28} className="text-white" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-gray capitalize">{alumnoDatos.alumno}</h2>
                </div>
              </div>
              
              <div className="flex items-center text-medium-gray bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                <IdCard size={24} className="text-unahur-accent mr-2" />
                <span className="font-mono font-bold text-lg md:text-xl">{alumnoDatos.dni}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-dark-gray mb-6 pb-3 border-b border-light-gray flex items-center">
                <BookOpen size={24} className="text-unahur-green mr-3" />
                Materias Inscriptas ({resultados.inscripciones.length})
              </h3>

              {/* Mostrar mensaje para móviles */}
              <div className="lg:hidden mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Smartphone size={20} className="text-unahur-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-dark-gray font-medium">
                      Vista optimizada para dispositivos móviles. Desplázate verticalmente para ver toda la información.
                    </p>
                  </div>
                </div>
              </div>

         
              {renderDesktopTable()}
              {renderMobileCards()}
            </div>
            
            {/* Mensaje Informativo Inferior */}
            <div className="bg-blue-50 border border-unahur-accent/30 rounded-lg p-4 md:p-5 flex items-start gap-3 mt-6">
               <div className="p-2 bg-unahur-accent rounded-full text-white mt-0.5 flex-shrink-0">
                  <Users size={18} />
               </div>
               <div>
                  <p className="text-sm md:text-base text-dark-gray">
                    Recuerda verificar el aula en la puerta de la sede. Los horarios mostrados corresponden a tu inscripción actual.
                  </p>
               </div>
            </div>

          </div>
        )}

        {/* Maps Section */}
        <div id="seccion-mapas" className="bg-unahur-blue rounded-2xl shadow-card border border-light-gray mb-12 w-full mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-8 bg-unahur-blue rounded-t-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">
              <span className="text-unahur-light-green">Mapas de Sedes</span> UNAHUR
            </h3>
            <div className="flex gap-3 md:gap-4 flex-wrap">
              <button
                onClick={() => {
                  setMapaActivo('origone')
                  setPisoActivo('baja')
                }}
                className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium flex items-center transition-all duration-200 text-sm md:text-base ${
                  mapaActivo === 'origone'
                    ? 'bg-unahur-green text-white shadow-lg'
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
                className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium flex items-center transition-all duration-200 text-sm md:text-base ${
                  mapaActivo === 'laPatria'
                    ? 'bg-unahur-green text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Home size={18} className="mr-2" />
                La Patria
              </button>
            </div>
          </div>

          <div className="bg-white p-4 md:p-8 rounded-b-2xl">
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Map size={24} className="text-unahur-accent mr-3" />
                <h4 className="text-xl md:text-2xl font-bold text-dark-gray">{mapaActual.nombre}</h4>
              </div>
              <p className="text-medium-gray text-base md:text-lg">{mapaActual.descripcion}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2">
                <div className="bg-light-gray rounded-xl p-3 md:p-4 border border-gray-300">
                  <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-lg overflow-hidden bg-white cursor-pointer group"
                       onClick={() => setImagenAmpliada(pisoActual.imagen)}>
                    <img
                      src={pisoActual.imagen}
                      alt={`Mapa de ${mapaActual.nombre} - ${pisoActual.nombre}`}
                      className="w-full h-full object-contain p-2 md:p-4 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                        <Maximize2 size={20} />
                        <span className="font-medium">Haz clic para ampliar</span>
                      </div>
                    </div>
                  </div>

                  {mapaActual.pisos.length > 1 && (
                    <div className="flex justify-center gap-3 md:gap-4 mt-4">
                      {mapaActual.pisos.map((piso) => (
                        <button
                          key={piso.id}
                          onClick={() => setPisoActivo(piso.id)}
                          className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors ${
                            pisoActivo === piso.id
                              ? 'bg-unahur-green text-white shadow'
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

              <div className="bg-gradient-to-br from-gray-50 to-white p-4 md:p-6 rounded-xl border border-light-gray">
                <h5 className="text-lg md:text-xl font-bold text-dark-gray mb-4 flex items-center">
                  <Navigation size={20} className="text-unahur-green mr-2" />
                  Información de la Sede
                </h5>

                <div className="mb-6">
                  <h6 className="font-semibold text-medium-gray text-sm md:text-base mb-2">Ubicación:</h6>
                  <p className="text-dark-gray text-sm md:text-base">
                    {mapaActivo === 'origone'
                      ? 'Av. Origone 151, Hurlingham, Buenos Aires'
                      : 'Av. La Patria 3800, Hurlingham, Buenos Aires'}
                  </p>
                </div>

                <div className="mb-6">
                  <h6 className="font-semibold text-medium-gray text-sm md:text-base mb-2">Servicios disponibles:</h6>
                  <ul className="space-y-2 md:space-y-3">
                    {mapaActual.servicios.map((servicio, index) => (
                      <li key={index} className="flex items-center text-sm md:text-base">
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
                className="w-32 h-14 md:w-36 md:h-16 object-contain mr-4"
              />
              <div>
                <h3 className="font-bold text-dark-gray text-lg md:text-xl">UNAHUR</h3>
                <p className="text-medium-gray text-sm md:text-base">Universidad Nacional de Hurlingham</p>
                <p className="text-medium-gray text-sm md:text-base mt-1">
                  Origone: Av. Origone 151, Hurlingham<br />
                  La Patria: Av. La Patria 3800, Hurlingham
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="flex justify-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-unahur-green flex items-center justify-center">
                  <MapPin size={24} className="text-white" />
                </div>
                <div className="w-12 h-12 rounded-full bg-unahur-accent flex items-center justify-center">
                  <GraduationCap size={24} className="text-white" />
                </div>
                <div className="w-12 h-12 rounded-full bg-unahur-green flex items-center justify-center">
                  <Building size={24} className="text-white" />
                </div>
              </div>
              <p className="text-medium-gray text-sm md:text-base">
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