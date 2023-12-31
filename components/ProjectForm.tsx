'use client';

import { ProjectInterface, SessionInterface } from '@/common.type';
import React, { ChangeEvent, useState } from 'react';
import { categoryFilters } from '@/constants';
import { createNewProject, fetchToken, updateProject } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import FormField from './FormField';
import CustomMenu from './CustomMenu';
import Button from './Button';

type Props = {
  type: string;
  session: SessionInterface;
  project?: ProjectInterface;
};

export default function ProjectForm({ type, session, project }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false)  
  const [form, setForm] = useState({
    image: project?.image || '',
    title: project?.title || '',
    description: project?.description || '',
    liveSiteUrl: project?.liveSiteUrl || '',
    githubUrl: project?.githubUrl || '',
    category: project?.category || '',
  });

  const handleStateChange = (fieldName: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }))
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { token } = await fetchToken();

    try {
      if(type === 'create') {
        await createNewProject(form, session?.user?.id, token)
        router.push('/');
      }

      if(type === 'edit') {
        await updateProject(form, project?.id as string, token)
        router.push(`/project/${project?.id}`);
      }

    } catch (error) {
      alert(`Failed to ${type === 'create' ? 'create' : 'edit'} a project. Try again!`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];

    if(!file) {
      return;
    }

    if(!file.type.includes('image')) {
      return alert('Please upload an image file');
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      handleStateChange('image', result);
    };
  };

  return (
    <form onSubmit={handleFormSubmit} className='flexStart form'>
      <div className='flexStart form_image-container'>
        <label htmlFor='thumbnail' className='flexCenter form_image-label'>
          {!form.image && 'Choose a thumbnail for your project'}
        </label>

        <input
          id='image'
          type='file'
          accept='image/*'
          required={type === 'create'}
          className='form_image-input'
          onChange={handleChangeImage}
        />

        {form.image && (
          <Image
            src={form?.image}
            alt='project thumbnail'
            fill
            className='sm:p-10 object-contain z-20'
          />
        )}
      </div>

      <FormField
        title='Title'
        state={form.title}
        placeholder='Project Title'
        setState={(value) => handleStateChange('title', value)}
      />

      <FormField
        title='Description'
        state={form.description}
        placeholder='Project Description'
        setState={(value) => handleStateChange('description', value)}
      />

      <FormField
        type='url'
        title='Website URL'
        state={form.liveSiteUrl}
        placeholder='https://example.com'
        setState={(value) => handleStateChange('liveSiteUrl', value)}
      />

      <FormField
        type='url'
        title='Github URL'
        state={form.githubUrl}
        placeholder='https://github.com/username/project'
        setState={(value) => handleStateChange('githubUrl', value)}
      />

      <CustomMenu
        title='Category'
        state={form.category}
        filters={categoryFilters}
        setState={(value) => handleStateChange('category', value)}
      />

      <div className='flexStart w-full'>
        <Button
          title={submitting ? `${type === 'create' ? 'Creating' : 'Editing'}` : `${type === 'create' ? 'Create' : 'Edit'}`}
          type='submit'
          leftIcon={submitting ? '' : '/plus.svg'}
          submitting={submitting}
        />
      </div>
    </form>
  )
};
