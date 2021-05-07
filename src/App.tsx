import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { Section, Container } from 'bloomer';

const FileDashboard = React.lazy(
  () =>
    import(/* webpackChunkName: "filedashboard"*/ '@app/pages/FileDashboard')
);

const App = () => {
  return (
    <Section className="site-container">
      <React.Suspense fallback={<div>Initializing...</div>}>
        <FileDashboard />
      </React.Suspense>
    </Section>
  );
};

export default hot(App);
