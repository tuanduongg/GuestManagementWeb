import { Card, Row, Col, Flex, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';

const CardComponent = ({ content, icon, url }) => {
  const navigate = useNavigate();
  return (
    <Card
      //   bordered={false}
      onClick={() => {
        if (url) {
          navigate(url);
        }
      }}
      style={{
        cursor: 'pointer',
        margin: '20px 0px 0px 0px',
        width: '100%',
        background: 'linear-gradient(to bottom, #283c86, #45a247)',
        color: '#ffff',
        maxWidth: '470px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '10px' }}>{icon}</div>
        <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{content}</div>
      </div>
    </Card>
  );
};
export default CardComponent;
