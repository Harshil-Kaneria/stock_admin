'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'

// API Function
import { apiGetNotificationList } from '@services/apiFunctions'

const ListTable = () => {
  const [rowsData, setRowsData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await apiGetNotificationList()
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

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'body', headerName: 'Body', flex: 1 }
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
