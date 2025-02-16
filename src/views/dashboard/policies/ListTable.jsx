'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next.js Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'

// API Function
import { apiUserPoliciesList } from '@services/apiFunctions'

const ListTable = () => {
  const router = useRouter()
  const [rowsData, setRowsData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await apiUserPoliciesList()
      if (response.status) {
        setRowsData(response.data)
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong !')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEdit = row => {
    router.push(`/policies/${row.type}`)
  }

  const columns = [
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      sortable: false,
      renderCell: params => (params.row.type == 'privacy_policy' ? 'Privacy policy' : 'Terms and conditions')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: params => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <i className='ri-edit-line text-[20px] text-primary' title='Edit' onClick={() => handleEdit(params.row)}></i>
        </div>
      )
    }
  ]

  return (
    <>
      <Card>
        <div style={{ height: '100%', width: '100%' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <CircularProgress />
            </div>
          ) : (
            <DataGrid
              rows={rowsData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              autoHeight
            />
          )}
        </div>
      </Card>
    </>
  )
}

export default ListTable
