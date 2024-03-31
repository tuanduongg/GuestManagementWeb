import { Card, Button, Row, Col } from 'antd';
import './card_product.css';
const { Meta } = Card;
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { truncateString } from 'utils/helper';
import { Box } from '@mui/material';

const CardProduct = ({ number }) => {
  return (
    <>
      <Card
        className="card-product"
        hoverable
        style={{
          width: `100%`
        }}
        cover={
        <img alt="example"  style={{ padding: '0px', objectFit: 'cover' }} height={'150px'} src="https://picsum.photos/200/300" />
    }
      >
        {/* 66 */}
        <Box
          onClick={() => {
            alert('clcik');
          }}
          className="title-card-product"
        >
          {truncateString('Product tittle infomation Product tittle infomation infomation ddasdfsadfsd asdfdf', 66)}
        </Box>
        {/* <div className="price-card-product">125.000đ</div> */}
        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Col xs={24} lg={11}>
            <div className="price-card-product">1.250.000đ</div>
            {/* <Button className="no-border-radius" icon={<EyeOutlined />} size="small"></Button> */}
          </Col>
          <Col xs={24} lg={13}>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                alert('click 2');
              }}
              className="add-to-cart-button no-border-radius"
            >
              Thêm vào giỏ
            </Button>
          </Col>
        </Row>
        {/* <div className="wrap-button-card">
        </div> */}
      </Card>
    </>
  );
};

export default CardProduct;
