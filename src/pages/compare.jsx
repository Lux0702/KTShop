import React from 'react';
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import Wrapper from '@/layout/wrapper';
import CompareArea from '@/components/compare/compare-area';
import CommonBreadcrumb from '@/components/breadcrumb/common-breadcrumb';
import Header from "@/layout/headers/header";

const ComparePage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Shop" />
      <Header />
      <CommonBreadcrumb title="Compare" subtitle="Compare" />
      <CompareArea/>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ComparePage;