import Navbar from '@/components/Navbar'
import HeroCarousel from '@/components/HeroCarousel'
import MenuSection from '@/components/MenuSection'
import PromotionsSection from '@/components/PromotionsSection'
import NightsSection from '@/components/NightsSection'
import GamesSection from '@/components/GamesSection'
import LocationSection from '@/components/LocationSection'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import HeroContent from '@/components/HeroContent'
import BarPhrases from '@/components/BarPhrases'
import { getMenuDB, getPromotionsDB, getSettingsDB, getCarouselDB } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const menu = await getMenuDB()
  const promotions = await getPromotionsDB()
  const settings = await getSettingsDB()
  const carousel = await getCarouselDB()

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
          <HeroCarousel images={carousel.images} />
          <HeroContent whatsapp={settings.whatsapp} />
        </section>

        <MenuSection categories={menu.categories} items={menu.items} />
        <PromotionsSection items={promotions.items} />
        <BarPhrases />
        <NightsSection hours={settings.hours} specialNights={settings.specialNights} />
        <GamesSection />
        <LocationSection
          address={settings.address}
          addressEn={settings.addressEn}
          whatsapp={settings.whatsapp}
          mapEmbedUrl={settings.mapEmbedUrl}
        />
      </main>
      <Footer instagram={settings.instagram} facebook={settings.facebook} />
      <FloatingButtons whatsapp={settings.whatsapp} />
    </>
  )
}
