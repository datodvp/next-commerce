import { TextareaHTMLAttributes } from 'react'
import styles from './AdminForm.module.scss'

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

const FormTextarea = ({ className, error, ...props }: FormTextareaProps) => {
  return (
    <textarea
      className={`${styles.textarea} ${error ? styles.errorInput : ''} ${className || ''}`}
      {...props}
    />
  )
}

export default FormTextarea

