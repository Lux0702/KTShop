import React from 'react'
import SEO from "@/components/seo"
import Wrapper from "@/layout/wrapper";
import SidebarWithContentSeparator from "@/components/admin/sidebar/sidebar.jsx"


export default function Dashboard (){
    return(
        <Wrapper>
        <SEO pageTitle='Dashboard'/>
         <SidebarWithContentSeparator/>       
        </Wrapper>
    )
}