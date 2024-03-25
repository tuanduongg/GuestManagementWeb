import { Suspense } from 'react';

// project import
import Loader from './Loader';
import Loading from './Loading';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const Loadable = (Component) => (props) => (
  <Suspense fallback={<Loading loading={true} />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;
