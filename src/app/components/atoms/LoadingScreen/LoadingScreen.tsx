import React from 'react';
import Loader from '@/app/components/atoms/Loader';

const LoadingScreen = () => {
  return (
    <>
      <div className="loadingScreen">
        <Loader />
      </div>
    </>
  );
};

export default LoadingScreen;
