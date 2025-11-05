/**
 * Admin Table Component
 * Reusable table component for admin panel
 */

import { ReactNode } from 'react'
import styles from './AdminTable.module.scss'

interface AdminTableProps {
  headers: string[]
  children: ReactNode
}

const AdminTable = ({ headers, children }: AdminTableProps) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export default AdminTable

