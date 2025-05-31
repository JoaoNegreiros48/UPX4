import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Car, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useEffect } from "react"

interface LocationState {
  coords: {
    lat: number
    lng: number
  }
  mode: "rider" | "driver"
}

export default function Payment() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState

  useEffect(() => {
    if (!state) {
      toast.error("Informações da carona não encontradas.")
      navigate("/")
    }
  }, [state, navigate])

  const handlePayment = () => {
    // Exemplo de link real seria criado no backend
    const fakePaymentLink =
      "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=123456789"
    window.location.href = fakePaymentLink
  }

  if (!state) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background/90 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Car className="h-5 w-5" />
            {state.mode === "rider"
              ? "Solicitação de Carona"
              : "Confirmação de Rota"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {state.mode === "rider"
              ? "Você está prestes a solicitar uma carona para o seguinte destino:"
              : "Você está oferecendo carona com o destino:"}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-green-600" />
            Latitude: <strong>{state.coords.lat.toFixed(5)}</strong>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-green-600" />
            Longitude: <strong>{state.coords.lng.toFixed(5)}</strong>
          </div>

          <Button className="w-full" onClick={handlePayment}>
            Ir para o pagamento
          </Button>

          <Button
            variant="ghost"
            className="w-full text-muted-foreground gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
