import React, { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
// const notify = (message) => toast(message)

export default function Notification() {
    // notify('This is a notification!')

    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
        />
    )
}
