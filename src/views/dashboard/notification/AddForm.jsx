'use client'

// React Imports
import { useState } from 'react'

// Next.js Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { toast } from 'react-toastify'

// Formik and Yup Imports
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'

// API Function
import { apiCreateNotification } from '@services/apiFunctions'

const AddForm = () => {
  const router = useRouter()
  const sendRoutes = () => router.push('/notification')

  const handleSave = async (values, { setSubmitting }) => {
    try {
      const response = await apiCreateNotification(values)
      if (response.status) toast.success(response.message || 'Success !')
    } catch (err) {
      toast.error(err?.message || 'Something went wrong !')
    } finally {
      setSubmitting(false)
      sendRoutes()
    }
  }

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    body: Yup.string().required('Body is required')
  })

  return (
    <Card>
      <Formik initialValues={{ title: '', body: '' }} validationSchema={validationSchema} onSubmit={handleSave}>
        {({ errors, touched, isSubmitting }) => (
          <>
            <CardHeader
              action={
                <Button
                  type='submit'
                  form='add-form'
                  variant='outlined'
                  color='primary'
                  startIcon={<i className='ri-save-line'></i>}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              }
            />
            <CardContent>
              <Form id='add-form'>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name='title'
                      fullWidth
                      label='Title'
                      error={touched.title && !!errors.title}
                      helperText={touched.title && errors.title}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name='body'
                      fullWidth
                      label='Body'
                      error={touched.body && !!errors.body}
                      helperText={touched.body && errors.body}
                    />
                  </Grid>
                </Grid>
              </Form>
            </CardContent>
          </>
        )}
      </Formik>
    </Card>
  )
}

export default AddForm
