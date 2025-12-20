import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSupplier } from '@/Redux Toolkit/features/supplier/supplierSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SupplierForm = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', phone: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addSupplier(form));
    setForm({ name: '', phone: '', email: '' });
  };

  return (
    <form className="space-y-4 p-4 border rounded" onSubmit={handleSubmit}>
      <Input
        placeholder="Supplier Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <Input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <Input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <Button type="submit">Add Supplier</Button>
    </form>
  );
};

export default SupplierForm;
