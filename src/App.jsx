import { useState } from 'react'
import './App.css'

import logoUnahur from './assets/logo-unahur.png'
import logo from './assets/logo.png'
import mapaOrigone from './assets/mapa-origone.png'
import mapaOrigoneAlta from './assets/mapa-origone-planta-alta.png'
import sedePatria from './assets/sede-la-patria.png'

// Componentes de íconos SVG
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
)

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
)

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
)

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
)

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
)

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <rect x="9" y="6" width="6" height="6"></rect>
    <line x1="9" y1="14" x2="9" y2="18"></line>
    <line x1="15" y1="14" x2="15" y2="18"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
)

const GraduationCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
  </svg>
)

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
    <line x1="8" y1="2" x2="8" y2="18"></line>
    <line x1="16" y1="6" x2="16" y2="22"></line>
  </svg>
)

const NavigationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
  </svg>
)

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
)

function App() {
  const [busqueda, setBusqueda] = useState('')
  const [resultado, setResultado] = useState(null)
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
        'Instituto de Ciencias Sociales',
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
      setError('Por favor, ingresa el nombre o número de tu comisión')
      return
    }

    setLoading(true)
    setError(null)
    setResultado(null)

    try {
      const response = await fetch(`/.netlify/functions/consultar?q=${encodeURIComponent(busqueda)}`)
      const data = await response.json()

      if (response.ok) {
        setResultado(data)
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
    setResultado(null)
    setError(null)
  }

  const mapaActual = mapas[mapaActivo] || mapas.origone
  const pisoActual = mapaActual.pisos.find(p => p.id === pisoActivo) || mapaActual.pisos[0]

  return (
    <div className="App">
      {/* Header */}
      <header className="header-container">
        <div className="header-content">
          <div className="header-logo-section">
            <img
              src={logo}
              alt="Logo UNAHUR"
              className="logo-image"
            />
            <div className="header-title">
              <h1>Universidad Nacional de Hurlingham</h1>
              <p>"Conocimiento para la inclusión social"</p>
            </div>
          </div>
          <div className="cycle-badge">
            <CalendarIcon />
            <span>Ciclo 2026</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-container">
          <div className="nav-items">
            <div className="nav-item">
              <div className="nav-indicator green"></div>
              <span>Consulta Académica</span>
            </div>
            <div className="nav-divider hidden"></div>
            <div className="nav-item">
              <div className="nav-indicator blue"></div>
              <span>Información por Comisión</span>
            </div>
            <div className="nav-divider hidden"></div>
            <div className="nav-item">
              <MapIcon />
              <span style={{ marginLeft: '0.5rem' }}>Mapas de Sedes</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="search-icon-container">
            <SearchIcon />
          </div>
          <h1 className="hero-title">
            Consulta tu <span>Información Académica</span>
          </h1>
          <p className="hero-description">
            Ingresa el nombre de tu comisión o el número para acceder a tu carrera, comisión, horarios de cursada y ubicación en nuestras sedes.
          </p>
        </div>

        {/* Search Form */}
        <div className="search-container">
          <form onSubmit={buscarComision}>
            <div className="mb-6">
              <label htmlFor="comision" className="form-label">
                <UserIcon />
                Ingresá tu comisión
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="comision"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Ejemplo: COMISIÓN 101 TT"
                  className="search-input"
                />
                <div className="comision-badge">COMISIÓN</div>
              </div>
              <p className="demo-text mb-4">
                <span>Ejemplos de búsqueda:</span> COMISIÓN 101 TT, 205 TN, 150 TM
              </p>
            </div>

            <div className="form-buttons">
              <button
                type="submit"
                className="search-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Buscando...</span>
                  </>
                ) : 'Buscar Información'}
              </button>
              <button
                type="button"
                className="reset-button"
                onClick={manejarReinicio}
              >
                Reiniciar
              </button>
            </div>
          </form>

          {error && (
            <div className="error-message">
              <div className="flex items-center">
                <div className="error-indicator"></div>
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Results Card */}
        {resultado && (
          <div className="student-card">
            <div className="card-header">
              <div className="comision-info">
                <div className="comision-icon">
                  <UserIcon />
                </div>
                <div className="comision-details">
                  <h2>{resultado.id}</h2>
                  <p>{resultado.carrera}</p>
                </div>
              </div>
              <div className="location-info">
                {resultado.edificio && (
                  <div className="flex items-center">
                    <BuildingIcon />
                    <span>{resultado.edificio}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="section-title">
                <BookOpenIcon />
                Información Académica
              </h3>

              <div className="info-grid">
                <div className="info-card">
                  <div className="card-header-small">
                    <div className="card-icon">
                      <GraduationCapIcon />
                    </div>
                    <h4>Carrera</h4>
                  </div>
                  <p>{resultado.carrera}</p>
                </div>

                <div className="info-card">
                  <div className="card-header-small">
                    <div className="card-icon">
                      <UsersIcon />
                    </div>
                    <h4>Comisión</h4>
                  </div>
                  <p>{resultado.id}</p>
                </div>

                <div className="info-card">
                  <div className="card-header-small">
                    <div className="card-icon">
                      <ClockIcon />
                    </div>
                    <h4>Turno</h4>
                  </div>
                  <p>{resultado.turno}</p>
                </div>
              </div>

              <div className="info-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="info-card">
                  <div className="card-header-small">
                    <div className="card-icon">
                      <MapPinIcon />
                    </div>
                    <h4>Aula</h4>
                  </div>
                  <div className="aula-badge">{resultado.aula}</div>
                </div>
              </div>
            </div>

            <div className="horarios-container">
              <h3 className="section-title">
                <CalendarIcon />
                Horarios de Cursada
              </h3>

              {Object.entries(resultado.horarios).map(([dia, materia]) => (
                materia !== '-' && (
                  <div key={dia} className="horario-fila">
                    <span className="dato-label">{dia}:</span>
                    <span className="dato-valor">{materia}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Maps Section*/}
        <div className="maps-container">
          <div className="maps-header">
            <h3 className="maps-title">
              <span>Mapas de Sedes</span> UNAHUR
            </h3>

            <div className="maps-buttons">
              <button
                onClick={() => {
                  setMapaActivo('origone')
                  setPisoActivo('baja')
                }}
                className={`map-button ${mapaActivo === 'origone' ? 'active' : ''}`}
              >
                <BuildingIcon />
                Origone
              </button>
              <button
                onClick={() => {
                  setMapaActivo('laPatria')
                  setPisoActivo('baja')
                }}
                className={`map-button ${mapaActivo === 'laPatria' ? 'active' : ''}`}
              >
                <HomeIcon />
                La Patria
              </button>
            </div>
          </div>

          <div className="maps-content">
            <div className="map-info">
              <div className="map-info-header">
                <MapIcon />
                <h4>{mapaActual.nombre}</h4>
              </div>
              <p>{mapaActual.descripcion}</p>
            </div>

            <div className="maps-grid">
              <div>
                <div className="map-display">
                  <div className="map-image-container">
                    <img
                      src={pisoActual.imagen}
                      alt={`Mapa de ${mapaActual.nombre} - ${pisoActual.nombre}`}
                      className="map-image"
                    />
                  </div>

                  {mapaActual.pisos.length > 1 && (
                    <div className="floor-buttons">
                      {mapaActual.pisos.map((piso) => (
                        <button
                          key={piso.id}
                          onClick={() => setPisoActivo(piso.id)}
                          className={`floor-button ${pisoActivo === piso.id ? 'active' : 'inactive'}`}
                        >
                          {piso.nombre}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="map-sidebar">
                <h5 className="sidebar-title">
                  <NavigationIcon />
                  Información de la Sede
                </h5>

                <div className="info-section">
                  <h6>Ubicación:</h6>
                  <p>
                    {mapaActivo === 'origone'
                      ? 'Av. Origone 151, Hurlingham, Buenos Aires'
                      : 'Av. La Patria 123, Hurlingham, Buenos Aires'}
                  </p>
                </div>

                <div className="info-section">
                  <h6>Servicios disponibles:</h6>
                  <ul className="services-list">
                    {mapaActual.servicios.map((servicio, index) => (
                      <li key={index} className="service-item">
                        <div className="service-indicator"></div>
                        <span>{servicio}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {resultado && resultado.edificio && (
                  <div className="student-location">
                    <div className="flex items-center mb-2">
                      <div className="location-indicator"></div>
                      <span className="font-semibold">Tu ubicación</span>
                    </div>
                    <p className="location-text">
                      {resultado.edificio === (mapaActivo === 'origone' ? 'Origone' : 'La Patria') ? (
                        <>
                          Estás cursando en esta sede: <span>{resultado.edificio}</span>
                          {resultado.piso && ` - ${resultado.piso}`}
                        </>
                      ) : (
                        <>
                          Tu comisión se encuentra en: <span>{resultado.edificio}</span>
                          {resultado.piso && ` - ${resultado.piso}`}
                          <br />
                          <small style={{ color: '#718096', fontStyle: 'italic' }}>
                            (Selecciona "{resultado.edificio}" en los botones de arriba para ver ese mapa)
                          </small>
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img
              src={logoUnahur}
              alt="Logo UNAHUR"
              className="footer-logo-image"
            />
            <div className="footer-info">
              <h3>UNAHUR</h3>
              <p>Universidad Nacional de Hurlingham</p>
              <p className="footer-address">
                Origone: Av. Origone 151, Hurlingham<br />
                La Patria: Av. La Patria 123, Hurlingham
              </p>
            </div>
          </div>

          <div className="footer-center">
            <div className="icon-grid">
              <div className="icon-circle green">
                <MapPinIcon />
              </div>
              <div className="icon-circle blue">
                <GraduationCapIcon />
              </div>
              <div className="icon-circle green">
                <BuildingIcon />
              </div>
            </div>
            <p className="footer-copyright">
              Sistema Académico © {new Date().getFullYear()}<br />
              <span>Universidad Nacional de Hurlingham</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App