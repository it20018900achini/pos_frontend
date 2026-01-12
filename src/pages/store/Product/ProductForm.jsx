import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, updateProduct } from "@/Redux Toolkit/features/product/productThunks";
import { getCategoriesByStore } from "@/Redux Toolkit/features/category/categoryThunks";
import { useGetBrandsByStoreQuery } from "@/Redux Toolkit/features/brand/brandApi";
import { toast } from "@/components/ui/use-toast";

const validationSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  sku: Yup.string().required("SKU is required"),
  brandId: Yup.string().required("Brand is required"),
  categoryId: Yup.string().required("Category is required"),
  description: Yup.string().optional(),
  variants: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Variant name required"),
      sku: Yup.string().required("Variant SKU required"),
      price: Yup.number().required("Variant price required").positive(),
    })
  ),
});

const ProductForm = ({ initialValues = {}, onSubmit, onCancel, isEditing = false }) => {
  const dispatch = useDispatch();
  const { store } = useSelector((state) => state.store);
  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (store?.id && token) {
      dispatch(getCategoriesByStore({ storeId: store.id, token }));
    }
  }, [dispatch, store]);

  const { data: brandData, isLoading: brandLoading } = useGetBrandsByStoreQuery(
    { storeId: store?.id, page: 0, size: 50 },
    { skip: !store?.id }
  );
  const brands = brandData?.brands || [];

  const defaultValues = {
    name: "",
    sku: "",
    description: "",
    brandId: "",
    categoryId: "",
    variants: [],
    ...initialValues,
  };

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const dto = {
        ...values,
        storeId: store.id,
        categoryId: parseInt(values.categoryId),
        brandId: parseInt(values.brandId),
      };

      if (isEditing && initialValues.id) {
        await dispatch(updateProduct({ id: initialValues.id, dto })).unwrap();
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        await dispatch(createProduct(dto)).unwrap();
        toast({ title: "Success", description: "Product added successfully" });
      }

      onSubmit?.();
    } catch (err) {
      toast({ title: "Error", description: err || "Failed to save product", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize
    >
      {({ isSubmitting, setFieldValue, values, touched, errors }) => (
        <Form className="space-y-4 py-2 pr-2">
          {/* Product Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Product Name</label>
            <Field as={Input} name="name" placeholder="Enter product name" className={touched.name && errors.name ? "border-red-300" : ""} />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
          </div>

          {/* SKU */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">SKU</label>
            <Field as={Input} name="sku" placeholder="Enter SKU" className={touched.sku && errors.sku ? "border-red-300" : ""} />
            <ErrorMessage name="sku" component="div" className="text-red-500 text-sm" />
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Brand</label>
            <Field name="brandId">
              {({ field }) => (
                <Select value={field.value} onValueChange={(val) => setFieldValue("brandId", val)} disabled={brandLoading}>
                  <SelectTrigger className={`w-full ${touched.brandId && errors.brandId ? "border-red-300" : ""}`}>
                    <SelectValue placeholder={brandLoading ? "Loading brands..." : "Select brand"} />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>{brand.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
            <ErrorMessage name="brandId" component="div" className="text-red-500 text-sm" />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Category</label>
            <Field name="categoryId">
              {({ field }) => (
                <Select value={field.value} onValueChange={(val) => setFieldValue("categoryId", val)}>
                  <SelectTrigger className={`w-full ${touched.categoryId && errors.categoryId ? "border-red-300" : ""}`}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
            <ErrorMessage name="categoryId" component="div" className="text-red-500 text-sm" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Description</label>
            <Field as={Textarea} name="description" placeholder="Enter product description" rows={3} />
          </div>

          {/* Variants */}
          <FieldArray name="variants">
            {({ push, remove }) => (
              <div className="space-y-3">
                <label className="block text-sm font-medium">Variants</label>
                {values.variants?.map((variant, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 items-end">
                    <Field as={Input} name={`variants.${index}.name`} placeholder="Variant name" />
                    <Field as={Input} name={`variants.${index}.sku`} placeholder="Variant SKU" />
                    <Field as={Input} type="number" name={`variants.${index}.price`} placeholder="Price" />
                    <Button type="button" variant="destructive" onClick={() => remove(index)}>Remove</Button>
                  </div>
                ))}
                <Button type="button" onClick={() => push({ name: "", sku: "", price: "" })}>Add Variant</Button>
              </div>
            )}
          </FieldArray>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
              {isSubmitting ? (isEditing ? "Updating..." : "Adding...") : isEditing ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;
