import { SelectHTMLAttributes, ReactNode } from 'react'
import styles from './AdminForm.module.scss'

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode
  error?: string
}

const FormSelect = ({ className, children, error, ...props }: FormSelectProps) => {
  return (
    <select
      className={`${styles.select} ${error ? styles.errorInput : ''} ${className || ''}`}
      {...props}
    >
      {children}
    </select>
  )
}

export default FormSelect

