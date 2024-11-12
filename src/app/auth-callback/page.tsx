import React from 'react'
import { verifyUser } from './actions'
import { redirect } from 'next/navigation'

const page = async () => {
    const {success} = await verifyUser()
    if(success) {
        redirect('/dashboard')
    }
  return (
    <div>
        {!success && <p>An error occured with the account creation process.</p>}
    </div>
  )
}

export default page