'use client'

import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  DirectionsRenderer
} from '@react-google-maps/api'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

interface LatLng {
  lat: number
  lng: number
}

interface Place {
  geometry: {
    location: {
      lat: () => number
      lng: () => number
    }
  }
}

interface Route {
  motorista_id: string
  preco: string
  mercado_pago_link: string
  rota: {
    origem: [number, number]
    destino: [number, number]
  }
}

interface DirectionsResult {
  routes: {
    legs: {
      distance?: { text: string }
      duration?: { text: string }
    }[]
  }[]
}

const containerStyle = {
  width: '100%',
  height: '400px'
}

const center = {
  lat: -23.55052,
  lng: -46.633308
}

const getLatLngFromPlace = (place: Place | null): LatLng | null => {
  if (!place || !place.geometry) return null
  const location = place.geometry.location
  return {
    lat: location.lat(),
    lng: location.lng()
  }
}

export default function DriverRouteMap() {
  const [origin, setOrigin] = useState<LatLng | null>(null)
  const [destination, setDestination] = useState<LatLng | null>(null)
  const [directions, setDirections] = useState<DirectionsResult | null>(null)
  const [distance, setDistance] = useState<string | null>(null)
  const [duration, setDuration] = useState<string | null>(null)
  const [routesNearby, setRoutesNearby] = useState<Route[]>([])
  const [showModal, setShowModal] = useState(false)
  const [price, setPrice] = useState('')

  const originRef = useRef<google.maps.places.Autocomplete | null>(null)
  const destinationRef = useRef<google.maps.places.Autocomplete | null>(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')
  const isDriver = user?.role === 'motorista'

  const handlePlaceChanged = () => {
    const originPlace = originRef.current?.getPlace()
    const destinationPlace = destinationRef.current?.getPlace()

    if (originPlace && destinationPlace) {
      const originCoords = getLatLngFromPlace(originPlace)
      const destinationCoords = getLatLngFromPlace(destinationPlace)
      setOrigin(originCoords)
      setDestination(destinationCoords)
    }
  }

  useEffect(() => {
    if (origin && destination) {
      const service = new google.maps.DirectionsService()
      service.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result)
            const leg = result.routes[0].legs[0]
            setDistance(leg.distance?.text || null)
            setDuration(leg.duration?.text || null)
          } else {
            console.error('Erro ao calcular rota:', status)
          }
        }
      )
    }
  }, [origin, destination])

  const handleSubmit = async () => {
    if (!origin || !destination) return

    if (isDriver) {
      const body = {
        origin_lat: origin.lat,
        origin_lng: origin.lng,
        destination_lat: destination.lat,
        destination_lng: destination.lng,
        price: parseFloat(price) || 0
      }

      await fetch('http://localhost:8000/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      alert('Rota cadastrada com sucesso!')
    } else {
      const res = await fetch(`http://localhost:8000/routes/search?lat=${origin.lat}&lng=${origin.lng}`)
      const data = await res.json() as Route[]
      setRoutesNearby(data)
      setShowModal(true)
    }
  }

  const handleChooseRoute = (mercado_pago_link: string) => {
    // console.log('Link de pagamento:', mercado_pago_link)
    window.location.href = mercado_pago_link
  }

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={['places']}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <Autocomplete onLoad={(ref) => (originRef.current = ref)} onPlaceChanged={handlePlaceChanged}>
            <input
              type="text"
              placeholder="Origem"
              className="border rounded-md p-3 w-full text-lg"
            />
          </Autocomplete>

          <Autocomplete onLoad={(ref) => (destinationRef.current = ref)} onPlaceChanged={handlePlaceChanged}>
            <input
              type="text"
              placeholder="Destino"
              className="border rounded-md p-3 w-full text-lg"
            />
          </Autocomplete>
        </div>

        {isDriver && (
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Preço da corrida (R$)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded-md p-3 w-full text-lg"
          />
        )}

        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>

        {distance && duration && (
          <div className="text-sm text-muted-foreground">
            Distância: {distance} — Duração: {duration}
          </div>
        )}

        <Button variant="default" onClick={handleSubmit} className="w-full text-lg">
          {isDriver ? 'Cadastrar rota' : 'Buscar caronas'}
        </Button>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">Rotas disponíveis</DialogTitle>
            </DialogHeader>
            {routesNearby.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma rota encontrada.</p>
            ) : (
              <ul className="space-y-4 max-h-80 overflow-auto">
                {routesNearby.map((r, i) => (
                  <li key={i} className="border p-4 rounded-md shadow-sm flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <p className="text-md"><strong>ID do motorista:</strong> {r.motorista_id}</p>
                      <p className="text-md"><strong>Preço:</strong> R${r.preco}</p>
                    </div>
                    <Button variant="outline" className="mt-2 md:mt-0" onClick={() => handleChooseRoute(r.mercado_pago_link)}>
                      Escolher e pagar
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </LoadScript>
  )
}
