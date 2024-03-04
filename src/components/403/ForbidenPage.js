import { Button, Result } from 'antd';

const ForbidenPage = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={<Button type="primary">Về trang chủ</Button>}
    />
  );
};
export default ForbidenPage;
