import Container from 'app/components/Container'
import Head from 'next/head'
import Home from "pages/home"

export default function Dashboard() {
  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12" maxWidth='full'>
      <Head>
        <title>Dashboard | NEXUSSwap</title>
        <meta name="description" content="NEXUSSwap" />
        <meta key="twitter:description" name="twitter:description" content="NEXUSSwap" />
        <meta key="og:description" property="og:description" content="NEXUSSwap" />
      </Head>
      <Home />
    </Container>
  )
}
