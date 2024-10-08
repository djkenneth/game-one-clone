import MainProduct from './MainProduct';
import { useParams } from 'react-router-dom';

function SingleProduct() {
  const { id, slug } = useParams();
  return <>{id && slug && <MainProduct productId={id} />}</>;
}

export default SingleProduct;
