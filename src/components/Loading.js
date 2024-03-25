import React from 'react';
import { Button, Spin } from 'antd';

const Loading = ({loading}) => {
  if (loading) {
    return (
      <>
        <Spin style={{ zIndex: '2000' }} spinning={true} fullscreen />
      </>
    );
  }
  return null;
};

export default Loading;
