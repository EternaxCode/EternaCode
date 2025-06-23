// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* 기본 ICO */}
          <link rel="icon" href="/favicon.ico" />
          {/* 필요하면 고해상도 PNG·SVG 추가 가능 */}
          {/* <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
