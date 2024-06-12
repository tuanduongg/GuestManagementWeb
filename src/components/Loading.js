import React from 'react';
import { Spin } from 'antd';

const Loading = ({ loading }) => {
  if (loading) {
    return (
      <>
        <Spin percent={'auto'} style={{ zIndex: '2000' }} spinning={true} fullscreen />
      </>
    );
  }
  return null;
};

export default Loading;
