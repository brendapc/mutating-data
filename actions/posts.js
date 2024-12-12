"use server";
import { uploadImage } from '@/lib/cloudinary';
import { storePost, updatePostLikeStatus } from '@/lib/posts';
import { redirect } from 'next/navigation';

export async function createPost(prevState, formData) {
  const title = formData.get('title');
  const image = formData.get('image');
  const content = formData.get('content');

  let errors = [];

  //server side validation
  if (!title || !title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!content || !content.trim().length === 0) {
    errors.push('Content is required');
  }

  if (!image || image.size === 0) {
    errors.push('Image is required');
  }

  if (errors.length > 0) {
    return { errors }
  }

  let imageUrl;

  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error('Image upload failed');
  }

  await storePost({
    imageUrl: imageUrl,
    title,
    content,
    userId: 1
  })

  redirect('/feed');
}

// because we used it with bind() the first argument is the postId
export async function togglePostLikeStatus(postId) {
  await updatePostLikeStatus(postId, 2);
}