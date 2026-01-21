// src/App.jsx
import { useState } from 'react'
import './App.css'

function App() {
  const [busqueda, setBusqueda] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const buscarComision = async (e) => {
    e.preventDefault()
    if (!busqueda) return
    
    setLoading(true)
    setError(null)
    setResultado(null)

    try {
      // Llamamos a nuestra función serverless
      // Nota: En local esto requiere configuración extra, pero en producción funciona directo.
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

  return (
    <div className="buscador-container">
      <h1>📅 Donde Curso</h1>
      <p>Ingresa el nombre de tu comisión o el numero</p>
      
      <form onSubmit={buscarComision} className="input-group">
        <input 
          type="text" 
          placeholder="Ej: COMISIÓN 101 TT" 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? '...' : 'Buscar'}
        </button>
      </form>

      {error && <div className="error-msg">{error}</div>}

      {resultado && (
        <div className="card">
          <h2>{resultado.id}</h2>
          <p style={{marginBottom: '15px'}}>{resultado.carrera}</p>
          
          <div className="dato-fila">
            <span className="dato-label">Turno:</span>
            <span className="dato-valor">{resultado.turno}</span>
          </div>

          <div className="dato-fila">
            <span className="dato-label">Aula:</span>
            <span className="aula-badge">{resultado.aula}</span>
          </div>

          <h3 style={{marginTop: '20px', fontSize: '1rem', borderBottom: '2px solid #ddd'}}>Horarios</h3>
          {Object.entries(resultado.horarios).map(([dia, materia]) => (
            materia !== '-' && (
              <div key={dia} className="dato-fila">
                <span className="dato-label" style={{textTransform: 'capitalize'}}>{dia}:</span>
                <span className="dato-valor" style={{textAlign: 'right', maxWidth: '60%'}}>{materia}</span>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  )
}

export default App