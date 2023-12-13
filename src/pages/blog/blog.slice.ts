import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Post } from 'types/blog.type'

interface BlogState {
  postId: string
  editingPost: Post | null
  loading: boolean
}

const initalPost: Post = {
  id: '',
  title: '',
  description: '',
  publishDate: '',
  featuredImage: '',
  published: false
}

const initialState: BlogState = {
  postId: '',
  editingPost: null,
  loading: false
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    startEditingPost: (state, action: PayloadAction<string>) => {
      state.postId = action.payload
    },
    cancelEditingPost: (state) => {
      state.postId = ''
    }
  }
})

const blogReducer = blogSlice.reducer
export const { cancelEditingPost, startEditingPost } = blogSlice.actions
export default blogReducer
