import { InputHTMLAttributes } from 'react'
import styles from './AdminForm.module.scss'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const FormInput = ({ className, error, ...props }: FormInputProps) => {
  return (
    <input
      className={`${styles.input} ${error ? styles.errorInput : ''} ${className || ''}`}
      {...props}
    />
  )
}

export default FormInput

