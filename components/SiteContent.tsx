import Experience from "@/components/Experience";
import Project from "@/components/Project";
import SectionWrapper from "@/components/SectionWrapper";

const SiteContent = () => {
  return (
    <div className="lg:col-span-3 pt-12 lg:py-24">
      <SectionWrapper
        sectionName="about"
        className="text-muted-foreground flex flex-col gap-2"
      >
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <p>I'm a student and frontend developer living in Taipei.</p>
        <p>
          During my free time I like going gym, doing Bench Press. You can also
          find some cool music festival live on my Instagram.
        </p>
        <p>You can always get my cv on here.</p>
      </SectionWrapper>

      <Experience />

      <Project />

      <SectionWrapper
        sectionName="footer"
        className="pb-0 mt-4 text-muted-foreground text-sm"
      >
        <footer>
          Built with Next.js, tailwind css. Deployed on self-hosted VPS.
        </footer>
      </SectionWrapper>
    </div>
  );
};

export default SiteContent;
