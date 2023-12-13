import { useGetProductsQuery } from './client.service';
import CreatePost from './components/CreatePost'
import PostList from './components/PostList'
import { useSelector } from 'react-redux';

export default function Blog() {

  const { data, isFetching } = useGetProductsQuery()

  console.log("data: ", data)

  return (
    <div className='p-5'>
      {/* <CreatePost />
      <PostList /> */}
      <h1>This home page</h1>
    </div>
  )
}
