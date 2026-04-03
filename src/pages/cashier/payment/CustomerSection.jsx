import React from 'react'
import { useSelector } from 'react-redux';
import { selectSelectedCustomer } from '../../../Redux Toolkit/features/cart/cartSlice';
import { User } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

const CustomerSection = ({setShowCustomerDialog}) => {
    const selectedCustomer = useSelector(selectSelectedCustomer);
  return null
}

export default CustomerSection