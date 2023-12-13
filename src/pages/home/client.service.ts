import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'types/blog.type'
import { Product } from 'types/product.type'

// Nếu bên slice chúng ta dùng createSlice để tạo slice thì bên RTK query dùng createApi
// Với createApi chúng ta gọi là slice api
// Chúng ta sẽ khai báo baseUrl và các endpoints

// baseQuery được dùng cho mỗi endpoint để fetch api

// fetchBaseQuery là một function nhỏ được xây dựng trên fetch API
// Nó không thay thế hoàn toàn được Axios nhưng sẽ giải quyết được hầu hết các vấn đề của bạn
// Chúng ta có thể dùng axios thay thế cũng được, nhưng để sau nhé

// endPoints là tập hợp những method giúp get, post, put, delete... tương tác với server
// Khi khai báo endPoints nó sẽ sinh ra cho chúng ta các hook tương ứng để dùng trong component
// endpoints có 2 kiểu là query và mutation.
// Query: Thường dùng cho GET
// Mutation: Thường dùng cho các trường hợp thay đổi dữ liệu trên server như POST, PUT, DELETE

// Có thể ban đầu mọi người thấy nó phức tạp và khó hiểu
// Không sao, mình cũng thể, các bạn chỉ cần hiểu là đây là cách setup mà RTK query yêu cầu
// Chúng ta chỉ cần làm theo hướng dẫn là được

export const clientApi = createApi({
  reducerPath: 'clientApi', // Tên field trong redux state
  tagTypes: ['Products'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/',
    prepareHeaders(headers) {
      headers.set('authorization', 'Bearer ABCXYX')

      return headers
    }
  }),
  endpoints: (build) => ({
    // Generic type theo thứ tự là kiểu (first: response trả về và second: argument )
    getPosts: build.query<Post[], void>({
      query: () => '/sanpham', // method không có argument,
      providesTags(result) {
        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: 'Products' as const, id })),
            { type: 'Products' as const, id: 'LIST' }
          ]
          return final
        }

        const final = [{ type: 'Products' as const, id: 'LIST' }]
        return final
      }
    }),
    getProducts: build.query<Product[], void>({
      query: () => '/sanpham', // method không có argument,
      providesTags(result) {
        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: 'Products' as const, id })),
            { type: 'Products' as const, id: 'LIST' }
          ]
          return final
        }

        const final = [{ type: 'Products' as const, id: 'LIST' }]
        return final
      }
    }),
    getPost: build.query<Post, string>({
      query: (id) => '/sanpham/' + id
    }),
    addPost: build.mutation<Post, Omit<Post, 'id'>>({
      query(body) {
        return {
          url: '/sanpham',
          method: 'POST',
          body
        }
      },
      invalidatesTags: (result, error, body) => (error ? [] : [{ type: 'Products', id: 'LIST' }])
    }),
    updatePost: build.mutation<Post, Post>({
      query(body) {
        return {
          url: '/sanpham/' + body.id,
          method: 'PUT',
          body
        }
      },
      invalidatesTags: (result, error, data) => (error ? [] : [{ type: 'Products', id: data.id }])
    }),
    deletePost: build.mutation<{}, string>({
      query(id) {
        return {
          url: '/sanpham/' + id,
          method: 'DELETE'
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Products', id }]
    })
  })
})

export const { useGetProductsQuery, useGetPostsQuery, useAddPostMutation, useGetPostQuery, useUpdatePostMutation, useDeletePostMutation } =
  clientApi

/**
 * Mô hình sync dữ liệu danh sách bài post dưới local sau khi thêm 1 bài post
 * Thường sẽ có 2 cách tiếp cận
 * Cách 1: Đây là cách những video trước đây mình dùng
 * 1. Sau khi thêm 1 bài post thì server sẽ trả về data của bài post đó
 * 2. Chúng ta sẽ tiến hành lấy data đó thêm vào state redux
 * 3. Lúc này UI chúng ta sẽ được sync
 *
 * ====> Rủi ro cách này là nếu khi gọi request add post mà server trả về data không đủ các field để
 * chúng ta hiển thị thì sẽ gặp lỗi. Nếu có nhiều người cùng add post thì data sẽ sync thiếu,
 * Chưa kể chúng ta phải quản lý việc cập nhật state nữa, hơi mệt!
 *
 *
 * Cách 2: Đây là cách thường dùng với RTK query
 * 1. Sau khi thêm 1 bài post thì server sẽ trả về data của bài post đó
 * 2. Chúng ta sẽ tiến hành fetch lại API get sanpham để cập nhật state redux
 * 3. Lúc này UI chúng ta sẽ được sync
 *
 * =====> Cách này giúp data dưới local sẽ luôn mới nhất, luôn đồng bộ với server
 * =====> Khuyết điểm là chúng ta sẽ tốn thêm một lần gọi API. Thực ra thì điều này có thể chấp nhận được
 */
