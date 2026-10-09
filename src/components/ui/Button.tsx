import type { ButtonHTMLAttributes } from 'react'
import { VARIANTS, buttonClass } from './buttonStyles'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS
  /** Clases extra para pisar el estilo (ej. acento del sabor). */
  className?: string
}

export function Button({ variant = 'primary', className = '', type = 'button', ...rest }: Props) {
  return <button type={type} className={buttonClass(variant, className)} {...rest} />
}
