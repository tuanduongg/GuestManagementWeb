import { Card, Button, Row, Col, Image } from 'antd';
import './card_product.css';
const { Meta } = Card;
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { truncateString } from 'utils/helper';
import { Box } from '@mui/material';

const CardProduct = ({ number, onClickProduct }) => {
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
              onClickProduct();
            }}
            alt={'image'}
            style={{objectFit: 'cover',cursor: 'pointer'}}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
        }
      >
        {/* 66 */}
        <Box
          onClick={() => {
            onClickProduct();
          }}
          className="title-card-product"
        >
          {truncateString('Product tittle infomation Product tittle infomation infomation ddasdfsadfsd asdfdf', 66)}
        </Box>
        {/* <div className="price-card-product">125.000đ</div> */}
        <div className="price-card-product">1.250.000đ</div>
        {/* <Button className="no-border-radius" icon={<EyeOutlined />} size="small"></Button> */}
        {/* <div className="wrap-button-card">
        </div> */}
      </Card>
    </>
  );
};

export default CardProduct;
