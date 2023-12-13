import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Post } from 'types/blog.type'

interface ClientState {
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

const initialState: ClientState = {
  postId: '',
  editingPost: null,
  loading: false
}

const clientSlice = createSlice({
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

const clientReducer = clientSlice.reducer
export const { cancelEditingPost, startEditingPost } = clientSlice.actions
export default clientReducer
