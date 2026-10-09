import { Benefits } from '../components/home/Benefits'
import { Catalog } from '../components/home/Catalog'
import { FaqSection } from '../components/home/FaqSection'
import { Hero } from '../components/home/Hero'
import { PaymentMethods } from '../components/home/PaymentMethods'
import { PriceTable } from '../components/home/PriceTable'
import { ShippingZones } from '../components/home/ShippingZones'
import { SocialSection } from '../components/home/SocialSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Benefits />
      <Catalog />
      <PriceTable />
      <ShippingZones />
      <PaymentMethods />
      <FaqSection />
      <SocialSection />
    </>
  )
}
