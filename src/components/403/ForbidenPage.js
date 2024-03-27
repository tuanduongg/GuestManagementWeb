import { Button, Result } from 'antd';
import { ConfigRouter } from 'config_router';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RollbackOutlined } from '@ant-design/icons';
const ForbidenPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onClickNavigate = () => {
    navigate(ConfigRouter.listGuest);
  };
  return (
    <Result
      status="403"
      title="403"
      subTitle={t('unauthorizeMsgPage')}
      extra={
        <Button onClick={onClickNavigate} icon={<RollbackOutlined />} type="primary">
          {t('btn_backToHome')}
        </Button>
      }
    />
  );
};
export default ForbidenPage;
