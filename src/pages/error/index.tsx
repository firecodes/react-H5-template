
import { Link, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="container mx-auto text-center">
      <h1 className="text-6xl py-10 font-bold">Oops!</h1>
      <p className="py-5">Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{(error && (error.statusText || error.message)) || 'Page not found!'}</i>
      </p>
      <Link to="/" className="block mx-auto my-3 bg-amber-500 w-24 h-8 leading-8 rounded-md text-white">Go Home</Link>
    </div>
  );
}
