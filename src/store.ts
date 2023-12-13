import { configureStore } from '@reduxjs/toolkit'
import { blogApi } from 'pages/blog/blog.service'
import blogReducer from 'pages/blog/blog.slice'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { rtkQueryErrorLogger } from 'middleware'
// ...

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    [blogApi.reducerPath]: blogApi.reducer
  },
  //   Thêm api middleware để enable các tính năng như caching, invalidation, polling của rtk - query
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(blogApi.middleware, rtkQueryErrorLogger)
})

// Optional, nhưng bắt buộc dùng tính năng refetchOnFocous/refetchOnConnect

setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
