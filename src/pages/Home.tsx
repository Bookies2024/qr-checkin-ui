import React, { useEffect } from "react";
import PageLayout from "../layout/PageLayout";
import { useAuth } from "../hooks/useAuth";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Link2, ScanQrCode, LayoutList } from "lucide-react";
import Scan from "../components/tabs/Scan";
import List from "../components/tabs/List";
import Link from "../components/tabs/Link";
import { useNavigate } from "react-router-dom";
import { TABS } from "../utils/constants";

const Home: React.FC = () => {
  const { isAuthenticated, isAuthInitialized } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { title: TABS.SCAN, icon: ScanQrCode, component: Scan },
    { title: TABS.LIST, icon: LayoutList, component: List },
    // { title: TABS.LINK, icon: Link2, component: Link },
  ];

  useEffect(() => {
    if (isAuthInitialized && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isAuthInitialized, navigate]);

  if (!isAuthInitialized) return <div>Loading...</div>;

  return (
    <PageLayout>
      <Tabs defaultValue={TABS.SCAN} className="flex flex-col h-full w-full">
        <div className="flex-1 flex flex-col overflow-auto py-2">
          {tabs.map((e, i) => {
            const Component = e.component;
            return (
              <TabsContent key={i} value={e.title}>
                <Component />
              </TabsContent>
            );
          })}
        </div>

        <TabsList className="bg-[#58551E] relative flex justify-evenly h-20 w-full rounded-full items-center p-2">
          {tabs.map((e, i) => {
            const Icon = e.icon;
            return (
              <TabsTrigger
                key={i}
                value={e.title}
                className="rounded-full p-3 data-[state=active]:bg-white data-[state=active]:text-[#4D4200] text-white transition-colors"
              >
                <Icon className="size-6" />
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </PageLayout>
  );
};

export default Home;

