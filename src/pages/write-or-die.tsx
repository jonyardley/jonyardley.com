import IndexLayout from '../layouts';
import Wrapper from '../components/Wrapper';
import SiteNav from '../components/header/SiteNav';
import { SiteHeader, outer, inner, SiteMain } from '../styles/shared';
import * as React from 'react';
import { css } from '@emotion/core';

import { PostFullHeader, PostFullTitle, NoImage, PostFull } from '../templates/post';
import { PostFullContent } from '../components/PostContent';
import Footer from '../components/Footer';
import Helmet from 'react-helmet';
import Writer from '../components/write-or-die/Writer';

const PageTemplate = css`
  .site-main {
    background: #fff;
    padding-bottom: 4vw;
  }
`;

const WriteOrDie: React.FC = () => (
  <IndexLayout>
    <Helmet>
      <title>Write or Die!</title>
    </Helmet>
    <Wrapper css={PageTemplate}>
      <header css={[outer, SiteHeader]}>
        <div css={inner}>
          <SiteNav />
        </div>
      </header>
      <main id="site-main" className="site-main" css={[SiteMain, outer]}>
        <article className="post page" css={[PostFull, NoImage]}>
          <PostFullHeader>
            <PostFullTitle>Write or Die!</PostFullTitle>
          </PostFullHeader>

          <PostFullContent className="post-full-content">
            <div className="post-content">
              <p>Write a story and don't stop. After a few seconds of not typing, you die. Deleting stuff doesn't count, so keep those ideas flowing.</p>
              <Writer/>
            </div>
          </PostFullContent>
        </article>
      </main>
      <Footer />
    </Wrapper>
  </IndexLayout>
);

export default WriteOrDie;
