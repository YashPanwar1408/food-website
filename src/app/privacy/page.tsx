'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-3xl font-bold text-foreground mb-4">{t('privacyPage.title')}</h1>
        <p className="text-muted-foreground mb-8">{t('privacyPage.lastUpdated')}</p>

        <div className="space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-3">{t('privacyPage.introduction.title')}</h2>
            <p className="text-muted-foreground">{t('privacyPage.introduction.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t('privacyPage.informationWeCollect.title')}</h2>
            <p className="text-muted-foreground">{t('privacyPage.informationWeCollect.content')}</p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>{t('privacyPage.informationWeCollect.item1')}</li>
              <li>{t('privacyPage.informationWeCollect.item2')}</li>
              <li>{t('privacyPage.informationWeCollect.item3')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t('privacyPage.howWeUseInformation.title')}</h2>
            <p className="text-muted-foreground">{t('privacyPage.howWeUseInformation.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t('privacyPage.dataSecurity.title')}</h2>
            <p className="text-muted-foreground">{t('privacyPage.dataSecurity.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t('privacyPage.contactUs.title')}</h2>
            <p className="text-muted-foreground">{t('privacyPage.contactUs.content')}</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;