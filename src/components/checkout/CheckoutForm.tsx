import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState, type ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import {
  BUSINESS_NAME,
  METODOS_PAGO,
  PUNTOS_RETIRO,
  WHATSAPP_NUMBER,
  ZONAS_ENVIO,
} from '../../config'
import type { DetailedLine } from '../../hooks/useCartSummary'
import { makeCheckoutSchema, type CheckoutValues } from '../../lib/checkout'
import { formatPrice } from '../../lib/format'
import type { CartSummary } from '../../lib/pricing'
import { buildOrderMessage, buildWhatsAppUrl } from '../../lib/whatsapp'
import { buttonClass } from '../ui/buttonStyles'
import { TransferInfo } from './TransferInfo'

const input =
  'min-h-12 w-full rounded-xl border border-line bg-surface2 px-4 text-base placeholder:text-neutral-500 focus:border-brand'

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold">
        {label}
        {hint && <span className="ml-1 font-normal text-muted">({hint})</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm text-rose-400">
          {error}
        </p>
      )}
    </div>
  )
}

interface Props {
  lines: DetailedLine[]
  summary: CartSummary
  modelo: string
}

export function CheckoutForm({ lines, summary, modelo }: Props) {
  const hayRetiro = PUNTOS_RETIRO.length > 0
  const schema = useMemo(() => makeCheckoutSchema(ZONAS_ENVIO, hayRetiro), [hayRetiro])
  const [waUrl, setWaUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: '',
      entrega: 'envio',
      localidad: '',
      direccion: '',
      puntoRetiro: '',
      metodoPago: 'Efectivo',
      efectivoCon: '',
      observaciones: '',
    },
  })
  const entrega = useWatch({ control, name: 'entrega' })
  const metodo = useWatch({ control, name: 'metodoPago' })
  const puntoSel = useWatch({ control, name: 'puntoRetiro' })
  const punto = PUNTOS_RETIRO.find((p) => p.nombre === puntoSel)

  const onSubmit = (v: CheckoutValues) => {
    if (v.metodoPago === 'Efectivo' && v.efectivoCon && Number(v.efectivoCon) < summary.total) {
      setError('efectivoCon', { message: `Tiene que ser al menos ${formatPrice(summary.total)}` })
      return
    }
    const text = buildOrderMessage(
      BUSINESS_NAME,
      modelo,
      lines.map((l) => ({
        emoji: l.product.emoji,
        nombre: l.product.nombre,
        quantity: l.quantity,
      })),
      summary,
      v,
    )
    const url = buildWhatsAppUrl(WHATSAPP_NUMBER, text)
    setWaUrl(url)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const err = (k: keyof CheckoutValues) => errors[k]?.message
  const aria = (k: keyof CheckoutValues) => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `${k}-error` : undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field label="Nombre" htmlFor="nombre" error={err('nombre')}>
        <input
          id="nombre"
          autoComplete="name"
          className={input}
          {...aria('nombre')}
          {...register('nombre')}
        />
      </Field>

      {hayRetiro && (
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">¿Cómo lo recibís?</legend>
          <div className="grid grid-cols-2 gap-3">
            {(['envio', 'retiro'] as const).map((v) => (
              <label
                key={v}
                className="flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border border-line bg-surface2 px-4 has-[:checked]:border-brand has-[:focus-visible]:outline"
              >
                <input
                  type="radio"
                  value={v}
                  className="accent-violet-500"
                  {...register('entrega')}
                />
                {v === 'envio' ? 'Envío' : 'Retiro'}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {entrega === 'envio' ? (
        <>
          <Field label="Localidad" htmlFor="localidad" error={err('localidad')}>
            <select
              id="localidad"
              className={input}
              {...aria('localidad')}
              {...register('localidad')}
            >
              <option value="">Elegí tu localidad</option>
              {ZONAS_ENVIO.map((z) => (
                <option key={z}>{z}</option>
              ))}
            </select>
          </Field>
          <Field
            label="Dirección"
            htmlFor="direccion"
            error={err('direccion')}
            hint="calle, número, piso/depto"
          >
            <input
              id="direccion"
              autoComplete="street-address"
              className={input}
              {...aria('direccion')}
              {...register('direccion')}
            />
          </Field>
        </>
      ) : (
        <Field label="Punto de retiro" htmlFor="puntoRetiro" error={err('puntoRetiro')}>
          <select
            id="puntoRetiro"
            className={input}
            {...aria('puntoRetiro')}
            {...register('puntoRetiro')}
          >
            <option value="">Elegí un punto</option>
            {PUNTOS_RETIRO.map((p) => (
              <option key={p.nombre} value={p.nombre}>
                {p.nombre}
              </option>
            ))}
          </select>
          {punto && (
            <p className="text-sm text-muted">
              {punto.direccion} · Podés pasar: {punto.horario}
            </p>
          )}
        </Field>
      )}

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold">Método de pago</legend>
        <div className="grid grid-cols-2 gap-3">
          {METODOS_PAGO.map((mp) => (
            <label
              key={mp}
              className="flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border border-line bg-surface2 px-4 has-[:checked]:border-brand has-[:focus-visible]:outline"
            >
              <input
                type="radio"
                value={mp}
                className="accent-violet-500"
                {...register('metodoPago')}
              />
              {mp}
            </label>
          ))}
        </div>
        {err('metodoPago') && (
          <p role="alert" className="text-sm text-rose-400">
            {err('metodoPago')}
          </p>
        )}
      </fieldset>

      {metodo === 'Transferencia' && <TransferInfo />}
      {metodo === 'Efectivo' && (
        <Field
          label="¿Con cuánto pagás?"
          htmlFor="efectivoCon"
          error={err('efectivoCon')}
          hint="opcional, para llevar cambio"
        >
          <input
            id="efectivoCon"
            inputMode="numeric"
            placeholder="Ej: 50000"
            className={input}
            {...aria('efectivoCon')}
            {...register('efectivoCon')}
          />
        </Field>
      )}

      <Field
        label="Observaciones"
        htmlFor="observaciones"
        error={err('observaciones')}
        hint="opcional"
      >
        <textarea
          id="observaciones"
          rows={3}
          className={`${input} py-3`}
          {...register('observaciones')}
        />
      </Field>

      <button type="submit" className={buttonClass('whatsapp', 'w-full')}>
        Confirmar pedido por WhatsApp
      </button>
      {waUrl && (
        <p className="text-center text-sm text-muted">
          ¿No se abrió WhatsApp?{' '}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand underline"
          >
            Tocá acá
          </a>
        </p>
      )}
    </form>
  )
}
