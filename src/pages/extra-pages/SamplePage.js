// material-ui
import { Button, Flex } from 'antd';
// project import
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => (
  <MainCard title="Sample Card">
    <Flex gap="small" wrap="wrap">
      <Button type="primary">Primary Button</Button>
      <Button>Default Button</Button>
      <Button type="dashed">Dashed Button</Button>
      <Button type="text">Text Button</Button>
      <Button type="link">Link Button</Button>
    </Flex>
  </MainCard>
);

export default SamplePage;
