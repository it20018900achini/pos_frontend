import React from 'react'
import JournalForm from './components/JournalForm'
import JournalDashboard from './JournalDashboard'
import JournalByAccount from './components/JournalByAccount'
import ContentLayout from '../../Dashboard/ContentLayout'

function Journals() {
  return (
    <ContentLayout title="Journals" subTitle="View and manage your journal entries." >
        
                  <JournalForm/>
                  <hr className="my-"/>
                 {/* <JournalDashboard /> */}
         
                  <JournalByAccount/> {/* */}
    </ContentLayout>
  )
}

export default Journals