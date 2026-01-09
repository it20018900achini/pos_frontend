// src/components/products/ProductForm.jsx
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { X, PhoneOutgoing } from "lucide-react";

const validationSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  sku: Yup.string().required("SKU is required"),
  mrp: Yup.number().positive("MRP must be positive"),
  sellingPrice: Yup.number().required("Selling price is required").positive("Selling price must be positive"),
  categoryId: Yup.string().required("Category is required"),
  brandId: Yup.string().required("Brand is required"),
  description: Yup.string().optional(),
  color: Yup.string().optional(),
  image: Yup.string().optional(),
});

const ProductForm = ({ initialValues = {}, onSubmit, onCancel, isEditing = false }) => {
  const dispatch = useDispatch();
  const { store } = useSelector((state) => state.store);
  const { loading } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch categories when store changes
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (store?.id && token) {
      dispatch(getCategoriesByStore({ storeId: store.id, token }));
    }
  }, [dispatch, store]);

  // Fetch brands via RTK Query
  const { data: brandData, isLoading: brandLoading } = useGetBrandsByStoreQuery(
    { storeId: store?.id, page: 0, size: 50 },
    { skip: !store?.id }
  );
  const brands = brandData?.brands || [];

  const defaultValues = {
    name: "",
    sku: "",
    description: "",
    mrp: "",
    sellingPrice: "",
    brandId: "",
    categoryId: "",
    color: "",
    image: null,
    ...initialValues,
  };

  const handleImageChange = async (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const imageUrl = await uploadToCloudinary(file);
    setFieldValue("image", imageUrl);
    setUploadingImage(false);
  };

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const dto = {
        ...values,
        mrp: parseFloat(values.mrp),
        sellingPrice: parseFloat(values.sellingPrice),
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
        resetForm();
      }

      onSubmit?.();
    } catch (err) {
      toast({
        title: "Error",
        description: err || `Failed to ${isEditing ? "update" : "add"} product`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={defaultValues} validationSchema={validationSchema} onSubmit={handleFormSubmit} enableReinitialize>
      {({ isSubmitting, setFieldValue, touched, errors, values }) => (
        <Form className="space-y-4 py-2 pr-2">
          {/* Image Upload */}
          <div className="flex flex-wrap gap-5">
            {!values.image ? (
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                />
                <span className="w-24 h-24 flex items-center justify-center border rounded-md p-3 border-gray-400">
                  <PhoneOutgoing className="text-gray-700" />
                </span>
                {uploadingImage && (
                  <div className="absolute inset-0 w-24 h-24 flex items-center justify-center bg-white/70">
                    Uploading...
                  </div>
                )}
              </label>
            ) : (
              <div className="relative">
                <img className="w-24 h-24 object-cover" src={values.image} alt="Product" />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-0 right-0"
                  onClick={() => setFieldValue("image", null)}
                >
                  <X />
                </Button>
              </div>
            )}
          </div>

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
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
            <ErrorMessage name="brandId" component="div" className="text-red-500 text-sm" />
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-4">
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

            {/* Color */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Color</label>
              <Field as={Input} name="color" placeholder="Enter color" />
            </div>
          </div>

          {/* MRP & Selling Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">MRP</label>
              <Field as={Input} type="number" name="mrp" placeholder="0.00" className={touched.mrp && errors.mrp ? "border-red-300" : ""} />
              <ErrorMessage name="mrp" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Selling Price</label>
              <Field as={Input} type="number" name="sellingPrice" placeholder="0.00" className={touched.sellingPrice && errors.sellingPrice ? "border-red-300" : ""} />
              <ErrorMessage name="sellingPrice" component="div" className="text-red-500 text-sm" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Description</label>
            <Field as={Textarea} name="description" placeholder="Enter product description" rows={3} />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? (isEditing ? "Updating..." : "Adding...") : isEditing ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;
