import MainProduct from './MainProduct';
import { useParams } from 'react-router-dom';

function SingleProduct() {
  const { id } = useParams();
  return <>{id && <MainProduct productId={id} />}</>;
}

export default SingleProduct;
