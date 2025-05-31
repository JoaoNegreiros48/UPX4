import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const signInForm = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta"),
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
  })

  async function handleSignIn(data: SignInForm) {
    try {
      const response = await axios.post('http://localhost:8000/login', data)

      const { token, user } = response.data

      // Armazena o token (você pode usar context, localStorage, etc.)
      localStorage.setItem('token', token)
      localStorage.setItem("user", JSON.stringify(user)) // ou "driver"


      toast.success('Login feito com sucesso!')
      navigate('/')
    } catch (error) {
      console.error(error)
      toast.error('Falha no login. Verifique suas credenciais.')
    }
  }

  return (
    <>
      <Helmet title="Login" />

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="relative w-full max-w-sm space-y-6 rounded-xl border bg-background p-6 shadow-lg">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar painel
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe suas rotas pelo painel!
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Sua senha</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Acessar painel
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              asChild
            >
              <Link to="/sign-up" className="text-sm font-semibold">
                Novo por aqui? Crie uma conta grátis
              </Link>
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
