import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { useAddPostMutation, useGetPostQuery, useUpdatePostMutation } from 'pages/blog/blog.service'
import { cancelEditingPost } from 'pages/blog/blog.slice'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { Post } from 'types/blog.type'
import { isEntityError, isFetchBaseQueryError } from 'utils/helper'

// import { RootState, useAppDispatch } from 'store'

const initialState: Post = {
  id: '',
  title: '',
  description: '',
  publishDate: '',
  featuredImage: '',
  published: false
}

type FormError =
  | {
      [key in keyof typeof initialState]: string
    }
  | null

export default function CreatePost() {
  const [formData, setFormData] = useState<Post>(initialState)
  const [addPost, addPostResult] = useAddPostMutation()
  const [updatePost, updatePostResult] = useUpdatePostMutation()
  // const [errorForm, setErrorForm] = useState<null | ErrorForm>(null)

  const editingPost = useSelector((state: RootState) => state.blog.editingPost)

  const loading = useSelector((state: RootState) => state.blog.loading)
  const postId = useSelector((state: RootState) => state.blog.postId)

  const { data, isFetching, refetch } = useGetPostQuery(postId, { skip: !postId, refetchOnMountOrArgChange: 5 }) // Thêm skip khi postId tồn tại !!!
  // const dispatch = useAppDispatch()

  const dispatch = useDispatch()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      if (postId) {
        const formDataWithId = {
          ...formData,
          id: postId
        }

        try {
          const result = await updatePost(formDataWithId).unwrap()
          console.log(result)
          setFormData(initialState)
        } catch (error) {
          setFormData(formDataWithId)
        }

        console.log(updatePostResult)
        // dispatch(updatePost(formDataWithId)).unwrap().then((res)=> {
        //   console.log(res)
        //   setErrorForm(null);
        //   setFormData(initialState)

        // })
        // .catch((error) => {
        //   console.log(error)
        //   setErrorForm(error.error);
        // })
      } else {
        console.log(formData)
        const result = await addPost(formData).unwrap()
        setFormData(initialState)
        console.log(result)
        // try {
        //   const res = await dispatch(addPost(formData))
        //   const result = unwrapResult(res);
        //   console.log(result);

        //   setErrorForm(null);
        //   setFormData(initialState)
        // } catch (error: any) {
        //   console.log(error);

        //   setErrorForm(error.error);
        // }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const errorForm: FormError = useMemo(() => {
    const errorResult = postId ? updatePostResult.error : addPostResult.error
    // Vì errorResult có thể là FetchBaseQueryError | SerializedError | undefined, mỗi kiểu lại có cấu trúc khác nhau
    // nên kiểm tra như thế nào cho đúng ?

    if (isEntityError(errorResult)) {
      console.log(errorResult)

      return errorResult.data.error as FormError
    }
    return null

    // if((errorResult as FetchBaseQueryError).data && (errorResult as FetchBaseQueryError).status) {
    //   return (errorResult as FetchBaseQueryError).data.error
    // }

    // return errorResult as any
  }, [addPostResult.error, postId, updatePostResult.error])

  useEffect(() => {
    if (data && postId) {
      setFormData(data)
    } else {
      setFormData(initialState)
    }
  }, [data, postId])

  const cancelHandler = () => {
    dispatch(cancelEditingPost())
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='mb-6'>
        <label htmlFor='title' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
          Title
        </label>
        <input
          type='text'
          id='title'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          placeholder='Title'
          required
          value={formData.title}
          onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
        />
      </div>
      <div className='mb-6'>
        <label htmlFor='featuredImage' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
          Featured Image
        </label>
        <input
          type='text'
          id='featuredImage'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          placeholder='Url image'
          required
          value={formData.featuredImage}
          onChange={(event) => setFormData((prev) => ({ ...prev, featuredImage: event.target.value }))}
        />
      </div>
      <div className='mb-6'>
        <div>
          <label htmlFor='description' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400'>
            Description
          </label>
          <textarea
            id='description'
            rows={3}
            className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
            placeholder='Your description...'
            required
            value={formData.description}
            onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
          />
        </div>
      </div>
      <div className='mb-6'>
        <label
          htmlFor='publishDate'
          className={`mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300 ${
            errorForm?.publishDate ? 'text-red-700' : 'text-gray-900'
          }`}
        >
          Publish Date
        </label>
        <input
          type='datetime-local'
          id='publishDate'
          className={`block w-56 rounded-lg border p-2.5 text-sm ${
            errorForm?.publishDate
              ? 'border-red-500 text-red-500'
              : 'border-gray-300 bg-gray-50  text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          }`}
          placeholder='Title'
          required
          value={formData.publishDate}
          onChange={(event) => setFormData((prev) => ({ ...prev, publishDate: event.target.value }))}
        />
        {errorForm?.publishDate && (
          <p className={`error-message text-red-600`}>
            <span className='font-med'>Lỗi!</span>
            {errorForm.publishDate}
          </p>
        )}
      </div>
      <div className='mb-6 flex items-center'>
        <input
          id='publish'
          type='checkbox'
          className='h-4 w-4 focus:ring-2 focus:ring-blue-500'
          checked={formData.published}
          onChange={(event) => setFormData((prev) => ({ ...prev, published: event.target.checked }))}
        />
        <label htmlFor='publish' className='ml-2 text-sm font-medium text-gray-900'>
          Publish
        </label>
      </div>
      <div>
        {!postId && (
          <button
            disabled={isFetching}
            className={`group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800`}
            type='submit'
          >
            <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
              <div role='status'>
                {isFetching && (
                  <svg
                    aria-hidden='true'
                    className='mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='currentColor'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentFill'
                    />
                    <span className='sr-only'>Loading...</span>
                  </svg>
                )}
                {!isFetching && `Publish Post`}
              </div>
            </span>
          </button>
        )}
        {postId && (
          <button
            type='submit'
            className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
          >
            <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
              Update Post
            </span>
          </button>
        )}

        {postId && (
          <button
            onClick={cancelHandler}
            type='reset'
            className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400'
          >
            <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
              Cancel
            </span>
          </button>
        )}
      </div>
    </form>
  )
}
