import { Button, Result } from 'antd';
import { ConfigRouter } from 'config_router';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RollbackOutlined } from '@ant-design/icons';
const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onClickNavigate = () => {
    navigate(ConfigRouter.listGuest.url);
  };
  return <Result status="404" title="404" subTitle={'404 Not found'} />;
};
export default NotFoundPage;
