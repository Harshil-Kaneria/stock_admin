'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { toast } from 'react-toastify'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CKEditor } from 'ckeditor4-react'
import { apiUserPoliciesByType, apiUserPoliciesUpdate } from '@services/apiFunctions'

const EditForm = ({ type }) => {
  const router = useRouter()
  const [initialValues, setInitialValues] = useState({
    content: '' // For the CKEditor
  })

  const fetchData = async () => {
    try {
      const response = await apiUserPoliciesByType({ type })
      if (response.status) {
        const { content } = response.data
        setInitialValues({ content: content || '' })
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong !')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async (values, { setSubmitting }) => {
    try {
      const requestData = { ...values, type }
      const response = await apiUserPoliciesUpdate(requestData)
      if (response.status) toast.success(response.message || 'Success !')
    } catch (err) {
      toast.error(err?.message || 'Something went wrong !')
    } finally {
      setSubmitting(false)
      router.push('/policies')
    }
  }

  const validationSchema = Yup.object().shape({
    content: Yup.string().required('Content is required') // Validation for CKEditor
  })

  return (
    <Card>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ errors, touched, setFieldValue, isSubmitting }) => (
          <>
            <CardHeader
              action={
                <Button type='submit' form='edit-form' variant='outlined' color='primary' disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Update'}
                </Button>
              }
            />
            <CardContent>
              <Form id='edit-form'>
                <div>
                  {initialValues.content && (
                    <>
                      <CKEditor
                        initData={initialValues.content || ''}
                        onChange={evt => setFieldValue('content', evt.editor.getData())}
                        config={{
                          height: 300, // Customize height
                          width: '100%' // Responsive width
                        }}
                      />
                      {touched.content && errors.content && (
                        <div style={{ color: 'red', marginTop: '10px' }}>{errors.content}</div>
                      )}
                    </>
                  )}
                </div>
              </Form>
            </CardContent>
          </>
        )}
      </Formik>
    </Card>
  )
}

export default EditForm
