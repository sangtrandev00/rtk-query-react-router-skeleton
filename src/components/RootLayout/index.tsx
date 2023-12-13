
import { Outlet } from 'react-router-dom';
import Header from 'components/Header';
import Footer from 'components/Footer';
const RootLayout = () => {
  return (
    <div className='main' id='main'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default RootLayout;
