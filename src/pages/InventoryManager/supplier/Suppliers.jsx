import React from 'react'
import SupplierList from './SupplierList'
import SupplierForm from './SupplierForm'
import ContentLayout from '../../Dashboard/ContentLayout'

function Suppliers() {
  return (
    <ContentLayout title="Supplier Management" subTitle="Manage your branch's suppliers here.">
        <SupplierList/>
    </ContentLayout>
  )
}

export default Suppliers