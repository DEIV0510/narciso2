import Hero from '../components/home/Hero'
import Collections from '../components/home/Collections'
import Selection from '../components/home/Selection'
import ProfileExplorer from '../components/home/ProfileExplorer'
import Promotions from '../components/home/Promotions'
import House from '../components/home/House'
import Visit from '../components/home/Visit'
import useReveal from '../hooks/useReveal'

export default function HomePage() {
  useReveal()
  return (
    <>
      <Hero />
      <Collections />
      <Selection />
      <ProfileExplorer />
      <Promotions />
      <House />
      <Visit />
    </>
  )
}
