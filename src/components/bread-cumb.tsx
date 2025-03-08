import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface CustomBreadCrumbProps {
    data: { name: string | undefined, link: string, isPage: boolean }[]
}

import React from 'react'

const CustomBreadCrumb = ({ data }: CustomBreadCrumbProps) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {data.map((item, index) => (
                    <BreadcrumbItem key={item.link}>
                        {item.isPage ? (
                            <BreadcrumbPage>{item.name}</BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink href={`/${item.link}`}>
                                {item.name}
                            </BreadcrumbLink>
                        )}
                        {/* Thêm BreadcrumbSeparator ở ngoài <BreadcrumbItem> để tránh lỗi <li> bị lồng */}
                        {index < data.length - 1 && <BreadcrumbSeparator />}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default CustomBreadCrumb
