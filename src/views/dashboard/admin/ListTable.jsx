'use client'

// React Imports
import { useEffect, useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'

// Next.js Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'

// API Function
import { apiGetAdminList, apiDeleteAdmin } from '@services/apiFunctions'

const ListTable = () => {
  const router = useRouter()
  const [rowsData, setRowsData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await apiGetAdminList()
      if (response.status) {
        setRowsData(response.data)
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong !')
    } finally {
      setLoading(false)
    }
  }

  const deleteAdmin = async data => {
    try {
      setLoading(true)
      const response = await apiDeleteAdmin(data)
      if (response.status) toast.success(response.message || 'Success !')
    } catch (err) {
      toast.error(err?.message || 'Something went wrong !')
    } finally {
      setLoading(false)
      fetchData()
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEdit = row => {
    router.push(`/admin/${row.secretId}`)
  }

  const handleDelete = row => {
    confirmAlert({
      title: 'Confirm to submit',
      message: `Are you sure to delete ${row.name}`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteAdmin({ secretId: row.secretId })
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    })
  }

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: params => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {params.row.adminType != 'superAdmin' ? (
            <>
              <i
                className='ri-edit-line text-[20px] text-primary'
                title='Edit'
                onClick={() => handleEdit(params.row)}
              ></i>
              <i
                className='ri-delete-bin-2-line text-[20px] text-warning'
                title='Delete'
                onClick={() => handleDelete(params.row)}
              ></i>
            </>
          ) : (
            <></>
          )}
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
