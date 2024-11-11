import { siteConfig } from "@/config/site"
import { MainNav } from "@/components/main-nav"
import { SiteHeader } from "@/components/site-header"

interface Props {
  children: React.ReactNode
  params: { domain: string }
}

export default function DomainLayout({ children, params }: Props) {
  return (
    <>
      <SiteHeader items={siteConfig.mainNav}>
        <MainNav title={params.domain} items={siteConfig.mainNav} />
      </SiteHeader>
      <div className="flex flex-1 flex-col">
        <div>
          <div className="h-2 bg-[#005EB8]"></div>
          <div className="h-2 bg-[#FFD500]"></div>
        </div>
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </>
  )
}
