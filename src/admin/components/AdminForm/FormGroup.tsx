import { ReactNode } from 'react'
import styles from './AdminForm.module.scss'

interface FormGroupProps {
  children: ReactNode
  label?: string
  error?: string
}

const FormGroup = ({ children, label, error }: FormGroupProps) => {
  return (
    <div className={styles.formGroup}>
      {label && <label className={styles.label}>{label}</label>}
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}

export default FormGroup

