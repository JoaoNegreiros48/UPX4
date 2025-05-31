import { Helmet } from 'react-helmet-async'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const signUpSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    role: z.enum(['motorista', 'caroneiro'], {
      errorMap: () => ({ message: 'Selecione um tipo de usuário' }),
    }),
    mercado_pago_link: z.string().url('Link de pagamento inválido').optional(),
  })
  .refine((data) => {
    if (data.role === 'motorista' && !data.mercado_pago_link) {
      return false
    }
    return true
  }, {
    message: 'O link de pagamento é obrigatório para motoristas',
    path: ['mercado_pago_link'],
  })

type SignUpForm = z.infer<typeof signUpSchema>

export function SignUp() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: 'caroneiro',
    },
  })

  const role = useWatch({
    control,
    name: 'role',
  })

  async function handleSignUp(data: SignUpForm) {
    try {
      console.log('Cadastro realizado com sucesso:', data)

      await axios.post('http://localhost:8000/register', data)

      toast.success('Cadastro realizado com sucesso!', {
        action: {
          label: 'Login',
          onClick: () => navigate('/sign-in'),
        },
      })
    } catch (error: any) {
      console.error(error)
      toast.error('Erro ao cadastrar. Verifique os dados e tente novamente.')
    }
  }

  return (
    <>
      <Helmet title="Cadastro" />

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 rounded-xl border bg-background p-6 shadow-lg">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
            <p className="text-sm text-muted-foreground">
              Escolha seu perfil e preencha os dados abaixo.
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="role">Tipo de usuário</Label>
              <select
                id="role"
                {...register('role')}
                className="w-full border rounded-md h-10 px-2"
              >
                <option value="caroneiro">Caroneiro</option>
                <option value="motorista">Motorista</option>
              </select>
              {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
            </div>

            {role === 'motorista' && (
              <div className="space-y-1">
                <Label htmlFor="mercado_pago_link">Link de pagamento</Label>
                <Input id="mercado_pago_link" {...register('mercado_pago_link')} />
                {errors.mercado_pago_link && (
                  <p className="text-xs text-red-500">{errors.mercado_pago_link.message}</p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Finalizar cadastro
            </Button>

            <Link to="/sign-in" className="text-sm block text-center text-muted-foreground">
              Já tem conta? Fazer login
            </Link>
          </form>
        </div>
      </div>
    </>
  )
}
