import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface CustomBreadCrumbProps {
    data: { name: string | undefined, link: string, isPage: boolean }[];
}

import React from "react";

const CustomBreadCrumb = ({ data }: CustomBreadCrumbProps) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {data.map((item, index) => (
                    <React.Fragment key={item.link}>
                        <BreadcrumbItem>
                            {item.isPage ? (
                                <BreadcrumbPage>{item.name}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={`/${item.link}`}>
                                    {item.name}
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {/* Đặt Separator ngoài BreadcrumbItem */}
                        {index < data.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default CustomBreadCrumb;
