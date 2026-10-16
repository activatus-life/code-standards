import {Redirect} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

// The docs have no home page of their own: /docs opens the first Overview doc.
const Home = () => {
  return <Redirect to={useBaseUrl('/overview/what-is-it')} />;
};

export default Home;
