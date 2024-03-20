import { Suspense } from 'react';

// project import
import Loader from './Loader';
import Loading from './Loading';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const Loadable = (Component) => (props) => (
  <Suspense fallback={<Loading />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;
