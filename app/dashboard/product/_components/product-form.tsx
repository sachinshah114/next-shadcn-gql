'use client';

import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const formSchema = z.object({
  image: z
    .any()
    .refine((files) => files && files.length > 0, 'Image is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    )
  ,
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.'
  }),
  price: z.coerce.number(),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.'
  })
});

const uploadImageToS3 = async (file: any) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
      // body: JSON.stringify({
      //   file
      // }),
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      alert(`Uploaded successfully: ${data.data.Location}`);
      console.log('Uploaded file info:', data.data);
    } else {
      alert('Upload failed');
      console.error(data.error);
    }
  } catch (error) {
    console.error('Upload Error:', error);
  }
}

export type Product = {
  name: string,
  price: number,
  description: string,
  image: string[]
}

export default function ProductForm({
  initialData,
  pageTitle
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);

  const defaultValues = {
    name: initialData?.name || 'sachin test',
    price: initialData?.price || 114,
    description: initialData?.description || 'THIS IS THE FAKE DESC TO TEST',
    image: []
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    //Upload Image in S3 bucket     
    if (process.env.NEXT_PUBLIC_AWS_KEY_ID && process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY && process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME && process.env.NEXT_PUBLIC_AWS_REGION) {
      const imagesNames: string[] = [];
      for (let i = 0; i < values.image.length; i++) {
        const presignedURL = new URL('/api/presigned', window.location.href);
        presignedURL.searchParams.set('fileName', new Date().getTime() + values.image[i].name.trim());
        presignedURL.searchParams.set('contentType', values.image[i].type);
        fetch(presignedURL.toString())
          .then((res) => res.json())
          .then((res) => {
            const body = values.image[i];
            fetch(res.signedUrl, {
              body,
              headers: {
                'Content-Type': values.image[i].type
              },
              method: 'PUT',
            }).then(() => {
              imagesNames.push(res.signedUrl.split('?')[0]);
            })
          });

      }

      const finalCreateProductObj = { ...values, ...{ image: imagesNames } };
      console.log(`[finalCreateProductObj] ::: `, finalCreateProductObj);


    } else {
      toast.error('Please setup required keys first');
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={4}
                        maxSize={4 * 1024 * 1024}
                      // disabled={loading}
                      // progresses={progresses}
                      // pass the onUpload function here for direct upload
                      // onUpload={uploadFiles}
                      // disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Product</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
