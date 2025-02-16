'use client'

// React Imports
import { useEffect, useState } from 'react'

//MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { toast } from 'react-toastify'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

import themeConfig from '@configs/themeConfig'

// API Function
import { apiGetAdminDashboard } from '@services/apiFunctions'

const DashboardCount = () => {
  const [data, setData] = useState([])

  const fetchData = async () => {
    try {
      const response = await apiGetAdminDashboard()
      if (response.status) setData(response.data)
    } catch (err) {
      toast.error(err?.message || 'Something went wrong !')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Card className='bs-full'>
      <CardHeader
        title='Welcome'
        subheader={
          <p className='mbs-3'>
            <span className='font-medium text-textPrimary'>
              Here is basic analytics of <strong>{themeConfig.templateName}</strong>
            </span>
          </p>
        }
      />
      <CardContent className='!pbs-5'>
        <Grid container spacing={2}>
          {data.map((item, index) => (
            <Grid item xs={6} md={3} key={index}>
              <div className='flex items-center gap-3'>
                <CustomAvatar variant='rounded' color={item.color} className='shadow-xs'>
                  <i className={item.icon}></i>
                </CustomAvatar>
                <div>
                  <Typography>{item.title}</Typography>
                  <Typography variant='h5'>{item.stats}</Typography>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default DashboardCount
