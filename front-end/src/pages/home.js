import React from 'react'
import Header from '../components/header/header';
import IntroSection from '../components/intro/intro'
import QuranLearningSection from '../components/learning/learn';
import TajweedSection from '../components/tajweed/tajweed';
import RecordResponseSection from '../components/record/record';
import QuranPilotSection from '../components/steps/steps';
import SubscriptionSection from '../components/cta/cta';
import QuranLearningModule from '../components/quranlerning/quranlearning';
import "./home.css"

function Home() {
  return (
    <>
      <Header />
      <IntroSection />
      <QuranLearningSection />
      <TajweedSection />
      < RecordResponseSection />
      < QuranPilotSection />
      <SubscriptionSection />
      <QuranLearningModule />
   </>
  )
}

export default Home
