import { Layout } from "@/components/layout/Layout";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { QuickActions } from "@/components/home/QuickActions";
import { StatsSection } from "@/components/home/StatsSection";
const Index = () => {
    return (<Layout>
      <HeroCarousel />
      <QuickActions />
      <StatsSection />
    </Layout>);
};
export default Index;
