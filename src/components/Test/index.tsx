

import { memo } from 'react';

/**
 * mome 测试
 */
export default memo(function Test(props: { count?: number }) {

  return (
    <div>
      index
      count: {props.count}
    </div>
  );
});
