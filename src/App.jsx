import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('monitoring') // 'monitoring' or 'details'
  const [currentBoatIndex, setCurrentBoatIndex] = useState(0)
  const [previousBoatIndex, setPreviousBoatIndex] = useState(-1)
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 })
  const [timestamp, setTimestamp] = useState(new Date())
  const [showToast, setShowToast] = useState(false)
  const [detectionData, setDetectionData] = useState(null)

  // Stock boat images (user will replace these)
    const boatImages = [
    '/boat1.jpg',    // Tumhari photo
    '/boat2.jpg',
    '/boat3.jpg',
    '/boat4.jpg',
    '/boat5.jpg',
    '/boat6.jpg',
  ]


  // Generate random coordinates (Mumbai coastal area range)
  const generateRandomCoordinates = () => {
    const lat = (18.9 + Math.random() * 0.2).toFixed(6)
    const lng = (72.8 + Math.random() * 0.2).toFixed(6)
    return { lat, lng }
  }

  // Get next boat index (avoiding adjacent repeats)
  const getNextBoatIndex = () => {
    let nextIndex
    do {
      nextIndex = Math.floor(Math.random() * boatImages.length)
    } while (nextIndex === previousBoatIndex && boatImages.length > 1)
    return nextIndex
  }

  // Generate random interval between 5-10 seconds
  const getRandomInterval = () => {
    return Math.floor(Math.random() * 5000) + 5000 // 5000-10000ms
  }

  // Generate new detection data
  const generateDetection = () => {
    const nextIndex = getNextBoatIndex()
    const newCoords = generateRandomCoordinates()
    const newTimestamp = new Date()

    setPreviousBoatIndex(currentBoatIndex)
    setCurrentBoatIndex(nextIndex)
    setCoordinates(newCoords)
    setTimestamp(newTimestamp)

    setDetectionData({
      boatIndex: nextIndex,
      coords: newCoords,
      timestamp: newTimestamp
    })

    // Show toast notification
    setShowToast(true)

    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setShowToast(false)
    }, 5000)
  }

  // Random alert system (5-10 seconds interval)
  useEffect(() => {
    let timeout

    const scheduleNextAlert = () => {
      const interval = getRandomInterval()
      timeout = setTimeout(() => {
        if (currentPage === 'monitoring') {
          generateDetection()
        }
        scheduleNextAlert()
      }, interval)
    }

    scheduleNextAlert()

    return () => clearTimeout(timeout)
  }, [currentPage, previousBoatIndex])

  // Initial load
  useEffect(() => {
    setCoordinates(generateRandomCoordinates())
  }, [])

  const formatTimestamp = (date) => {
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  const handleCaptureClick = () => {
    generateDetection()
  }

  const handleViewDetails = () => {
    setCurrentPage('details')
    setShowToast(false)
  }

  const handleBackToMap = () => {
    setCurrentPage('monitoring')
  }

  // Monitoring Page (Page 1)
  if (currentPage === 'monitoring') {
    return (
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <h1>Oceanguard 2.0 - Live Monitoring</h1>
          <button className="capture-btn" onClick={handleCaptureClick}>
            📷 Capture
          </button>
        </header>

        {/* Full Screen Map */}
        <div className="map-section fullscreen">
          <div className="map-container-large">
            <img
              src="/ocean-map.jpg"
              alt="Ocean Map"
              className="map-image"
            />
            {/* Active monitoring indicator */}
            <div className="monitoring-status">
              <span className="status-dot"></span>
              <span className="status-text">LIVE MONITORING ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && detectionData && (
          <div className="toast-notification" onClick={handleViewDetails}>
            <div className="toast-header">
              <div className="toast-icon">🔴</div>
              <div className="toast-title">ALERT: Suspected Vessel Detected!</div>
              <button className="toast-close" onClick={(e) => {
                e.stopPropagation()
                setShowToast(false)
              }}>×</button>
            </div>
            <div className="toast-body">
              <div className="toast-info">
                📍 Location: {detectionData.coords.lat}°N, {detectionData.coords.lng}°E
              </div>
              <div className="toast-info">
                🕐 Time: {formatTimestamp(detectionData.timestamp)}
              </div>
              <div className="toast-action">
                Click to View Details →
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Details Page (Page 2)
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <button className="back-btn" onClick={handleBackToMap}>
          ← Back to Map
        </button>
        <h1>Oceanguard 2.0 - Detection Details</h1>
      </header>

      {/* Map Section with Red Marker */}
      <div className="map-section">
        <div className="map-container">
          <img
            src="/ocean-map.jpg"
            alt="Detection Location"
            className="map-image"
          />
          {/* Red Blinking Warning Marker */}
          <div className="warning-marker">
            <div className="marker-pulse"></div>
            <div className="marker-dot"></div>
            <div className="warning-popup">
              <div className="warning-title">⚠️ SUSPECTED VESSEL</div>
              <div className="warning-coords">
                {coordinates.lat}° N<br/>
                {coordinates.lng}° E
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Boat Photo Section */}
      <div className="photo-section">
        <div className="photo-header">
          <h2>📷 Camera Capture</h2>
        </div>
        <div className="photo-container">
          <img
            src={boatImages[currentBoatIndex]}
            alt="Suspected Vessel"
            className="boat-photo"
            key={currentBoatIndex}
          />
          <div className="photo-info">
            <div className="info-row">
              <span className="info-label">📅 Date/Time:</span>
              <span className="info-value">{formatTimestamp(timestamp)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">📍 Coordinates:</span>
              <span className="info-value">
                {coordinates.lat}° N, {coordinates.lng}° E
              </span>
            </div>
            <div className="info-row status-alert">
              <span className="status-indicator">🔴</span>
              <span className="status-text">ALERT: Suspected Vessel Detected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
