import { Card, Button, Row, Col, Image } from 'antd';
import './card_product.css';
const { Meta } = Card;
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { formattingVND, truncateString } from 'utils/helper';
import { Box } from '@mui/material';
import config from 'config';
import { urlFallBack } from 'pages/manager-product/manager-product.service';

const CardProduct = ({ product, onClickProduct }) => {
  return (
    <>
      <Card
        className="card-product"
        // hoverable
        style={{
          width: `100%`
        }}
        // cover={<img alt="example"  style={{ padding: '0px', objectFit: 'cover' }} height={'150px'} src="https://picsum.photos/200/300" />}
        cover={
          <Image
            height={'150px'}
            preview={false}
            onClick={() => {
              onClickProduct(product);
            }}
            alt={'image'}
            style={{ objectFit: 'cover', cursor: 'pointer', border: '1px solid #f0f0f0', borderBottom: '0px' }}
            src={product?.images[0] ? config.urlImageSever + product?.images[0]?.url : ''}
            fallback={urlFallBack}
          />
        }
      >
        {/* 66 */}
        <Box
          onClick={() => {
            onClickProduct(product);
          }}
          className="title-card-product"
        >
          {truncateString(product?.productName, 66)}
        </Box>
        <div className="price-card-product">{formattingVND(product?.price)}</div>
      </Card>
    </>
  );
};

export default CardProduct;
