import MainProduct from './MainProduct';
import { useParams } from 'react-router-dom';

function SingleProduct() {
  const { id, slug } = useParams();
  return <div>{id && slug && <MainProduct productId={id} />}</div>;
}

export default SingleProduct;
