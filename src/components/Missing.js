import React from 'react';
import { Link } from 'react-router-dom';
export default function Missing() {
  return (
    <>
      <section>
        <h2>Page not found!</h2>
        <Link to="/">Back to homepage</Link>
      </section>
    </>
  );
}
