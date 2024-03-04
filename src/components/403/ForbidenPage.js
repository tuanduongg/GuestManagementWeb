import { Button, Result } from 'antd';
import { ConfigRouter } from 'config_router';
import { useNavigate } from 'react-router-dom';

const ForbidenPage = () => {
  const navigate = useNavigate();
  const onClickNavigate = () => {
    navigate(ConfigRouter.listGuest);
  };
  return (
    <Result
      status="403"
      title="403"
      subTitle="Bạn không có quyền truy cập!"
      extra={
        <Button onClick={onClickNavigate} type="primary">
          Về trang chủ
        </Button>
      }
    />
  );
};
export default ForbidenPage;
