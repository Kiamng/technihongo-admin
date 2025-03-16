export type Domain = {
    domainId: number;
    tag: string;
    name: string;
    description: string;
    parentDomainId: number;
    isActive: boolean;
    createdAt: Date;
  };

export type DomainList = {
  content : Domain [],
  last : boolean,
  pageNo : number,
  pageSize : number,
  totalElements : number,
  totalPages : number
}