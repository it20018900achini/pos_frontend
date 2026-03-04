import React from 'react'
import PurchaseList from './PurchaseList'
import ContentLayout from '../../Dashboard/ContentLayout'

function Purchase() {
  return (
    <ContentLayout title="Purchase Management" subTitle="Manage your branch's purchases here."><PurchaseList/></ContentLayout>
  )
}

export default Purchase