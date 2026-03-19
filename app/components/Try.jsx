'use client'

import React, { useState } from 'react'
import AddProposal from './AddProposal'

const Page = () => {
    const [activeTab, setActiveTab] = useState('revenue')

    return (
        <div>
            <AddProposal />
            <p>Test</p>
        </div>
    )
}

export default Page