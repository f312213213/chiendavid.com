import type {Metadata} from "next";

export const metadata: Metadata = {
  title: 'About',
  description: 'Assistant engineer at Lang Live',
};

const About = () => {
  return (
    <main>
      <p className="text-white">about</p>
    </main>
  )
}
export default About