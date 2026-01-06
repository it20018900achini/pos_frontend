import React from 'react'
import JournalForm from './components/JournalForm'
import JournalDashboard from './JournalDashboard'
import JournalByAccount from './components/JournalByAccount'

function Journals() {
  return (
    <div>
        
                  <JournalForm/>
                  <hr className="my-"/>
                  <JournalDashboard />
        
                  <JournalByAccount/>
    </div>
  )
}

export default Journals