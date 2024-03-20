import React from 'react';
import { Button, Spin } from 'antd';

const Loading = () => {
  return (
    <>
      <Spin style={{ zIndex: '2000' }} spinning={true} fullscreen />
    </>
  );
};

export default Loading;
