import { useState, useMemo, useCallback } from 'react'
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
  Smartphone,
  AlertCircle,
  HelpCircle
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
  
 
  const [mostrarAyudaGestion, setMostrarAyudaGestion] = useState(false)

  const [mapaActivo, setMapaActivo] = useState('origone')
  const [pisoActivo, setPisoActivo] = useState('baja')
  const [imagenAmpliada, setImagenAmpliada] = useState(null)

  
  const mapas = useMemo(() => ({
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
  }), [])

  const buscarComision = async (e) => {
    e.preventDefault()
    if (!busqueda) {
      setError('Por favor, ingresa tu búsqueda')
      return
    }

    // se verifica caché de sesión para reducir llamadas al servidor
    const cacheKey = `search_${busqueda.trim()}`;
    const cachedData = sessionStorage.getItem(cacheKey);

    setLoading(true)
    setError(null)
    setResultados(null)
    setMostrarAyudaGestion(false)

    if (cachedData) {
        
        setTimeout(() => {
            const data = JSON.parse(cachedData);
            setResultados(data);
            setLoading(false);
        }, 300);
        return;
    }

    try {
      const response = await fetch(`/.netlify/functions/consultar?q=${encodeURIComponent(busqueda)}`)
      const data = await response.json()

      if (response.ok) {
        if (data.inscripciones && data.inscripciones.length > 0) {
          setResultados(data)
          // Guardar en caché 
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        } else {
          setError('No se encontraron inscripciones asociadas a este documento.')
          setMostrarAyudaGestion(true)
        }
      } else {
        // 404 , mostramos el mensaje de ayuda
        setError(data.error || 'No pudimos encontrar tus datos.')
        setMostrarAyudaGestion(true)
      }
    } catch (err) {
      setError('Hubo un problema de conexión. Por favor, intenta nuevamente en unos segundos.')
    } finally {
      setLoading(false)
    }
  }

  const manejarReinicio = () => {
    setBusqueda('')
    setResultados(null)
    setError(null)
    setMostrarAyudaGestion(false)
  }

  
  const detectarSede = useCallback((aulaTexto) => {
    if (!aulaTexto) return null
    const texto = aulaTexto.toLowerCase()
    if (texto.includes('patria')) return 'laPatria'
    if (texto.includes('origone')) return 'origone'
    return null
  }, [])

  const mapaActual = mapas[mapaActivo] || mapas.origone
  const pisoActual = mapaActual.pisos.find(p => p.id === pisoActivo) || mapaActual.pisos[0]

  const alumnoDatos = resultados; 

 
  const renderDesktopTable = useMemo(() => {
    if (!resultados) return null;
    return (
    <div className="hidden lg:block overflow-hidden rounded-xl border border-light-gray w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-50 text-medium-gray text-sm uppercase font-bold tracking-wider border-b border-light-gray">
              <th className="px-6 py-4 w-[28%] min-w-[300px]">Materia</th>
              <th className="px-6 py-4 w-[12%] text-center min-w-[120px]">Comisión</th>
              <th className="px-6 py-4 w-[22%] min-w-[250px]">Docente</th>
              <th className="px-6 py-4 w-[18%] min-w-[180px]">Días de Cursada</th>
              <th className="px-6 py-4 w-[15%] min-w-[160px]">Horario</th>
              <th className="px-6 py-4 w-[20%] min-w-[200px]">Aula</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-gray bg-white">
            {resultados.inscripciones.map((materia, index) => {
              const sedeSugerida = detectarSede(materia.aula);
              
              const diasActivos = materia.horarios 
                ? Object.entries(materia.horarios).filter(([_, h]) => h !== '-')
                : [];

              return (
                <tr key={`${materia.comision}-${index}`} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-5 align-top">
                    <span className="font-bold text-dark-gray text-xl block break-words leading-relaxed pr-2">
                      {materia.materia}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center align-top">
                    <span className="inline-flex items-center px-5 py-3 rounded-full bg-unahur-accent/10 text-unahur-blue text-xl font-bold min-w-[100px] justify-center">
                      {materia.comision}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-dark-gray text-lg align-top">
                    <div className="break-words max-w-full leading-relaxed pr-2">
                      {materia.docente}
                    </div>
                  </td>
                  
                  <td className="px-6 py-5 align-top">
                    <div className="flex flex-col gap-3">
                      {diasActivos.length > 0 ? (
                        diasActivos.map(([dia, _]) => (
                          <span key={dia} className="capitalize font-bold text-unahur-green flex items-center gap-3 text-lg">
                            <Calendar size={18} className="flex-shrink-0" /> 
                            <span className="truncate">{dia}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-medium-gray text-lg">A confirmar</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5 align-top">
                    <div className="flex flex-col gap-3">
                      {diasActivos.length > 0 ? (
                        diasActivos.map(([dia, hora]) => (
                          <span key={dia} className="text-dark-gray text-lg font-medium flex items-center gap-3">
                            <Clock size={18} className="text-medium-gray flex-shrink-0" /> 
                            <span className="truncate">{hora}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-medium-gray text-lg">-</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5 align-top">
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-dark-gray flex items-center gap-3 text-xl">
                        <MapPin size={20} className="text-error-red flex-shrink-0" />
                        <span className="break-words pr-2">{materia.aula}</span>
                      </span>
                      {sedeSugerida && (
                        <button
                          onClick={() => {
                            setMapaActivo(sedeSugerida);
                            const el = document.getElementById('seccion-mapas');
                            if(el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-base text-unahur-blue hover:underline mt-3 flex items-center gap-2 font-medium"
                        >
                          Ver mapa <Navigation size={14} />
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
  )}, [resultados, detectarSede]);

 
  const renderMobileCards = useMemo(() => {
    if (!resultados) return null;
    return (
    <div className="lg:hidden space-y-6">
      {resultados.inscripciones.map((materia, index) => {
        const sedeSugerida = detectarSede(materia.aula);
        const diasActivos = materia.horarios 
          ? Object.entries(materia.horarios).filter(([_, h]) => h !== '-')
          : [];

        return (
          <div key={`${materia.comision}-${index}`} className="bg-white rounded-xl border border-light-gray p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-bold text-dark-gray text-xl mb-3">{materia.materia}</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-unahur-accent/10 text-unahur-blue text-base font-bold">
                      Comisión {materia.comision}
                    </span>
                    {sedeSugerida && (
                      <button
                        onClick={() => {
                          setMapaActivo(sedeSugerida);
                          const el = document.getElementById('seccion-mapas');
                          if(el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-sm text-unahur-blue hover:underline flex items-center gap-1 font-medium"
                      >
                        Ver mapa <Navigation size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-base text-medium-gray mb-2 font-semibold">Docente:</p>
                <p className="text-dark-gray font-medium text-lg">{materia.docente}</p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-base text-medium-gray mb-3 font-semibold">Días:</p>
                  <div className="space-y-2">
                    {diasActivos.length > 0 ? (
                      diasActivos.map(([dia, _]) => (
                        <div key={dia} className="flex items-center gap-3">
                          <Calendar size={16} className="text-unahur-green flex-shrink-0" />
                          <span className="capitalize text-dark-gray font-medium text-base">{dia}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-medium-gray text-base">A confirmar</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-base text-medium-gray mb-3 font-semibold">Horarios:</p>
                  <div className="space-y-2">
                    {diasActivos.length > 0 ? (
                      diasActivos.map(([dia, hora]) => (
                        <div key={dia} className="flex items-center gap-3">
                          <Clock size={16} className="text-medium-gray flex-shrink-0" />
                          <span className="text-dark-gray font-medium text-base">{hora}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-medium-gray text-base">-</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-base text-medium-gray mb-2 font-semibold">Aula:</p>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-error-red flex-shrink-0" />
                  <span className="font-bold text-dark-gray text-lg">{materia.aula}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )}, [resultados, detectarSede]);

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
              loading="lazy"
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
                loading="lazy"
              />
              <div className="text-center">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                  UNIVERSIDAD NACIONAL DE HURLINGHAM
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-light-gray py-3 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-unahur-green mr-2"></div>
              <span className="font-medium text-medium-gray text-sm sm:text-base">Consulta Académica</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-unahur-accent mr-2"></div>
              <span className="font-medium text-medium-gray text-sm sm:text-base">Información por Comisión</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
            <div className="flex items-center">
              <Map size={18} className="text-medium-gray mr-2" />
              <span className="font-medium text-medium-gray text-sm sm:text-base">Mapas de Sedes</span>
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
            Busca por DNI para acceder a tu cursada, horarios y ubicación en nuestras sedes.
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
                  disabled={loading}
                  className="w-full px-6 py-4 md:py-5 border-2 border-light-gray rounded-xl text-lg md:text-xl focus:outline-none focus:border-unahur-green focus:ring-4 focus:ring-unahur-green/10 bg-white text-dark-gray disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                type="submit"
                disabled={loading || !busqueda}
                className="flex-1 px-6 py-4 md:py-5 bg-unahur-green text-white font-semibold text-lg md:text-xl rounded-xl hover:bg-[#90c473] active:translate-y-0.5 transition-all duration-200 shadow-button hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
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
                disabled={loading}
                className="flex-1 px-6 py-4 md:py-5 bg-unahur-blue text-white font-semibold text-lg md:text-xl rounded-xl hover:bg-[#78cee4] transition-colors duration-200 disabled:opacity-50"
              >
                Reiniciar
              </button>
            </div>
          </form>

          {/* MENSAJE DE ERROR Y AYUDA GESTIÓN ESTUDIANTIL */}
          {error && (
            <div className="mt-8 animate-fade-in">
              <div className="p-5 bg-red-50 border border-red-200 rounded-xl mb-4 flex items-start gap-3">
                <AlertCircle size={24} className="text-error-red flex-shrink-0 mt-0.5" />
                <span className="text-error-red font-medium text-lg">{error}</span>
              </div>

              {mostrarAyudaGestion && (
                 <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                       <div className="bg-yellow-100 p-3 rounded-full text-yellow-700">
                          <HelpCircle size={32} />
                       </div>
                       <div>
                          <h4 className="text-xl font-bold text-gray-800">¿No encontrás tus datos o son incorrectos?</h4>
                          <p className="text-gray-600 mt-1">Es posible que la inscripción no se haya procesado correctamente o falte documentación.</p>
                       </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-yellow-100">
                       <p className="text-lg text-gray-800 font-medium mb-2">Por favor, acércate a <span className="text-unahur-green font-bold">Gestión Estudiantil</span>:</p>
                       <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center gap-2">
                             <MapPin size={18} className="text-unahur-blue"/> 
                             Sede Origone (Planta Baja)
                          </li>
                          <li className="flex items-center gap-2">
                             <Clock size={18} className="text-unahur-blue"/> 
                             Lunes a Viernes de 9 a 20 hs
                          </li>
                       </ul>
                    </div>
                 </div>
              )}
            </div>
          )}
        </div>

        {/* Results Card */}
        {resultados && alumnoDatos && resultados.inscripciones && (
          <div className="bg-white rounded-2xl shadow-card p-4 md:p-8 mb-12 border border-light-gray w-full mx-auto animate-fade-in">
            
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

              {/* Mensaje Móvil */}
              <div className="lg:hidden mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Smartphone size={20} className="text-unahur-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-dark-gray font-medium">
                      Desplázate hacia abajo para ver todas las materias.
                    </p>
                  </div>
                </div>
              </div>

              {renderDesktopTable}
              {renderMobileCards}
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
                      loading="lazy"
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
                loading="lazy"
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