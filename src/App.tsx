
import { Suspense, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';

import Loading from '@/components/Loading';

import r, { generateRouter } from './router';
import { usePermission, useSelector } from './store';

export default function App() {

  const [router, setRouter] = useState(r);
  const { GenerateRoutes } = usePermission(useSelector(['GenerateRoutes']));

  useEffect(() => {
    GenerateRoutes().then(r => {
      setRouter(generateRouter(r));
    });
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
